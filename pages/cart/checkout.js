// Checkout functionality with integration to shared utilities
document.addEventListener('DOMContentLoaded', function () {
    // Render navbar using shared utilities
    if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
    }
    
    // Initialize checkout
    initializeCheckout();
});

// Global variables
let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};
let editIndex = null;
let user = null;
let selectedUserIndex = 0;
let addresses = [];
let currentStep = 1;
let deleteTimeout = null;

// Initialize checkout process
function initializeCheckout() {
    // Check if user is logged in
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    
    if (!currentUser) {
        showAlert("Please login to continue with checkout", "warning");
        setTimeout(() => {
            window.location.href = "../../pages/login/index.html";
        }, 2000);
        return;
    }
    
    // Load user data
    user = currentUser;
    selectedUserIndex = 0;
    cartInfo.userId = user.id;
    
    // Load addresses
    addresses = user.addresses || [];
    
    // Save updated cart info
    localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
    
    // Initialize checkout
    renderAddresses();
    initializeShippingDates();
    renderOrderSummary();
    initializeCardPreviews();
    
    // Show first step
    showStep(1);
}

// Alert function
function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('notification');
    if (!alertPlaceholder) return;
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    
    alertPlaceholder.appendChild(wrapper);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (wrapper.parentNode) {
            wrapper.remove();
        }
    }, 3000);
}

// Address management functions
function renderAddresses() {
    const list = document.getElementById("address-list");
    if (!list) return;
    
    list.innerHTML = "";
    
    if (addresses.length === 0) {
        list.innerHTML = `
            <div class="text-center py-4">
                <i class="fa-solid fa-map-marker-alt fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No addresses found</h5>
                <p class="text-muted">Add your first delivery address to continue</p>
            </div>`;
        return;
    }

    addresses.forEach((addr, index) => {
        const div = document.createElement("div");
        div.className = "card mb-3 shadow-sm border-0";
        div.innerHTML = `    
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="form-check flex-grow-1">
                    <input class="form-check-input" type="radio" name="address" id="addr-${index}" value="${index}">
                    <div class="ms-3">
                        <h5 class="mb-1">${addr.street}</h5>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge text-bg-primary">${addr.name}</span>
                            <span class="text-muted">${addr.city}</span>
                        </div>
                        <div class="text-muted mt-1">
                            <i class="fa-solid fa-phone me-1"></i>${addr.phone}
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" onclick="editAddress(${index})" data-bs-toggle="modal" data-bs-target="#addressModal">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="startDelete(${index}, this)">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
        list.appendChild(div);
    });

    // Save user data
    user.addresses = addresses;
    localStorage.setItem("currentUser", encrypt_string_to_string(JSON.stringify(user)));
}

function startDelete(index, btn) {
    if (btn.classList.contains("loading")) {
        // Second click - cancel deletion
        btn.classList.remove("loading");
        clearTimeout(deleteTimeout);
        deleteTimeout = null;
        showAlert("❌ Delete cancelled", "info");
    } else {
        // First click - start deletion countdown
        btn.classList.add("loading");
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        deleteTimeout = setTimeout(() => {
            deleteAddress(index);
            btn.classList.remove("loading");
            btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            showAlert("✅ Address deleted successfully", "success");
        }, 2000);
    }
}

function checking() {
    const name = document.getElementById("name").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const errorDiv = document.getElementById("address-listxx");
    
    if (!name || !street || !city || !phone) {
        errorDiv.classList.remove("d-none");
        return false;
    } else {
        errorDiv.classList.add("d-none");
        return true;
    }
}

function closeForm() {
    document.getElementById("name").value = "";
    document.getElementById("street").value = "";
    document.getElementById("city").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address-listxx").classList.add("d-none");
    document.getElementById("form-title").innerText = "Add New Address";
    editIndex = null;
}

function saveAddress() {
    if (!checking()) return;

    const name = document.getElementById("name").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (editIndex !== null) {
        // Edit existing address
        addresses[editIndex] = { name, street, city, phone };
        showAlert("Address updated successfully", "success");
    } else {
        // Add new address
        addresses.push({ name, street, city, phone });
        showAlert("Address added successfully", "success");
    }

    // Save user data
    user.addresses = addresses;
    localStorage.setItem("currentUser", encrypt_string_to_string(JSON.stringify(user)));

    // Update UI
    renderAddresses();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"));
    modal.hide();
    closeForm();
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
    user.addresses = addresses;
    localStorage.setItem("currentUser", encrypt_string_to_string(JSON.stringify(user)));
    renderAddresses();
}

// Shipping functions
function calcShippingCost(days) {
    if (days <= 2) return 100;
    if (days >= 10) return 50;
    return 100 - (days - 2) * 10;
}

function setDate(spanId, inputId, costId, daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    const options = { day: "numeric", month: "short", year: "numeric" };
    const spanElement = document.getElementById(spanId);
    const inputElement = document.getElementById(inputId);
    const costElement = document.getElementById(costId);
    
    if (spanElement) spanElement.textContent = date.toLocaleDateString("en-GB", options);
    if (inputElement) inputElement.value = date.toLocaleDateString("en-GB", options);

    const cost = calcShippingCost(daysToAdd);
    if (costElement) costElement.textContent = `$${cost}`;
}

function initializeShippingDates() {
    setDate("datespan1", "spinp1", "cost1", 2);
    setDate("datespan2", "spinp2", "cost2", 5);
    setDate("datespan3", "spinp3", "cost3", 6);

    // Custom date handling
    const customRadio = document.getElementById("ship4");
    const customDateInput = document.getElementById("customDate");
    const customCost = document.getElementById("customCost");

    if (customRadio && customDateInput && customCost) {
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
            customCost.textContent = `$${cost}`;
        });
    }

    // Handle shipping method changes
    document.querySelectorAll("input[name='shipping']").forEach(radio => {
        if (radio.id !== "ship4") {
            radio.addEventListener("change", () => {
                if (customDateInput) customDateInput.disabled = true;
                if (customCost) customCost.textContent = "";
            });
        }
    });
}

// Order summary functions
function renderOrderSummary() {
    const itemsList = document.getElementById("itemsList");
    if (!itemsList || !cartInfo.items) return;
    
    itemsList.innerHTML = "";
    let subtotal = 0;

    cartInfo.items.forEach(item => {
        subtotal += item.price * item.qty;
        itemsList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.image || '../../assets/img/products/default.png'}" class="me-3" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <small class="text-muted">Qty: ${item.qty}</small>
                    </div>
                </div>
                <span class="fw-bold">$${(item.price * item.qty).toLocaleString()}</span>
            </li>`;
    });

    // Calculate totals
    const tax = cartInfo.tax || Math.round(subtotal * 0.14);
    const shippingCost = cartInfo.shippingCost || 0;
    const total = subtotal + tax + shippingCost;
    
    cartInfo.subtotal = subtotal;
    cartInfo.total = total;
    
    // Update summary display
    updateSummaryDisplay();
    
    // Save cart info
    localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
}

