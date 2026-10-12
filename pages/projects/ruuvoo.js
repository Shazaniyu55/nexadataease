import ProductDetail from "../../components/ProductDetail";

export default function Ruuvoo() {
  return (
    <ProductDetail
      accent="green"
      eyebrow="Consumer app · Payments"
      name="Ruuvoo"
      status="Live"
      tagline="Pay for airtime, data, TV and electricity, and Gift Cards — all from one app."
      description="Ruuvoo is the flagship NexaDataEase product and the reason the company exists. It replaces the four or five separate apps people usually juggle for everyday transactions with one: top up airtime and mobile data, pay electricity and cable TV bills, and Gift Cards, all in a few taps. It's built to be fast and dependable enough to be someone's default app for these transactions, and it's the foundation the rest of the NexaDataEase portfolio is built on."
      features={[
        "Airtime & mobile data top-up",
        "Electricity bill payments",
        "Cable TV subscriptions",
        "Gift Cards",
        "Roadmap: escrow-secured payments with licensed banking partners",
      ]}
      appUrl="https://play.google.com/store/apps/details?id=com.ruuvoo.app"
      screenshots={[
        "/images/ruuvoo1.png",
      ]}
    />
  );
}
