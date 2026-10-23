import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { businessSchema } from "../src/content/schema.ts"
import { client, listClients, root } from "../build/clients.ts"

/** Проверяет clients/<slug>/business.json и картинки. Возвращает список ошибок (пустой — всё хорошо). */
export function checkClient(slug: string): string[] {
  const c = client(slug)
  const rel = path.relative(root, c.json)
  if (!fs.existsSync(c.json)) return [`нет файла ${rel}`]

  const text = fs.readFileSync(c.json, "utf8")
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch (e) {
    return [`${rel}: битый JSON (${(e as Error).message})`]
  }
  const result = businessSchema.safeParse(raw)
  if (!result.success) {
    return result.error.issues.map((i) => `${rel} → ${i.path.join(".") || "(корень)"}: ${i.message}`)
  }

  const b = result.data
  const errors: string[] = []
  if (b.slug !== slug) errors.push(`${rel} → slug: «${b.slug}», а папка называется «${slug}»`)
  // Заготовка из _template помечена TODO: такие места нельзя показывать клиенту
  const todos = text.split("\n").flatMap((line, i) => (line.includes("TODO") ? [`строка ${i + 1}: ${line.trim()}`] : []))
  for (const t of todos) errors.push(`${rel}: не заполнено, ${t}`)

  const images = [b.hero.image, b.hero.imageSmall, ...b.gallery.flatMap((g) => [g.src, g.thumb])]
  for (const src of images) {
    const file = path.join(c.images, src.slice("/images/".length))
    if (!fs.existsSync(file)) errors.push(`нет картинки ${path.relative(root, file)}`)
  }
  return errors
}

// CLI: node scripts/check-content.ts <slug...> | --all  (без аргументов берётся CLIENT)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const slugs = args.includes("--all") ? listClients() : args.length ? args : process.env.CLIENT ? [process.env.CLIENT] : []
  if (!slugs.length) {
    console.error("Укажите клиента: npm run content:check -- <slug> (или --all)")
    process.exit(1)
  }
  let failed = 0
  for (const slug of slugs) {
    const errors = checkClient(slug)
    if (errors.length) {
      failed++
      console.error(`✗ ${slug}`)
      for (const e of errors) console.error(`  • ${e}`)
    } else {
      console.log(`✓ ${slug}`)
    }
  }
  if (failed) process.exit(1)
}
