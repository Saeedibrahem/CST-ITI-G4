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
      //   "Jul",
      //   "Aug",
      //   "Oct",
      //   "Nov",
      //   "Dec",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [30, 59, 80, 81, 56, 200, 40],
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
      "APPLE",
      "OPPO",
      "SAMSUNG",
      "HONOR",
      "SONY",
      "HUAWEI",
      "XIAOMI",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [50, 100, 150, 300, 350, 400, 450, 500, 700, 800],
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
        position: "bottom", // ✅ Move labels below chart
      },
    },
    cutout: "70%", // ✅ Make chart thinner (increase % for thinner ring)
  },
});
