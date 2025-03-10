import { Types } from "v@types";

class GitHubApi extends Types.Github.Api {
  public async getRepositories(owner: string, type: string, ignoredRepo: string[] = [".github"]) {
    try {
      const data = await fetch(`https://api.github.com/${type}/${owner}/repos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const repos: Types.Github.Repo[] | { status: number } = await data.json();

      return {
        status: data.status,
        text: data.statusText,
        repos: (Array.isArray(repos) ? repos : []).filter(
          (r: Types.Github.Repo) => !ignoredRepo.includes(r.name)
        )
      };
    } catch (err: unknown) {
      return {
        status: 404,
        text: `${err}`,
        repos: []
      };
    }
  }

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
