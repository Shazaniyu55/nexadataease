import ProductDetail from "../../components/ProductDetail";

export default function DataEaseBackend() {
  return (
    <ProductDetail
      accent="bronze"
      eyebrow="Infrastructure · API"
      name="TrueBooker Driver"
      status="In production"
      tagline="TruBook is a marketplace for interstate trips. Passengers post where they're going and when; drivers list vehicles and routes and pick up matching requests."
                  description="TruBook is a marketplace for interstate trips. Passengers post where they're going and when; drivers list vehicles and routes and pick up matching requests."
            features={["Trip request board", "Driver & vehicle management", "Route & district matching"]}

      appUrl="https://play.google.com/store/apps/details?id=com.trubooker.drivers&pcampaignid=web_share"
        screenshots={[
        "/images/tru1.jpg",
        "/images/tru2.jpg",
      ]}
    />
  );
}
