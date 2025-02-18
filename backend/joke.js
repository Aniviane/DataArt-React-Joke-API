const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema({
  
  question: String,
  answer: String,
  votes: [{ value: Number, label: String }],
  availableVotes: [String],
});

const Joke = mongoose.model("Joke", jokeSchema);

module.exports = Joke;