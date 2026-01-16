document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch('data/sales.json?v=' + new Date().getTime())
    .then(response => response.json())
    .then(salesData => {

      /* ===============================
         CALCULATE MONTHLY TOTALS
         =============================== */
      const monthlyTotals = calculateMonthlyTotals(salesData);

      /* ===============================
         BUILD CALENDAR EVENTS
         =============================== */
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

      /* ===============================
         INITIALIZE CALENDAR
         =============================== */
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

        /* ===============================
           HEADER TOTAL PER MONTH
           =============================== */
        datesSet: function () {

          // Cleanup on navigation
          document.querySelectorAll(".month-header-total").forEach(e => e.remove());

          document.querySelectorAll(".fc-multimonth-month").forEach(monthEl => {

            const dateStr = monthEl.getAttribute("data-date");
            if (!dateStr) return;

            const date = new Date(dateStr);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const monthData = monthlyTotals[key];

            if (!monthData) return;

            const header = document.createElement("div");
            header.className = "month-header-total";
            header.innerHTML =
              `Total Sales: ₹${monthData.total.toLocaleString("en-IN")}`;

            // Insert BELOW title, ABOVE grid
            const title = monthEl.querySelector(".fc-multimonth-title");
            title.after(header);
          });
        },

        /* ===============================
           TOOLTIP
           =============================== */
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

          info.el.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 15 + "px";
            tooltip.style.top = e.pageY + 15 + "px";
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


/* ===============================
   HELPER
   =============================== */
function calculateMonthlyTotals(data) {

  const monthly = {};

  data.forEach(d => {
    const date = new Date(d.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const total = Object.values(d.outlets)
      .reduce((a, b) => a + b, 0);

    if (!monthly[key]) {
      monthly[key] = { total: 0 };
    }

    monthly[key].total += total;
  });

  return monthly;
}
