import * as React from 'react';
import {ButtonGroup, Button, Table, Alert} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Errors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: 0,
            allErrors: [],
            errorsLoaded: false,
            error: null,
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadErrors = this.loadErrors.bind(this);
        this.closeError = this.closeError.bind(this);
        this.closeAllErrors = this.closeAllErrors.bind(this);
        this.generatePage = this.generatePage.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.checkCategory = this.checkCategory.bind(this);
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

    closeError(num) {
        return () => {
            Axios.post('/api/errors/close_error', {
                num
            }).then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.loadErrors();
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

    closeAllErrors() {
        Axios.post('/api/errors/close_all_errors')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.loadErrors();
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

    loadErrors() {
        Axios.get('/api/errors/get_all_errors')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    response.body = response.body.reverse();
                    this.setState({
                        allErrors: response.body,
                        errorsLoaded: true
                    });
                } else {
                    this.setState({
                        error: "Ошибка сервера",
                        errorsLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера",
                        errorsLoaded: true
                });
            });
    }

    generatePage() {
        var errorPanel;
        if (this.state.error) {
            errorPanel = <Alert bsStyle="danger">{this.state.error}</Alert>;
        }

        if (!this.state.errorsLoaded) {
            this.loadErrors();
        }

        var errors;

        if (this.state.category == 0) {
            errors = this.state.allErrors.filter(function (error) {
                return error.Active;
            });
        } else if (this.state.category == 1) {
            errors = this.state.allErrors.filter(function (error) {
                return !error.Active;
            });
        } else {
            errors = this.state.allErrors;
        }

        errors = errors.map((error) => {
            var date = new Date(error.CreatedAt);
            date = (date.getHours()) + ':' + (date.getMinutes()) + ' ' + (date.getDate()) + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear());
            let activity_pic = error.Active ? "✗" : "✓";
            let close_button = error.Active ? <Button bsStyle="primary" bsSize="xsmall" onClick={this.closeError(error.ID)}>Просмотрено</Button> : '';
            return <tr key={error.ID}>
                <td>{error.ID}</td>
                <td>{error.Text}</td>
                <td>{date}</td>
                <td>{activity_pic}</td>
                <td>{close_button}</td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <Button bsStyle="primary" className="error-closeAll" onClick={this.closeAllErrors}>Отметить все ошибки просмотренными</Button>
            <br/>
            <ButtonGroup justified>
                <Button href="#" active={this.checkCategory(0)} onClick={this.changeCategory(0)}>Новые</Button>
                <Button href="#" active={this.checkCategory(1)} onClick={this.changeCategory(1)}>Просмотренные</Button>
                <Button href="#" active={this.checkCategory(2)} onClick={this.changeCategory(2)}>Все</Button>
            </ButtonGroup>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Текст</th>
                    <th>Дата создания</th>
                    <th>Просмотрено</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {errors}
                </tbody>
            </Table>
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
