const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Import the modified Publisher class (adjust the path as necessary)
const Publisher = require("./Publisher");

// Initialize the Publisher
const topicName = "tutorial/topic"; // Adjust your topic name as necessary
const publisher = new Publisher(topicName);

// Connect to Solace
publisher.connect();

// Route to handle POST requests from React frontend
app.post("/send-question", (req, res) => {
  const question = req.body.question;

  // Logic to send the question to Solace and receive a response will go here
  // For now, we'll simulate sending the question and directly return a mock response
  publisher.request(
    question,
    (response) => {
      // Assuming response is the reply you got from Solace
      res.json({ reply: response });
    },
    (error) => {
      res.status(500).json({ error: "Error communicating with Solace" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
