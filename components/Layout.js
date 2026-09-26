import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({
  children,
  title = "NexaDataEase — Payments, mobility and financial infrastructure",
  description = "NexaDataEase is a CAC-registered Nigerian technology company building DataEase (bills, travel and payments), TruBook (interstate ride booking) and the API infrastructure behind them.",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}
