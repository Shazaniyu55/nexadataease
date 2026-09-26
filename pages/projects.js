import Layout from "../components/Layout";
import ProductPanel from "../components/ProductPanel";

export default function Projects() {
  return (
    <Layout
      title="Products — NexaDataEase"
      description="DataEase, TruBook and DataEase Backend — the products and infrastructure built by NexaDataEase."
    >
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Portfolio</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          What we've built so far.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink/70">
          Two consumer products and the infrastructure that runs underneath
          them, all built and maintained in-house.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="space-y-6">
          <ProductPanel
            accent="green"
            eyebrow="Consumer app · Payments & travel"
            name="DataEase"
            status="Live"
            description="DataEase is our flagship app — the place people go to pay for airtime, mobile data, electricity and cable TV, and to book flights and hotels, without switching between four different apps."
            points={["Airtime & data top-up", "Electricity & cable TV bills", "Flight booking", "Hotel booking"]}
            detailHref="/projects/dataease"
            appUrl="https://play.google.com/store/apps/details?id=com.nexatech.dataease"
              image="/images/dataeased.jpeg"
             imageAlt="DataEase app home screen"
          />
          <ProductPanel
            accent="navy"
            eyebrow="Consumer app · Mobility"
            name="TruBook Passenger"
            status="Live"
            description="TruBook is a marketplace for interstate trips. Passengers post where they're going and when; drivers list vehicles and routes and pick up matching requests."
            points={["Trip request board", "Driver & vehicle management", "Route & district matching"]}
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

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-wide text-ink/45">Next</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight">
            Escrow-secured payments, in partnership with licensed banks.
          </h2>
          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink/70">
            We're growing DataEase's user base, strengthening payment
            security and speed, and building out escrow functionality with
            licensed banking partners — turning a bills app into fuller
            financial infrastructure.
          </p>
        </div>
      </section>
    </Layout>
  );
}
