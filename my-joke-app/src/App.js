
import { useState, useEffect } from "react";

import './App.css';




const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
  },
  form: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    margin: "5px",
    width: "80%",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  voteButton: {
    fontSize: "24px",
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
  },
  h3: {
    color: "#28a745"
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
};





function App() {

  const [joke, setJoke] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState(""); 


  const fetchJoke = () => {
    fetch("http://localhost:5000/")
    .then((res) => {
      if (!res.ok) {
        if (res.status === 404) {
          return null; 
        }
        throw new Error("Failed to fetch joke");
      }
      return res.json();
    })
    .then((data) => setJoke(data))
    .catch((err) => {
      console.error("Error fetching joke:", err);
      setJoke(null); 
    });
  };

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const res = await fetch("http://localhost:5000/");
        if (!res.ok) {
          if (res.status === 404) {
            setJoke(null); 
            return;
          }
          throw new Error("Failed to fetch joke");
        }
        const data = await res.json();
        setJoke(data);
      } catch (err) {
        console.error("Error fetching joke:", err);
      }
    };

    fetchJoke();
  }, []);


  const submitJoke = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/jokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message); 
        setQuestion(""); 
        setAnswer("")})
      .catch((err) => console.error("Error adding joke:", err));
  };


  const handleVote = (reaction) => {

    console.log(reaction)

    fetch("http://localhost:5000/jokes/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jokeId: joke._id, reactionLabel: reaction }),
    })
      .then((res) => res.json())
      .then((data) => {
        setJoke((prevJoke) => ({
          ...prevJoke,
          votes: prevJoke.votes.map((vote) =>
            vote.label === reaction
              ? { ...vote, value: vote.value + 1 }
              : vote
          ),
        }));
      })
      .catch((err) => console.error("Error voting:", err));
  };



  return (
    <div className="App">
          
            {joke ? (
              <div>
                <h2>{joke.question}</h2>
                <p>{joke.answer}</p>
                <ul>
                {joke.votes.map((vote, index) => (
                  <li key={index}>
                    {vote.label}: {vote.value}
                  </li>
                ))}
              </ul>
              <div>
            {joke.availableVotes.map((reaction) => (
              <button
                key={reaction}
                onClick={() => handleVote(reaction)}
                style={styles.voteButton}
              >
                {reaction}
              </button>
            ))}
          </div>
              </div>
              
            ) : (
              <p>No available jokes yet@ Please add a new one!</p>
            )}

         
        <button style={styles.button} onClick={fetchJoke}>
        Get New Joke
      </button>

      <form onSubmit={submitJoke} style={styles.form}>
        <h3 style={styles.h3}> Submit your own jokes down below! </h3>
        <input
          type="text"
          placeholder="Enter joke question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Enter joke answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={styles.input}
          required
        />
        
      <br></br>
        <button type="submit" style={styles.button}>Submit Joke</button>
      </form>


      {message && <p style={styles.successMessage}>{message}</p>}
    </div>
  );
}

export default App;
