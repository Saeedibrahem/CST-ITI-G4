//getCurrentUser()
// user = {
// email:"abdo@gmail.com"
// firstName:"abdo"
// id:0
// lastName:"sakr"
// password:"123"
// role:"customer"    
// }


//   {
//     "id": 0,
//     "firstName": "abdo",
//     "lastName": "sakr",
//     "email": "abdo@gmail.com",
//     "password": "123",
//     "addresses": [
//             {
//                 "name": "Home",
//                 "street": "123 Main St.",
//                 "city": "Cairo",
//                 "phone": "(201) 555-0101"
//             },
//             {
//                 "name": "Office",
//                 "street": "2715 Ash Dr.",
//                 "city": "masoura",
//                 "phone": "(704) 555-0127"
//             }
//         ],
//     "role": "customer"
//   }


// localStorage.setItem("cartInfo", JSON.stringify({
//     items: [
//         {
//             name: "Apple iPhone 14 Pro Max 128Gb",
//             price: 1399,
//             image: "image/iphone.webp"
//         },
//         {
//             name: "AirPods Max Silver",
//             price: 549,
//             image: "image/airpod.webp"
//         },
//         {
//             name: "Apple Watch Series 9 GPS 41mm",
//             price: 399,
//             image: "image/watch.webp"
//         }
//     ],
//     userId: 0,
//     address: "1131 Dusty Townline, Jacksonville, TX 40322",
//     phone: "(704) 555-0127",
//     shippingMethod: "Free",
//     shippingCost: 50,
//     shippingDate: "5 oct 2025",   // date when podect will arrive
//     Subtotal: 3000,
//     tax: 50,
//     Total: 3100,
//     PaymentMethod: "PayPal",
//     date: new Date().toLocaleString()

// }));




let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};


// step 1
let editIndex = null;
let user = JSON.parse(localStorage.getItem("userss")) || [
    {
        "id": 0,
        "firstName": "abdo",
        "lastName": "sakr",
        "email": "abdo@gmail.com",
        "password": "123",
        "addresses": [
            {
                "name": "Home",
                "street": "123 Main St.",
                "city": "Cairo",
                "phone": "(201) 555-0101"
            },
            {
                "name": "Office",
                "street": "2715 Ash Dr.",
                "city": "masoura",
                "phone": "(704) 555-0127"
            }
        ],
        "role": "customer"
    }
];



let selectedUserIndex = 0;
cartInfo.userId = selectedUserIndex;
localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
let addresses = user[selectedUserIndex].addresses;

// notification alert 
const alertPlaceholder = document.getElementById('notification');
function showAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    alertPlaceholder.append(wrapper);
    setTimeout(() => wrapper.remove(), 3000); // auto hide
}



let deleteTimeout = null;

function renderAddresses() {
    const list = document.getElementById("address-list");
    list.innerHTML = "";

    addresses.forEach((addr, index) => {

        const div = document.createElement("div");
        div.className = "card mb-3 shadow-sm  bg-light  border border-0";
        div.innerHTML = `    
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="address" id="addr-${index}" value="${index}">
                    <div>
                        <h5 > ${addr.street} <span class="badge text-bg-dark mx-2">${addr.name}</span></h5>
                        ${addr.city}<br>
                        ${addr.phone}
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm  me-2" onclick="editAddress(${index})" data-bs-toggle="modal" data-bs-target="#addressModal"><span style='font-size:30px;'>✎</span></button>
                    <button class="btn btn-sm btn-close " onclick="startDelete(${index}, this)"></button>
                </div>
            </div>`;
        list.appendChild(div);
    });

    user[selectedUserIndex].addresses = addresses;
    localStorage.setItem("userss", JSON.stringify(user));
}

function startDelete(index, btn) {
    if (btn.classList.contains("loading")) {
        // ضغط تاني → إلغاء
        btn.classList.remove("loading");
        clearTimeout(deleteTimeout);
        deleteTimeout = null;
        showAlert("❌ Delete Cancelled", "danger");
    } else {

        btn.classList.add("loading");
        deleteTimeout = setTimeout(() => {
            deleteAddress(index);
            btn.classList.remove("loading");
            showAlert("✅ Deleted Successfully", "success");
        }, 2000);
    }
}

function checking() {
    const name = document.getElementById("name").value;
    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const phone = document.getElementById("phone").value;

    if (name === "" || street === "" || city === "" || phone === "") {
        document.getElementById("address-listxx").classList.remove("d-none");
        return false;
    } else {
        document.getElementById("address-listxx").classList.add("d-none");
        return true;
    }
}

