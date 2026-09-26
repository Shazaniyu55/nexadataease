import ProductDetail from "../../components/ProductDetail";

export default function DataEaseBackend() {
  return (
    <ProductDetail
      accent="bronze"
      eyebrow="Infrastructure · API"
      name="DataEase Backend"
      status="In production"
      tagline="The VTU and payments API powering DataEase."
      description="DataEase Backend is the API layer behind DataEase's bill-payment features. It integrates with upstream VTU providers — currently VTpass — to process airtime, mobile data, cable TV and electricity transactions, and is built to be dependable enough that every consumer-facing product in the portfolio can rely on it. It's infrastructure rather than a product people see directly, but it's what makes the rest of the portfolio possible."
      features={[
        "VTU transaction processing",
        "VTpass provider integration",
        "Built for reliability at scale",
        "NestJS / TypeScript",
      ]}
      appUrl="#"
    />
  );
}
