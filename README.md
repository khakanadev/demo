# Лендинги для автосервисов и шиномонтажей

Один шаблон одностраничного сайта и много клиентов. Каждый клиент — папка `clients/<slug>/` с файлом `business.json` и фото. На сайте: первый экран, услуги, фото, отзывы, часы работы, карта и кнопка «Позвонить» (`tel:`), которая на телефоне закреплена внизу экрана.

Стек: React 19, TypeScript strict, Vite, Tailwind CSS 4, shadcn/ui, Zod. Сайты статические, сервер не нужен.

## Команды

```bash
npm install

CLIENT=kalina-center npm run dev       # http://localhost:5173
npm run content:check -- --all         # проверить данные всех клиентов
npm run build -- kalina-center         # сборка в dist/kalina-center/ (или --all)

npm run new-client -- shina-plus       # новый клиент из clients/_template (или --from <slug>)
npm run deploy -- shina-plus           # выложить демо на GitHub Pages (или --all)
npm run undeploy -- shina-plus         # убрать демо с GitHub Pages
```

## Данные клиента

`clients/<slug>/business.json`: название, телефоны, мессенджеры, адрес и координаты, часы работы, рейтинг, тексты, услуги, фото, отзывы и цвета темы. Схема и описание полей лежат в `src/content/schema.ts`.

Фото лежат в `clients/<slug>/images/`. Для каждого фото нужны две версии: полная (`name.webp`, до 1600px) и превью (`name-sm.webp`, до 800px). В JSON они указываются как `/images/name.webp`.

`npm run content:check` проверяет JSON по схеме, совпадение `slug` с именем папки, наличие картинок и незаполненные `TODO`. Та же проверка запускается перед каждой сборкой и публикацией.

У каждой услуги есть поле `price`: это цена «от» в рублях. Если там `null`, на карточке написано «Цена по телефону».

## Публикация

**Демо (GitHub Pages).** `npm run deploy -- <slug>` собирает сайт под подпапку и кладёт его в ветку `gh-pages`, в папку `<slug>/`. Остальные клиенты при этом не меняются. Адрес демо: `https://<login>.github.io/<repo>/<slug>/`. Демо закрыты от поисковиков (`noindex`).

В настройках репозитория: Settings → Pages → Source: *Deploy from a branch*, ветка `gh-pages`, папка `/ (root)`.

Куда публиковать, берётся из `git remote origin`. Чтобы публиковать в другой репозиторий (например, исходники приватные, а витрина публичная), создайте `pages.config.json`:

```json
{ "repo": "https://github.com/<login>/demo-sites.git" }
```

**Сайт на домене клиента.** `SITE_URL=https://domain.ru npm run build -- <slug>`, затем выложить содержимое `dist/<slug>/` на любой статический хостинг. Из `SITE_URL` строятся canonical и абсолютная ссылка на OG-картинку.