function updateSummaryDisplay() {
    const elements = {
        address: document.getElementById("address"),
        shipment: document.getElementById("shipment"),
        shipmentDate: document.getElementById("shipmentDate"),
        shipmentCost: document.getElementById("shipmentCost"),
        subtotal: document.getElementById("subtotal"),
        tax: document.getElementById("tax"),
        total: document.getElementById("total")
    };
    
    if (elements.address) elements.address.textContent = cartInfo.address || "Not selected";
    if (elements.shipment) elements.shipment.textContent = cartInfo.shippingMethod || "Not selected";
    if (elements.shipmentDate) elements.shipmentDate.textContent = cartInfo.shippingDate || "Not selected";
    if (elements.shipmentCost) elements.shipmentCost.textContent = cartInfo.shippingCost ? `$${cartInfo.shippingCost}` : "$0";
    if (elements.subtotal) elements.subtotal.textContent = `$${cartInfo.subtotal?.toLocaleString() || "0"}`;
    if (elements.tax) elements.tax.textContent = `$${cartInfo.tax?.toLocaleString() || "0"}`;
    if (elements.total) elements.total.textContent = `$${cartInfo.total?.toLocaleString() || "0"}`;
}

// Card preview functionality
function initializeCardPreviews() {
    document.querySelectorAll(".card-preview").forEach((preview, previewIndex) => {
        const numberInput = preview.parentElement.querySelector(".cardNumber");
        const nameInput = preview.parentElement.querySelector(".cardName");
        const monthInput = preview.parentElement.querySelector(".cardMonth");
        const yearInput = preview.parentElement.querySelector(".cardYear");
        const cvvInput = preview.parentElement.querySelector(".cardCvv");

        const numberPreview = preview.querySelector(".cardNumberPreview");
        const namePreview = preview.querySelector(".cardNamePreview");
        const datePreview = preview.querySelector(".cardDatePreview");
        const cvvPreview = preview.querySelector(".cvvPreview");

        if (numberInput && numberPreview) {
            numberInput.addEventListener("input", e => {
                let value = e.target.value.replace(/\D/g, "");
                value = value.replace(/(.{4})/g, "$1 ").trim();
                numberInput.value = value;
                numberPreview.textContent = value || "#### #### #### ####";
            });
        }

        if (nameInput && namePreview) {
            nameInput.addEventListener("input", e => {
                namePreview.textContent = e.target.value.toUpperCase() || "FULL NAME";
            });
        }

        if (cvvInput && cvvPreview) {
            cvvInput.addEventListener("input", e => {
                cvvPreview.textContent = e.target.value || "CVV";
            });
        }

        if (monthInput && yearInput && datePreview) {
            function updateDate() {
                let mm = monthInput.value;
                let yy = yearInput.value ? yearInput.value.toString().slice(2) : "";
                datePreview.textContent = (mm && yy) ? `${mm}/${yy}` : "MM/YY";
            }
            monthInput.addEventListener("change", updateDate);
            yearInput.addEventListener("change", updateDate);
        }

        if (cvvInput && preview) {
            cvvInput.addEventListener("focus", () => preview.classList.add("flipped"));
            cvvInput.addEventListener("blur", () => preview.classList.remove("flipped"));
        }
    });
}

