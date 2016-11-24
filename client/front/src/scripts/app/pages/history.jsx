import * as React from 'react';
import {Button, Table, Alert} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class History extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [],
            totalLength: 0,
            currentLength: 10,
            historyLoaded: false,
            error: false,
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadHistory = this.loadHistory.bind(this);
        this.morePoints = this.morePoints.bind(this);
        this.generatePage = this.generatePage.bind(this);
    }

    loadHistory() {
        Axios.get('/api/history/get_all_history')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    response.body = response.body.reverse();
                    this.setState({
                        history: response.body,
                        totalLength: response.body.length,
                        historyLoaded: true
                    });
                } else {
                    this.setState({
                        error: "Ошибка сервера",
                        historyLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера",
                        historyLoaded: true
                });
            });
    }

    loadPage() {
        checkUser().then((response) => {
            var logged = false;
            if (response) {
                logged = true;
            }

            this.setState({
                loaded: true,
                logged
            });
        }).catch((page) => {
            this.setState({
                loaded: true
            });
        });
    }

    morePoints() {
        this.setState({
            currentLength: this.state.currentLength + 10
        });
    }

    generatePage() {
        var errorPanel;
        var moreButton;
        if (this.state.error) {
            errorPanel = <Alert bsStyle="danger">{this.state.error}</Alert>;
        }

        if (this.state.currentLength < this.state.totalLength) {
            moreButton = <Button bsStyle="primary" onClick={this.morePoints}>Загрузить ещё</Button>;
        }

        if (!this.state.historyLoaded) {
            this.loadHistory();
        }

        var points = this.state.history.slice(0, this.state.currentLength).map((point) => {
            var date = new Date(point.CreatedAt);
            date = (date.getHours()) + ':' + (date.getMinutes()) + ' ' + (date.getDate()) + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear());
            return <tr key={point.ID}>
                <td>{point.ID}</td>
                <td>{point.Text}</td>
                <td>{date}</td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Текст</th>
                    <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                    {points}
                </tbody>
            </Table>
            {moreButton}
        </main>;
    }
    
    render() {
        var page;

        if (!this.state.loaded) {
            this.loadPage();
        } else if (!this.state.logged) {
            page = forbiddenGenerator();
        } else {
            page = this.generatePage();
        }
        
        return (
            <div>
                <Header/>
                {page}
                <Footer/>
            </div>
        );
    }
}
