import ProductDetail from "../../components/ProductDetail";

export default function TruBook() {
  return (
    <ProductDetail
      accent="navy"
      eyebrow="Consumer app · Mobility"
      name="TruBook"
      status="Live"
      tagline="An interstate trip marketplace connecting drivers and passengers."
      description="TruBook is where passengers post where they're going and when, and drivers list their vehicles, routes and available seats to match them. Underneath the simple request board is timing and matching logic built for how interstate travel actually works — trip requests surface within a set window of departure so the board doesn't fill with stale listings, and route-matching understands that a different arrival district within the same destination state can still be a match, while a different departure town never is."
      features={[
        "Trip request board",
        "Driver & vehicle management",
        "Departure-window visibility rules",
        "Same-state district route matching",
        "Booking management",
      ]}
      appUrl="https://play.google.com/store/apps/details?id=com.trubooker.trubooker&pcampaignid=web_share"

      screenshots={[
        "/images/tru1.jpg",
        "/images/tru2.jpg",
      ]}
    />
  );
}
