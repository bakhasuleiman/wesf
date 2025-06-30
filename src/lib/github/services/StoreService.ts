import { GitHubDatabase } from '../database';

export class StoreService {
  private db: GitHubDatabase;
  private filePath = 'data/stores.json';

  constructor(db: GitHubDatabase) {
    this.db = db;
  }

  async createStore(store: any) {
    const stores = (await this.db.get(this.filePath)) || [];
    stores.push({ ...store, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    await this.db.set(this.filePath, stores);
    return store;
  }

  async updateStore(id: string, updates: any) {
    const stores = (await this.db.get(this.filePath)) || [];
    const idx = stores.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    stores[idx] = { ...stores[idx], ...updates, updatedAt: new Date().toISOString() };
    await this.db.set(this.filePath, stores);
    return stores[idx];
  }

  async getStoreById(id: string) {
    const stores = (await this.db.get(this.filePath)) || [];
    return stores.find((s: any) => s.id === id) || null;
  }

  async deleteStore(id: string) {
    let stores = (await this.db.get(this.filePath)) || [];
    stores = stores.filter((s: any) => s.id !== id);
    await this.db.set(this.filePath, stores);
    return true;
  }

  async getAllStores() {
    return (await this.db.get(this.filePath)) || [];
  }
} 