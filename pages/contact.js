import Image from "next/image";
import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout title="Contact — NexaDataEase" description="Get in touch with NexaDataEase — partnerships, investment or product questions.">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/45">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Let's talk.
            </h1>
            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink/70">
              Whether you're a potential partner, an investor, or you use
              DataEase or TruBook and have feedback — we read everything
              that comes through here.
            </p>

            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden">
              <Image
                src="/images/logo-full.png"
                alt="Shazaniyu Gbadamosi, Founder & CEO of NexaDataEase"
                fill
                className="w-30 h-30 object-cover"
              />
            </div>

            <dl className="mt-10 space-y-6 border-t border-line pt-8">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/45">Email</dt>
                <dd className="mt-1 text-lg">
                  <a href="mailto:info@nexadataease.com" className="hover:text-navy">
                    info@nexadataease.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/45">Office</dt>
                <dd className="mt-1 text-lg">10 Kunene Street, Maitama, Maitama, 904101, Nigeria</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/45">Company status</dt>
                <dd className="mt-1 text-lg">CAC registered, NexaDataEase Limited</dd>
              </div>
            </dl>
          </div>

          <form className="h-fit space-y-5 border-l-4 border-green bg-white p-6 sm:p-8" action="mailto:info@nexadataease.com" method="post" encType="text/plain">
            <div>
              <label htmlFor="name" className="text-xs uppercase tracking-wide text-ink/45">Name</label>
              <input id="name" name="name" type="text" required className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-wide text-ink/45">Email</label>
              <input id="email" name="email" type="email" required className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy" />
            </div>
            <div>
              <label htmlFor="reason" className="text-xs uppercase tracking-wide text-ink/45">This is about</label>
              <select id="reason" name="reason" className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy">
                <option>Partnership</option>
                <option>Investment</option>
                <option>Product feedback</option>
                <option>Something else</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-wide text-ink/45">Message</label>
              <textarea id="message" name="message" rows={4} required className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy" />
            </div>
            <button type="submit" className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-dark">
              Send message
            </button>
            <p className="text-xs text-ink/45">
              This opens your email client. Swap in a form service (e.g.
              Formspree) if you'd rather handle submissions without one.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}