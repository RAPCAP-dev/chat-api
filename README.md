# GREEN-API Messenger

Веб-интерфейс для обмена текстовыми сообщениями Telegram через [GREEN-API](https://green-api.com).

## Возможности

- Подключение к инстансу GREEN-API по `idInstance` и `apiTokenInstance`
- Список существующих чатов и поиск нового собеседника по номеру или username
- Отправка и получение текстовых сообщений
- Сохранение настроек подключения в `localStorage`

## Стек

React 19, TypeScript, Vite, styled-components.

## Запуск

```bash
npm install
npm run dev
```

## Скрипты

- `npm run dev` — dev-сервер
- `npm run build` — сборка (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — предпросмотр собранного приложения
