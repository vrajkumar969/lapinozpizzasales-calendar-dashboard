document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch("data/sales.json?v=" + Date.now())
    .then(res => res.json())
    .then(salesData => {

      /* ===============================
         MONTHLY TOTAL CALCULATION
         =============================== */
      const monthlyTotals = {};

      salesData.forEach(item => {
        const date = new Date(item.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        const total = Object.values(item.outlets)
          .reduce((a, b) => a + b, 0);

        monthlyTotals[key] = (monthlyTotals[key] || 0) + total;
      });

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
        initialView: "multiMonthYear",
        multiMonthMaxColumns: 3,
        height: "auto",

        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: ""
        },

        events: events,

        /* ===============================
           ADD MONTHLY TOTAL BELOW MONTH NAME
           =============================== */
        viewDidMount: function () {

          document.querySelectorAll(".fc-multimonth-title").forEach(header => {

            if (header.dataset.totalAdded) return;

            const text = header.innerText.trim(); // "January 2025"
            const date = new Date(text + " 1");
            if (isNaN(date)) return;

            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const total = monthlyTotals[key];
            if (!total) return;

            const div = document.createElement("div");
            div.className = "month-total-inline";
            div.innerText = `Total = ₹ ${total.toLocaleString("en-IN")}`;

            header.appendChild(div);
            header.dataset.totalAdded = "true";
          });
        },

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

          info.el.addEventListener("mousemove", e => {
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