function closeForm() {
    document.getElementById("name").value = "";
    document.getElementById("street").value = "";
    document.getElementById("city").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address-listxx").classList.add("d-none");
    editIndex = null;
}

function saveAddress() {
    const name = document.getElementById("name").value;
    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const phone = document.getElementById("phone").value;

    if (checking()) {
        if (editIndex !== null) {
            addresses[editIndex] = { name, street, city, phone };
        } else {
            addresses.push({ name, street, city, phone });
        }

        user[selectedUserIndex].addresses = addresses;
        localStorage.setItem("userss", JSON.stringify(user));

        renderAddresses();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"));
        modal.hide();
        closeForm();
    }
}

function editAddress(index) {
    editIndex = index;
    const addr = addresses[index];
    document.getElementById("name").value = addr.name;
    document.getElementById("street").value = addr.street;
    document.getElementById("city").value = addr.city;
    document.getElementById("phone").value = addr.phone;
    document.getElementById("form-title").innerText = "Edit Address";
}

function deleteAddress(index) {
    addresses.splice(index, 1);
    user[selectedUserIndex].addresses = addresses;
    localStorage.setItem("userss", JSON.stringify(user));
    renderAddresses();
}

renderAddresses();

// step 1 end


// step 2 Start
function calcShippingCost(days) {
    if (days <= 2) return 100;
    if (days >= 10) return 50;
    return 100 - (days - 2) * 10;
}
// show cost and date
function setDate(spanId, inputId, costId, daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    const options = { day: "numeric", month: "short", year: "numeric" };
    document.getElementById(spanId).textContent = date.toLocaleDateString("en-GB", options);
    document.getElementById(inputId).value = date.toLocaleDateString("en-GB", options);

    const cost = calcShippingCost(daysToAdd);
    document.getElementById(costId).textContent = cost + "$";
}
setDate("datespan1", "spinp1", "cost1", 2);
setDate("datespan2", "spinp2", "cost2", 5);
setDate("datespan3", "spinp3", "cost3", 6);


const customRadio = document.getElementById("ship4");
const customDateInput = document.getElementById("customDate");
const customCost = document.getElementById("customCost");

customRadio.addEventListener("change", function () {
    if (this.checked) {
        customDateInput.disabled = false;
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 3);
        customDateInput.min = minDate.toISOString().split("T")[0];
    }
});

customDateInput.addEventListener("change", function () {
    const today = new Date();
    const selected = new Date(this.value);
    const diffDays = Math.ceil((selected - today) / (1000 * 60 * 60 * 24));
    const cost = calcShippingCost(diffDays);
    customCost.textContent = cost + "$";
});

document.querySelectorAll("input[name='shipping']").forEach(radio => {
    if (radio.id !== "ship4") {
        radio.addEventListener("change", () => {
            customDateInput.disabled = true;
            customCost.textContent = "";
        });
    }
});


// step 2 end


// step 3 start


const itemsList = document.getElementById("itemsList");
let subtotal = 0;

