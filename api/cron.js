const { checkAndSendEmail } = require("./index.js");

export default function handler(req, res) {
  checkAndSendEmail()
    .then(() => {
      console.log("Email check completed.");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
