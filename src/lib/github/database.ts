import { Octokit } from '@octokit/rest';
import { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } from './config';

export class GitHubDatabase {
  private octokit: Octokit;
  private cache: Map<string, any>;

  constructor() {
    this.octokit = new Octokit({ auth: GITHUB_TOKEN });
    this.cache = new Map();
  }

  async getContent(path: string): Promise<any> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: GITHUB_OWNER!,
        repo: GITHUB_REPO!,
        path,
        ref: GITHUB_BRANCH,
      });
      if ('content' in data && data.content) {
        const content = Buffer.from(data.content, data.encoding as BufferEncoding).toString();
        return JSON.parse(content);
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateContent(path: string, content: any): Promise<void> {
    const file = await this.getFileSha(path);
    const encodedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
    await this.octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER!,
      repo: GITHUB_REPO!,
      path,
      message: `Update ${path}`,
      content: encodedContent,
      sha: file?.sha,
      branch: GITHUB_BRANCH,
    });
    this.cache.set(path, content);
  }

  async get(path: string): Promise<any> {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }
    const data = await this.getContent(path);
    if (data) this.cache.set(path, data);
    return data;
  }

  async set(path: string, data: any): Promise<void> {
    await this.updateContent(path, data);
  }

  async delete(path: string): Promise<void> {
    const file = await this.getFileSha(path);
    if (!file) return;
    await this.octokit.repos.deleteFile({
      owner: GITHUB_OWNER!,
      repo: GITHUB_REPO!,
      path,
      message: `Delete ${path}`,
      sha: file.sha,
      branch: GITHUB_BRANCH,
    });
    this.cache.delete(path);
  }

  private async getFileSha(path: string): Promise<{ sha: string } | null> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: GITHUB_OWNER!,
        repo: GITHUB_REPO!,
        path,
        ref: GITHUB_BRANCH,
      });
      if ('sha' in data) {
        return { sha: data.sha };
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }
} 