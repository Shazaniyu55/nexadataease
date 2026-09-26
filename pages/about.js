import Layout from "../components/Layout";
import ImagePlaceholder from "../components/ImagePlaceholder";
import Image from "next/image";

export default function About() {
  return (
    <Layout title="About — NexaDataEase" description="NexaDataEase is a CAC-registered technology company based in Lagos, Nigeria, building payments, travel and mobility products.">
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">About us</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          A technology company built around one question: what actually
          gets used?
        </h1>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src="/images/logo-full.png"
                        alt="Shazaniyu Gbadamosi, Founder & CEO of NexaDataEase"
                        fill
                        className="w-30 h-30 object-cover"
                      />
                    </div>
        <div className="space-y-8 text-[15px] leading-relaxed text-ink/75">
          <p>
            NexaDataEase Limited is a Nigerian technology company, registered
            with the Corporate Affairs Commission (CAC). We design and build
            software that sits close to the everyday things people already
            spend money and time on — paying bills, booking travel, moving
            between cities.
          </p>
          <p>
            We started with DataEase, an app for the transactions people run
            constantly: airtime, mobile data, electricity, cable TV, flights
            and hotels. Alongside it, we built TruBook, a marketplace for
            interstate trips, and the backend infrastructure that keeps both
            of them running reliably.
          </p>
          <p>
            Each product we ship teaches us something about payments in the
            Nigerian market, and each lesson feeds back into the next thing
            we build — including our plan to introduce escrow-secured
            payments through licensed banking partners.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">Registered & compliant</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              NexaDataEase is registered with the Corporate Affairs
              Commission (CAC) in Nigeria. Our registration details are
              available on request to partners and investors.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Where we operate</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              We're based in Lagos and build for the Nigerian market first —
              designing around local payment rails, local providers and how
              people actually transact day to day.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">How we build</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
              Small team, product-led. We ship the consumer-facing app,
              measure what people actually use, and invest in the
              infrastructure that use case demands next.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
