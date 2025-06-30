import { GitHubDatabase } from './database';

const db = new GitHubDatabase();

const initialData: Record<'data/users.json' | 'data/products.json' | 'data/stores.json', any[]> = {
  'data/users.json': [],
  'data/products.json': [],
  'data/stores.json': [],
};

export async function initDatabase() {
  const paths = Object.keys(initialData) as Array<keyof typeof initialData>;
  for (const path of paths) {
    const data = await db.get(path);
    if (!data) {
      await db.set(path, initialData[path]);
    }
  }
}

// Для теста можно вызвать initDatabase() при старте приложения или вручную 