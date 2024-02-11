Papa.parse('../AccidentsBig.csv', {
  download: true,
  complete: function(results) {
    const data = results.data;
    const timeOfDay = data.map(row => row[8]);
    const counts = {};
    timeOfDay.forEach(time => {
      counts[time] = (counts[time] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);
      
    const ctx = document.getElementById('accident-time').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Accidents by Time of Day',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      }
    });
  }
});

Papa.parse('../AccidentsBig.csv', {
  download: true,
  complete: function(results) {
    const data = results.data;
    const speedLimit = data.map(row => row[14]);
    const accidentSeverity = data.map(row => row[4]);

    const ctx = document.getElementById('speed-accident-chart').getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Speed Limit vs Accident Severity',
          data: speedLimit.map((limit, index) => ({ x: limit, y: accidentSeverity[index] })),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Speed Limit'
            },
            beginAtZero: true
          },
          y: {
            title: {
              display: true,
              text: 'Accident Severity'
            },
            beginAtZero: true,
            stepSize: 1
          }
        }
      }
    });
  }
});