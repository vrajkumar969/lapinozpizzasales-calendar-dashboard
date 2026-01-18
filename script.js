/* ===============================
   INDIAN HOLIDAYS (NO API)
   =============================== */
const fixedHolidays = {
  "01-01": "New Year’s Day",
  "01-14": "Makar Sankranti",
  "01-15": "Vasi Uttarayan",
  "01-26": "Republic Day",
  "02-14": "Valentine's Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "12-25": "Christmas",
  "12-31": "New Year’s Eve"
};

const yearlyHolidays = {
  2024: {
    "2024-05-23": "Buddha Purnima",
    "2024-06-17": "Id-ul-Zuha(Bakrid)",
    "2024-07-17": "Muharram",
    "2024-08-19": "Raksha Bandhan",
    "2024-08-26": "Janmashtami",
    "2024-09-07": "Ganesh Chaturthi",
    "2024-09-16": "Id-e-Milad",
    "2024-10-03": "Navratri Day 1",
    "2024-10-04": "Navratri Day 2",
    "2024-10-05": "Navratri Day 3",
    "2024-10-06": "Navratri Day 4",
    "2024-10-07": "Navratri Day 5",
    "2024-10-08": "Navratri Day 6",
    "2024-10-09": "Navratri Day 7",
    "2024-10-10": "Navratri Day 8",
    "2024-10-11": "Navratri Day 9",
    "2024-10-12": "Dussehra",
    "2024-10-31": "Diwali",
    "2024-11-02": "Govardhan Puja",
    "2024-11-03": "Bhai Dooj",
    "2024-11-07": "Chhat Puja",
    "2024-11-15": "Guru Nanak’s Birthday"
  },
  
  2025: {
    "2025-02-26": "Maha Shivaratri",
    "2025-03-14": "Holi",
    "2026-03-31": "Id-ul-Fitr",
    "2025-04-10": "Mahavir Jayanti",
    "2025-04-18": "Good Friday",
    "2025-05-12": "Buddha Purnima",
    "2025-06-07": "Id-ul-Zuha(Bakrid)",
    "2025-07-06": "Muharram",
    "2025-08-09": "Raksha Bandhan",
    "2025-08-16": "Janmashtami",
    "2025-08-27": "Ganesh Chaturthi",
    "2025-09-27": "Id-e-Milad",
    "2025-09-22": "Navratri Day 1",
    "2025-09-23": "Navratri Day 2",
    "2025-09-24": "Navratri Day 3",
    "2025-09-25": "Navratri Day 4",
    "2025-09-26": "Navratri Day 5",
    "2025-09-27": "Navratri Day 6",
    "2025-09-28": "Navratri Day 7",
    "2025-09-29": "Navratri Day 8",
    "2025-09-30": "Navratri Day 9",
    "2025-10-01": "Navratri Day 10",
    "2025-10-02": "Dussehra",
    "2025-10-20": "Diwali",
    "2025-10-22": "Govardhan Puja",
    "2025-10-23": "Bhai Dooj",
    "2025-10-23": "Chhat Puja",
    "2025-11-05": "Guru Nanak’s Birthday"
  },
  2026: {
    "2026-02-15": "Maha Shivaratri",
    "2026-03-04": "Holi",
    "2026-03-21": "Id-ul-Fitr",
    "2026-03-26": "Ram Navami",
    "2026-03-31": "Mahavir Jayanti",
    "2026-04-03": "Good Friday",
    "2026-05-01": "Buddha Purnima",
    "2026-05-27": "Id-ul-Zuha(Bakrid)",
    "2026-06-26": "Muharram",
    "2026-08-26": "Id-e-Milad",
    "2026-08-28": "Raksha Bandhan",
    "2026-09-04": "Janmashtami",
    "2026-09-14": "Ganesh Chaturthi",
    "2026-10-11": "Navratri Day 1",
    "2026-10-12": "Navratri Day 2",
    "2026-10-13": "Navratri Day 3",
    "2026-10-14": "Navratri Day 4",
    "2026-10-15": "Navratri Day 5",
    "2026-10-16": "Navratri Day 6",
    "2026-10-17": "Navratri Day 7",
    "2026-10-18": "Navratri Day 8",
    "2026-10-19": "Navratri Day 9",
    "2026-10-20": "Dussehra",
    "2026-11-08": "Diwali",
    "2026-11-09": "Govardhan Puja",
    "2026-11-11": "Bhai Dooj",
    "2026-11-15": "Chhat Puja",
    "2026-11-24": "Guru Nanak’s Birthday"
  }
};

