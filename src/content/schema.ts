import { z } from "zod"
import { dayKeys, iconKeys, type DayKey } from "./keys.ts"

export { dayKeys, iconKeys, type DayKey }

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Время в формате HH:MM")
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Цвет в формате #RRGGBB")
const imagePath = z.string().startsWith("/images/")
const dayHours = z.tuple([time, time]).nullable()

export const businessSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  kind: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1).max(300),
  city: z.string().min(1),
  // Город в предложном падеже для заголовка: «в Калининграде». Без него берётся city
  cityIn: z.string().min(1).optional(),
  timezone: z.string().min(1),
  theme: z.object({
    accent: hexColor,
    accentForeground: hexColor,
    background: hexColor,
  }),
  phones: z
    .array(
      z.object({
        label: z.string(),
        display: z.string(),
        value: z.string().regex(/^\+\d{10,15}$/),
        primary: z.boolean().optional(),
      }),
    )
    .min(1),
  messengers: z.object({
    whatsapp: z.url().optional(),
    telegram: z.url().optional(),
    vk: z.url().optional(),
  }),
  address: z.object({
    street: z.string(),
    note: z.string().optional(),
    district: z.string().optional(),
    postalCode: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  links: z.object({
    twoGis: z.url().optional(),
    twoGisReviews: z.url().optional(),
    twoGisRoute: z.url().optional(),
    yandexRoute: z.url().optional(),
  }),
  schedule: z.object({
    mon: dayHours, tue: dayHours, wed: dayHours, thu: dayHours,
    fri: dayHours, sat: dayHours, sun: dayHours,
  }),
  rating: z
    .object({
      value: z.number().min(0).max(5),
      votes: z.number().int().nonnegative(),
      reviews: z.number().int().nonnegative(),
      source: z.string(),
    })
    .optional(),
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    image: imagePath,
    imageSmall: imagePath,
    imageAlt: z.string(),
  }),
  highlights: z.array(z.object({ icon: z.enum(iconKeys), title: z.string(), text: z.string() })),
  services: z
    .array(
      z.object({
        icon: z.enum(iconKeys),
        title: z.string(),
        text: z.string(),
        // Цена «от», в рублях; null — уточняется по телефону
        price: z.number().positive().nullable(),
      }),
    )
    .min(1),
  pricesNote: z.string().optional(),
  // Заголовок блока с фото; по умолчанию «Как у нас всё устроено»
  galleryTitle: z.string().min(1).optional(),
  gallery: z.array(
    z.object({
      src: imagePath,
      thumb: imagePath,
      alt: z.string().min(1),
      w: z.number().int().positive(),
      h: z.number().int().positive(),
    }),
  ),
  reviews: z.array(
    z.object({
      // Имя на сайте не показывается, хранится только для себя
      author: z.string().optional(),
      rating: z.number().int().min(1).max(5),
      date: z.iso.date(),
      text: z.string().min(1),
      // Ссылка на этот отзыв в 2ГИС (кнопка «Поделиться» у отзыва). Без неё откроется links.twoGisReviews
      url: z.url().optional(),
    }),
  ),
})

export type Business = z.infer<typeof businessSchema>