cartInfo.items.forEach(item => {
    subtotal += item.price;
    itemsList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="${item.image}" class="me-2">
            <span>${item.name}</span>
          </div>
          <span>$${item.price} </span> x <span>${item.qty}</span>
        </li>`;
});

// total calc
const total = subtotal + cartInfo.tax + cartInfo.shippingCost;
cartInfo.total = total;
localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
// display data
document.getElementById("address").textContent = cartInfo.address;
document.getElementById("shipment").textContent = cartInfo.shippingMethod;
document.getElementById("shipmentDate").textContent = cartInfo.shippingDate;
document.getElementById("shipmentCost").textContent = cartInfo.shippingCost + "$";
document.getElementById("subtotal").textContent = `$${subtotal}`;
document.getElementById("tax").textContent = `$${cartInfo.tax}`;
document.getElementById("total").textContent = `$${total}`;



document.querySelectorAll(".card-preview").forEach(preview => {
    const numberInput = preview.parentElement.querySelector(".cardNumber");
    const nameInput = preview.parentElement.querySelector(".cardName");
    const monthInput = preview.parentElement.querySelector(".cardMonth");
    const yearInput = preview.parentElement.querySelector(".cardYear");
    const cvvInput = preview.parentElement.querySelector(".cardCvv");

    const numberPreview = preview.querySelector(".cardNumberPreview");
    const namePreview = preview.querySelector(".cardNamePreview");
    const datePreview = preview.querySelector(".cardDatePreview");
    const cvvPreview = preview.querySelector(".cvvPreview");

    // رقم البطاقة
    numberInput.addEventListener("input", e => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        numberInput.value = value;
        numberPreview.textContent = value || "#### #### #### ####";
    });

    // اسم البطاقة
    nameInput.addEventListener("input", e => {
        namePreview.textContent = e.target.value.toUpperCase() || "FULL NAME";
    });

    // CVV
    cvvInput.addEventListener("input", e => {
        cvvPreview.textContent = e.target.value || "CVV";
    });

    // تاريخ البطاقة
    function updateDate() {
        let mm = monthInput.value;
        let yy = yearInput.value ? yearInput.value.toString().slice(2) : "";
        datePreview.textContent = (mm && yy) ? `${mm}/${yy}` : "MM/YY";
    }
    monthInput.addEventListener("change", updateDate);
    yearInput.addEventListener("change", updateDate);

    // flip البطاقة عند كتابة CVV
    cvvInput.addEventListener("focus", () => preview.classList.add("flipped"));
    cvvInput.addEventListener("blur", () => preview.classList.remove("flipped"));
});



// step 3 end

// steps control
let currentStep = 1;

function showStep(step) {
    document.querySelectorAll('.step-content').forEach(div => div.classList.add('hidden'));
    document.getElementById(`step-${step}`).classList.remove('hidden');

    let steps = document.querySelectorAll('.steps .step');
    steps.forEach((s, i) => {
        s.classList.remove('active');
        if (i === step - 1) {
            s.classList.add('active');
        }
    });

    currentStep = step;
}

function nextStep() {
    if (currentStep === 1) {
        let selectedRadio = document.querySelector('input[name="address"]:checked');
        if (!selectedRadio) {
            showAlert("⚠️ please select an address", "warning");
            return;
        }
        let selectedIndex = selectedRadio.value;
        let selectedAddr = addresses[selectedIndex];
        cartInfo.address = `${selectedAddr.street}, ${selectedAddr.city}`;
        cartInfo.phone = selectedAddr.phone;
        localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
    }


    if (currentStep === 2) {
        const selected = document.querySelector("input[name='shipping']:checked");
        // لو مفيش اختيار
        if (!selected) {
            showAlert("⚠️ please select a shipping method", "warning");
            return;
        }
        if (selected.id === "ship1") {
            cartInfo.shippingMethod = "Fast Delivery";
            cartInfo.shippingDate = document.getElementById("spinp1").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost1").innerText.replace("$", "")) || 0;
        }
        else if (selected.id === "ship2") {
            cartInfo.shippingMethod = "Standard Delivery";
            cartInfo.shippingDate = document.getElementById("spinp2").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost2").innerText.replace("$", "")) || 0;
        }
        else if (selected.id === "ship3") {
            cartInfo.shippingMethod = "Scheduled Delivery";
            cartInfo.shippingDate = document.getElementById("spinp3").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost3").innerText.replace("$", "")) || 0;
        }
        else if (selected.id === "ship4") {
            const customDateInput = document.getElementById("customDate");
            if (!customDateInput.value) {
                showAlert("⚠️ please select a date", "warning");
                return;
            }
            cartInfo.shippingMethod = "Custom Delivery";
            cartInfo.shippingDate = customDateInput.value;
            cartInfo.shippingCost = parseFloat(document.getElementById("customCost").innerText.replace("$", "")) || 0;
        }
        localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
    }

    if (currentStep < 3) {
        showStep(currentStep + 1);
    }
}
let step3 = "pay"

// function step3valid() {
//     step3 = "active"
// }

function step3valid() {
    let activeTab = document.querySelector(".tab-pane.active");
    let paymentMethod = "";
    // ✅ Credit Card
    if (activeTab && activeTab.id === "credit") {
        let cardNumber = document.getElementsByClassName("cardNumber")[0].value.trim();
        let cardName = document.getElementsByClassName("cardName")[0].value.trim();
        let cardMonth = document.getElementsByClassName("cardMonth")[0].value;
        let cardYear = document.getElementsByClassName("cardYear")[0].value;
        let cardCvv = document.getElementsByClassName("cardCvv")[0].value.trim();

        if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
            alert("⚠️ Please fill all credit card fields");
            return;
        }
        paymentMethod = "Credit Card";
    }

    // ✅ PayPal Credit
    else if (activeTab && activeTab.id === "paypalcredit") {
        let cardNumber = document.getElementsByClassName("cardNumber")[1].value.trim();
        let cardName = document.getElementsByClassName("cardName")[1].value.trim();
        let cardMonth = document.getElementsByClassName("cardMonth")[1].value;
        let cardYear = document.getElementsByClassName("cardYear")[1].value;
        let cardCvv = document.getElementsByClassName("cardCvv")[1].value.trim();

        if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
            alert("⚠️ Please fill all payPal credit fields", "warning");
            return;
        }
        paymentMethod = "PayPal Credit";
    }

    // ✅ Cash on Delivery
    else if (activeTab && activeTab.id === "cash") {
        let cashcheck = document.getElementById("codAgree").checked;
        if (cashcheck === false) {
            alert("⚠️ Please agree to pay cash on delivery", "warning");
            return;
        }
        paymentMethod = "Cash on Delivery";
    }
    else {
        alert("⚠️ Please select a payment method", 'warning');
        return;
    }
    // localStorage
    let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};
    cartInfo.paymentMethod = paymentMethod;
    cartInfo.datepayment = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
    showAlert("✅ Payment confirmed: " + paymentMethod, "success");
    document.getElementById("btnstep3").innerText = paymentMethod
    document.getElementById("btnstep3").disabled = true
    document.getElementById("btnfinish").disabled = false

}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}



function finishOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let orderInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};

    let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

    let userInfo = JSON.parse(localStorage.getItem("userss")) || [];
    let user = userInfo.find((user) => user.id === orderInfo.userId);

    // invoice creation
    let newInvoice = {
        id: Date.now(), //  unique invoice ID
        items: orderInfo.items,
        customerId: orderInfo.userId,
        address: orderInfo.address,
        phone: orderInfo.phone,
        shippingMethod: orderInfo.shippingMethod,
        shippingCost: orderInfo.shippingCost,
        shippingDate: orderInfo.shippingDate,
        paymentMethod: orderInfo.paymentMethod,
        total: orderInfo.total,
        tax: orderInfo.tax,
        createdAt: orderInfo.datepayment,
        userInfo: user
    };
    console.log(newInvoice);
    // إضافة الفاتورة لقائمة الفواتير
    invoices.push(newInvoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));

    // empty cart and cartInfo
    localStorage.removeItem("cart");
    localStorage.removeItem("cartInfo");
    document.getElementsByClassName("container")[0].style.display = "none";
    document.getElementById("invoice").classList.remove("d-none");
    document.getElementById("invoice").innerHTML = `
        <div class="card shadow-lg p-4">
            <!-- Print Button -->
            <div class="d-flex justify-content-end mb-3">
                <button id="printBtn" class="btn btn-primary" onclick="window.print()">
                    🖨 Print Invoice
                </button>
            </div>

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">Invoice</h4>
                <span class="badge bg-dark fs-6">Invoice :  ${newInvoice.id}</span>
            </div>

            <!-- Customer Info -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <h6 class="fw-bold">Billed To:</h6>
                    <p class="mb-1">${user.firstName}  ${user.lastName }</p>
                    <p class="mb-1">${newInvoice.address}</p>
                    <p class="mb-1">Egypt</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <h6 class="fw-bold">Invoice Date:</h6>
                    <p class="mb-1">${newInvoice.createdAt}</p>
                    <h6 class="fw-bold">Due Date:</h6>
                    <p class="mb-1">${newInvoice.shippingDate}</p>
                </div>
            </div>

            <!-- Items Table -->
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Item</th>
                        <th class="text-center">Qty</th>
                        <th class="text-center">Price</th>
                        <th class="text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                   ${newInvoice.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="text-center">${item.qty}</td>
            <td class="text-center">$${item.price}</td>
            <td class="text-center">$${item.qty * item.price}</td>
          </tr>
        `).join('')}
                </tbody>
            </table>

            <!-- Summary -->
            <div class="d-flex justify-content-end">
                <div class="w-50">
                    <table class="table">
                        <tr>
                            <td>Tax (14%)</td>
                            <td class="text-end">${newInvoice.tax}</td>
                        </tr>
                        <tr>
                            <td>shipping Cost</td>
                            <td class="text-end">${newInvoice.shippingCost}</td>
                        </tr>
                        <tr class="fw-bold">
                            <td>Total</td>
                            <td class="text-end">${newInvoice.total}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-4">
                <p class="mb-3 text-muted">Thank you for your purchase!</p>
                <button id="homeBackBtn" class="btn btn-dark w-50" onclick="window.location.href='../../index.html'">
                    Back to Home
                </button>
            </div>
        </div>

    `
}





// steps control end

