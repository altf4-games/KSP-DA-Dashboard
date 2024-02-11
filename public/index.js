const map = L.map('map').setView([19.0760, 72.8777], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

Papa.parse('AccidentsBig.csv', {
    download: true,
    header: false,
    dynamicTyping: true,
    complete: (results) => {
        results.data.shift();
        const accidentsByDay = [0, 0, 0, 0, 0, 0, 0];
        results.data.forEach((row) => {
            const dayOfWeek = row[7];
            if (!isNaN(dayOfWeek)) {
                accidentsByDay[dayOfWeek - 1]++;
            }

            if (!isNaN(row[1]) && !isNaN(row[2])) {
                L.marker([row[2], row[1]]).addTo(map);
            } else {
                console.error("Invalid data: ", row);
            }
        });
        drawChart(accidentsByDay);
    }
});

const drawChart = (accidentsByDay) => {
    const ctx = document.getElementById('accidentChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Number of Accidents',
                data: accidentsByDay,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/*fetch(`/insights?inputString=${encodeURIComponent('write hello world in python')}`, {
    method: 'GET'
})
  .then((response) => response.json())
  .then((data) => console.log(data.choices[0].message.content))
  .catch((error) => console.error(error));*/