// Step navigation functions
function showStep(step) {
    document.querySelectorAll('.step-content').forEach(div => div.classList.add('hidden'));
    document.getElementById(`step-${step}`).classList.remove('hidden');

    // Update step indicators
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
        // Validate address selection
        let selectedRadio = document.querySelector('input[name="address"]:checked');
        if (!selectedRadio) {
            showAlert("⚠️ Please select a delivery address", "warning");
            return;
        }
        
        let selectedIndex = selectedRadio.value;
        let selectedAddr = addresses[selectedIndex];
        cartInfo.address = `${selectedAddr.street}, ${selectedAddr.city}`;
        cartInfo.phone = selectedAddr.phone;
        localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
        
        showAlert("✅ Address selected successfully", "success");
    }

    if (currentStep === 2) {
        // Validate shipping method selection
        const selected = document.querySelector("input[name='shipping']:checked");
        if (!selected) {
            showAlert("⚠️ Please select a shipping method", "warning");
            return;
        }
        
        // Set shipping details based on selection
        if (selected.id === "ship1") {
            cartInfo.shippingMethod = "Fast Delivery (2-3 days)";
            cartInfo.shippingDate = document.getElementById("spinp1").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost1").innerText.replace("$", "")) || 0;
        } else if (selected.id === "ship2") {
            cartInfo.shippingMethod = "Standard Delivery (5-7 days)";
            cartInfo.shippingDate = document.getElementById("spinp2").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost2").innerText.replace("$", "")) || 0;
        } else if (selected.id === "ship3") {
            cartInfo.shippingMethod = "Scheduled Delivery";
            cartInfo.shippingDate = document.getElementById("spinp3").value;
            cartInfo.shippingCost = parseFloat(document.getElementById("cost3").innerText.replace("$", "")) || 0;
        } else if (selected.id === "ship4") {
            const customDateInput = document.getElementById("customDate");
            if (!customDateInput.value) {
                showAlert("⚠️ Please select a delivery date", "warning");
                return;
            }
            cartInfo.shippingMethod = "Custom Delivery";
            cartInfo.shippingDate = customDateInput.value;
            cartInfo.shippingCost = parseFloat(document.getElementById("customCost").innerText.replace("$", "")) || 0;
        }
        
        localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
        updateSummaryDisplay();
        showAlert("✅ Shipping method selected successfully", "success");
    }

    if (currentStep < 3) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Payment validation
