import raw from "virtual:business"
import type { Business } from "./schema"

// virtual:business — это clients/<CLIENT>/business.json (подключает плагин business-html).
// Он проверяется Zod-схемой при сборке (npm run content:check и плагин), поэтому в браузер валидатор не попадает.
const data = raw as Business

// В JSON пути вида /images/x.webp; на хостинге сайт может лежать в подпапке, поэтому добавляем base.
const asset = (p: string) => `${import.meta.env.BASE_URL}${p.slice(1)}`

export const business: Business = {
  ...data,
  hero: { ...data.hero, image: asset(data.hero.image), imageSmall: asset(data.hero.imageSmall) },
  gallery: data.gallery.map((g) => ({ ...g, src: asset(g.src), thumb: asset(g.thumb) })),
}

export const primaryPhone = business.phones.find((p) => p.primary) ?? business.phones[0]
