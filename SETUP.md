# 🚀 Инструкции по настройке FoodSave Marketplace

## 📋 Предварительные требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** версии 18 или выше
- **npm** или **yarn** пакетный менеджер
- **Git** для работы с репозиторием
- **PostgreSQL** (для продакшена)
- **Redis** (для кэширования)

### Проверка версий:
```bash
node --version  # Должно быть v18.0.0 или выше
npm --version   # Должно быть 8.0.0 или выше
git --version   # Любая актуальная версия
```

## 🛠️ Установка и настройка

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/foodsave-marketplace.git
cd foodsave-marketplace
```

### 2. Установка зависимостей
```bash
npm install
# или
yarn install
```

### 3. Настройка переменных окружения
```bash
# Скопируйте пример файла окружения
cp env.example .env.local

# Отредактируйте файл .env.local в вашем редакторе
```

### 4. Базовая конфигурация для разработки
Для быстрого старта достаточно минимальной конфигурации:

```env
# Минимальная конфигурация для разработки
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 5. Запуск в режиме разработки
```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 🔧 Дополнительная настройка

### Настройка базы данных (PostgreSQL)

1. **Установка PostgreSQL:**
   - Windows: Скачайте с официального сайта
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql`

2. **Создание базы данных:**
```sql
CREATE DATABASE foodsave;
CREATE USER foodsave_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE foodsave TO foodsave_user;
```

3. **Настройка Prisma:**
```bash
# Установка Prisma CLI
npm install -g prisma

# Инициализация Prisma
npx prisma init

# Создание миграций
npx prisma migrate dev

# Генерация Prisma Client
npx prisma generate
```

4. **Обновите DATABASE_URL в .env.local:**
```env
DATABASE_URL="postgresql://foodsave_user:your_password@localhost:5432/foodsave"
```

### Настройка Redis (для кэширования)

1. **Установка Redis:**
   - Windows: Используйте WSL или Docker
   - macOS: `brew install redis`
   - Ubuntu: `sudo apt install redis-server`

2. **Запуск Redis:**
```bash
redis-server
```

3. **Добавьте в .env.local:**
```env
REDIS_URL="redis://localhost:6379"
```

### Настройка карт (Leaflet.js)

Для полноценной работы карт:

1. **Получите API ключ для карт:**
   - Google Maps: https://console.cloud.google.com/
   - Mapbox: https://account.mapbox.com/

2. **Добавьте в .env.local:**
```env
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

## 📱 Настройка PWA

### 1. Создание манифеста
Создайте файл `public/manifest.json`:
```json
{
  "name": "FoodSave - Товары со скидками",
  "short_name": "FoodSave",
  "description": "Платформа для поиска товаров со скидками в Узбекистане",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Создание Service Worker
Создайте файл `public/sw.js` для офлайн функциональности.

## 🔐 Настройка аутентификации

### 1. Настройка NextAuth.js
```bash
npm install next-auth
```

### 2. Создание провайдеров аутентификации
Настройте провайдеры в `app/api/auth/[...nextauth]/route.ts`:
- Phone (SMS) аутентификация
- Google OAuth
- Email/Password (опционально)

### 3. Настройка SMS сервиса
Для верификации по SMS используйте:
- Twilio
- Nexmo
- Локальные SMS провайдеры Узбекистана

## 📊 Настройка аналитики

### 1. Google Analytics
1. Создайте аккаунт в Google Analytics
2. Получите Measurement ID
3. Добавьте в .env.local:
```env
GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 2. Yandex.Metrika
1. Создайте счетчик в Yandex.Metrika
2. Получите ID счетчика
3. Добавьте в .env.local:
```env
YANDEX_METRIKA_ID="12345678"
```

## 🤖 Настройка Telegram Bot

### 1. Создание бота
1. Обратитесь к @BotFather в Telegram
2. Создайте нового бота
3. Получите токен

### 2. Настройка webhook
```bash
curl -F "url=https://your-domain.com/api/telegram/webhook" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

### 3. Добавьте в .env.local:
```env
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_WEBHOOK_URL="https://your-domain.com/api/telegram/webhook"
```

## 🧪 Тестирование

### 1. Запуск тестов
```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

### 2. Проверка сборки
```bash
npm run build
```

## 🚀 Развертывание

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
# Создание образа
docker build -t foodsave .

# Запуск контейнера
docker run -p 3000:3000 foodsave
```

### AWS/GCP
Инструкции по развертыванию на облачных платформах находятся в папке `docs/deployment/`.

## 🔍 Отладка

### Логи разработки
```bash
# Запуск с подробными логами
DEBUG=foodsave:* npm run dev

# Просмотр логов в реальном времени
npm run dev | tee logs/dev.log
```

### Инструменты разработчика
- React Developer Tools
- Redux DevTools (если используется)
- Network tab для отладки API запросов

## 📝 Полезные команды

```bash
# Очистка кэша
npm run clean

# Обновление зависимостей
npm update

# Проверка безопасности
npm audit

# Исправление проблем безопасности
npm audit fix

# Генерация документации
npm run docs

# Создание production сборки
npm run build

# Запуск production сервера
npm start
```

## 🆘 Решение проблем

### Частые проблемы:

1. **Ошибка "Module not found"**
   ```bash
   npm install
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Проблемы с TypeScript**
   ```bash
   npm run type-check
   # Исправьте ошибки типов
   ```

3. **Проблемы с базой данных**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Проблемы с кэшем**
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте [Issues](https://github.com/foodsave-uz/foodsave-marketplace/issues)
2. Создайте новый Issue с подробным описанием проблемы
3. Обратитесь в Telegram: @foodsave_uz
4. Напишите на email: info@foodsave.uz

---

**Удачной разработки! 🚀** 