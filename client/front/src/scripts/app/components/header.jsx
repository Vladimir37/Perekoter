import * as React from 'react';
import {Navbar, Nav, NavItem, Modal, FormControl, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.sendLogin = this.sendLogin.bind(this);

        this.state = {
            showModal: false,
            error: null,
            login: '',
            password: ''
        };
    }

    openLoginModal() {
        this.setState({
            showModal: true
        });
    }

    closeLoginModal() {
        this.setState({
            showModal: false
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
                error: 'Не все поля заполнены'
            });
            return false;
        } else {
            this.setState({
                error: null
            });
        }

        Axios.post("/api/auth/login", this.state)
            .then((resolve) => {
                resolve = resolve.data;
                if (resolve.data == 0) {
                    window.location.pathname = "/cabinet";
                } else {
                    this.setState({
                        error: "Неверные данные пользователя"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера"
                });
            });
    }

    render() {
        var error;
        if (this.state.error) {
            error = <Alert bsStyle="danger">{this.state.error}</Alert>;
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
                            <NavItem href="/issue">Предложить тред</NavItem>
                        </Nav>
                        <Nav pullRight>
                            <NavItem href="#" onClick={this.openLoginModal}>Вход</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Modal show={this.state.showModal} onHide={this.closeLoginModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Вход</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error}
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
            </header>
        );
    }
}
