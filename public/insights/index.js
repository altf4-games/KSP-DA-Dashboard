Papa.parse("../AccidentsBig.csv", {
  download: true,
  complete: function (results) {
    const data = results.data;
    const speedLimit = data.map((row) => row[14]);
    const accidentSeverity = data.map((row) => row[4]);
    const accidentsByDay = [0, 0, 0, 0, 0, 0, 0];
    results.data.forEach((row) => {
      const dayOfWeek = row[7];
      if (!isNaN(dayOfWeek)) {
        accidentsByDay[dayOfWeek - 1]++;
      }
    });
    drawChart(accidentsByDay);

    const ctx = document
      .getElementById("speed-accident-chart")
      .getContext("2d");
    new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Speed Limit vs Accident Severity",
            data: speedLimit.map((limit, index) => ({
              x: limit,
              y: accidentSeverity[index],
            })),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Speed Limit",
            },
            beginAtZero: true,
          },
          y: {
            title: {
              display: true,
              text: "Accident Severity",
            },
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    });
  },
});

const drawChart = (accidentsByDay) => {
  const ctx = document.getElementById("accidentChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      datasets: [
        {
          label: "Number of Accidents",
          data: accidentsByDay,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// plot Gender_Distribution.csv

fetch("Accident_Karnataka_Year-Wise.csv")
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").slice(1); // Split data into rows, excluding header
    const years = [];
    const totalAccidents = [];

    // Parse each row
    rows.forEach((row) => {
      const columns = row.split(",");
      const year = columns[0];
      const accidents = parseInt(columns[1]);

      years.push(year);
      totalAccidents.push(accidents);
    });

    // Create Chart.js chart
    const ctx = document.getElementById("year-wise-chart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: "Total Accidents",
            data: totalAccidents,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  });

const data = {
  labels: ["Male", "Female"],
  datasets: [
    {
      data: [8602, 1436],
      backgroundColor: ["#36A2EB", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384"],
    },
  ],
};

const accidentsData = [
  { gender: "Male", count: 8602 },
  { gender: "Female", count: 1436 },
];

// Extract labels and data
const genders = accidentsData.map((item) => item.gender);
const counts = accidentsData.map((item) => item.count);

// Create Chart.js chart
const ctx = document.getElementById("genderChart").getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 300;
const chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: genders,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red for males
          "rgba(54, 162, 235, 0.6)", // Blue for females
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
        maintainAspectRatio: false,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Accidents Involving Males and Females",
    },
    responsive: true,
    maintainAspectRatio: false,
  },
});
