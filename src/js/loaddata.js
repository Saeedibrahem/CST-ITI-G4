// export async function loadProducts() {
//   const cached = localStorage.getItem("ecommerce_products");
//   if (cached) {
//     try { return JSON.parse(cached); } catch {}
//   }

//   const res = await fetch("./assets/js/products.json");
//   const data = await res.json();

//   localStorage.setItem("ecommerce_products", JSON.stringify(data));
//   return data;
// }
