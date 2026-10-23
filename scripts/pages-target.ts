import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { root } from "../build/clients.ts"

/**
 * Куда публикуются демо. Берётся из pages.config.json, иначе из git remote origin.
 *   repo    — репозиторий витрины (ветка gh-pages). Можно отдельный публичный, если исходники приватные.
 *   siteUrl — корень сайта витрины. По умолчанию https://<login>.github.io/<repo>.
 */
export type PagesTarget = { repo: string; siteUrl: string }

export function pagesTarget(): PagesTarget {
  const configFile = path.join(root, "pages.config.json")
  const config: Partial<PagesTarget> = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile, "utf8")) : {}

  let repo = config.repo
  if (!repo) {
    try {
      repo = execFileSync("git", ["remote", "get-url", "origin"], { cwd: root, encoding: "utf8" }).trim()
    } catch {
      throw new Error("Не знаю, куда публиковать: нет git remote origin и нет pages.config.json с полем repo")
    }
  }

  let siteUrl = config.siteUrl
  if (!siteUrl) {
    const m = repo.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/)
    if (!m) throw new Error(`Не похоже на GitHub-репозиторий: ${repo}. Укажите siteUrl в pages.config.json`)
    const [, owner, name] = m
    const host = `${owner.toLowerCase()}.github.io`
    siteUrl = name.toLowerCase() === host ? `https://${host}` : `https://${host}/${name}`
  }
  return { repo, siteUrl: siteUrl.replace(/\/$/, "") }
}

/** Адрес демо клиента и путь для Vite base. */
export function demoUrl(t: PagesTarget, slug: string) {
  const url = `${t.siteUrl}/${slug}`
  return { url, base: `${new URL(url).pathname.replace(/\/$/, "")}/` }
}
