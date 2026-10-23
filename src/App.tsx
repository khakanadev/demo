import { CallBar } from "@/components/call-bar"
import { Contacts } from "@/components/contacts"
import { FinalCta } from "@/components/final-cta"
import { Gallery } from "@/components/gallery"
import { Hero } from "@/components/hero"
import { Highlights } from "@/components/highlights"
import { Reviews } from "@/components/reviews"
import { Services } from "@/components/services"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        К содержимому
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Highlights />
        <Services />
        <Gallery />
        <Reviews />
        <Contacts />
        <FinalCta />
      </main>
      <SiteFooter />
      <CallBar />
    </>
  )
}
