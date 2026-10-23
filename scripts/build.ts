import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { listClients, root } from "../build/clients.ts"
import { checkClient } from "./check-content.ts"

export type BuildOptions = {
  /** Подпапка на хостинге для Vite base, например /demo-sites/kalina-center/ */
  base?: string
  /** Абсолютный адрес сайта: canonical, OG-картинка */
  siteUrl?: string
  /** Демо: noindex */
  demo?: boolean
}

const bin = (name: string) => path.join(root, "node_modules/.bin", name)

function run(cmd: string, args: string[], env: NodeJS.ProcessEnv = {}) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", env: { ...process.env, ...env } })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

/** Проверяет контент, типы и собирает каждого клиента в dist/<slug>/. */
export function buildClients(slugs: string[], options: (slug: string) => BuildOptions = () => ({})) {
  let bad = false
  for (const slug of slugs) {
    const errors = checkClient(slug)
    if (errors.length) {
      bad = true
      console.error(`✗ ${slug}`)
      for (const e of errors) console.error(`  • ${e}`)
    }
  }
  if (bad) process.exit(1)

  run(bin("tsc"), ["-b"])
  for (const slug of slugs) {
    const o = options(slug)
    console.log(`\n▸ ${slug}`)
    run(bin("vite"), ["build", "--logLevel", "warn"], {
      CLIENT: slug,
      BASE_PATH: o.base ?? "/",
      SITE_URL: o.siteUrl ?? process.env.SITE_URL ?? "",
      DEMO: o.demo ? "1" : process.env.DEMO ?? "",
    })
    console.log(`✓ dist/${slug}/`)
  }
}

export function slugsFromArgs(args: string[]): string[] {
  const slugs = args.includes("--all") ? listClients() : args.filter((a) => !a.startsWith("-"))
  if (!slugs.length) {
    console.error("Укажите клиента (или --all). Есть: " + listClients().join(", "))
    process.exit(1)
  }
  return slugs
}

// CLI: npm run build -- <slug...> | --all   (сайт для своего домена, base = /)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const slugs = args.length ? slugsFromArgs(args) : process.env.CLIENT ? [process.env.CLIENT] : slugsFromArgs(args)
  buildClients(slugs)
}
