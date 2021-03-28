'use strict';
window.onload = function() {
  fetch('covid-uk.json')
    .then(response => response.json())
    .then(rawData => {
      const from = document.getElementById('from');
      const to = document.getElementById('to');
      if (!from.value) {
        from.value = '2021-01-01';
      }
      if (!to.value) {
        to.value = new Date().toISOString().substring(0,10);
      }
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
                  min: new Date(from.value),
                  max: new Date(to.value)
                }
              }]
            }
          }
        });
        return chart;
      };
      const cases = [], admissions = [], deaths = [], firstDoses = [], secondDoses = [];
      for (let i = 0; i < rawData.data.length; i++) {
        const day = rawData.data[i];
        const date = new Date(day.date);
        cases[i] = {x: date, y: day.cases};
        admissions[i] = {x: date, y: day.admissions};
        deaths[i] = {x: date, y: day.deaths};
        firstDoses[i] = {x: date, y: day.firstDoses};
        secondDoses[i] = {x: date, y: day.secondDoses};
      }
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
          xaxis.ticks.min = new Date(from.value);
          xaxis.ticks.max = new Date(to.value);
          charts[i].update();
        }
        return false;
      }
    });
}
