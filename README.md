# CS2 Skins Marketplace API

RESTful API для маркетплейса скинов CS2/CS:GO, построенный на NestJS.

## 📋 Содержание

- [Базовые настройки](#базовые-настройки)
- [API Эндпоинты](#api-эндпоинты)
- [Модели данных](#модели-данных)
- [Примеры использования](#примеры-использования)
- [Фильтрация](#фильтрация)
- [Коды ошибок](#коды-ошибок)

## 🔧 Базовые настройки

### Базовый URL

```
http://localhost:3000/api
```

**Примечание:** Порт по умолчанию `3000`, но может быть изменен через переменную окружения `PORT`.

### Первоначальная настройка

Перед первым запуском необходимо настроить базу данных:

```bash
# Применить миграции базы данных
npx prisma db migrate dev --name init

# Сгенерировать Prisma клиент
npx prisma generate

# Заполнить базу данных начальными данными
npx prisma db seed

# Запустить приложение
npm run start
```

### Запуск сервера

```bash
# Разработка
npm run start:dev

# Продакшн
npm run start:prod
```

## 📡 API Эндпоинты

### Получить список скинов

**GET** `/api/skin`

Возвращает список скинов с возможностью фильтрации.

#### Query параметры (все опциональны):

| Параметр | Тип | Описание | Пример |
|----------|-----|----------|--------|
| `weapon` | string | Название оружия | `AK-47`, `AWP`, `Butterfly Knife` |
| `condition` | string | Состояние скина | `FACTORY_NEW`, `MINIMAL_WEAR`, `FIELD_TESTED`, `WELL_WORN`, `BATTLE_SCARRED` |
| `priceFrom` | number | Минимальная цена | `100` |
| `priceTo` | number | Максимальная цена | `1000` |
| `isStatTrak` | 'Y' \| 'N' | Фильтр по StatTrak | `Y` или `N` |
| `isAvailable` | 'Y' \| 'N' | Фильтр по доступности | `Y` или `N` |
| `name` | string | Поиск по названию (частичное совпадение) | `Dragon Lore` |

#### Пример запроса:

```http
GET /api/skin?weapon=AK-47&condition=FACTORY_NEW&priceFrom=100&priceTo=5000&isStatTrak=N&isAvailable=Y
```

#### Пример ответа:

```json
[
  {
    "id": 1,
    "name": "AK-47 | Wild Lotus",
    "weapon": "AK-47",
    "itemType": "SKIN",
    "condition": "FACTORY_NEW",
    "price": 4500.00,
    "iamgeUrl": "https://assets.lis-skins.com/market_images/11022_s.png",
    "isAvailable": true,
    "float": 0.06711,
    "isStatTrak": false,
    "sellerId": 1,
    "seller": {
      "name": "Alice",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
    },
    "createdAt": "2025-01-18T12:00:00.000Z",
    "updatedAt": "2025-01-18T12:00:00.000Z"
  }
]
```

---

### Получить все скины (без фильтров)

**GET** `/api/skin`

Возвращает все доступные скины.

#### Пример запроса:

```http
GET /api/skin
```

---

## 📊 Модели данных

### Skin (Скин)

```typescript
{
  id: number;                    // Уникальный идентификатор
  name: string;                  // Название скина (например, "AK-47 | Wild Lotus")
  weapon: string;                // Название оружия (например, "AK-47", "AWP")
  itemType: "SKIN" | "CASE" | "STICKER" | "GRAFFITI" | "AGENT";
  condition: "FACTORY_NEW" | "MINIMAL_WEAR" | "FIELD_TESTED" | "WELL_WORN" | "BATTLE_SCARRED" | null;
  price: number;                 // Цена в рублях
  iamgeUrl: string;              // URL изображения
  isAvailable: boolean;          // Доступен ли для покупки
  float: number | null;          // Float значение (0.0 - 1.0)
  isStatTrak: boolean;           // Есть ли StatTrak
  sellerId: number;              // ID продавца
  seller: {                      // Информация о продавце
    name: string;
    avatar: string;
  };
  createdAt: string;             // ISO дата создания
  updatedAt: string;             // ISO дата обновления
}
```

### ItemType (Типы предметов)

- `SKIN` - Скины оружия, ножей, перчаток
- `CASE` - Кейсы
- `STICKER` - Стикеры
- `GRAFFITI` - Граффити
- `AGENT` - Агенты

### SkinCondition (Состояния скинов)

- `FACTORY_NEW` - Заводское состояние (FN)
- `MINIMAL_WEAR` - Минимальный износ (MW)
- `FIELD_TESTED` - После полевых испытаний (FT)
- `WELL_WORN` - Сильно изношенный (WW)
- `BATTLE_SCARRED` - Закалённый в боях (BS)
- `null` - Для предметов без состояния (кейсы, стикеры, агенты)

---

## 💡 Примеры использования

### JavaScript/TypeScript (Fetch API)

```typescript
// Получить все AK-47 скины
const response = await fetch('http://localhost:3000/api/skin?weapon=AK-47');
const skins = await response.json();
console.log(skins);

// Поиск скинов с ценой от 1000 до 5000 рублей
const filteredSkins = await fetch(
  'http://localhost:3000/api/skin?priceFrom=1000&priceTo=5000'
).then(res => res.json());

// Поиск StatTrak скинов
const statTrakSkins = await fetch(
  'http://localhost:3000/api/skin?isStatTrak=Y&isAvailable=Y'
).then(res => res.json());

// Поиск по названию
const searchResults = await fetch(
  'http://localhost:3000/api/skin?name=Dragon%20Lore'
).then(res => res.json());

// Комбинированная фильтрация
const complexSearch = await fetch(
  'http://localhost:3000/api/skin?weapon=AWP&condition=FACTORY_NEW&priceFrom=5000&priceTo=15000&isStatTrak=N'
).then(res => res.json());
```

### Axios

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Получить все скины
const getAllSkins = async () => {
  const response = await axios.get(`${API_BASE_URL}/skin`);
  return response.data;
};

// Фильтрация по нескольким параметрам
const getFilteredSkins = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.weapon) params.append('weapon', filters.weapon);
  if (filters.condition) params.append('condition', filters.condition);
  if (filters.priceFrom) params.append('priceFrom', filters.priceFrom);
  if (filters.priceTo) params.append('priceTo', filters.priceTo);
  if (filters.isStatTrak) params.append('isStatTrak', filters.isStatTrak);
  if (filters.isAvailable) params.append('isAvailable', filters.isAvailable);
  if (filters.name) params.append('name', filters.name);
  
  const response = await axios.get(`${API_BASE_URL}/skin?${params}`);
  return response.data;
};

// Использование
const skins = await getFilteredSkins({
  weapon: 'AK-47',
  condition: 'FACTORY_NEW',
  priceFrom: 1000,
  priceTo: 5000
});
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface SkinFilters {
  weapon?: string;
  condition?: string;
  priceFrom?: number;
  priceTo?: number;
  isStatTrak?: 'Y' | 'N';
  isAvailable?: 'Y' | 'N';
  name?: string;
}

const useSkins = (filters: SkinFilters = {}) => {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkins = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        
        const response = await fetch(
          `http://localhost:3000/api/skin?${params}`
        );
        const data = await response.json();
        setSkins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, [filters]);

  return { skins, loading, error };
};

// Использование в компоненте
const SkinsList = () => {
  const { skins, loading, error } = useSkins({
    weapon: 'AK-47',
    isAvailable: 'Y'
  });

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      {skins.map(skin => (
        <div key={skin.id}>
          <img src={skin.iamgeUrl} alt={skin.name} />
          <h3>{skin.name}</h3>
          <p>Цена: {skin.price} ₽</p>
          <p>Состояние: {skin.condition}</p>
          {skin.isStatTrak && <span>StatTrak™</span>}
        </div>
      ))}
    </div>
  );
};
```

---

## 🔍 Фильтрация

### Фильтр по оружию

```http
GET /api/skin?weapon=AK-47
GET /api/skin?weapon=AWP
GET /api/skin?weapon=Butterfly%20Knife
```

### Фильтр по состоянию

```http
GET /api/skin?condition=FACTORY_NEW
GET /api/skin?condition=MINIMAL_WEAR
GET /api/skin?condition=FIELD_TESTED
GET /api/skin?condition=WELL_WORN
GET /api/skin?condition=BATTLE_SCARRED
```

**Важно:** Используйте заглавные буквы и подчеркивания (`FACTORY_NEW`, не `factory_new`).

### Фильтр по цене

```http
GET /api/skin?priceFrom=1000        # От 1000 рублей
GET /api/skin?priceTo=5000          # До 5000 рублей
GET /api/skin?priceFrom=1000&priceTo=5000  # От 1000 до 5000 рублей
```

### Фильтр по StatTrak

```http
GET /api/skin?isStatTrak=Y    # Только StatTrak
GET /api/skin?isStatTrak=N    # Только без StatTrak
```

### Фильтр по доступности

```http
GET /api/skin?isAvailable=Y   # Только доступные
GET /api/skin?isAvailable=N   # Только недоступные
```

### Поиск по названию

```http
GET /api/skin?name=Dragon     # Найдет "AWP | Dragon Lore"
GET /api/skin?name=Wild       # Найдет "AK-47 | Wild Lotus"
```

Поиск выполняется по частичному совпадению (case-insensitive).

### Комбинированная фильтрация

Все фильтры можно комбинировать:

```http
GET /api/skin?weapon=AK-47&condition=FACTORY_NEW&priceFrom=1000&priceTo=5000&isStatTrak=N&isAvailable=Y&name=Lotus
```

---

## 📝 Популярные сценарии использования

### Получить все доступные скины AWP

```http
GET /api/skin?weapon=AWP&isAvailable=Y
```

### Получить дорогие StatTrak ножи

```http
GET /api/skin?weapon=Butterfly%20Knife&isStatTrak=Y&priceFrom=8000
```

### Получить кейсы

```http
GET /api/skin?weapon=Case
```

**Примечание:** Для кейсов поле `weapon` содержит "Case", а `itemType` = "CASE".

### Получить стикеры

```http
GET /api/skin?weapon=Sticker
```

**Примечание:** Для стикеров поле `weapon` содержит "Sticker", а `itemType` = "STICKER".

### Получить агентов

```http
GET /api/skin?weapon=Agent
```

**Примечание:** Для агентов поле `weapon` содержит "Agent", а `itemType` = "AGENT".

### Получить дешевые скины в хорошем состоянии

```http
GET /api/skin?condition=FACTORY_NEW&priceFrom=100&priceTo=500
```

---

## ⚠️ Коды ошибок

API использует стандартные HTTP коды состояния:

- `200 OK` - Успешный запрос
- `400 Bad Request` - Неверные параметры запроса
- `404 Not Found` - Эндпоинт не найден
- `500 Internal Server Error` - Ошибка сервера

---

## 🔗 Дополнительная информация

### Базовый эндпоинт

```http
GET /api
```

Возвращает простое приветственное сообщение (для проверки работы API).

---

## 📌 Важные замечания

1. **Все цены в рублях (₽)**
2. **Float значения** - от 0.0 до 1.0, где меньшее значение = лучше состояние
3. **URL изображений** могут быть внешними (например, `assets.lis-skins.com`)
4. **Фильтры чувствительны к регистру** только для `condition` (используйте заглавные буквы)
5. **Поиск по названию** не чувствителен к регистру и работает по частичному совпадению
6. **Для кейсов, стикеров и агентов** поле `condition` всегда `null`, а `float` всегда `null`

---

## 🚀 Быстрый старт для Frontend

1. Убедитесь, что сервер запущен на `http://localhost:3000`
2. Используйте базовый URL: `http://localhost:3000/api`
3. Начните с простого запроса: `GET /api/skin`
4. Добавьте фильтры по необходимости

---

## 📞 Вопросы?

Если у вас возникли вопросы по использованию API, обратитесь к backend разработчику проекта.
