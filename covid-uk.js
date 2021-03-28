"use strict";
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
                type: 'time'
              }]
            }
          }
        });
      };
      var cases = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.cases};
      });
      drawChart('cases', [{
        label: 'Cases',
        //backgroundColor: 'rgb(255, 99, 132)',
        //borderColor: 'rgb(255, 99, 132)',
        data: cases
      }]);
      var admissions = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.admissions};
      });
      drawChart('admissions', [{
        label: 'Hospital admissions',
        //backgroundColor: 'rgb(255, 99, 132)',
        //borderColor: 'rgb(255, 99, 132)',
        data: admissions
      }]);
      var deaths = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.deaths};
      });
      drawChart('deaths', [{
        label: 'Deaths',
        //backgroundColor: 'rgb(255, 99, 132)',
        //borderColor: 'rgb(255, 99, 132)',
        data: deaths
      }]);
      var firstDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.firstDoses};
      });
      var secondDoses = rawData.data.map(function(day) {
        return {x: new Date(day.date), y: day.secondDoses};
      });
      drawChart('vaccinations', [{
        label: 'First doses',
        //backgroundColor: 'rgb(255, 99, 132)',
        //borderColor: 'rgb(255, 99, 132)',
        data: firstDoses
      }, {
        label: 'Second doses',
        //backgroundColor: 'rgb(255, 99, 132)',
        //borderColor: 'rgb(255, 99, 132)',
        data: secondDoses
      }]);
    });
}
