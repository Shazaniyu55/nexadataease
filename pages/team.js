import Image from "next/image";
import Layout from "../components/Layout";
import ImagePlaceholder from "../components/ImagePlaceholder";

const TEAM = [
  { name: "Shazaniyu Gbadamosi", role: "Founder & CEO", photo: "/team/ceo.jpeg" },
  { name: "Balikis (Enakhe) Gbadamosi", role: "Secretary ", photo: null ,photo: "/team/becky.png"},
];

export default function Team() {
  return (
    <Layout title="Team — NexaDataEase" description="The people building NexaDataEase.">
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Team</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          The people behind NexaDataEase.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink/70">
          A small, product-led team based in Lagos, building DataEase,
          TruBook and the infrastructure behind both.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {TEAM.map((member, i) => (
            <div key={i}>
              {member.photo ? (
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder label="Add headshot" ratio="aspect-square" />
              )}
              <p className="mt-4 text-base font-semibold">{member.name}</p>
              <p className="text-sm text-ink/55">{member.role}</p>
            </div>
          ))}
        </div>
       
      </section>
    </Layout>
  );
}