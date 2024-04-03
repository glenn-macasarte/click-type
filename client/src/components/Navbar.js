import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('logged_user'));

    useEffect(() => {
      document.querySelectorAll("#nav li").forEach(function(navEl) {
        navEl.onclick = function() { toggleTab(this.id, this.dataset.target); }
      });

      var burger = document.querySelector('.burger');
      var menu = document.querySelector('#' + burger.dataset.target);
      burger.addEventListener('click', function() {
          burger.classList.toggle('is-active');
          menu.classList.toggle('is-active');
      });
    }, []);

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
      <nav className="navbar is-info">
        <div className="navbar-brand">
          <a className="navbar-item" href="/type">
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
            {/* <a className="navbar-item" href="/">Home</a> */}
            <a className="navbar-item" href="/type">Typing Test</a>
            <a className="navbar-item" href="/progress">Progress</a>
            {/* <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link" href="/documentation/overview/start/">Links</a>
              <div className="navbar-dropdown is-boxed">
                <a className="navbar-item" href="admin.html">Admin</a>
                <a className="navbar-item" href="forum.html">Forum</a>
                <a className="navbar-item" href="cover.html">Cover</a>
                <a className="navbar-item" href="cards.html">Cards</a>
                <a className="navbar-item" href="blog.html">Blog</a>
                <hr className="navbar-divider" />
                <a className="navbar-item" href="search.html">Search</a>
                <a className="navbar-item is-active" href="kanban.html">Kanban</a>
              </div>
            </div> */}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link" href="#">{user.first_name} {user.last_name}</a>
                <div className="navbar-dropdown is-boxed">
                  <a className="navbar-item" href="#" onClick={logout}>Logout</a>
                </div>
              </div>
              {/* <div className="field is-grouped">
                <p className="control">
                  <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="#" target="_blank" href="https://twitter.com/intent/tweet?text=get free bulma templates:;url=https://github.com/BulmaTemplates/bulma-templates">
                    <span className="icon">
                      <i className="fab fa-twitter"></i>
                    </span>
                    <span>Tweet</span>
                  </a>
                </p>
                <p className="control">
                  <a className="button is-primary" href="https://github.com/BulmaTemplates/bulma-templates">
                    <span className="icon">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Download</span>
                  </a>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;