function step3valid() {
    let activeTab = document.querySelector(".tab-pane.active");
    let paymentMethod = "";
    
    if (!activeTab) {
        showAlert("⚠️ Please select a payment method", "warning");
        return;
    }

    // Validate based on payment method
    if (activeTab.id === "credit" || activeTab.id === "paypalcredit") {
        const tabIndex = activeTab.id === "credit" ? 0 : 1;
        const cardNumber = document.getElementsByClassName("cardNumber")[tabIndex]?.value.trim();
        const cardName = document.getElementsByClassName("cardName")[tabIndex]?.value.trim();
        const cardMonth = document.getElementsByClassName("cardMonth")[tabIndex]?.value;
        const cardYear = document.getElementsByClassName("cardYear")[tabIndex]?.value;
        const cardCvv = document.getElementsByClassName("cardCvv")[tabIndex]?.value.trim();

        if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
            showAlert("⚠️ Please fill all credit card fields", "warning");
            return;
        }
        
        paymentMethod = activeTab.id === "credit" ? "Credit Card" : "PayPal Credit";
    } else if (activeTab.id === "cash") {
        const cashcheck = document.getElementById("codAgree").checked;
        if (!cashcheck) {
            showAlert("⚠️ Please agree to pay cash on delivery", "warning");
            return;
        }
        paymentMethod = "Cash on Delivery";
    } else {
        showAlert("⚠️ Please select a payment method", "warning");
        return;
    }

    // Save payment information
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
    
    // Update UI
    showAlert(`✅ Payment confirmed: ${paymentMethod}`, "success");
    document.getElementById("btnstep3").innerHTML = `<i class="fa-solid fa-check me-2"></i>${paymentMethod}`;
    document.getElementById("btnstep3").disabled = true;
    document.getElementById("btnfinish").disabled = false;
}

// Complete order
function finishOrder() {
    try {
        // Get cart and order info
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let orderInfo = JSON.parse(localStorage.getItem("cartInfo")) || {};
        let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
        let userInfo = currentUser || user;

        // Create invoice
        let newInvoice = {
            id: Date.now(),
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
            userInfo: userInfo,
            status: "pending"
        };

        // Add invoice to storage
        invoices.push(newInvoice);
        localStorage.setItem("invoices", JSON.stringify(invoices));

        // Clear cart and cart info
        localStorage.removeItem("cart");
        localStorage.removeItem("cartInfo");
        
        // Show success message and invoice
        showInvoice(newInvoice);
        
    } catch (error) {
        console.error("Error completing order:", error);
        showAlert("❌ Error completing order. Please try again.", "danger");
    }
}

function showInvoice(invoice) {
    // Hide checkout form
    document.querySelector(".container").style.display = "none";
    
    // Show invoice
    const invoiceDiv = document.getElementById("invoice");
    invoiceDiv.classList.remove("d-none");
    
    invoiceDiv.innerHTML = `
        <div class="card shadow-lg p-4">
            <!-- Print Button -->
            <div class="d-flex justify-content-end mb-3">
                <button id="printBtn" class="btn btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-print me-2"></i>Print Invoice
                </button>
            </div>

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">
                    <i class="fa-solid fa-receipt me-2 text-primary"></i>Order Confirmation
                </h4>
                <span class="badge bg-success fs-6">Order #${invoice.id}</span>
            </div>

            <!-- Customer Info -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <h6 class="fw-bold">Delivery Address:</h6>
                    <p class="mb-1">${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
                    <p class="mb-1">${invoice.address}</p>
                    <p class="mb-1">Phone: ${invoice.phone}</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <h6 class="fw-bold">Order Date:</h6>
                    <p class="mb-1">${invoice.createdAt}</p>
                    <h6 class="fw-bold">Expected Delivery:</h6>
                    <p class="mb-1">${invoice.shippingDate}</p>
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
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td class="text-center">${item.qty}</td>
                            <td class="text-center">$${item.price.toLocaleString()}</td>
                            <td class="text-center">$${(item.qty * item.price).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Summary -->
            <div class="d-flex justify-content-end">
                <div class="w-50">
                    <table class="table">
                        <tr>
                            <td>Subtotal:</td>
                            <td class="text-end">$${invoice.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Tax (14%):</td>
                            <td class="text-end">$${invoice.tax.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Shipping Cost:</td>
                            <td class="text-end">$${invoice.shippingCost.toLocaleString()}</td>
                        </tr>
                        <tr class="fw-bold fs-5">
                            <td>Total:</td>
                            <td class="text-end">$${invoice.total.toLocaleString()}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-4">
                <div class="alert alert-success">
                    <i class="fa-solid fa-check-circle me-2"></i>
                    <strong>Thank you for your order!</strong><br>
                    Your order has been successfully placed and will be processed shortly.
                </div>
                <button id="homeBackBtn" class="btn btn-dark w-50" onclick="window.location.href='../../index.html'">
                    <i class="fa-solid fa-home me-2"></i>Back to Home
                </button>
            </div>
        </div>
    `;
}

// Export functions for global access
window.checkoutFunctions = {
    nextStep,
    prevStep,
    step3valid,
    finishOrder,
    saveAddress,
    editAddress,
    deleteAddress,
    startDelete,
    closeForm
};

