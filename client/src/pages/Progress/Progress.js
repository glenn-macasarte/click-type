import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Progress() {
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('logged_user'));

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/progress/', { headers: { 
        'Accept': 'application/json',
        Authorization: "Bearer " + localStorage.getItem('auth_token')
      } })
      .then(res => {
        setProgress(res.data.progress);
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          alert(error.response.data.message);
        }
    });
  }, []);

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

  function getProgressClass(level) {
    if (level === 1) {
      return 'is-success';
    } else if (level === 2) {
      return 'is-warning';
    } else if (level === 3) {
      return 'is-danger';
    }
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
                <a className="navbar-link" href="#">{user.first_name} {user.last_name}</a>
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
            <h1 className="title">Check and monitor your progress on your Typing journey.</h1>
            {/* <h2 className="subtitle">Intro and Description</h2> */}
          </div>
        </div>

        <div className="tab-content">
            <div className="tab-pane is-active" id="pane-2">
              <div className="container">
                <div className="content">
                <table className="table">
                  <thead>
                    <tr>
                      <th><abbr title="Level">LEVEL</abbr></th>
                      <th><abbr title="Assignment">ASSIGNMENT</abbr></th>
                      <th><abbr title="Words Per Minute">WORDS PER MINUTE</abbr></th>
                      <th><abbr title="Accuracy">ACCURACY</abbr></th>
                      <th><abbr title="Efficiency">EFFICIENCY</abbr></th>
                      <th><abbr title="Date">DATE</abbr></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(progress)?.map((prog, i) => (
                      <tr key={i}>
                        <th>{progress[prog]['level_label']}</th>
                        <td>
                        {progress[prog]['assignment']}. {progress[prog]['assignment_label']}
                          <progress className={"progress is-large " + getProgressClass(progress[prog]['level'])} value={progress[prog]['accuracy']} max="100">90%</progress>
                        </td>
                        <td>{progress[prog]['words_per_minute']} WPM</td>
                        <td>{progress[prog]['accuracy']} %</td>
                        <td>
                          {(() => {
                            let span = [];
                            for (let i = 1; i <= progress[prog]['efficiency']; i++) {
                              span.push(<span key={i}><i className='fas fa-star'></i></span>);
                            }
                            return span;
                          })()}
                        </td>
                        <td>{progress[prog]['date']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Progress;