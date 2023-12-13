import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function login(e) {
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    }

    axios.post('http://127.0.0.1:8000/api/login', data, { headers: { 'Accept': 'application/json' } })
      .then(res => {
        localStorage.setItem('logged_user', JSON.stringify(res.data.user));
        localStorage.setItem('auth_token', res.data.token);
        navigate("/");
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
      });
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <form onSubmit={login}>
            <input type="text" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button className="button is-info is-fullwidth">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;