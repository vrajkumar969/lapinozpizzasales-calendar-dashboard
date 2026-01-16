/* ===============================
   INDIAN HOLIDAYS (NO API)
   =============================== */
const fixedHolidays = {
  "01-01": "New Year’s Day",
  "01-14": "Makar Sankranti",
  "01-15": "Vasi Uttarayan",
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "12-25": "Christmas"
};

const yearlyHolidays = {
   2025: {
    "2025-02-26": "Maha Shivaratri",
    "2025-03-14": "Holi",
    "2025-04-10": "Mahavir Jayanti",
    "2025-04-18": "Good Friday",
    "2025-05-12": "Buddha Purnima",
    "2025-08-16": "Janmashtami",
    "2025-08-21": "Raksha Bandhan",
    "2025-08-29": "Ganesh Chaturthi",
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
    "2025-10-22": "Bhai Dooj",
    "2025-11-05": "Guru Nanak’s Birthday",
  },
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
   DOM CONTENT LOADED
   =============================== */
document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch('data/sales.json?v=' + new Date().getTime())
    .then(res => res.json())
    .then(salesData => {

      const monthlyTotals = calculateMonthlyTotals(salesData);
      const dailyTotals = salesData.map(item =>
        Object.values(item.outlets).reduce((sum, val) => sum + val, 0)
      );
      const minSales = Math.min(...dailyTotals);
      const maxSales = Math.max(...dailyTotals);

      const events = salesData.map(item => {
        const totalSales = Object.values(item.outlets)
          .reduce((sum, val) => sum + val, 0);
        return {
          title: `₹${totalSales.toLocaleString("en-IN")}`,
          start: item.date,
          allDay: true,
          extendedProps: item.outlets
        };
      });

      const calendar = new FullCalendar.Calendar(calendarEl, {
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

        /* MONTH HEADER TOTAL */
        datesSet: function () {
          document.querySelectorAll(".month-header-total").forEach(el => el.remove());
          document.querySelectorAll(".fc-multimonth-month").forEach(monthEl => {
            const dateStr = monthEl.getAttribute("data-date");
            if (!dateStr) return;
            const date = new Date(dateStr);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyTotals[key]) return;
            const header = document.createElement("div");
            header.className = "month-header-total";
            header.textContent =
              `Total Sales: ₹${monthlyTotals[key].total.toLocaleString("en-IN")}`;
            monthEl.querySelector(".fc-multimonth-title").after(header);
          });
        },

        /* HOLIDAY & HEATMAP */
        dayCellDidMount: function (info) {
          if (info.isOther) return;

          const yyyy = info.date.getFullYear();
          const mm = String(info.date.getMonth() + 1).padStart(2, "0");
          const dd = String(info.date.getDate()).padStart(2, "0");
          const fullKey = `${yyyy}-${mm}-${dd}`;
          const fixedKey = `${mm}-${dd}`;

          /* HOLIDAY */
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

          /* HEATMAP */
          const dayEvent = salesData.find(d => d.date === fullKey);
          if (dayEvent) {
            const totalSales = Object.values(dayEvent.outlets)
              .reduce((sum, val) => sum + val, 0);
            info.el.style.backgroundColor = getHeatColor(totalSales, minSales, maxSales);
          }
        },

        /* SALES TOOLTIP */
        eventDidMount: function (info) {

          const tooltip = document.createElement("div");
          tooltip.className = "sales-tooltip";

          let html = `<div class="tooltip-title">Outlet-wise Sales</div>`;
          Object.entries(info.event.extendedProps).forEach(([outlet, value]) => {
            html += `
              <div class="tooltip-row">
                <span>${outlet}</span>
                <span>₹${value.toLocaleString("en-IN")}</span>
              </div>
            `;
          });
          tooltip.innerHTML = html;
          document.body.appendChild(tooltip);

          info.el.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
          });

          info.el.addEventListener("mousemove", e => {
            const tooltipRect = tooltip.getBoundingClientRect();
            let left = e.pageX + 15;
            let top = e.pageY + 15;

            if (left + tooltipRect.width > window.pageXOffset + window.innerWidth) {
              left = e.pageX - tooltipRect.width - 15;
            }
            if (top + tooltipRect.height > window.pageYOffset + window.innerHeight) {
              top = e.pageY - tooltipRect.height - 15;
            }

            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";
          });

          info.el.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
          });
        }

      });

      calendar.render();
    })
    .catch(err => console.error("Error loading sales.json", err));

});

/* MONTHLY TOTAL CALCULATION */
function calculateMonthlyTotals(data) {
  const monthly = {};
  data.forEach(item => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const total = Object.values(item.outlets).reduce((sum, val) => sum + val, 0);
    if (!monthly[key]) monthly[key] = { total: 0 };
    monthly[key].total += total;
  });
  return monthly;
}
