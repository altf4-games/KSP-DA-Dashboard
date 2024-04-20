document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", event.target.elements.image.files[0]);

    try {
      const response = await fetch("/api/v1/traffic_accident_detection", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      displayResult(result, event.target.elements.image.files[0]);
    } catch (error) {
      console.error("Error:", error);
    }
  });

function displayResult(result, imageFile) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = JSON.stringify(result, null, 2);

  // Display the image with the box drawn
  const image = document.createElement("img");
  image.src = URL.createObjectURL(imageFile);
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    // Draw the box and probability label on the canvas
    const box = result[0].box;
    const probability = result[0].score.toFixed(2);

    const textWidth = ctx.measureText(`Accident: ${probability}`).width;
    ctx.fillStyle = "red";
    ctx.fillRect(box.xmin, box.ymin - 30, textWidth + 50, 30);

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Accident: ${probability}`, box.xmin + 5, box.ymin - 10);

    // Draw the box around the object
    ctx.beginPath();
    ctx.rect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.stroke();

    resultDiv.innerHTML = "";
    resultDiv.appendChild(canvas);
  };
}
