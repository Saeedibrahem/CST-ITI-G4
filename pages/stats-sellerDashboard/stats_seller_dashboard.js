// getTotalSales
function getTotalSales() {
  const currentUser = getCurrentUser();
  const products = getProducts();
  let totalSales = 0;
  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      // totalSales+=product.sold*product.price
    }
  }
  document.getElementById("totalSales").innerHTML = `$${totalSales}`;
  return totalSales;
}
getTotalSales();
// getTotalOrders
function getTotalOrders() {
  const currentUser = getCurrentUser();
  const products = getProducts();
  let totalOrders = 0;
  for (const product of products) {
    if (product.sellerId == currentUser.id) {
      // totalOrders+=product.sold
    }
  }
  document.getElementById("totalOrders").innerHTML = `${totalOrders}`;
  return totalOrders;
}
getTotalOrders();
// getAOV() => Average Order Value = TotalRevenue/NumberOfOrders
function getAOV() {
  const currentUser = getCurrentUser();
  const products = getProducts();
  let AOV = 0;
  if (getTotalOrders > 0) {
    AOV = getTotalSales() / getTotalOrders();
  }
  document.getElementById("AOV").innerHTML = `$${AOV}`;
  return AOV;
}
getAOV();
// getMonthlySales
let monthlySales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function getMonthlySales() {
  const currentUser = getCurrentUser();
  const products = getProducts();
  for (const product of products) {
    //TODO:
    // if (product.sellerId == product.sellerId) {
    if (product.sellerId == 101) {
      for (let i = 0; i < monthlySales.length; i++) {
        monthlySales[i] += product.monthlySales[i];
      }
      monthlySales = product.monthlySales;
    }
  }
}
getMonthlySales();

// getSalesDistribution
let REALME = 0;
let INFINIX = 0;
let IPHONE = 0;
let OPPO = 0;
let SAMSUNG = 0;
let HONOR = 0;
let SONY = 0;
let HUAWEI = 0;
let XIAOMI = 0;
let ONEPLUS = 0;
function getSalesDistribution() {
  const currentUser = getCurrentUser();
  const products = getProducts();
  for (const product of products) {
    //TODO:
    // if (product.sellerId == product.sellerId) {
    if (product.sellerId == 101) {
      nameOfProduct = product.name.toUpperCase();
      console.log(nameOfProduct);
      if (nameOfProduct.includes("REALME")) {
        REALME++;
      } else if (nameOfProduct.includes("INFINIX")) {
        INFINIX++;
      } else if (nameOfProduct.includes("IPHONE")) {
        IPHONE++;
      } else if (nameOfProduct.includes("OPPO")) {
        OPPO++;
      } else if (nameOfProduct.includes("SAMSUNG")) {
        SAMSUNG++;
      } else if (nameOfProduct.includes("HONOR")) {
        HONOR++;
      } else if (nameOfProduct.includes("SONY")) {
        SONY++;
      } else if (nameOfProduct.includes("HUAWEI")) {
        HUAWEI++;
      } else if (nameOfProduct.includes("XIAOMI")) {
        XIAOMI++;
      } else if (nameOfProduct.includes("ONEPLUS")) {
        ONEPLUS++;
      }
    }
  }
}
getSalesDistribution();
// my_line_chart code
const line_chart = document.getElementById("my_line_chart");
new Chart(line_chart, {
  type: "line",
  data: {
    labels: [
      "Jun",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "My First Dataset",
        // data: [30, 59, 80, 81, 56, 200, 40],
        data: monthlySales,
        fill: false,
        borderColor: "rgb(16, 115, 197)",
        tension: 0.3,
        pointRadius: 0, // ✅ removes dots
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false, // ✅ hide the label/legend
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// my_doughnut_chart code
const doughnut_chart = document.getElementById("my_doughnut_chart");
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
        // data: [50, 100, 150, 300, 350, 400, 450, 500, 700, 800, 90],
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
          "rgb(60, 140, 60)",
        ],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "bottom", // ✅ Move labels below chart
      },
    },
    cutout: "70%", // ✅ Make chart thinner (increase % for thinner ring)
  },
});
