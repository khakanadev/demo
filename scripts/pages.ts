import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import ghpages from "gh-pages"
import { root } from "../build/clients.ts"
import { buildClients, slugsFromArgs } from "./build.ts"
import { demoUrl, pagesTarget } from "./pages-target.ts"

type PublishOptions = Parameters<typeof ghpages.publish>[1]
type Git = Parameters<NonNullable<NonNullable<PublishOptions>["beforeAdd"]>>[0]

const publish = (dir: string, options: PublishOptions) =>
  new Promise<void>((resolve, reject) => ghpages.publish(dir, options, (err) => (err ? reject(err) : resolve())))

const [command, ...args] = process.argv.slice(2)
const target = pagesTarget()

// git.cwd — рабочая копия ветки gh-pages (в типах @types/gh-pages его нет)
const cwdOf = (git: Git) => (git as Git & { cwd: string }).cwd

/** Оставляет в корне витрины только папки этих клиентов. Пакет сам не удаляет файлы на «.», поэтому чистим вручную. */
const keepOnly = (slugs: string[]) => async (git: Git) => {
  const keep = new Set([".git", ".nojekyll", ...slugs])
  for (const name of fs.readdirSync(cwdOf(git))) {
    if (!keep.has(name)) fs.rmSync(path.join(cwdOf(git), name), { recursive: true, force: true })
  }
  return git
}

const hasPagesBranch = () =>
  execFileSync("git", ["ls-remote", "--heads", target.repo, "gh-pages"], { cwd: root, encoding: "utf8" }).trim() !== ""

if (command === "deploy") {
  // Собираем демо с base под подпапку и кладём каждое в gh-pages/<slug>/.
  // Без --add gh-pages чистит только папку dest, остальные клиенты на витрине остаются.
  const all = args.includes("--all")
  const slugs = slugsFromArgs(args)
  // Старые сборки удалённых клиентов не должны попасть на витрину
  if (all) fs.rmSync(path.join(root, "dist"), { recursive: true, force: true })
  buildClients(slugs, (slug) => {
    const { url, base } = demoUrl(target, slug)
    return { base, siteUrl: url, demo: true }
  })

  if (all || !hasPagesBranch()) {
    // --all синхронизирует витрину с clients/: удалённые клиенты исчезнут и с сайта.
    // Новую ветку gh-pages пакет создаёт из копии main, поэтому первая публикация тоже чистит корень,
    // иначе исходники попали бы на сайт.
    await publish(path.join(root, "dist"), {
      repo: target.repo,
      src: slugs.map((s) => `${s}/**`),
      nojekyll: true,
      message: all ? "Демо: все клиенты" : `Демо: ${slugs.join(", ")}`,
      beforeAdd: keepOnly(slugs),
    })
  } else {
    for (const slug of slugs) {
      await publish(path.join(root, "dist", slug), { repo: target.repo, dest: slug, nojekyll: true, message: `Демо: ${slug}` })
    }
  }
  console.log("\nОпубликовано (GitHub Pages обновляется ~1 минуту):")
  for (const slug of slugs) console.log(`  ${demoUrl(target, slug).url}/`)
} else if (command === "undeploy") {
  const slugs = args.filter((a) => !a.startsWith("-"))
  if (!slugs.length) {
    console.error("Укажите клиента: npm run undeploy -- <slug>")
    process.exit(1)
  }
  // gh-pages не публикует пустую папку, поэтому кладём только .nojekyll, а нужные папки удаляем перед коммитом
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "undeploy-"))
  fs.writeFileSync(path.join(tmp, ".nojekyll"), "")
  await publish(tmp, {
    repo: target.repo,
    add: true,
    dotfiles: true,
    message: `Убрано демо: ${slugs.join(", ")}`,
    // Следующий `git add .` зафиксирует удаление
    beforeAdd: async (git) => {
      for (const slug of slugs) fs.rmSync(path.join(cwdOf(git), slug), { recursive: true, force: true })
      return git
    },
  })
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`Убрано с витрины: ${slugs.join(", ")}. Папки в clients/ не тронуты.`)
} else {
  console.error("Использование: npm run deploy -- <slug...> | --all;  npm run undeploy -- <slug...>")
  process.exit(1)
}
