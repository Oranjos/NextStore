// import ProductsContainer from "@/components/products/ProductsContainer";

// function ProductsPage({
//   searchParams,
// }: {
//   searchParams: { layout?: string; search?: string };
// }) {
//   const layout = searchParams.layout || "grid";
//   const search = searchParams.search || "";

//   return <ProductsContainer layout={layout} search={search} />;
// }

// export default ProductsPage;

import ProductsContainer from "@/components/products/ProductsContainer";

async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string; search?: string }>;
}) {
  const params = await searchParams;
  const layout = params?.layout || "grid";
  const search = params?.search || "";

  return <ProductsContainer layout={layout} search={search} />;
}

export default ProductsPage;

// mport ProductsContainer from "@/components/products/ProductsContainer";

// type SearchParams = {

//   layout?: string;

//   search?: string;

// };

// export default async function ProductsPage({

//   searchParams,

// }: {

//   searchParams: Promise<SearchParams>;

// }) {

//   const { layout = "grid", search = "" } = await searchParams;

//   return <ProductsContainer layout={layout} search={search} />;

// }
