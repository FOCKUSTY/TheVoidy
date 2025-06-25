import { Types } from "@voidy/types";

import path from "node:path";
import fs from "node:fs";
import { Branch, BranchCommit, Repo } from "@voidy/types/dist/services/github-api.type";

type Data<T> = {
  [owner: string]: {
    date: string,
    data: {
      [name: string]: {
        date: string,
        data: T
      };
    };
  };
};

type DataTypes = "repos"|"commits"|"branches";
type GetDataTypes<T extends DataTypes> = ({
  repos: Repo,
  commits: BranchCommit,
  branches: Branch
})[T][];
type Cache = {
  repos: Data<Repo>,
  commits: Data<BranchCommit>,
  branches: Data<Branch>
};

const CACHE_PATH = path.join(__dirname, "github.cache.json");
fs.writeFileSync(CACHE_PATH, JSON.stringify({
  repos: {},
  commits: {},
  branches: {}
}, undefined, 2), "utf-8");
const TIME_OFFSET = 1 * 1000 * 60 * 60 * 3 // 3 hours;
const WEEK = 1 * 1000 * 60 * 60 * 24 * 7;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readCacheFile = <T extends Cache = any>(): T => {
  const file = fs.readFileSync(CACHE_PATH, "utf-8");
  
  return JSON.parse(file);
};

const writeCacheFile = <T extends DataTypes>({
  type,
  owner,
  value
}: {
  type: T,
  owner: string,
  value: GetDataTypes<T>
}) => {
  const file = readCacheFile();

  file[type][owner] = ({
    date: new Date().toISOString(),
    data: value
  });

  fs.writeFileSync(CACHE_PATH, JSON.stringify(file, undefined, 2), "utf-8");
  
  return file;
}

const useCache = <T extends DataTypes>(type: T) => {
  return [
    (owner: string, value: GetDataTypes<T>) => {
      return writeCacheFile({
        type,
        owner,
        value
      });
    },
    (owner: string): GetDataTypes<T>|false => {
      const file = readCacheFile();

      if (!file[type]) {
        file[type] = {};
        return false;
      }
      if (!file[type][owner]) {
        writeCacheFile({type, owner, value: [] });
        return false;
      }
      
      const { date } = file[type][owner];
      if (new Date().getTime()-TIME_OFFSET > new Date(date).getTime()) {
        return false;
      };

      return file[type] || false;
    }
  ] as const
};

class GitHubApi extends Types.Github.Api {
  public async getRepositories(owner: string, type: string, ignoredRepo: string[] = [".github"]) {
    const [ setCache, getCache ] = useCache("repos");
    
    try {
      const cache = getCache(`${type}@${owner}`);

      if (cache) {
        return {
          status: 200,
          text: "from cache",
          repos: cache
        }
      };

      const data = await fetch(`https://api.github.com/${type}/${owner}/repos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const repositories: Types.Github.Repo[] | { status: number } = await data.json();
      const repos = (Array.isArray(repositories) ? repositories : []).filter(
        (r: Types.Github.Repo) => !ignoredRepo.includes(r.name)
      );

      setCache(`${type}@${owner}`, repos);

      return {
        status: data.status,
        text: data.statusText,
        repos
      };
    } catch (err: unknown) {
      return {
        status: 404,
        text: `${err}`,
        repos: []
      };
    }
  }

  public async getBranches(repositoryLink: string) {
    const [ owner, repo ] = repositoryLink.replace("https://api.github.com/repos/", "").split("/");
    const [ setCache, getCache ] = useCache("branches");

    try {
      const cache = getCache(`${owner}@${repo}`);

      if (cache) {
        return {
          status: 200,
          text: "from cache",
          branches: cache
        };
      };

      const data = await fetch(repositoryLink + "/branches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const branches = (await data.json() as Branch[])

      setCache(`${owner}@${repo}`, branches);

      return {
        status: data.status,
        text: data.statusText,
        branches
      }
    } catch (err) {
      return {
        status: 404,
        text: `${err}`,
        branches: []
      };
    }
  };

  private resolveCommits(commits: BranchCommit[]) {
    return commits.filter((commit: BranchCommit) => Date.parse(commit.commit.author.date) > (new Date().getTime()-WEEK));
  }

  public async getCommits(repositoryLink: string) {
    const [ owner, repo ] = repositoryLink.replace("https://api.github.com/repos/", "").split("/");
    const [ setCache, getCache ] = useCache("commits");

    try {
      const cache = getCache(`${owner}@${repo}`);

      if (cache) {
        return {
          status: 200,
          text: "from cache",
          commits: this.resolveCommits(cache)
        };
      };

      const commits = [];
      const branches = (await this.getBranches(repositoryLink)).branches.map(branch => branch.name);

      for (const branch of branches) {
        try {
          const data = await fetch(repositoryLink + "/commits/" + branch, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });

          const c = (await data.json());

          commits.push({...c, branch_name: branch});
        } catch (error) {
          continue;
        };
      };

      setCache(`${owner}@${repo}`, commits);

      return {
        status: 200,
        text: "getted",
        commits: this.resolveCommits(commits)
      }
    } catch (err) {
      return {
        status: 404,
        text: `${err}`,
        commits: []
      };
    }
  };

  /**
   * @param getRepository - A some repository
   * @param dateOffset - A date offset in seconds
   */
  public repositoryCommited(repository: Types.Github.Repo, dateOffset: number): boolean {
    const now = Date.parse(new Date().toISOString());
    const last_commit = Date.parse(`${repository.pushed_at}`);

    if (now - last_commit > dateOffset) return false;

    return true;
  }
}

export default GitHubApi;
