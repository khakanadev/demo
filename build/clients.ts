import fs from "node:fs"
import path from "node:path"

export const root = path.resolve(import.meta.dirname, "..")
export const clientsDir = path.join(root, "clients")

export type Client = { slug: string; dir: string; json: string; images: string }

export function client(slug: string): Client {
  const dir = path.join(clientsDir, slug)
  return { slug, dir, json: path.join(dir, "business.json"), images: path.join(dir, "images") }
}

/** Все клиенты из clients/, кроме служебных папок на «_» (например, _template). */
export function listClients(): string[] {
  return fs
    .readdirSync(clientsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && fs.existsSync(path.join(clientsDir, d.name, "business.json")))
    .map((d) => d.name)
    .sort()
}

/** Клиент из переменной окружения CLIENT. Без неё Vite не знает, какой сайт собирать. */
export function clientFromEnv(): Client {
  const slug = process.env.CLIENT
  if (!slug) {
    throw new Error(`Не задан CLIENT. Пример: CLIENT=${listClients()[0] ?? "<slug>"} npm run dev`)
  }
  const c = client(slug)
  if (!fs.existsSync(c.json)) {
    throw new Error(`Нет клиента «${slug}»: не найден ${path.relative(root, c.json)}. Есть: ${listClients().join(", ")}`)
  }
  return c
}
