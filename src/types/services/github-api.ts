export interface Repo {
  "id": number;
  "node_id": string;
  "name": string;
  "full_name": string;
  "owner": {
    "login": string;
    "id": number;
    "node_id": string;
    "avatar_url": string;
    "gravatar_id": string;
    "url": string;
    "html_url": string;
    "type": string;
    "site_admin": boolean;
  };
  "private": boolean;
  "html_url": string;
  "url": string;
  "description": string;
  "fork": boolean;
  "language": string;
  "forks_count": number;
  "stargazers_count": number;
  "watchers_count": number;
  "size": number;
  "default_branch": string;
  "open_issues_count": number;
  "is_template": boolean;
  "topics": string[];
  "has_issues": boolean;
  "has_projects": boolean;
  "has_wiki": boolean;
  "has_pages": boolean;
  "has_downloads": boolean;
  "archived": boolean;
  "disabled": boolean;
  "visibility": string;
  "pushed_at": Date;
  "created_at": Date;
  "updated_at": Date;
  "allow_rebase_merge": boolean;
  "forks": number;
  "open_issues": number;
  "watchers": number;
}

export interface Commit {
  "url": string;
  "sha": string;
  "node_id": string;
  "html_url": string;
  "comments_url": string;
  "commit": {
    "url": string;
    "author": {
      "name": string;
      "email": string;
      "date": string;
    };
    "committer": {
      "name": string;
      "email": string;
      "date": string;
    };
    "message": string;
    "tree": {
      "url": string;
      "sha": string;
    };
    "comment_count": number;
    "verification": {
      "verified": boolean;
      "reason": string;
      "signature": string | null;
      "payload": string | null;
      "verified_at": string | null;
    };
  };
  "author": {
    "login": string;
    "id": number;
    "node_id": string;
    "avatar_url": string;
    "gravatar_id": string;
    "url": string;
    "html_url": string;
    "followers_url": string;
    "following_url": string;
    "gists_url": string;
    "starred_url": string;
    "subscriptions_url": string;
    "organizations_url": string;
    "repos_url": string;
    "events_url": string;
    "received_events_url": string;
    "type": string;
    "site_admin": boolean;
  };
  "committer": {
    "login": string;
    "id": number;
    "node_id": string;
    "avatar_url": string;
    "gravatar_id": string;
    "url": string;
    "html_url": string;
    "followers_url": string;
    "following_url": string;
    "gists_url": string;
    "starred_url": string;
    "subscriptions_url": string;
    "organizations_url": string;
    "repos_url": string;
    "events_url": string;
    "received_events_url": string;
    "type": string;
    "site_admin": boolean;
  };
  "parents": {
    "url": string;
    "sha": string;
  }[];
}

export interface BranchCommit extends Commit {
  "branch_name": string;

  "files": {
    "sha": string;
    "filename": string;
    "status": "added" | "modified" | "removed";
    "additions": number;
    "deletions": number;
    "changes": number;
    "blob_url": string;
    "raw_url": string;
    "contents_url": string;
    "patch": string;
  }[];
}

export interface Branch {
  "name": string;
  "commit": {
    "sha": string;
    "url": string;
  };
  "protected": boolean;
}

export const REPO_OWNERS = ["orgs", "users"] as const;
export type RepoOwners = (typeof REPO_OWNERS)[number];
export type RepoReturn = {
  status: number;
  text: string;
  repos: Repo[];
};
export type CommitReturn = {
  status: number;
  text: string;
  commits: BranchCommit[];
};
export type BranchReturn = {
  status: number;
  text: string;
  branches: Branch[];
};

export abstract class GitHubApi {
  public abstract getRepositories(
    owner: string,
    type: RepoOwners,
    ignoredRepo: string[]
  ): Promise<RepoReturn>;

  public abstract getBranches(repositoryLink: string): Promise<BranchReturn>;
  public abstract getCommits(repositoryLink: string): Promise<CommitReturn>;

  /**
   * @param getRepository - A some repository
   * @param dateOffset - A date offset in seconds
   */
  public abstract repositoryCommited(repository: Repo, dateOffset: number): boolean;
}