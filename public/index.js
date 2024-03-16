const apiKey = "pCKjhiDCnrgyjAqbqaeEMeJYmenJGWz6";

const map = tt.map({
    key: apiKey,
    container: "map",
    center: [77.5946, 12.9999],
    zoom: 15,
});

map.on("load", function () {
    map.showTrafficFlow();
});

Papa.parse('AccidentsBig.csv', {
    download: true,
    header: false,
    dynamicTyping: true,
    complete: (results) => {
        results.data.shift();
        results.data.forEach((row) => {
            if (!isNaN(row[1]) && !isNaN(row[2])) {
                const data = `lat: ${row[2]}, lon: ${row[1]}
                    <br>accident severity: ${row[4]}
                    <br>number of vehicles: ${row[5]}
                    <br>number of casualties: ${row[6]}
                    <br>day of week: ${row[7]}
                    <br>date: ${row[29]}
                    <br>time: ${row[8]}
                    <br>speed limit: ${row[14]}
                    <br>weather conditions: ${weatherConditions[row[22]]}
                    <br>light conditions: ${lightConditions[row[21]]}
                `;
                const marker = new tt.Marker()
                    .setLngLat([row[1], row[2]])
                    .addTo(map)
                    .setPopup(new tt.Popup().setHTML(data));
                
                marker.on('click', () => {
                    document.getElementsByClassName('in-btn')[0].disabled = false;
                    currentMarkerData = {
                        severity: row[4],
                        vehicles: row[5],
                        casualties: row[6],
                        dayOfWeek: row[7],
                        date: row[29],
                        time: row[8],
                        speedLimit: row[14],
                        weatherConditions: weatherConditions[row[22]],
                        lightConditions: lightConditions[row[21]]
                    };
                });
            } else {
                console.error("Invalid data: ", row);
            }
        });
    }
});

const weatherConditions = {
    0: "Sunny",
    1: "Partly Cloudy",
    2: "Cloudy",
    3: "Rainy",
    4: "Stormy"
};

const lightConditions = {
    0: "Bright",
    1: "Normal",
    2: "Dim",
    3: "Dark",
    4: "Very Dark"
};

let currentMarkerData;
const infraImprovementsText = document.getElementsByClassName('ii-text')[0];
const trafficDeploymentText = document.getElementsByClassName('td-text')[0];

const getInsights = async () => {
    if (currentMarkerData !== undefined) {
        const infraPrompt = `based on the ${JSON.stringify(currentMarkerData)} data, suggest infrastructure improvements to reduce accidents in single short paragraph`;
        const trafficPrompt = `based on the ${JSON.stringify(currentMarkerData)} data , can you suggest some traffic deployment plans in a single short paragraph to lower accidents.`;
        infraImprovementsText.innerText = "Loading...";
        trafficDeploymentText.innerText = "Loading...";

        fetch(`/api/v1/insights?inputString=${encodeURIComponent(infraPrompt)}`, {
            method: 'GET'
        })
        .then((response) => response.json())
            .then((data) => {
            infraImprovementsText.innerText = data.choices[0].message.content;
        })
        .catch((error) => console.error(error));
        
        fetch(`/api/v1/insights?inputString=${encodeURIComponent(trafficPrompt)}`, {
            method: 'GET'
        })
        .then((response) => response.json())
            .then((data) => {
            trafficDeploymentText.innerText = data.choices[0].message.content;
        })
        .catch((error) => console.error(error));
    }
};

// Heatmap
Papa.parse("AccidentsBig.csv", {
    download: true,
    header: true,
    complete: function(results) {
        var data = results.data;

        var heatmapData = {
            type: 'FeatureCollection',
            features: data.map(function(point) {
                return {
                    geometry: {
                        type: 'Point',
                        coordinates: [point.longitude, point.latitude],
                        intensity: point.accident_severity,
                    },
                    properties: {}
                };
            })
        };

        map.on('load', function() {
            map.addLayer({
                'id': 'heatmap',
                'type': 'heatmap',
                'source': {
                    'type': 'geojson',
                    'data': heatmapData
                },
                'paint': {
                    'heatmap-intensity': 3,
                    'heatmap-radius': 40,
                    'heatmap-opacity': 0.6
                }
            });
        });
    }
});