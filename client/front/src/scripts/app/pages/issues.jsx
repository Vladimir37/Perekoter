import * as React from 'react';
import {ButtonGroup, Button, Table, Alert, Modal} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Issues extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: 0,
            allIssues: [],
            issuesLoaded: false,
            showModal: false,
            currentIssue: {},
            currentData: new Date(),
            error: null,
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.generatePage = this.generatePage.bind(this);
        this.loadIssues = this.loadIssues.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeIssue = this.closeIssue.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.checkCategory = this.checkCategory.bind(this);
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

    changeCategory(category) {
        return () => {
            this.setState({
                category
            });
        }
    }

    checkCategory(category) {
        return this.state.category == category;
    }

    loadIssues() {
        Axios.get('/api/issues/get_all_issues')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    response.body = response.body.reverse();
                    this.setState({
                        allIssues: response.body,
                        issuesLoaded: true
                    });
                } else {
                    this.setState({
                        error: "Ошибка сервера",
                        issuesLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера",
                    issuesLoaded: true
                });
            });
    }

    openModal(issue, date) {
        return () => {
            this.setState({
                showModal: true,
                currentIssue: issue,
                currentDate: date
            });
        }
    }

    closeModal() {
        this.setState({
            showModal: false
        });
    }

    closeIssue(num) {
        return () => {
            Axios.post('/api/issues/close_issue', {
                num
            }).then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.closeModal();
                    this.loadIssues();
                } else {
                    this.setState({
                        error: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера"
                });
            });
        }
    }

    generatePage() {
        var errorPanel;
        if (this.state.error) {
            errorPanel = <Alert bsStyle="danger">{this.state.error}</Alert>;
        }

        if (!this.state.issuesLoaded) {
            this.loadIssues();
        }

        var issues;

        if (this.state.category == 0) {
            issues = this.state.allIssues.filter(function (error) {
                return error.Active;
            });
        } else if (this.state.category == 1) {
            issues = this.state.allIssues.filter(function (error) {
                return !error.Active;
            });
        } else {
            issues = this.state.allIssues;
        }

        issues = issues.map((issue) => {
            var date = new Date(issue.CreatedAt);
            date = (date.getHours()) + ':' + (date.getMinutes()) + ' ' + (date.getDate()) + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear());
            let activity_pic = issue.Active ? "✗" : "✓";
            let close_button = issue.Active ? <Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal(issue, date)}>Просмотреть</Button> : '';
            return <tr key={issue.ID}>
                <td>{issue.ID}</td>
                <td>{issue.Title}</td>
                <td>{date}</td>
                <td>{activity_pic}</td>
                <td>{close_button}</td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <ButtonGroup justified>
                <Button href="#" active={this.checkCategory(0)} onClick={this.changeCategory(0)}>Новые</Button>
                <Button href="#" active={this.checkCategory(1)} onClick={this.changeCategory(1)}>Просмотренные</Button>
                <Button href="#" active={this.checkCategory(2)} onClick={this.changeCategory(2)}>Все</Button>
            </ButtonGroup>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Название</th>
                    <th>Дата отправки</th>
                    <th>Просмотрено</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {issues}
                </tbody>
            </Table>
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Предложение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>{this.state.currentIssue.Title}</h2>
                    <div className="modal-date">{this.state.currentDate}</div>
                    <p>{this.state.currentIssue.Text}</p>
                    <a href={this.state.currentIssue.Link} target="_blank">{this.state.currentIssue.Link}</a>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.closeIssue(this.state.currentIssue.ID)}>Просмотрено</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
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
