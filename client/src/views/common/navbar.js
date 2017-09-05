import React from 'react';

export default class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">MegaminerAI</a>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav navbar-left">
                            <li><a href="/dashboard">Dashboard</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="/logout">Log Out</a></li>
                            <li><a className="login-button" href="/dashboard">Dashboard</a></li>
                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
            </nav>
        )
    }
}