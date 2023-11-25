import { useState, useEffect, useRef } from "react";
import { generate } from "random-words";
// import { Link, useNavigate } from 'react-router-dom';

const NUMB_OF_WORDS = 200;
const SECONDS = 60;

function Login() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => generate());
  }

  function login() {
    console.log('ahaha')
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <form>
            <input type="text" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button className="button is-info is-fullwidth" onClick={login}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;