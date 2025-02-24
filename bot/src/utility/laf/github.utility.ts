import { Repo, GitHubApi as Service } from "v@types/utils/github.type";

class GitHubApi extends Service {
	public async getRepositories(
		owner: string,
		type: string,
		ignoredRepo: string[] = [".github"]
	): Promise<Repo[]> {
		try {
			const data: Repo[] = await (
				await fetch(`https://api.github.com/${type}/${owner}/repos`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				})
			).json();

			return data.filter((r: Repo) => !ignoredRepo.includes(r.name));
		} catch {
			return [];
		}
	}

	/**
	 * @param getRepository - A some repository
	 * @param dateOffset - A date offset in seconds
	 */
	public repositoryCommited(repository: Repo, dateOffset: number): boolean {
		const now = Date.parse(new Date().toISOString());
		const last_commit = Date.parse(`${repository.pushed_at}`);

		if (now - last_commit > dateOffset) return false;

		return true;
	}
}

export default GitHubApi;
