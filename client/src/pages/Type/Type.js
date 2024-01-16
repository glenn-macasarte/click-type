import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import * as myConstants from "../../constants";

const NUMB_OF_WORDS = 100;
const SECONDS = 10;

function Type() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [level, setLevel] = useState("0");
  const [assignment, setAssignment] = useState("0");
  const textInput = useRef(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setWords(generateWords());
  // }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => generate());
  }

  function start($e) {
    const level_assignment = $e.target.value.split("_");
    setLevel(level_assignment[0]);
    setAssignment(level_assignment[1]);

    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      if (level_assignment[0] === "1") {
        const min = 1;
        const max = 5;
        var level_one = myConstants.level_one;

        let result = [];
        for (let i = 0; i < NUMB_OF_WORDS; i++) {
          let random_word_length = Math.floor(Math.random() * (max - min + 1) + min);
          const characters = level_one[level_assignment[1] - 1];
          let counter = 0;
          while (counter < random_word_length) {
            if (result[i] === undefined) {
              result[i] = '';
            }
            result[i] += characters[Math.floor(Math.random() * ((characters.length - 1) - 0 + 1) + 0)];
            counter += 1;
          }
        }
        setWords(result);
      } else if (level_assignment[0] === "2") {
        var level_two = myConstants.level_two[level_assignment[1] - 1];
        let currentIndex = level_two.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [level_two[currentIndex], level_two[randomIndex]] = [
            level_two[randomIndex], level_two[currentIndex]];
        }
        setWords(level_two);
      } else {
        setWords(generateWords());
      }

      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
              clearInterval(interval);
              setStatus("finished");
              setCurrInput("");
              return SECONDS;
          } else {
              return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({keyCode, key}) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== "finished") {
      if (char === currChar) {
        return 'has-background-success';
      } else {
        return 'has-background-danger';
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex.length]) {
      return 'has-background-danger';
    } else {
      return "";
    }
  }

  function save() {
    const user = JSON.parse(localStorage.logged_user);
    const date = new Date();

    // format date
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    const full_date = year + "-" + addZero(month) + "-" + addZero(day) + " " + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);

    const data = {
      user_id: user.id,
      level_number: level,
      assignment_number: assignment,
      words_per_minute: correct,
      accuracy: Math.round((correct / (correct + incorrect)) * 100),
      is_done: 1,
      date_done: full_date,
    }

    axios.post('http://127.0.0.1:8000/api/save', data, { headers: { 
        'Accept': 'application/json', 
        Authorization: "Bearer " + localStorage.getItem('auth_token') 
      } })
      .then(res => {
        navigate("/progress");
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
      });
  }

  function addZero(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>Select Difficulty</h2>
          <h3>Novice</h3>
          <button className="button is-info is-fullwidth" onClick={start} value="1_1">Level 1</button>
          <button className="button is-info is-fullwidth" onClick={start} value="1_2">Level 2</button>
          <button className="button is-info is-fullwidth" onClick={start} value="1_3">Level 3</button>
          <button className="button is-info is-fullwidth" onClick={start} value="1_4">Level 4</button>
          <button className="button is-info is-fullwidth" onClick={start} value="1_5">Level 5</button>

          <h3>Intermediate</h3>
          <button className="button is-info is-fullwidth" onClick={start} value="2_1">Level 1</button>
          <button className="button is-info is-fullwidth" onClick={start} value="2_2">Level 2</button>
          <button className="button is-info is-fullwidth" onClick={start} value="2_3">Level 3</button>
          <button className="button is-info is-fullwidth" onClick={start} value="2_4">Level 4</button>
          <button className="button is-info is-fullwidth" onClick={start} value="2_5">Level 5</button>

          <h3>Advance</h3>
          <button className="button is-info is-fullwidth" onClick={start} value="3_1">Level 1</button>
          <button className="button is-info is-fullwidth" onClick={start} value="3_2">Level 2</button>
          <button className="button is-info is-fullwidth" onClick={start} value="3_3">Level 3</button>
          <button className="button is-info is-fullwidth" onClick={start} value="3_4">Level 4</button>
          <button className="button is-info is-fullwidth" onClick={start} value="3_5">Level 5</button>
        </div>
      </div>

      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className="input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} />
      </div>

      {/* <div className="section">
        <button className="button is-info is-fullwidth" onClick={start}>
          Start
        </button>
      </div> */}

      {status === "started" && (
        <div className="section">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">
                {correct}
              </p>
            </div>
            <div className="column has-text-centered">
              <div className="is-size-5">Accuracy: </div>
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)} %
                </p>
            </div>
          </div>
          <button className="button is-info is-fullwidth" onClick={save}>
            Save Record
          </button>
        </div>
      )}

      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <Link to="/">Back</Link>
        </div>
      </div>
    </div>
    
  )
}

export default Type;