/* ===============================
   HEATMAP COLOR FUNCTION
   =============================== */
function getHeatColor(sales, min, max) {
  if (sales == null) return "#ffffff";
  if (min === max) return "#16a34a";

  const ratio = (sales - min) / (max - min);
  const startColor = [220, 252, 231];
  const endColor = [22, 163, 74];

  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);

  return `rgb(${r},${g},${b})`;
}

/* ===============================
   MONTHLY TOTAL CALCULATION
   =============================== */
function calculateMonthlyTotals(data) {
  const monthly = {};
  data.forEach(item => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthly[key]) monthly[key] = { total: 0, outlets: {} };

    const total = Object.values(item.outlets).reduce((sum, val) => sum + val, 0);
    monthly[key].total += total;

    Object.entries(item.outlets).forEach(([outlet, value]) => {
      if (!monthly[key].outlets[outlet]) monthly[key].outlets[outlet] = 0;
      monthly[key].outlets[outlet] += value;
    });
  });
  return monthly;
}

/* ===============================
   TOP 3 SALES PER MONTH
   =============================== */
function calculateTop3DaysPerMonth(data) {
  const monthMap = {};

  data.forEach(item => {
    const dateObj = new Date(item.date);
    const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;

    const total = Object.values(item.outlets).reduce((s, v) => s + v, 0);
    if (!monthMap[key]) monthMap[key] = [];

    monthMap[key].push({
      date: item.date,
      total
    });
  });

  // sort & keep top 3
  Object.keys(monthMap).forEach(key => {
    monthMap[key] = monthMap[key]
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  });

  return monthMap;
}

