import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Progress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('logged_user'));
    axios.get('http://127.0.0.1:8000/api/getprogress/' + user.id, { headers: { 
        'Accept': 'application/json',
        Authorization: "Bearer " + localStorage.getItem('auth_token')
      } })
      .then(res => {
        setProgress(res.data.progress);
        // localStorage.setItem('logged_user', JSON.stringify(res.data.user));
        // localStorage.setItem('auth_token', res.data.token);
        // navigate("/");
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
    });
  }, []);

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h1><b>Progress Page</b></h1>
          <table>
            <thead>
              <th>Level</th>
              <th>Assignment</th>
              <th>Words Per Minute</th>
              <th>Accuracy</th>
              <th>Date</th>
            </thead>
            <tbody>
            {progress.map((prog, i) => (
              <tr key={i}>
                <td>{prog.level_number}</td>
                <td>{prog.assignment_number}</td>
                <td>{prog.words_per_minute}</td>
                <td>{prog.accuracy}</td>
                <td>{prog.date_done}</td>
              </tr>
            ))}
            </tbody>
          </table>

          <div><Link to="/">Back</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Progress;