import * as React from 'react';

export class Header extends React.Component {
    render() {
        return (
            <header>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Perekoter</a>
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li><a href="/issue">Предложить тред</a></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#">Вход</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
