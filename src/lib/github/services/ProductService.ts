import { GitHubDatabase } from '../database';

export class ProductService {
  private db: GitHubDatabase;
  private filePath = 'data/products.json';

  constructor(db: GitHubDatabase) {
    this.db = db;
  }

  async createProduct(product: any) {
    const products = (await this.db.get(this.filePath)) || [];
    products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    await this.db.set(this.filePath, products);
    return product;
  }

  async updateProduct(id: string, updates: any) {
    const products = (await this.db.get(this.filePath)) || [];
    const idx = products.findIndex((p: any) => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
    await this.db.set(this.filePath, products);
    return products[idx];
  }

  async getProductById(id: string) {
    const products = (await this.db.get(this.filePath)) || [];
    return products.find((p: any) => p.id === id) || null;
  }

  async deleteProduct(id: string) {
    let products = (await this.db.get(this.filePath)) || [];
    products = products.filter((p: any) => p.id !== id);
    await this.db.set(this.filePath, products);
    return true;
  }

  async getAllProducts() {
    return (await this.db.get(this.filePath)) || [];
  }

  async getProductsByStore(storeId: string) {
    const products = (await this.db.get(this.filePath)) || [];
    return products.filter((p: any) => p.storeId === storeId);
  }
} 