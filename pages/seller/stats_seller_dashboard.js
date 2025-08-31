// function getCurrentUser() {
//   const currentUser = getItemFromLocalStorage("currentUser");
//   return currentUser;
// }
var currentUser = {
  id: 106,
  "firstName": "omar",
  "lastName": "ali",
  "email": "omar@gmail.com",
  "status": "active",
  "createdAt": "2025-01-15",
  "role": "seller",
  "password": "123",
  "phone": null,
  "address": null,
  "city": null,
  "country": "Egypt",
  "zip": null,
  "DOB": "2000-01-01",
  "gender": "male",
};
function getProducts() {
  const products = getItemFromLocalStorage("products");
  return products;
}

// getTotalSales
function getTotalSales() {
  // const currentUser = getCurrentUser();
  const products = getProducts();
  let totalSales = 0;
  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      totalSales += product.sold * product.price;
    }
  }
  document.getElementById("totalSales").innerHTML = `$${totalSales}`;
  return totalSales;
}

// getTotalOrders
function getTotalOrders() {
  // const currentUser = getCurrentUser();
  const products = getProducts();
  let totalOrders = 0;
  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      totalOrders += product.sold;
    }
  }
  document.getElementById("totalOrders").innerHTML = `${totalOrders}`;
  return totalOrders;
}

// getAOV() => Average Order Value = TotalRevenue/NumberOfOrders
function getAOV() {
  // const currentUser = getCurrentUser();
  const products = getProducts();
  let AOV = 0;
  const totalSales = getTotalSales();
  const totalOrders = getTotalOrders();
  if (totalOrders > 0) {
    AOV = totalSales / totalOrders;
  }
  document.getElementById("AOV").innerHTML = `$${AOV.toFixed(2)}`;
  return AOV;
}

// getMonthlySales
let monthlySales = [0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0];
function getMonthlySales() {
  // const currentUser = getCurrentUser();
  const products = getProducts();
  // Reset monthly sales array
  monthlySales = [0, 0, 20, 0, 0, 0, 0, 5, 0, 0, 0, 0];

  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      // Check if product has monthlySales array, if not use sold count
      if (product.monthlySales && Array.isArray(product.monthlySales)) {
        for (let i = 0; i < Math.min(monthlySales.length, product.monthlySales.length); i++) {
          monthlySales[i] += product.monthlySales[i];
        }
      } else if (product.sold) {
        // If no monthly sales data, distribute sold count across months
        const soldPerMonth = Math.floor(product.sold / 12);
        for (let i = 0; i < monthlySales.length; i++) {
          monthlySales[i] += soldPerMonth;
        }
      }
    }
  }
  return monthlySales;
}

// getSalesDistribution
let REALME = 0;
let INFINIX = 0;
let IPHONE = 0;
let OPPO = 0;
let SAMSUNG = 5;
let HONOR = 0;
let SONY = 0;
let HUAWEI = 10;
let XIAOMI = 0;
let ONEPLUS = 0;

function getSalesDistribution() {
  // const currentUser = getCurrentUser();
  const products = getProducts();

  // Reset counters
  REALME = 0;
  INFINIX = 0;
  IPHONE = 0;
  OPPO = 0;
  SAMSUNG = 0;
  HONOR = 6;
  SONY = 0;
  HUAWEI = 15;
  XIAOMI = 0;
  ONEPLUS = 0;

  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      const nameOfProduct = product.name.toUpperCase();
      if (nameOfProduct.includes("REALME")) {
        REALME += product.sold || 0;
      } else if (nameOfProduct.includes("INFINIX")) {
        INFINIX += product.sold || 0;
      } else if (nameOfProduct.includes("IPHONE")) {
        IPHONE += product.sold || 0;
      } else if (nameOfProduct.includes("OPPO")) {
        OPPO += product.sold || 0;
      } else if (nameOfProduct.includes("SAMSUNG")) {
        SAMSUNG += product.sold || 0;
      } else if (nameOfProduct.includes("HONOR")) {
        HONOR += product.sold || 0;
      } else if (nameOfProduct.includes("SONY")) {
        SONY += product.sold || 0;
      } else if (nameOfProduct.includes("HUAWEI")) {
        HUAWEI += product.sold || 0;
      } else if (nameOfProduct.includes("XIAOMI")) {
        XIAOMI += product.sold || 0;
      } else if (nameOfProduct.includes("ONEPLUS")) {
        ONEPLUS += product.sold || 0;
      }
    }
  }
}

// getTopSellingProduct
let topSellingProduct = null;
let maxSales = 0;

function getTopSellingProduct() {
  const productsObj = {
    REALME,
    INFINIX,
    IPHONE,
    OPPO,
    SAMSUNG,
    HONOR,
    SONY,
    HUAWEI,
    XIAOMI,
    ONEPLUS,
  };

  maxSales = 15;
  topSellingProduct = "HUAWEI";

  for (const key in productsObj) {
    if (productsObj[key] > maxSales) {
      maxSales = productsObj[key];
      topSellingProduct = key;
    }
  }

  if (topSellingProduct) {
    document.getElementById("topSellingProduct").innerHTML = topSellingProduct.toLowerCase();
    document.getElementById("topSellingProductTimes").innerHTML = `Sold ${maxSales} times`;
  } else {
    document.getElementById("topSellingProduct").innerHTML = "No sales yet";
    document.getElementById("topSellingProductTimes").innerHTML = "Start selling!";
  }
}

