import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import * as myConstants from "../../constants";

const NUMB_OF_WORDS = 100;
const SECONDS = 60;

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
  const user = JSON.parse(localStorage.getItem('logged_user'));

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

  const logout = () => {
    axios.post('http://127.0.0.1:8000/api/logout', {}, { 
      headers: {
        Authorization: "Bearer " + localStorage.getItem('auth_token')
      } })
      .then(res => {
        localStorage.clear();
        navigate("/login");
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
      });
  }

  return (
    <div className="App">
      <nav className="navbar is-info">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
          </a>
          <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-start is-link">
            <a className="navbar-item" href="/">Home</a>
            <a className="navbar-item" href="/type">Typing Test</a>
            <a className="navbar-item" href="/progress">Progress</a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" href="/documentation/overview/start/">{user.first_name} {user.last_name}</a>
                <div className="navbar-dropdown is-boxed">
                  <a className="navbar-item" href="#" onClick={logout}>Logout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Learn how to type. From the basics to more advanced lessons</h1>
            <h2 className="subtitle">Select level of difficulty on the tabs below.</h2>
          </div>
        </div>

        <div className="tabs is-boxed is-centered main-menu is-active" id="nav">
          <ul>
            <li data-target="pane-1" id="1" className="">
              <a>
                <span className="icon is-small"><i className="fas fa-baby-carriage"></i></span>
                <span>Beginner</span>
              </a>
            </li>
            <li data-target="pane-2" id="2">
              <a>
                <span className="icon is-small"><i className="fas fa-bicycle"></i></span>
                <span>Intermediate</span>
              </a>
            </li>
            <li data-target="pane-3" id="3">
              <a>
                <span className="icon is-small"><i className="fas fa-motorcycle"></i></span>
                <span>Advanced</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          <div className="container tab-pane buttons are-large" id="pane-1">
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
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_1">Level 3 - Assignment 1</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_2">Level 3 - Assignment 2</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_3">Level 3 - Assignment 3</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_4">Level 3 - Assignment 4</button>
            <button className="button is-info is-fullwidth is-light" onClick={start} value="3_5">Level 3 - Assignment 5</button>
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
        </div>
      )}

      {status === "finished" && (
        <div className="container">
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
                    {isNaN(Math.round((correct / (correct + incorrect)) * 100)) ? 0 : Math.round((correct / (correct + incorrect)) * 100) } %
                  </p>
              </div>
            </div>
            <button className="button is-primary is-large is-fullwidth" onClick={save}>Save Record</button>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default Type;