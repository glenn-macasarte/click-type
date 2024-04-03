// import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

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
        navigate("/type");
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
      });
  }

  return (
    <div className="App">
      <section className="hero is-success is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-black">ClickType</h3>
              <hr className="login-hr" />
              <p className="subtitle has-text-black">Please login to proceed.</p>
              <div className="box">
                <form onSubmit={login}>
                  <div className="field">
                    <div className="control">
                      <input className="input is-large" type="email" name="email" placeholder="Email" autoFocus="" required />
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <input className="input is-large" type="password" name="password" placeholder="Password" required />
                    </div>
                  </div>

                  <div className="field"></div>
                  <button className="button is-block is-info is-large is-fullwidth">Login <i className="fa fa-sign-in" aria-hidden="true"></i></button>
                </form>
              </div>
              <p className="has-text-grey">
                {/* <a href="../">Sign Up</a> &nbsp;·&nbsp; */}
                <a href="../">Forgot Password</a>
                {/* <a href="../">Need Help?</a> */}
              </p>
            </div>
          </div>
        </div>
    </section>
    </div>
  )
}

export default Login;