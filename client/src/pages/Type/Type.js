import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as myConstants from "../../constants";
import './Type.css';
import Navbar from '../../components/Navbar';

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

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }

    document.querySelectorAll("#nav li").forEach(function(navEl) {
      navEl.onclick = function() { toggleTab(this.id, this.dataset.target); }
    });

    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#' + burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
  }, [status]);

  function toggleTab(selectedNav, targetId) {
    var navEls = document.querySelectorAll("#nav li");
  
    navEls.forEach(function(navEl) {
      if (navEl.id == selectedNav) {
        navEl.classList.add("is-active");
      } else {
        if (navEl.classList.contains("is-active")) {
          navEl.classList.remove("is-active");
        }
      }
    });
  
    var tabs = document.querySelectorAll(".tab-pane");
  
    tabs.forEach(function(tab) {
      if (tab.id == targetId) {
        tab.style.display = "block";
      } else {
        tab.style.display = "none";
      }
    });
  }

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
        const min = 2;
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
        if (level_assignment[1] === "1" || level_assignment[1] === "2") {
          const min = 2;
          const max = 5;
          var level_three = myConstants.level_three;

          let result = [];
          for (let i = 0; i < NUMB_OF_WORDS; i++) {
            let random_word_length = Math.floor(Math.random() * (max - min + 1) + min);
            const characters = level_three[level_assignment[1] - 1];
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
        } else {
          setWords(generateWords());
        }
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
      if (currCharIndex >= 0) {
        setCurrCharIndex(currCharIndex - 1);
      }
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

  function getWordClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && status !== "finished") {
      return 'word-underline';
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

  const getDiff = () => {
    var level_label = ['Beginner', 'Intermediate', 'Advanced'];
    var assignment_label = [
      ['J, F, and Spaces', 'U, R, and K Keys', 'D, E, and I Keys', 'C, G, and N Keys', 'Beginner Review'],
      ['A Words', 'S Words', 'L Words', 'B Words', 'W Words'],
      ['10 Key Functions (Numbers Only)', '10 Key Functions (Numbers and Symbols)', 'All Random Words']
    ]
    return level_label[level - 1] + ": " + assignment_label[level - 1][assignment - 1];
  }

  return (
    <div className="App">
      <Navbar />

      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Learn how to type. From the basics to more advanced lessons</h1>
            <h2 className="subtitle">Select level of difficulty on the tabs below.</h2>
          </div>
        </div>

        <div className="tabs is-boxed is-centered main-menu is-active" id="nav">
          <ul>
            <li data-target="pane-1" id="1" className="is-active">
              <a>
                <span className="icon is-small"><i className="fas fa-baby-carriage"></i></span>
                <span className="font20">Beginner</span>
              </a>
            </li>
            <li data-target="pane-2" id="2">
              <a>
                <span className="icon is-small"><i className="fas fa-bicycle"></i></span>
                <span className="font20">Intermediate</span>
              </a>
            </li>
            <li data-target="pane-3" id="3">
              <a>
                <span className="icon is-small"><i className="fas fa-motorcycle"></i></span>
                <span className="font20">Advanced</span>
              </a>
            </li>
            <li data-target="pane-4" id="4">
              <a>
                <span className="icon is-small"><i className="fas fa-book"></i></span>
                <span className="font20">Digital Literacy</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          <div className="container tab-pane buttons are-large display-block" id="pane-1">
            <button className="button is-info is-fullwidth is-light" onClick={start} value="1_1">J, F, and Spaces</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="1_2">U, R, and K Keys</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="1_3">D, E, and I Keys</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="1_4">C, G, and N Keys</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="1_5">Beginner Review</button>
          </div>

          <div className="container tab-pane buttons are-large" id="pane-2">
            <button className="button is-info is-fullwidth is-light" onClick={start} value="2_1">A Words</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="2_2">S Words</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="2_3">L Words</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="2_4">B Words</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="2_5">W Words</button>
          </div>

          <div className="container tab-pane buttons are-large" id="pane-3">
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_1">10 Key Functions (Numbers Only)</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_2">10 Key Functions (Numbers and Symbols)</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_3">All Random Words</button>
            {/* <button className="button is-info is-fullwidth is-light" onClick={start} value="3_4">Level 3 - Assignment 4</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_5">Level 3 - Assignment 5</button> */}
          </div>

          <div className="container tab-pane buttons are-large" id="pane-4">
            <div className="container textCenter">
              <iframe width="800" height="470" src="https://www.youtube.com/embed/vXsutlz0GIQ?si=sdhcSbgsQp4WjcfQ" title="YouTube video player" 
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      </section>

      {status === "started" && (
        <div className="container" id="type-form">
          <div className="control is-expanded section">
            <input ref={textInput} disabled={status !== "started"} type="text" className="input is-large is-rounded" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} />
          </div>

          <div className="section">
            <div className="is-size-1 has-text-centered has-text-danger">
              <h2>{countDown}</h2>
            </div>
          </div>
        </div>
      )}

      {status === "started" && (
        <div className="container">
          <div className="section">
            <div className="card">
              <div className="card-content">
                <div className="content lh-70">
                  {words.map((word, i) => (
                    <span key={i}>
                      <span className={getWordClass(i)}>
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
        </div>
      )}

      {status === "finished" && (
        <div className="container">
          <div className="box">
            <div className="section">
                <div className="columns">
                  <div className="column has-text-centered">
                    <p className="is-size-5">DIFFICULTY</p>
                    <p className="has-text-danger is-size-1">
                      {getDiff()}
                    </p>
                  </div>
                  <div className="column has-text-centered">
                    <p className="is-size-5">WORDS PER MINUTE</p>
                    <p className="has-text-primary is-size-1">
                      {correct} WPM
                    </p>
                  </div>
                  <div className="column has-text-centered">
                    <p className="is-size-5">ACCURACY</p>
                    <p className="has-text-info is-size-1">
                      {isNaN(Math.round((correct / (correct + incorrect)) * 100)) ? 0 : Math.round((correct / (correct + incorrect)) * 100) } %
                    </p>
                  </div>
                </div>
                <button className="button is-primary is-large is-fullwidth" onClick={save}>Save Record</button>
              </div>
          </div><br/>
        </div>
      )}
    </div>
    
  )
}

export default Type;