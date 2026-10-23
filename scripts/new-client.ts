import fs from "node:fs"
import path from "node:path"
import { client, clientsDir, root } from "../build/clients.ts"

// CLI: npm run new-client -- <slug> [--from <другой-slug>]   (по умолчанию копируется clients/_template)
const args = process.argv.slice(2)
const fromIndex = args.indexOf("--from")
const from = fromIndex >= 0 ? args[fromIndex + 1] : "_template"
const slug = args.find((a, i) => !a.startsWith("-") && (fromIndex < 0 || i !== fromIndex + 1))

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Использование: npm run new-client -- <slug> [--from <slug>]\nslug: латиница в нижнем регистре, цифры и дефис, например shina-plus-msk")
  process.exit(1)
}

const src = path.join(clientsDir, from)
const dst = client(slug)
if (!fs.existsSync(path.join(src, "business.json"))) {
  console.error(`Нет образца clients/${from}/`)
  process.exit(1)
}
if (fs.existsSync(dst.dir)) {
  console.error(`clients/${slug}/ уже есть`)
  process.exit(1)
}

fs.cpSync(src, dst.dir, { recursive: true })
const data = JSON.parse(fs.readFileSync(dst.json, "utf8"))
data.slug = slug
fs.writeFileSync(dst.json, JSON.stringify(data, null, 2) + "\n")

console.log(`✓ Создан ${path.relative(root, dst.dir)}/ (из ${from})

Дальше:
  1. Заполните ${path.relative(root, dst.json)}: все поля с TODO, телефоны, адрес, координаты, график.
  2. Положите фото в ${path.relative(root, dst.images)}/ (name.webp до 1600px и name-sm.webp до 800px).
  3. Посмотрите:      CLIENT=${slug} npm run dev
  4. Выложите демо:   npm run deploy -- ${slug}`)
