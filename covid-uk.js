'use strict';
window.onload = function () {
  fetch('covid-uk.json')
    .then(response => response.json())
    .then(rawData => {
      const from = document.getElementById('from');
      const to = document.getElementById('to');
      if (!from.value) {
        from.value = '2021-01-01';
      }
      if (!to.value) {
        to.value = new Date().toISOString().substring(0, 10);
      }
      function drawChart(id, datasets, percentage) {
        const start = new Date(from.value);
        const end = new Date(to.value);
        const scales = {
          xAxes: [{
            type: 'time',
            ticks: {
              min: start,
              max: end
            }
          }]
        };
        if (percentage) {
          const range = getRange(start, end);
          scales.yAxes = [{
            ticks: {
              min: range.min,
              max: range.max,
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
      function arithMean(values) {
        let sum = 0;
        let count = 0;
        for (let i = 0; i < values.length; i++) {
          if (values[i] != null) {
            sum += values[i];
            count++;
          }
        }
        return sum / count;
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
          output[i - 13] = { x: new Date(input[i - 7].x.getTime() + halfAWeek), y: geoMean(scratch) - 1 };
        }
      }
      function movingAverageCalc(i, input, scratch, output) {
        scratch[i % 7] = input[i].y;
        if (scratch.length === 7) {
          output[i - 6] = { x: new Date(input[i].x.getTime() + halfAWeek), y: arithMean(scratch) };
        }
      }
      const cases = [], admissions = [], deaths = [], firstDoses = [], secondDoses = [], casesRatio = [], admissionsRatio = [], deathsRatio = [], firstDosesWeek = [], secondDosesWeek = [], casesMAR = [], admissionsMAR = [], deathsMAR = [], firstDosesMA = [], secondDosesMA = [], totalDosesMA = [];
      for (let i = 0; i < rawData.data.length; i++) {
        const day = rawData.data[i];
        const date = new Date(day.date);
        cases[i] = { x: date, y: day.cases };
        movingAverageRatioCalc(i, cases, casesRatio, casesMAR);
        admissions[i] = { x: date, y: day.admissions };
        movingAverageRatioCalc(i, admissions, admissionsRatio, admissionsMAR);
        deaths[i] = { x: date, y: day.deaths };
        movingAverageRatioCalc(i, deaths, deathsRatio, deathsMAR);
        firstDoses[i] = { x: date, y: day.firstDoses };
        movingAverageCalc(i, firstDoses, firstDosesWeek, firstDosesMA);
        secondDoses[i] = { x: date, y: day.secondDoses };
        movingAverageCalc(i, secondDoses, secondDosesWeek, secondDosesMA);
        if (i >= 6) {
          totalDosesMA[i - 6] = { x: firstDosesMA[i - 6].x, y: firstDosesMA[i - 6].y + secondDosesMA[i - 6].y };
        }
      }
      function getRange(start, end) {
        let min = 0, max = 0;
        for (let i = 0; i < casesMAR.length; i++) {
          if (casesMAR[i].x >= start && casesMAR[i].x <= end) {
            if (casesMAR[i].y < min) { min = casesMAR[i].y; }
            if (casesMAR[i].y > max) { max = casesMAR[i].y; }
            if (admissionsMAR[i].y < min) { min = admissionsMAR[i].y; }
            if (admissionsMAR[i].y > max) { max = admissionsMAR[i].y; }
            if (deathsMAR[i].y < min) { min = deathsMAR[i].y; }
            if (deathsMAR[i].y > max) { max = deathsMAR[i].y; }
          }
        }
        min = -(Math.ceil(-min * 5) / 5);
        max = Math.ceil(max * 5) / 5;
        return { min, max };
      }
      const charts = [
        drawChart('cases', [{
          label: 'New COVID-19 cases, moving average of change week to week',
          data: casesMAR,
          borderColor: 'rgb(86,180,233)',
          pointRadius: 1
        }], true),
        drawChart('admissions', [{
          label: 'New COVID-19 hospital admissions, moving average of change week to week',
          data: admissionsMAR,
          borderColor: 'rgb(86,180,233)',
          pointRadius: 1
        }], true),
        drawChart('deaths', [{
          label: 'New COVID-19 deaths, moving average of change week to week',
          data: deathsMAR,
          borderColor: 'rgb(86,180,233)',
          pointRadius: 1
        }], true),
        drawChart('vaccinations', [{
          label: 'First doses (weekly moving average)',
          data: firstDosesMA,
          borderColor: 'rgb(230,159,0)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 1
        }, {
          label: 'Second doses (weekly moving average)',
          data: secondDosesMA,
          borderColor: 'rgb(0,158,115)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          pointRadius: 1
        }, {
          label: 'Total doses (weekly moving average)',
          data: totalDosesMA,
          borderColor: 'rgb(100,100,100)',
          pointRadius: 1
        }])
      ];
      document.getElementById('redraw').onclick = () => {
        const start = new Date(from.value);
        const end = new Date(to.value);
        const range = getRange(start, end);
        for (let i = 0; i < charts.length; i++) {
          const chart = charts[i];
          const xaxis = chart.options.scales.xAxes[0];
          xaxis.ticks.min = start;
          xaxis.ticks.max = end;
          const yaxis = chart.options.scales.yAxes[0];
          if (yaxis.ticks.min !== undefined) {
            yaxis.ticks.min = range.min;
            yaxis.ticks.max = range.max;
          }
          chart.update();
        }
        return false;
      }
    });
}
