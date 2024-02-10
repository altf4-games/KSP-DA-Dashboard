const map = L.map('map').setView([19.0760, 72.8777], 13);
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
        results.data.forEach((row) => {
            if (!isNaN(row[1]) && !isNaN(row[2])) {
                L.marker([row[2], row[1]]).addTo(map);
            } else {
                console.error("Invalid data: ", row);
            }
        });
    }
});