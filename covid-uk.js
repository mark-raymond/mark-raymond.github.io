"use strict";
window.onload = function() {
  var rawData = {"length":423,"maxPageLimit":2500,"data":[{"date":"2021-03-27","cases":4715,"admissions":null,"firstDoses":null,"secondDoses":null,"deaths":58},{"date":"2021-03-26","cases":6187,"admissions":null,"firstDoses":411305,"secondDoses":283654,"deaths":70},{"date":"2021-03-25","cases":6397,"admissions":null,"firstDoses":324942,"secondDoses":234382,"deaths":63},{"date":"2021-03-24","cases":5605,"admissions":null,"firstDoses":337665,"secondDoses":242642,"deaths":98},{"date":"2021-03-23","cases":5379,"admissions":363,"firstDoses":323941,"secondDoses":167512,"deaths":112},{"date":"2021-03-22","cases":5342,"admissions":357,"firstDoses":335001,"secondDoses":87542,"deaths":17},{"date":"2021-03-21","cases":5312,"admissions":355,"firstDoses":350705,"secondDoses":45039,"deaths":33},{"date":"2021-03-20","cases":5587,"admissions":361,"firstDoses":753659,"secondDoses":92691,"deaths":96},{"date":"2021-03-19","cases":4802,"admissions":379,"firstDoses":615891,"secondDoses":127232,"deaths":101},{"date":"2021-03-18","cases":6303,"admissions":447,"firstDoses":527208,"secondDoses":133542,"deaths":95},{"date":"2021-03-17","cases":5758,"admissions":442,"firstDoses":463241,"secondDoses":120154,"deaths":141},{"date":"2021-03-16","cases":5294,"admissions":439,"firstDoses":437226,"secondDoses":95487,"deaths":110},{"date":"2021-03-15","cases":5089,"admissions":497,"firstDoses":387825,"secondDoses":54668,"deaths":64},{"date":"2021-03-14","cases":4618,"admissions":426,"firstDoses":255997,"secondDoses":25374,"deaths":52},{"date":"2021-03-13","cases":5534,"admissions":460,"firstDoses":513207,"secondDoses":52150,"deaths":121},{"date":"2021-03-12","cases":6609,"admissions":480,"firstDoses":372582,"secondDoses":87679,"deaths":175},{"date":"2021-03-11","cases":6753,"admissions":544,"firstDoses":260393,"secondDoses":93563,"deaths":181},{"date":"2021-03-10","cases":5926,"admissions":568,"firstDoses":245305,"secondDoses":97357,"deaths":190},{"date":"2021-03-09","cases":5766,"admissions":580,"firstDoses":217427,"secondDoses":73129,"deaths":231},{"date":"2021-03-08","cases":4712,"admissions":576,"firstDoses":212535,"secondDoses":38804,"deaths":65},{"date":"2021-03-07","cases":5177,"admissions":537,"firstDoses":163390,"secondDoses":20241,"deaths":82},{"date":"2021-03-06","cases":6040,"admissions":638,"firstDoses":417621,"secondDoses":31562,"deaths":158},{"date":"2021-03-05","cases":5947,"admissions":597,"firstDoses":436831,"secondDoses":56772,"deaths":236},{"date":"2021-03-04","cases":6573,"admissions":703,"firstDoses":375846,"secondDoses":70206,"deaths":242},{"date":"2021-03-03","cases":6385,"admissions":713,"firstDoses":278016,"secondDoses":68374,"deaths":315},{"date":"2021-03-02","cases":6391,"admissions":832,"firstDoses":228138,"secondDoses":50991,"deaths":343},{"date":"2021-03-01","cases":5455,"admissions":822,"firstDoses":196948,"secondDoses":28083,"deaths":104},{"date":"2021-02-28","cases":6035,"admissions":770,"firstDoses":185982,"secondDoses":19684,"deaths":144},{"date":"2021-02-27","cases":7434,"admissions":740,"firstDoses":407574,"secondDoses":27322,"deaths":290},{"date":"2021-02-26","cases":8523,"admissions":862,"firstDoses":504528,"secondDoses":32797,"deaths":345},{"date":"2021-02-25","cases":9985,"admissions":970,"firstDoses":484876,"secondDoses":35329,"deaths":323},{"date":"2021-02-24","cases":9938,"admissions":1021,"firstDoses":450775,"secondDoses":31614,"deaths":442},{"date":"2021-02-23","cases":8489,"admissions":1120,"firstDoses":328751,"secondDoses":26317,"deaths":548},{"date":"2021-02-22","cases":10641,"admissions":1121,"firstDoses":191949,"secondDoses":18463,"deaths":178},{"date":"2021-02-21","cases":9834,"admissions":1154,"firstDoses":134808,"secondDoses":9261,"deaths":215},{"date":"2021-02-20","cases":10406,"admissions":1085,"firstDoses":337883,"secondDoses":10264,"deaths":445},{"date":"2021-02-19","cases":12027,"admissions":1268,"firstDoses":375250,"secondDoses":15294,"deaths":533},{"date":"2021-02-18","cases":12057,"admissions":1334,"firstDoses":453237,"secondDoses":15867,"deaths":454}]}
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
}
