import { GitHubDatabase } from '../database';

export class UserService {
  private db: GitHubDatabase;
  private filePath = 'data/users.json';

  constructor(db: GitHubDatabase) {
    this.db = db;
  }

  async createOrUpdateUser(user: any) {
    const users = (await this.db.get(this.filePath)) || [];
    const idx = users.findIndex((u: any) => u.telegram_id === user.telegram_id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    await this.db.set(this.filePath, users);
    return user;
  }

  async getUserById(id: string) {
    const users = (await this.db.get(this.filePath)) || [];
    return users.find((u: any) => u.id === id) || null;
  }

  async deleteUser(id: string) {
    let users = (await this.db.get(this.filePath)) || [];
    users = users.filter((u: any) => u.id !== id);
    await this.db.set(this.filePath, users);
    return true;
  }

  async getUserByTelegramId(telegram_id: string) {
    const users = (await this.db.get(this.filePath)) || [];
    return users.find((u: any) => u.telegram_id === telegram_id) || null;
  }
} 