// Initialize all functions
function initializeDashboard() {
  getTotalSales();
  getTotalOrders();
  getAOV();
  getMonthlySales();
  getSalesDistribution();
  getTopSellingProduct();
  loadSellerInvoices(); // Add this line
}

// Invoice Management Functions
function loadSellerInvoices() {
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const currentUser = getCurrentUser();
  
  // Filter invoices for products sold by this seller
  const sellerInvoices = invoices.filter(invoice => {
    return invoice.items.some(item => {
      // Check if any product in the invoice belongs to this seller
      const products = getProducts();
      const product = products.find(p => p.name === item.name);
      return product && product.sellerId == currentUser.id;
    });
  });
  
  displayInvoices(sellerInvoices);
}

function displayInvoices(invoices) {
  const tableBody = document.getElementById("invoicesTableBody");
  const noInvoices = document.getElementById("noInvoices");
  
  if (invoices.length === 0) {
    tableBody.innerHTML = "";
    noInvoices.classList.remove("d-none");
    return;
  }
  
  noInvoices.classList.add("d-none");
  
  tableBody.innerHTML = invoices.map(invoice => {
    const sellerItems = invoice.items.filter(item => {
      const products = getProducts();
      const product = products.find(p => p.name === item.name);
      return product && product.sellerId == getCurrentUser().id;
    });
    
    const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const sellerCommission = sellerTotal * 0.9; // 90% for seller, 10% platform fee
    
    return `
      <tr>
        <td><strong>#${invoice.id}</strong></td>
        <td>
          <div>
            <strong>${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</strong><br>
            <small class="text-muted">${invoice.userInfo.email}</small>
          </div>
        </td>
        <td>
          ${sellerItems.map(item => `
            <div class="mb-1">
              <span class="badge bg-primary">${item.name}</span>
              <small class="text-muted">x${item.qty}</small>
            </div>
          `).join('')}
        </td>
        <td>
          <div>
            <strong>$${sellerTotal.toFixed(2)}</strong><br>
            <small class="text-success">Earnings: $${sellerCommission.toFixed(2)}</small>
          </div>
        </td>
        <td>
          <small>${new Date(invoice.createdAt).toLocaleDateString()}</small>
        </td>
        <td>
          <span class="badge bg-success">Completed</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="viewInvoiceDetails(${invoice.id})">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function viewInvoiceDetails(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) {
    alert("Invoice not found!");
    return;
  }
  
  // Create modal to show invoice details
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'invoiceModal';
  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Invoice #${invoice.id}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <h6>Customer Information</h6>
              <p><strong>Name:</strong> ${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
              <p><strong>Email:</strong> ${invoice.userInfo.email}</p>
              <p><strong>Address:</strong> ${invoice.address}</p>
              <p><strong>Phone:</strong> ${invoice.phone}</p>
            </div>
            <div class="col-md-6">
              <h6>Order Information</h6>
              <p><strong>Date:</strong> ${invoice.createdAt}</p>
              <p><strong>Shipping:</strong> ${invoice.shippingMethod}</p>
              <p><strong>Payment:</strong> ${invoice.paymentMethod}</p>
            </div>
          </div>
          
          <h6>Products Sold</h6>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="text-end">
            <h5>Total: $${invoice.total}</h5>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" onclick="printInvoice(${invoice.id})">
            <i class="bi bi-printer"></i> Print
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
  
  // Remove modal from DOM after it's hidden
  modal.addEventListener('hidden.bs.modal', () => {
    document.body.removeChild(modal);
  });
}

function printInvoice(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice #${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice #${invoice.id}</h1>
          <p>Date: ${invoice.createdAt}</p>
        </div>
        
        <div class="info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${invoice.userInfo.firstName} ${invoice.userInfo.lastName}</p>
          <p><strong>Email:</strong> ${invoice.userInfo.email}</p>
          <p><strong>Address:</strong> ${invoice.address}</p>
          <p><strong>Phone:</strong> ${invoice.phone}</p>
        </div>
        
        <h3>Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>$${item.price}</td>
                <td>$${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <h3>Total: $${invoice.total}</h3>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function refreshInvoices() {
  loadSellerInvoices();
  showAlert("Invoices refreshed successfully!", "success");
}

// Call initialization when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDashboard);
} else {
  initializeDashboard();
}

// my_line_chart code
const line_chart = document.getElementById("my_line_chart");
if (line_chart) {
  new Chart(line_chart, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Monthly Sales",
          data: monthlySales,
          fill: false,
          borderColor: "rgb(16, 115, 197)",
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// my_doughnut_chart code
const doughnut_chart = document.getElementById("my_doughnut_chart");
if (doughnut_chart) {
  new Chart(doughnut_chart, {
    type: "doughnut",
    data: {
      labels: [
        "REALME",
        "INFINIX",
        "IPHONE",
        "OPPO",
        "SAMSUNG",
        "HONOR",
        "SONY",
        "HUAWEI",
        "XIAOMI",
        "ONEPLUS",
      ],
      datasets: [
        {
          label: "Sold",
          data: [
            REALME,
            INFINIX,
            IPHONE,
            OPPO,
            SAMSUNG,
            HONOR,
            SONY,
            HUAWEI,
            XIAOMI,
            ONEPLUS,
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
            "rgb(199, 199, 199)",
            "rgb(255, 87, 34)",
            "rgb(0, 200, 83)",
            "rgb(233, 30, 99)",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      cutout: "70%",
    },
  });
}
