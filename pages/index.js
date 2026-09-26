import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import ProductPanel from "../components/ProductPanel";
import RotatingWord from "../components/RotatingWord";
import logoIcon from "../public/images/logo-icon.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src={logoIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-0 hidden h-[34rem] w-auto opacity-[0.05] sm:block"
          priority
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-[2.6rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              Digital infrastructure for how Nigerians{" "}
              <RotatingWord
                words={["pay", "move", "spend", "book travel"]}
                className="text-green"
              />
              .
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70">
              NexaDataEase is a Lagos-based technology company. We build the
              products and the payment infrastructure underneath them —
              starting with bills, travel and interstate mobility.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="rounded-sm bg-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-dark"
              >
                See what we've built
              </Link>
              <Link
                href="/contact"
                className="rounded-sm border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/40"
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* Credential strip */}
          <dl className="relative mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-line py-7 sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/45">Status</dt>
              <dd className="mt-1 text-sm font-medium">CAC registered</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/45">Headquarters</dt>
              <dd className="mt-1 text-sm font-medium">Lagos, Nigeria</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/45">Focus areas</dt>
              <dd className="mt-1 text-sm font-medium">Payments · Travel · Mobility</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink/45">Products live</dt>
              <dd className="mt-1 text-sm font-medium">2 apps, 1 API platform</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* About summary */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/45">Who we are</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              We build the products first, then the rails underneath them.
            </h2>
          </div>
          <p className="max-w-prose text-[15px] leading-relaxed text-ink/70">
            Most people in Nigeria manage money and movement through a
            patchwork of apps, agents and cash. NexaDataEase starts by
            solving that directly — a bills and travel app people already
            use — and reinvests what we learn into our own payment and
            trip infrastructure, so the next product doesn't start from
            zero.
          </p>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="text-xs uppercase tracking-wide text-ink/45">What we've built</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
          Three products, one payments engine.
        </h2>

        <div className="mt-10 space-y-6">
          <ProductPanel
            accent="green"
            eyebrow="Consumer app · Payments & travel"
            name="DataEase"
            status="Live"
            description="Pay for airtime, mobile data, cable TV and electricity in seconds, plus book flights and hotels — all from one app."
            points={["Airtime & data", "Electricity & cable TV", "Flight & hotel booking"]}
            detailHref="/projects/dataease"
               appUrl="https://play.google.com/store/apps/details?id=com.nexatech.dataease"
              image="/images/dataeased.jpeg"
             imageAlt="DataEase app home screen"
          />
          <ProductPanel
            accent="navy"
            eyebrow="Mobility"
            name="TruBook"
            status="Live"
            description="An interstate trip marketplace connecting drivers and passengers — trip requests, route matching and booking management in one place."
            points={["Interstate trip requests", "Driver & vehicle management"]}
            detailHref="/projects/trubook"
                appUrl="https://play.google.com/store/apps/details?id=com.trubooker.trubooker&pcampaignid=web_share"
              image="/images/truP.png"
             imageAlt="TruBook app home screen"
          />
          <ProductPanel
                     accent="bronze"
                     eyebrow="Consumer app · Mobility"
                     name="TruBook Driver"
                     status="In production"
                     description="The API layer behind DataEase's bill-payment features, integrating with upstream VTU providers to process transactions reliably."
                     points={["VTU transaction processing", "Provider integrations (VTpass)"]}
                     detailHref="/projects/dataease-backend"
                     appUrl="https://play.google.com/store/apps/details?id=com.trubooker.drivers&pcampaignid=web_share"
                      image="/images/unnamed.png"
                      imageAlt="TruBook Driver app home screen"
                   />
        </div>
      </section>

      {/* Where we're headed */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-wide text-ink/45">Where we're headed</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight">
            Toward escrow-secured payments, built with licensed banking partners.
          </h2>
          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink/70">
            The next chapter for DataEase is escrow — holding funds
            securely between buyers and sellers until a transaction is
            confirmed, in partnership with licensed banks. It's the
            foundation for a fuller fintech offering, not just a bills app.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <h2 className="max-w-md text-2xl font-semibold leading-snug text-white">
            Building, investing or partnering — we'd like to hear from you.
          </h2>
          <Link
            href="/contact"
            className="shrink-0 rounded-sm bg-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-dark"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
