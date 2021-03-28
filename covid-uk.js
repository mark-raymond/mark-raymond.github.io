'use strict';
window.onload = function() {
  fetch('covid-uk.json')
    .then(response => response.json())
    .then(rawData => {
      function drawChart(id, datasets) {
        var ctx = document.getElementById(id).getContext('2d');
        var chart = new Chart(ctx, {
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
      var cases = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.cases};
      });
      var admissions = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.admissions};
      });
      var deaths = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.deaths};
      });
      var firstDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.firstDoses};
      });
      var secondDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.secondDoses};
      });
      var charts = [
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
        for (var i = 0; i < charts.length; i++) {
          var xaxis = charts[i].options.scales.xAxes[0];
          xaxis.ticks.min = new Date(document.getElementById('from').value);
          xaxis.ticks.max = new Date(document.getElementById('to').value);
          charts[i].update();
        }
        return false;
      }
    });
}
