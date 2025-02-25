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

export abstract class GitHubApi {
  public abstract getRepositories(
    owner: string,
    type: string,
    ignoredRepo: string[]
  ): Promise<Repo[]>;

  /**
   * @param getRepository - A some repository
   * @param dateOffset - A date offset in seconds
   */
  public abstract repositoryCommited(repository: Repo, dateOffset: number): boolean;
}
