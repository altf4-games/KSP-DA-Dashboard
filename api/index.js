const OpenAI = require("openai");
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const multer = require("multer");
const upload = multer();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env["FROM_EMAIL"],
        pass: process.env["FROM_EMAIL_PASSWORD"],
      },
    });

    let info = await transporter.sendMail({
      from: process.env["FROM_EMAIL"],
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const checkAndSendEmail = async () => {
  try {
    const apiUrl =
      "https://dane-profound-arguably.ngrok-free.app/highest_risk_locations";
    const response = await fetch(apiUrl);
    const data = await response.json();

    const threshold = 0.17;
    const filteredData = data.filter((entry) => entry.Probability > threshold);

    if (filteredData.length > 0) {
      let emailContent = "High-risk locations alert:\n\n";
      filteredData.forEach((entry) => {
        emailContent += `Latitude: ${entry.latitude}, Longitude: ${entry.longitude}, Accident Severity: ${entry.Accident_Severity}\n`;
      });
      await sendEmail(
        process.env["RECIPIENT_EMAIL"],
        "High-risk locations alert",
        emailContent
      );
    }
  } catch (error) {
    console.error("Error fetching data or sending email:", error);
  }
};

// Schedule to check and send email every hour - 3600000 ms
setInterval(checkAndSendEmail, 3600000);

async function generateText(parameter) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${parameter}` }],
    model: "gpt-3.5-turbo",
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
