import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import ghpages from "gh-pages"
import { root } from "../build/clients.ts"
import { buildClients, slugsFromArgs } from "./build.ts"
import { demoUrl, pagesTarget } from "./pages-target.ts"

type PublishOptions = Parameters<typeof ghpages.publish>[1]

const publish = (dir: string, options: PublishOptions) =>
  new Promise<void>((resolve, reject) => ghpages.publish(dir, options, (err) => (err ? reject(err) : resolve())))

const [command, ...args] = process.argv.slice(2)
const target = pagesTarget()

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

  if (all) {
    // --all синхронизирует витрину с clients/: удалённые клиенты исчезнут и с сайта
    await publish(path.join(root, "dist"), { repo: target.repo, nojekyll: true, message: "Демо: все клиенты" })
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
    // git.cwd — рабочая копия ветки gh-pages (в типах @types/gh-pages его нет); следующий `git add .` зафиксирует удаление
    beforeAdd: async (git) => {
      const cwd = (git as typeof git & { cwd: string }).cwd
      for (const slug of slugs) fs.rmSync(path.join(cwd, slug), { recursive: true, force: true })
      return git
    },
  })
  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`Убрано с витрины: ${slugs.join(", ")}. Папки в clients/ не тронуты.`)
} else {
  console.error("Использование: npm run deploy -- <slug...> | --all;  npm run undeploy -- <slug...>")
  process.exit(1)
}
