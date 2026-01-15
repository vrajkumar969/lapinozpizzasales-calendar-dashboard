/*document.addEventListener('DOMContentLoaded', function () {

  fetch('data/sales.json')
    .then(response => response.json())
    .then(data => {

      const events = data.map(item => ({
        title: "₹" + item.totalSales.toLocaleString(),   // ONLY TOTAL SALES SHOWN
        start: item.date,
        allDay: true,
        extendedProps: item.outlets                      // STORE OUTLET DATA
      }));

      const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
          initialView: 'multiMonthYear',
          multiMonthMaxColumns: 3,
          height: 'auto',

          events: events,

        eventDidMount: function (info) {

      const tooltip = document.createElement("div");
      tooltip.className = "sales-tooltip";

      let html = `<div class="tooltip-title">Outlet-wise Sales</div>`;

      Object.entries(info.event.extendedProps).forEach(([outlet, value]) => {
        html += `
          <div class="tooltip-row">
            <span>${outlet}</span>
            <span>₹${value.toLocaleString()}</span>
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


  /* ===============================
     5️⃣ RENDER CALENDAR
     =============================== */
/*
calendar.render();

});*/

  document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  fetch('data/sales.json?v=' + new Date().getTime())
    .then(response => response.json())
    .then(salesData => {

      /* ===============================
         BUILD CALENDAR EVENTS
         =============================== */

      const events = salesData.map(item => {

        const totalSales = Object.values(item.outlets)
          .reduce((sum, val) => sum + val, 0);

        return {
          title: `₹${totalSales.toLocaleString()}`,
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
        
        /*initialView: "dayGridMonth",
        initialDate: salesData[0].date,
        height: "auto",
        fixedWeekCount: false,
        showNonCurrentDates: false,*/

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
                <span>₹${value.toLocaleString()}</span>
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
      console.error("Error loading sales-data.json", err);
    });

});

function renderMonthlyTotals(data) {

  const monthly = {};

  data.forEach(d => {
    const month = d.date.substring(0, 7); // YYYY-MM
    const total = Object.values(d.outlets).reduce((a, b) => a + b, 0);
    monthly[month] = (monthly[month] || 0) + total;
  });

  let html = "<h3>📈 Monthly Sales Summary</h3>";
  Object.entries(monthly).forEach(([month, total]) => {
    html += `<div>${month}: ₹${total.toLocaleString()}</div>`;
  });

  document.getElementById("monthlyTotals").innerHTML = html;
}
