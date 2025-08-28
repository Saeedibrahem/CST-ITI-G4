// getProductInfo =============================================================
let products = getProducts();
let product = {};
function getProductById(productId) {
  const currentUser = getCurrentUser();
  for (const item of products) {
    if (item.id == productId) {
      product = item;
    }
  }
  document.getElementById("productName").setAttribute("value", product.name);
  document.getElementById("productDesc").innerHTML = `${product.description}`;
  document.getElementById("productPrice").setAttribute("value", product.price);
  document
    .getElementById("productQuantity")
    .setAttribute("value", product.stock);
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productBrand").value = product.brand;

  for (const product of products) {
    if (product.id == productId) {
      for (const img of product.images) {
        document.getElementById(
          "uploaded-img-container"
        ).innerHTML += `<img src="../../${img}" alt="" />`;
      }
    }
  }

  document.getElementById("seo-pageTitle").setAttribute("value", product.name);
  document.getElementById("seo-metaDesc").innerHTML = `${product.description}`;

  document.getElementById("summary_status").innerHTML =
    product.adminReview.status;
  document.getElementById("summary_price").innerHTML = `${product.price}$`;
  document.getElementById("summary_stock").innerHTML = product.stock;
  document.getElementById("summary_img").innerHTML = product.images.length;
  return product;
}
//! addProductImage =============================================================
let newImgs = product.images;
function addProductImage(e) {
  newImgs.push(e.target.value);
}
//! removeProductImage =============================================================
function removeProductImage(e) {}
// sendUpdatesToAdmin =============================================================
function sendUpdatesToAdmin(e) {
  e.preventDefault();
  const edit_seller_product_form = document.getElementById(
    "edit_seller_product_form"
  );
  if (edit_seller_product_form.checkValidity()) {
    const entered_productName = document.getElementById("productName").value;
    const entered_productDesc =
      document.getElementById("productDesc").innerHTML;
    const entered_productPrice = document.getElementById("productPrice").value;
    const entered_productCategory =
      document.getElementById("productCategory").value;
    const entered_productBrand = document.getElementById("productBrand").value;
    const entered_seo_pageTitle =
      document.getElementById("seo-pageTitle").value;
    const entered_seo_metaDesc = document.getElementById("seo-metaDesc").value;

    let newProduct = {};
    Object.assign(newProduct, product);
    newProduct.name = entered_productName;
    newProduct.description = entered_productDesc;
    newProduct.price = entered_productPrice;
    newProduct.category = entered_productCategory;
    newProduct.brand = entered_productBrand;
    newProduct.seo_pageTitle = entered_seo_pageTitle;
    newProduct.seo_metaDesc = entered_seo_metaDesc;
    let newProducts = products.map((item) => {
      if (item.id == newProduct.id) {
        return newProduct;
      } else {
        return item;
      }
    });

    // localStorage.setItem("products", JSON.stringify(newProducts));
    // window.location.href = "../../index.html";
  } else {
    edit_seller_product_form.classList.add("was-validated");
  }
}
//! removeImage =============================================================
