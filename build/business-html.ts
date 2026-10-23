import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"
import { businessSchema, dayKeys, type Business } from "../src/content/schema.ts"
import type { Client } from "./clients.ts"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

const schemaDays: Record<(typeof dayKeys)[number], string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
}

const VIRTUAL_ID = "virtual:business"

function jsonLd(b: Business, siteUrl?: string) {
  const primary = b.phones.find((p) => p.primary) ?? b.phones[0]
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: b.name,
    description: b.description,
    telephone: primary.value,
    url: siteUrl,
    image: siteUrl ? `${siteUrl}${b.hero.image}` : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      addressLocality: b.city,
      postalCode: b.address.postalCode,
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: b.address.lat, longitude: b.address.lon },
    openingHoursSpecification: dayKeys.flatMap((d) => {
      const h = b.schedule[d]
      return h ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: schemaDays[d], opens: h[0], closes: h[1] }] : []
    }),
    sameAs: [b.messengers.vk, b.links.twoGis].filter(Boolean),
  }
}

/**
 * Подключает данные клиента из clients/<slug>/:
 * - `virtual:business` отдаёт его business.json в браузерный код;
 * - картинки из clients/<slug>/images/ раздаются в dev и копируются в сборку как /images/*;
 * - в index.html подставляются заголовок, описание, OG, цвета темы и JSON-LD.
 * DEMO=1 добавляет noindex, SITE_URL задаёт абсолютный адрес сайта (canonical и OG-картинка).
 */
export function businessHtml(c: Client): Plugin {
  let base = "/"
  return {
    name: "business-html",
    configResolved(config) {
      base = config.base
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return c.json
    },
    configureServer(server) {
      server.watcher.add(c.json)
      const prefix = `${base}images/`
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0]
        if (!url?.startsWith(prefix)) return next()
        const file = path.join(c.images, path.basename(decodeURIComponent(url.slice(prefix.length))))
        if (!fs.existsSync(file)) return next()
        res.setHeader("Content-Type", file.endsWith(".svg") ? "image/svg+xml" : `image/${path.extname(file).slice(1)}`)
        fs.createReadStream(file).pipe(res)
      })
    },
    generateBundle() {
      if (!fs.existsSync(c.images)) return
      for (const name of fs.readdirSync(c.images)) {
        if (name.startsWith(".")) continue
        this.emitFile({ type: "asset", fileName: `images/${name}`, source: fs.readFileSync(path.join(c.images, name)) })
      }
    },
    transformIndexHtml(html) {
      const b = businessSchema.parse(JSON.parse(fs.readFileSync(c.json, "utf8")))
      const siteUrl = process.env.SITE_URL?.replace(/\/$/, "")
      const demo = process.env.DEMO === "1"
      const asset = (p: string) => (siteUrl ? `${siteUrl}${p}` : `${base}${p.slice(1)}`)
      const title = `${b.name} — ${b.tagline.toLowerCase()} в ${b.cityIn ?? b.city}`
      const head = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(b.description)}" />`,
        demo ? `<meta name="robots" content="noindex, nofollow" />` : "",
        `<meta name="theme-color" content="${b.theme.background}" />`,
        `<meta name="color-scheme" content="dark" />`,
        `<meta name="format-detection" content="telephone=no" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="ru_RU" />`,
        `<meta property="og:title" content="${esc(title)}" />`,
        `<meta property="og:description" content="${esc(b.description)}" />`,
        `<meta property="og:image" content="${esc(asset(b.hero.image))}" />`,
        siteUrl && !demo ? `<link rel="canonical" href="${esc(siteUrl)}/" />` : "",
        `<link rel="preload" as="image" href="${esc(`${base}${b.hero.imageSmall.slice(1)}`)}" media="(max-width: 767px)" />`,
        `<style>:root{--brand:${b.theme.accent};--brand-foreground:${b.theme.accentForeground};--page:${b.theme.background}}html{background:${b.theme.background}}</style>`,
        `<script type="application/ld+json">${JSON.stringify(jsonLd(b, siteUrl)).replace(/</g, "\\u003c")}</script>`,
      ]
      return html.replace("<!--business-head-->", head.filter(Boolean).join("\n    "))
    },
  }
}
