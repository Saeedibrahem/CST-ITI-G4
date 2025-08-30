// set in localStorage

// localStorage.setItem("cart", JSON.stringify([
//   { id: 1, stock:3, name: "iPhone 14 Pro Max", price: 1399, qty: 1, img: "image/iphone.webp" },
//   { id: 2, stock:2, name: "AirPods Max", price: 549, qty: 1, img: "image/airpod.webp" },
//   { id: 3, stock:4, name: "Apple Watch Series 9", price: 399, qty: 1, img: "image/watch.webp" }
// ]));


  // {
  //   "id": 7,
  //   "name": "iPhone 15 Pro Max",
  //   "slug": "50320",
  //   "old_price": 120394,

  //   "color": "white",
  //   "os": "ios",
  //   "brand": "iphone",

  //   "description": "iPhone 15 Pro Max with A17 Pro chip, 6.7-inch ProMotion display, titanium design, 5x optical zoom, and USB-C port.",
  //   "price": 12199,
  //   "originalPrice": 1299,
  //   "salePercentage": 0,
  //   "category": "Smartphones",
  //   "stock": 10,
  //   "images": [
  //     "../../assets/img/products/iphone15promax/front.png",
  //     "../../assets/img/products/iphone15promax/back.png"
  //   ],
  //   "sellerId": 105,
  //   "rating": 4.9,
  //   "adminReview": {
  //     "status": "approved",
  //     "reviewedBy": "admin003",
  //     "reviewedAt": "2025-01-25T09:15:00Z",
  //     "notes": "First iPhone with USB-C and titanium build.",
  //     "approvalDate": "2025-01-25T09:15:00Z"
  //   },
  //   "userComments": [
  //     {
  //       "id": "comment_014",
  //       "userId": "user555",
  //       "username": "EarlyAdopter",
  //       "rating": 5,
  //       "comment": "The titanium build feels premium and lightweight. USB-C is finally here! The 5x zoom is impressive for a smartphone.",
  //       "createdAt": "2025-01-26T16:30:00Z",
  //       "helpful": 30,
  //       "verified": true
  //     },
  //     {
  //       "id": "comment_015",
  //       "userId": "user666",
  //       "username": "PhotographyPro",
  //       "rating": 4,
  //       "comment": "Camera system is phenomenal, especially the periscope zoom. Battery life could be slightly better though.",
  //       "createdAt": "2025-01-27T10:20:00Z",
  //       "helpful": 15,
  //       "verified": true
  //     }
  //   ],
  //   "specifications": {
  //     "Processor": "A17 Pro (3nm)",
  //     "Display": "6.7-inch Super Retina XDR, 120Hz",
  //     "RAM": "8GB",
  //     "Storage": "256GB",
  //     "Battery": "4422 mAh",
  //     "Camera": "48MP (Main) + 12MP (Telephoto) + 12MP (Ultra-wide)"
  //   },
  //   "createdAt": "2025-08-18T10:30:00Z",
  //   "updatedAt": "2025-08-18T10:30:00Z"
  // }


//localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
let tax=0;
function renderCart() {
  let cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="list-group-item d-flex align-items-center cart-item">
        <img src="${item.image}" class="me-3">
        <div class="flex-grow-1">
          <h6>${item.name}</h6>
          <p class="mb-1">$${item.price} x ${item.qty}</p>
          <span id="stockspan" class="badge mb-2 bg-success stockspan">available: ${item.stock} piec</span>
          <div class="d-flex align-items-center flex-wrap">
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
            
            <!-- زرار الحذف -->
            <div class="delete-wrap d-inline-block ms-3 mt-2 mt-md-0" id="deleteWrap-${index}">
              <button class="delete-btn btn-sm">Delete</button>
              <div class="x-mark">✕</div>
              <div class="bubble"></div>
            </div>
          </div>
        </div>
        </div>
        <strong>$${item.price * item.qty}</strong>
      </div>`;
  });

  tax = Math.round(subtotal * 0.014);
  let shipping = subtotal > 0 ? 60 : 0;
  let total = subtotal + tax + shipping;

  document.getElementById("subtotal").innerText ="$"+" "+subtotal;
  document.getElementById("tax").innerText ="$"+" "+ tax;
  document.getElementById("shipping").innerText ="$"+" "+ shipping;
  document.getElementById("total").innerText ="$"+" "+ total;

  saveCart();

  cart.forEach((item,index)=>{
    initDeleteButton(index);
  });
}


function updateQty(index, change) {
  let newQty = cart[index].qty + change;
  if (newQty < 1) {
    return;
  }
  if (newQty > cart[index].stock) {
    document.getElementsByClassName("stockspan")[index].classList.remove("bg-success");
    document.getElementsByClassName("stockspan")[index].classList.add("bg-danger");
    return;
  }
  cart[index].qty = newQty;

  renderCart();
}


function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}


renderCart();


function initDeleteButton(index){
  const wrap = document.getElementById("deleteWrap-"+index);
  if(!wrap) return;
  const btn = wrap.querySelector(".delete-btn");
  const x = wrap.querySelector(".x-mark");
  let confirmMode = false;

  btn.addEventListener("click", () => {
    if(!confirmMode){
      wrap.classList.add("active");
      confirmMode = true;
      setTimeout(()=>{
        wrap.classList.remove("active");
        confirmMode = false;
      },5000);
    } else {
      removeItem(index);
    }
  });

  x.addEventListener("click", () => {
    wrap.classList.remove("active");
    confirmMode = false;
  });
}



let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};

function showCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const items = cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    qty: item.qty,
    image: item.image, 
  }));

  // update cartInfo
  cartInfo.items = items;
  cartInfo.address = cartInfo.address || "";
  cartInfo.shippingMethod = cartInfo.shippingMethod || "Standard";
  cartInfo.shippingCost = cartInfo.shippingCost || 0;
  cartInfo.shippingDate = cartInfo.shippingDate || "";
  cartInfo.tax = tax || 0;

  // localStorage update
  localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
  window.location.href = "../../pages/cart/ceckout.html"; 


}