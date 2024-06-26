const OpenAI = require("openai");
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const fetch = require("node-fetch");
const multer = require("multer");
const upload = multer();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

app.get("/api/v1/insights", async (req, res) => {
  try {
    const inputString = req.query.inputString;
    const generatedText = await generateText(inputString);
    res.json(generatedText);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/v1/highest_risk_locations", async (req, res) => {
  fetch(
    "https://dane-profound-arguably.ngrok-free.app/highest_risk_locations",
    {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  ).then((response) => {
    response.json().then((data) => {
      res.json(data);
    });
  });
});

app.post(
  "/api/v1/traffic_accident_detection",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageBuffer = req.file.buffer; // Get the buffer containing the uploaded file

      const result = await query(imageBuffer);
      res.json(result);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

async function generateText(parameter) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${parameter}` }],
    model: "gpt-3.5-turbo",
    max_tokens: 4096,
  });
  return chatCompletion;
}

async function query(imageBuffer) {
  try {
    // Send image data to Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/hilmantm/detr-traffic-accident-detection",
      {
        headers: {
          Authorization: `Bearer ${process.env["HUGGING_FACE_API"]}`,
          "Content-Type": "image/jpeg", // Assuming the image format is JPEG
        },
        method: "POST",
        body: imageBuffer,
      }
    );

    // Parse and return the result
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Error querying Hugging Face API: " + error.message);
  }
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
