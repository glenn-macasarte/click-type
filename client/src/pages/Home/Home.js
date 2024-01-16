import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('logged_user'));

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
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h1><b>Home Page</b></h1>
          <span>Welcome {user.first_name} {user.last_name}</span>
          <div><Link to="/type">Start Here</Link></div>
          <div><Link to="/progress">Progress</Link></div>
          <div><button onClick={logout}>Logout</button></div>
        </div>
      </div>
    </div>
  )
}

export default Home;