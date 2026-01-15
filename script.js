document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch('data/sales.json?v=' + new Date().getTime())
    .then(response => response.json())
    .then(salesData => {

      /* ===============================
         MONTHLY TOTALS (CALL ADDED)
         =============================== */
      renderMonthlyTotals(salesData);

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
        multiMonthMaxColumns: 3,
        height: 'auto',

        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: ""
        },

        events: events,

        /* ===============================
           CUSTOM TOOLTIP
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
    .catch(err => {
      console.error("Error loading sales.json", err);
    });

});


/* ===============================
   MONTHLY TOTAL FUNCTION (IMPROVED)
   =============================== */
function renderMonthlyTotals(data) {

  const monthly = {};

  data.forEach(d => {
    const date = new Date(d.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const total = Object.values(d.outlets)
      .reduce((a, b) => a + b, 0);

    if (!monthly[key]) {
      monthly[key] = {
        year: date.getFullYear(),
        month: date.getMonth(),
        total: 0
      };
    }

    monthly[key].total += total;
  });

  let html = `<h3>📈 Monthly Sales Summary</h3>`;

  Object.values(monthly).forEach(m => {
    const monthName = new Date(m.year, m.month)
      .toLocaleString("en-IN", { month: "long", year: "numeric" });

    html += `
      <div class="month-total">
        <strong>${monthName}</strong> : ₹${m.total.toLocaleString("en-IN")}
      </div>
    `;
  });

  document.getElementById("monthlyTotals").innerHTML = html;
}
