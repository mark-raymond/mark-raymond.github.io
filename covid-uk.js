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
      function drawChart(id, datasets, percentage) {
        const scales = {
          xAxes: [{
            type: 'time',
            ticks: {
              min: new Date(from.value),
              max: new Date(to.value)
            }
          }]
        };
        if (percentage) {
          scales.yAxes = [{
            ticks: {
              min: -0.4,
              max: 0.8,
              callback: value => (value > 0 ? '+' : '') + (value * 100).toFixed(0) + '%'
            }
          }];
        }
        const ctx = document.getElementById(id).getContext('2d');
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: datasets
          },
          options: {
            scales: scales
          }
        });
        return chart;
      };
      const halfAWeek = 1000 * 86400 * 3.5;
      function geoMean(values) {
        let product = 1;
        let count = 0;
        for (let i = 0; i < values.length; i++) {
          if (values[i] != null) {
            product *= values[i];
            count++;
          }
        }
        return Math.pow(product, 1 / count);
      }
      function movingAverageRatioCalc(i, input, scratch, output) {
        if (i >= 7) {
          if (input[i].y && input[i - 7].y) {
            scratch[i % 7] = input[i - 7].y / input[i].y;
          } else {
            scratch[i % 7] = null
          }
        }
        if (scratch.length === 7) {
          output[i - 13] = {x: new Date(input[i - 7].x.getTime() + halfAWeek), y: geoMean(scratch) - 1};
        }
      }
      const cases = [], admissions = [], deaths = [], firstDoses = [], secondDoses = [], casesRatio = [], admissionsRatio = [], deathsRatio = [], casesMAR = [], admissionsMAR = [], deathsMAR = [];
      for (let i = 0; i < rawData.data.length; i++) {
        const day = rawData.data[i];
        const date = new Date(day.date);
        cases[i] = {x: date, y: day.cases};
        movingAverageRatioCalc(i, cases, casesRatio, casesMAR);
        admissions[i] = {x: date, y: day.admissions};
        movingAverageRatioCalc(i, admissions, admissionsRatio, admissionsMAR);
        deaths[i] = {x: date, y: day.deaths};
        movingAverageRatioCalc(i, deaths, deathsRatio, deathsMAR);
        firstDoses[i] = {x: date, y: day.firstDoses};
        secondDoses[i] = {x: date, y: day.secondDoses};
      }
      const charts = [
        drawChart('cases', [{
          label: 'New COVID-19 cases, change week to week',
          data: casesMAR
        }], true),
        drawChart('admissions', [{
          label: 'New COVID-19 hospital admissions, change week to week',
          data: admissionsMAR
        }], true),
        drawChart('deaths', [{
          label: 'New COVID-19 deaths, change week to week',
          data: deathsMAR
        }], true),
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