/* ===============================
   DOM CONTENT LOADED
   =============================== */
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const outletButtons = document.querySelectorAll("#outletButtons button");
  let calendar = null;
  let allSalesData = [];
  let currentOutlet = "All";

  fetch('data/sales.json?v=' + new Date().getTime())
    .then(res => res.json())
    .then(salesData => {
      allSalesData = salesData;

      // Initial render
      renderCalendar();

      // Button click: set outlet filter
      outletButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          outletButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentOutlet = btn.dataset.outlet;
          renderCalendar();
        });
      });
    })
    .catch(err => console.error("Error loading sales.json", err));

  /* ===============================
     RENDER CALENDAR FUNCTION
     =============================== */
  function renderCalendar() {
    if (calendar) calendar.destroy();

    // Filter sales data for selected outlet
    const filteredData = allSalesData.map(item => {
      if (currentOutlet === "All") return item;
      const value = item.outlets[currentOutlet] || 0;
      return { date: item.date, outlets: { [currentOutlet]: value } };
    });

    const monthlyTotals = calculateMonthlyTotals(filteredData);
    const top3ByMonth = calculateTop3DaysPerMonth(filteredData);

    // Update chart for selected outlet
    if (typeof renderMonthlySalesChart === "function") {
      renderMonthlySalesChart(monthlyTotals);
    }

    const dailyTotals = filteredData.map(item =>
      Object.values(item.outlets).reduce((sum, val) => sum + val, 0)
    );
    const minSales = Math.min(...dailyTotals);
    const maxSales = Math.max(...dailyTotals);

    const events = filteredData.map(item => {
      const totalSales = Object.values(item.outlets).reduce((sum, val) => sum + val, 0);
      return {
        title: `₹${totalSales.toLocaleString("en-IN")}`,
        start: item.date,
        allDay: true,
        extendedProps: item.outlets
      };
    });

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'multiMonthYear',
      multiMonthMaxColumns: 2,
      height: 'auto',
      dayMaxEventRows: false,
      eventDisplay: 'block',
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: ""
      },
      events: events,

      /* Month totals */
      datesSet: function () {
  document.querySelectorAll(".month-header-total, .month-top3").forEach(el => el.remove());

  document.querySelectorAll(".fc-multimonth-month").forEach(monthEl => {
    const dateStr = monthEl.getAttribute("data-date");
    if (!dateStr) return;

    const date = new Date(dateStr);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthlyData = monthlyTotals[key];
    if (!monthlyData) return;

    /* ===== Monthly Total Header ===== */
    const header = document.createElement("div");
    header.className = "month-header-total";

    let html = `<div class="total-sales">
      Total Sales: ₹${monthlyData.total.toLocaleString("en-IN")}
    </div>
    <div class="separator"></div>`;

    Object.entries(monthlyData.outlets)
      .sort((a, b) => b[1] - a[1])
      .forEach(([outlet, value]) => {
        html += `<div class="outlet-sales">
          ${outlet}: ₹${value.toLocaleString("en-IN")}
        </div>`;
      });

    header.innerHTML = html;
    monthEl.querySelector(".fc-multimonth-title").after(header);

    /* 🔹 ===== Top 3 Sales Section ===== */
    const top3 = top3ByMonth[key];
    if (!top3 || top3.length === 0) return;

    const top3El = document.createElement("div");
    top3El.className = "month-top3";

    let tHtml = `<div class="top3-title">Top 3 Sales Days</div>`;
    top3.forEach((d, i) => {
      const dt = new Date(d.date);
      const label = dt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      });

      tHtml += `
        <div class="top3-row">
          <span>${i + 1}. ${label}</span>
          <span>₹${d.total.toLocaleString("en-IN")}</span>
        </div>`;
    });

    top3El.innerHTML = tHtml;
    monthEl.appendChild(top3El);
  });
},

      /* Day cells: holidays + heatmap */
      dayCellDidMount: function (info) {
        if (info.isOther) return;

        const yyyy = info.date.getFullYear();
        const mm = String(info.date.getMonth() + 1).padStart(2, "0");
        const dd = String(info.date.getDate()).padStart(2, "0");
        const fullKey = `${yyyy}-${mm}-${dd}`;
        const fixedKey = `${mm}-${dd}`;

        const holiday =
          (yearlyHolidays[yyyy] && yearlyHolidays[yyyy][fullKey]) ||
          fixedHolidays[fixedKey];
        if (holiday) {
          const frame = info.el.querySelector(".fc-daygrid-day-frame");
          const el = document.createElement("div");
          el.className = "holiday-text";
          el.textContent = holiday;
          frame.appendChild(el);
        }

        const dayEvent = filteredData.find(d => d.date === fullKey);
        if (dayEvent) {
          const totalSales = Object.values(dayEvent.outlets).reduce((sum, val) => sum + val, 0);
          info.el.style.backgroundColor = getHeatColor(totalSales, minSales, maxSales);
        }
      },

      /* Tooltip */
      eventDidMount: function (info) {
        const tooltip = document.createElement("div");
        tooltip.className = "sales-tooltip";

        let html = `<div class="tooltip-title">Outlet-wise Sales</div>`;
        Object.entries(info.event.extendedProps).forEach(([outlet, value]) => {
          html += `<div class="tooltip-row"><span>${outlet}</span><span>₹${value.toLocaleString("en-IN")}</span></div>`;
        });
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);

        info.el.addEventListener("mouseenter", () => { tooltip.style.display = "block"; });
        info.el.addEventListener("mousemove", e => {
          const tooltipRect = tooltip.getBoundingClientRect();
          let left = e.clientX + 10;
          let top = e.clientY + 10;
          if (left + tooltipRect.width > window.innerWidth) left = e.clientX - tooltipRect.width - 10;
          if (top + tooltipRect.height > window.innerHeight) top = e.clientY - tooltipRect.height - 10;
          tooltip.style.left = left + "px";
          tooltip.style.top = top + "px";
        });
        info.el.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
      }
    });

    calendar.render();
  }
});
