let monthlySalesChart = null;

/* ===============================
   FLOATING TREND LINE VALUES
   =============================== */
function calculateFloatingLine(values) {
  if (!values.length) return [];

  const line = [];
  const baseOffset = Math.max(Math.max(...values) * 0.04, 50000);

  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      line.push(values[0] + baseOffset);
    } else {
      line.push(values[i] + baseOffset);
    }
  }
  return line;
}

/* ===============================
   RENDER MONTHLY SALES CHART
   =============================== */
function renderMonthlySalesChart(monthlyTotals) {
  const ctx = document.getElementById("monthlySalesChart");
  if (!ctx) return;

  if (monthlySalesChart) monthlySalesChart.destroy();

  const labels = [];
  const values = [];

  Object.keys(monthlyTotals)
    .sort((a, b) => {
      const [y1, m1] = a.split("-");
      const [y2, m2] = b.split("-");
      return new Date(y1, m1) - new Date(y2, m2);
    })
    .forEach(key => {
      const [year, month] = key.split("-");
      const date = new Date(year, month);

      labels.push(
        date.toLocaleString("en-IN", { month: "short", year: "numeric" })
      );
      values.push(monthlyTotals[key].total || 0);
    });

  const floatingLine = calculateFloatingLine(values);

  monthlySalesChart = new Chart(ctx.getContext("2d"), {
    data: {
      labels,
      datasets: [
        /* ===============================
           BAR DATASET
           =============================== */
        {
          type: "bar",
          label: "Total Sales",
          data: values,
          backgroundColor: "#2563eb",
          borderRadius: 10,
          barPercentage: 0.9,
          categoryPercentage: 1,
          order: 1
        },

        /* ===============================
           FLOATING TREND LINE
           =============================== */
        {
          type: "line",
          label: "Growth Trend",
          data: floatingLine,

          spanGaps: true,
          tension: 0.35,

          borderWidth: 3,
          borderColor: "#16a34a",
          backgroundColor: "transparent",

          pointRadius: 5,
          pointHoverRadius: 6,

          order: 99
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        legend: { display: false },

        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.dataset.type === "line") return null;
              return `₹${ctx.parsed.y.toLocaleString("en-IN")}`;
            }
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          grace: "20%",
          ticks: {
            callback: v => `₹${v.toLocaleString("en-IN")}`
          },
          grid: { color: "#e5e7eb" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}
