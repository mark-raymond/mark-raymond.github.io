'use strict';
window.onload = function() {
  fetch('covid-uk.json')
    .then(response => response.json())
    .then(rawData => {
      function drawChart(id, datasets) {
        const ctx = document.getElementById(id).getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: datasets
          },
          options: {
            scales: {
              xAxes: [{
                type: 'time',
                ticks: {
                  min: new Date(document.getElementById('from').value),
                  max: new Date(document.getElementById('to').value)
                }
              }]
            }
          }
        });
        return chart;
      };
      const cases = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.cases};
      });
      const admissions = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.admissions};
      });
      const deaths = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.deaths};
      });
      const firstDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.firstDoses};
      });
      const secondDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.secondDoses};
      });
      const charts = [
        drawChart('cases', [{
          label: 'Cases',
          data: cases
        }]),
        drawChart('admissions', [{
          label: 'Hospital admissions',
          data: admissions
        }]),
        drawChart('deaths', [{
          label: 'Deaths',
          data: deaths
        }]),
        drawChart('vaccinations', [{
          label: 'First doses',
          data: firstDoses
        }, {
          label: 'Second doses',
          data: secondDoses
        }])
      ];
      document.getElementById('redraw').onclick = () => {
        for (let i = 0; i < charts.length; i++) {
          const xaxis = charts[i].options.scales.xAxes[0];
          xaxis.ticks.min = new Date(document.getElementById('from').value);
          xaxis.ticks.max = new Date(document.getElementById('to').value);
          charts[i].update();
        }
        return false;
      }
    });
}
