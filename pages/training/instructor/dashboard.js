import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import InstructorDocs from "../../../components/training/InstructorDocs";
import CourseManager from "../../../components/training/CourseManager";
import { iapi, clearToken, INSTRUCTOR_KEY } from "../../../lib/trainingApi";

export default function InstructorDashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const load = () => iapi("/instructor/me").then(setMe).catch(() => { clearToken(INSTRUCTOR_KEY); router.replace("/training/instructor/login"); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!me) return <Layout title="Instructor dashboard"><p className="mx-auto max-w-6xl px-5 py-24 text-sm text-ink/60 sm:px-8">Loading…</p></Layout>;

  return (
    <Layout title="Instructor dashboard — NexaDataEase Training">
      <section className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/45">Instructor dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Hello, {me.name.split(" ")[0]}</h1>
          </div>
          <button onClick={() => { clearToken(INSTRUCTOR_KEY); router.push("/training"); }} className="rounded-sm border border-line px-4 py-2 text-sm hover:bg-white">Log out</button>
        </div>

        <div className="mt-8 space-y-5">
          {(me.status === "incomplete" || me.status === "rejected") && (
            <>
              <div className={`border-l-4 bg-white p-6 ${me.status === "rejected" ? "border-bronze" : "border-green"}`}>
                <p className="text-xs uppercase tracking-wide text-ink/45">{me.status === "rejected" ? "Application not approved" : "One more step"}</p>
                <p className="mt-2 text-[15px] text-ink/75">
                  {me.status === "rejected" ? `Reason: ${me.reviewNote}. You can update your documents and re-submit.` : "Upload your CV to complete your application."}
                </p>
              </div>
              <InstructorDocs onDone={load} />
            </>
          )}
          {me.status === "pending" && (
            <div className="border-l-4 border-bronze bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-bronze">Under review</p>
              <p className="mt-2 text-[15px] text-ink/75">Thanks! We are reviewing your application and will email you at {me.email} once there is a decision.</p>
            </div>
          )}
          {me.status === "approved" && <CourseManager />}
        </div>
      </section>
    </Layout>
  );
}