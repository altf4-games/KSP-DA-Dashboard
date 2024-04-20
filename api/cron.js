const { checkAndSendEmail } = require("./index.js");

module.exports = function handler(req, res) {
  checkAndSendEmail()
    .then(() => {
      console.log("Email check completed.");
      res.status(200).send("Email check completed.");
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Error occurred while checking and sending email.");
    });
};
