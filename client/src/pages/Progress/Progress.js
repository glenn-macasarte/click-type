import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../../components/Navbar';

function Progress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    axios.get('https://clicktype.co/public/api/progress/', { headers: { 
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
      <Navbar />

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