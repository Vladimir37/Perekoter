import * as React from 'react';
import {Navbar, Nav, NavItem, Modal, FormControl, Button, Alert, Badge} from 'react-bootstrap';
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
        this.sendLogout = this.sendLogout.bind(this);
        this.sendIssue = this.sendIssue.bind(this);
        this.generateMenuItems = this.generateMenuItems.bind(this);
        this.goToLink = this.goToLink.bind(this);

        this.state = {
            showModalLogin: false,
            showModalIssue: false,
            errorLogin: null,
            errorIssue: null,
            errorAuth: null,
            issueSended: false,
            logged: false,
            loggedCheck: false,
            errorsNum: 0,
            issuesNum: 0,
            passcodeActivity: 0,
            login: '',
            password: '',
            title: '',
            link: '',
            comment: ''
        };
    }

    goToLink(e) {
        window.location.pathname = e.target.getAttribute('href');
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
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    window.location.pathname = "/control";
                } else {
                    this.setState({
                        errorLogin: "Неверные данные пользователя"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorLogin: "Ошибка сервера"
                });
            });
    }

    sendLogout() {
        Axios.post("/api/auth/logout")
            .then((response) => {
                response = response.data;
                this.setState({
                    logged: false
                });
            })
            .catch((err) => {
                this.setState({
                    errorAuth: "Ошибка сервера"
                });
            });
    }

    sendIssue() {
        if (!this.state.title) {
            this.setState({
                errorIssue: 'Не все поля заполнены'
            });
            return false;
        } else {
            this.setState({
                errorIssue: null
            });
        }

        Axios.post("/api/issues/send_issue", this.state)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        issueSended: true
                    });
                } else {
                    this.setState({
                        errorIssue: "Неверные данные пользователя"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorIssue: "Ошибка сервера"
                });
            });
    }

    generateLoginModal() {
        var errorLogin;

        if (this.state.errorLogin) {
            errorLogin = <Alert bsStyle="danger">{this.state.errorLogin}</Alert>;
        }

        return <Modal show={this.state.showModalLogin} onHide={this.closeLoginModal}>
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
            </Modal>;
    }

    generateIssueModal() {
        var errorIssue;
        var modalBody;
        var modalFooter;
        
        if (this.state.errorIssue) {
            errorIssue = <Alert bsStyle="danger">{this.state.errorIssue}</Alert>;
        }

        if (this.state.issueSended) {
            modalBody = <span className="header-issue-success">
                Предложение успешно отправлено! Оно будет рассмотрено в ближайшее время.
            </span>;
            modalFooter = '';
        } else {
            modalBody = <section>
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
            </section>;
            modalFooter = <section>
                <Button bsStyle="success" onClick={this.sendIssue}>Отправить</Button>
                <Button bsStyle="primary" onClick={this.closeIssueModal}>Закрыть</Button>
            </section>;
        }

        return <Modal show={this.state.showModalIssue} onHide={this.closeIssueModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Предложить тред</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorIssue}
                    {modalBody}
                </Modal.Body>
                <Modal.Footer>
                    {modalFooter}
                </Modal.Footer>
            </Modal>;
    }

    generateMenuItems() {
        if (!this.state.logged) {
            return <Nav pullRight>
                <NavItem href="#" onClick={this.openLoginModal}>Вход</NavItem>
            </Nav>;
        } else {
            return <Nav pullRight>
                <NavItem onClick={this.goToLink} href="/settings">Пасскод  <Badge>{this.state.passcodeActivity ? "✓" : "✗"}</Badge></NavItem>
                <NavItem onClick={this.goToLink} href="/issues">Предложения  <Badge>{this.state.issuesNum}</Badge></NavItem>
                <NavItem onClick={this.goToLink} href="/errors">Ошибки  <Badge>{this.state.errorsNum}</Badge></NavItem>
                <NavItem onClick={this.goToLink} href="/control">Управление</NavItem>
                <NavItem onClick={this.sendLogout} href="#">Выход</NavItem>
            </Nav>;
        }
    }

    checkUser() {
        Axios.get("/api/auth/check")
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        logged: true,
                        loggedCheck: true
                    });
                    this.checkAdminData();
                } else {
                    this.setState({
                        errorAuth: "Ошибка сервера",
                        loggedCheck: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorAuth: "Ошибка сервера",
                    loggedCheck: true
                });
            });
    }

    checkAdminData() {
        Axios.get("/api/auth/admin")
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorsNum: response.body.Errors,
                        issuesNum: response.body.Issues,
                        passcodeActivity: Boolean(response.body.Passcode)
                    });
                } else {
                    this.setState({
                        errorAuth: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorAuth: "Ошибка сервера"
                });
            });
    }

    render() {
        if (!this.state.loggedCheck) {
            this.checkUser();
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
                        {this.generateMenuItems()}
                    </Navbar.Collapse>
                </Navbar>
                {this.generateLoginModal()}
                {this.generateIssueModal()}
            </header>
        );
    }
}
