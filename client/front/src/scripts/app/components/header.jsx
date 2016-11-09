import * as React from 'react';
import {Navbar, Nav, NavItem, Modal, FormControl, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.openIssueModal = this.openIssueModal.bind(this);
        this.closeIssueModal = this.closeIssueModal.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
        this.sendIssue = this.sendIssue.bind(this);

        this.state = {
            showModalLogin: false,
            showModalIssue: false,
            errorLogin: null,
            errorIssue: null,
            login: '',
            password: '',
            title: '',
            link: '',
            comment: ''
        };
    }

    openLoginModal() {
        this.setState({
            showModalLogin: true
        });
    }

    closeLoginModal() {
        this.setState({
            showModalLogin: false
        });
    }

    openIssueModal() {
        this.setState({
            showModalIssue: true
        });
    }

    closeIssueModal() {
        this.setState({
            showModalIssue: false
        });
    }

    changeForm(type) {
        return (e) => {
            this.setState({
                [type]: e.target.value
            });
        }
    }

    sendLogin() {
        if (!this.state.login || !this.state.password) {
            this.setState({
                errorLogin: 'Не все поля заполнены'
            });
            return false;
        } else {
            this.setState({
                errorLogin: null
            });
        }

        Axios.post("/api/auth/login", this.state)
            .then((resolve) => {
                resolve = resolve.data;
                if (resolve.data.status == 0) {
                    window.location.pathname = "/cabinet";
                } else {
                    this.setState({
                        errorLogin: "Неверные данные пользователя"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера"
                });
            });
    }

    sendIssue() {
        //
    }

    render() {
        var errorLogin;
        var errorIssue;
        if (this.state.errorLogin) {
            errorLogin = <Alert bsStyle="danger">{this.state.errorLogin}</Alert>;
        }
        if (this.state.errorIssue) {
            errorIssue = <Alert bsStyle="danger">{this.state.errorIssue}</Alert>;
        }

        return (
            <header>
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">Perekoter</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href="#" onClick={this.openIssueModal}>Предложить тред</NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem href="#" onClick={this.openLoginModal}>Вход</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Modal show={this.state.showModalLogin} onHide={this.closeLoginModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Вход</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {errorLogin}
                        <FormControl
                            type="text"
                            value={this.state.login}
                            placeholder="Login"
                            onChange={this.changeForm("login")}
                        />
                        <br/>
                        <FormControl
                            type="password"
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.changeForm("password")}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.sendLogin}>Войти</Button>
                        <Button bsStyle="primary" onClick={this.closeLoginModal}>Закрыть</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showModalIssue} onHide={this.closeIssueModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Предложить тред</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {errorIssue}
                        <FormControl
                            type="text"
                            value={this.state.title}
                            placeholder="Название треда"
                            onChange={this.changeForm("title")}
                        />
                        <br/>
                        <FormControl
                            type="text"
                            value={this.state.link}
                            placeholder="Ссылка на текущий тред (необязательно)"
                            onChange={this.changeForm("link")}
                        />
                        <br/>
                        <FormControl
                            componentClass="textarea"
                            className="header-textarea"
                            value={this.state.comment}
                            placeholder="Комментарий - источник шапки, важность треда, источник изображений и любая другая информация (необязательно)"
                            onChange={this.changeForm("comment")}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.sendIssue}>Отправить</Button>
                        <Button bsStyle="primary" onClick={this.closeIssueModal}>Закрыть</Button>
                    </Modal.Footer>
                </Modal>
            </header>
        );
    }
}
