document.addEventListener('DOMContentLoaded', function () {

  fetch('data/sales.json')
    .then(response => response.json())
    .then(data => {

      const events = data.map(item => ({
        title: "₹" + item.totalSales.toLocaleString(),
        start: item.date,
        allDay: true,
        extendedProps: item.outlets
      }));

      const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
          initialView: 'multiMonthYear',
          multiMonthMaxColumns: 3, // Show 3 months together
          height: 'auto',

          events: events,

          eventDidMount: function(info) {
            let tooltip = "<b>Outlet-wise Sales</b><br>";
            for (let outlet in info.event.extendedProps) {
              tooltip += `${outlet}: ₹${info.event.extendedProps[outlet].toLocaleString()}<br>`;
            }
            info.el.setAttribute("title", tooltip);
          }
        }
      );

      calendar.render();
    });
});
