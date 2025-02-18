require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Joke = require("./joke");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors()); 

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/jokesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

    
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
    }



app.get("/", async (req, res) => {
  try {
    const randomJoke = await Joke.aggregate([
      { $sample: { size: 1 } }, 
    ]);

    if (randomJoke.length === 0) {
      return res.status(404).json({ message: "No jokes available" });
    }

    res.json(randomJoke[0]);
  } catch (err) {
    console.error("Error fetching random joke:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




  app.post("/jokes", async (req, res) => {
    const { question, answer } = req.body;
    
    const newJoke = new Joke({
      question,
      answer,
      votes: [
        { value: 0, label: "😂" },
        { value: 0, label: "👍" },
        { value: 0, label: "❤️" },
      ],
      availableVotes: ["😂", "👍", "❤️"],
    });
  
    await newJoke.save();

    res.json({ message: "Joke added successfully" });
  });



  app.post("/jokes/vote", async (req, res) => {
    const { jokeId, reactionLabel } = req.body;
  

    const joke = await Joke.findById(jokeId);
    if (!joke) return res.status(404).json({ message: "Joke not found" });

  
    const reaction = joke.votes.find((vote) => vote.label === reactionLabel);
    if (!reaction) return res.status(400).json({ message: "Invalid reaction" });
  
    

    reaction.value += 1;

    await joke.save();
  
    res.json({ message: "Vote recorded successfully" });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
