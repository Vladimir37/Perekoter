import * as React from 'react';
import {Modal, FormGroup, FormControl, ControlLabel, Checkbox, Table, Button, Grid, Col, Row, Alert} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDataModal: false,
            showUserModal: false,
            showPasscodeModal: false,
            errorData: null,
            errorUser: null,
            errorPasscode: null,
            settingsLoaded: false,
            errorLoading: null,
            settings: {},
            loaded: false,
            logged: false
        };

        this.sendData = this.sendData.bind(this);
        this.sendUser = this.sendUser.bind(this);
        this.sendPasscode = this.sendPasscode.bind(this);
        this.generateDataModal = this.generateDataModal.bind(this);
        this.generateUserModal = this.generateUserModal.bind(this);
        this.generatePasscodeModal = this.generatePasscodeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.generatePage = this.generatePage.bind(this);
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

    getSettingsData() {
        Axios.get('/api/settings/get_settings')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        settings: response.body,
                        settingsLoaded: true,
                        period: response.body.Period,
                        base: response.body.Base,
                        botname: response.body.Botname,
                        notification: response.body.Notification,
                        notification_text: response.body.NotificationText,
                        secret_key: response.body.SecretKey,
                        passcode: response.body.Passcode
                    });
                } else {
                    this.setState({
                        errorLoading: "Ошибка сервера",
                        settingsLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorLoading: "Ошибка сервера",
                    settingsLoaded: true
                });
            });
    }

    openModal(type) {
        return () => {
            this.setState({
                ['show' + type + 'Modal']: true
            });
        }
    }

    closeModal() {
        this.setState({
            showDataModal: false,
            showUserModal: false,
            showPasscodeModal: false
        });
    }

    changeForm(type) {
        return (e) => {
            this.setState({
                [type]: e.target.value
            });
        }
    }

    changeCheckbox(type) {
        return (e) => {
            this.setState({
                [type]: e.target.checked
            });
        }
    }

    sendData() {
        var allData = (this.state.login && this.state.password && this.state.period && this.state.base
            && this.state.notification_text && this.state.secret_key);

        if (!allData) {
            this.setState({
                errorData: "Не все поля заполнены"
            });
            return false;
        }

        if (isNaN(this.state.period)) {
            this.setState({
                errorData: "Частота проверки должна быть числом"
            });
            return false;
        }

        var key_length = this.state.secret_key.length;

        if (key_length != 16 && key_length != 24 && key_length != 32) {
            this.setState({
                errorData: "Неверное количество символов в секретном ключе"
            });
            return false;
        }

        var req_data = {
            login: this.state.login,
            password: this.state.password,
            period: Number(this.state.period),
            base: this.state.base,
            botname: this.state.botname,
            notification: this.state.notification,
            notification_text: this.state.notification_text,
            secret_key: this.state.secret_key
        };

        Axios.post('/api/settings/set_settings', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorData: null
                    })
                    this.getSettingsData();
                    this.closeModal();
                } else if (response.status == 2) {
                    this.setState({
                        errorData: "Неверный логин или пароль"
                    });
                } else {
                    this.setState({
                        errorData: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorData: "Ошибка сервера"
                });
            });
    }

    sendUser() {
        var allData = (this.state.old_login && this.state.old_password && this.state.new_login && this.state.new_password);

        if (!allData) {
            this.setState({
                errorUser: "Не все поля заполнены"
            });
            return false;
        }

        var req_data = {
            old_login: this.state.old_login,
            old_password: this.state.old_password,
            new_login: this.state.new_login,
            new_password: this.state.new_password
        };

        Axios.post('/api/settings/set_user', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorUser: null,
                        old_login: null,
                        old_password: null,
                        new_login: null,
                        new_password: null
                    })
                    this.getSettingsData();
                    this.closeModal();
                } else if (response.status == 2) {
                    this.setState({
                        errorUser: "Неверный старый логин или пароль"
                    });
                } else {
                    this.setState({
                        errorUser: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorUser: "Ошибка сервера"
                });
            });
    }

    sendPasscode() {
        var allData = (this.state.login && this.state.password && this.state.passcode);
        if (!allData) {
            this.setState({
                errorPasscode: "Не все поля заполнены"
            });
            return false;
        }

        var req_data = {
            login: this.state.login,
            password: this.state.password,
            passcode: this.state.passcode
        };

        Axios.post('/api/settings/change_passcode', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorUser: null,
                        passcode: null
                    })
                    this.getSettingsData();
                    this.closeModal();
                } else if (response.status == 2) {
                    this.setState({
                        errorPasscode: "Неверный логин или пароль"
                    });
                } else {
                    this.setState({
                        errorPasscode: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorPasscode: "Ошибка сервера"
                });
            });
    }

    generateDataModal() {
        var errorPanel;
        if (this.state.errorData) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorData}</Alert>;
        }

        return <Modal show={this.state.showDataModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorPanel}
                <FormGroup
                    controlId="login-data"
                >
                    <ControlLabel>Логин</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.login}
                        placeholder="Логин"
                        onChange={this.changeForm("login")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="pass-data"
                >
                    <ControlLabel>Пароль</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.password}
                        placeholder="Пароль"
                        onChange={this.changeForm("password")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="period-data"
                >
                    <ControlLabel>Частота проверки треда</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.period}
                        placeholder="Частота проверки"
                        onChange={this.changeForm("period")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="base-data"
                >
                    <ControlLabel>Используемый домен</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.base}
                        placeholder="Адрес"
                        onChange={this.changeForm("base")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="bot-data"
                >
                    <ControlLabel>Имя бота (допускается трипкод)</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.botname}
                        placeholder="Имя бота"
                        onChange={this.changeForm("botname")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-data"
                >
                    <ControlLabel>Уведомления о Перекоте в тонущем треде</ControlLabel>
                    <Checkbox
                        value={true}
                        checked={this.state.notification}
                        onChange={this.changeCheckbox("notification")}
                    >Включить уведомления</Checkbox>
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Текст уведомления (после него ставится номер треда без ">>")</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.notification_text}
                        disabled={!this.state.notification}
                        placeholder="Текст уведомления"
                        onChange={this.changeForm("notification_text")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Ключ для шифрования (только 16, 24 или 32 символа)</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.secret_key}
                        placeholder="Секретный ключ"
                        onChange={this.changeForm("secret_key")}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success" onClick={this.sendData}>Сохранить данные</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generateUserModal() {
        var errorPanel;
        if (this.state.errorUser) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorUser}</Alert>;
        }

        return <Modal show={this.state.showUserModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение юзера</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorPanel}
                <FormGroup
                    controlId="lod-login-data"
                >
                    <ControlLabel>Старый логин</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.old_login}
                        placeholder="Старый логин"
                        onChange={this.changeForm("old_login")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Старый пароль</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.old_pass}
                        placeholder="Старый пароль"
                        onChange={this.changeForm("old_password")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Новый логин</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.new_login}
                        placeholder="Новый логин"
                        onChange={this.changeForm("new_login")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Новый пароль</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.new_pass}
                        placeholder="Секретный ключ"
                        onChange={this.changeForm("new_password")}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success" onClick={this.sendUser}>Изменить юзера</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generatePasscodeModal() {
        var errorPanel;
        if (this.state.errorPasscode) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorPasscode}</Alert>;
        }

        return <Modal show={this.state.showPasscodeModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение пасскода</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorPanel}
                <FormGroup
                    controlId="login-data"
                >
                    <ControlLabel>Логин</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.login}
                        placeholder="Логин"
                        onChange={this.changeForm("login")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="pass-data"
                >
                    <ControlLabel>Пароль</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.password}
                        placeholder="Пароль"
                        onChange={this.changeForm("password")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Используемый пасскод</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.passcode}
                        placeholder="Пасскод"
                        onChange={this.changeForm("passcode")}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success" onClick={this.sendPasscode}>Изменить пасскод</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generatePage() {
        var errorPanel;
        if (this.state.errorLoading) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorLoading}</Alert>;
        }

        return <main>
            {errorPanel}
            <article className="settings">
                <Table striped bordered condensed hover>
                    <tbody>
                        <tr>
                        <td>Частота проверки (в минутах)</td>
                        <td>{this.state.settings.Period}</td>
                    </tr>
                    <tr>
                        <td>Адрес</td>
                        <td>{this.state.settings.Base}</td>
                    </tr>
                    <tr>
                        <td>Имя бота</td>
                        <td>{this.state.settings.Botname}</td>
                    </tr>
                    <tr>
                        <td>Уведомления в тонущий тред</td>
                        <td>{this.state.settings.Notification ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td>Текст уведомления (после текста идёт номер треда без ">>")</td>
                        <td>{this.state.settings.NotificationText}</td>
                    </tr>
                    <tr>
                        <td>Секретный ключ (для шифрования)</td>
                        <td>{this.state.settings.SecretKey}</td>
                    </tr>
                    <tr>
                        <td>Используемый пасскод</td>
                        <td>{this.state.settings.Passcode}</td>
                    </tr>
                    </tbody>
                </Table>
            </article>
            <Grid>
                <Row>
                    <Col md={3}>
                        <Button bsStyle="primary" onClick={this.openModal('Data')}>Изменить данные</Button>
                    </Col>
                    <Col md={3}>
                        <Button bsStyle="primary" onClick={this.openModal('User')}>Изменить юзера</Button>
                    </Col>
                    <Col md={3}>
                        <Button bsStyle="primary" onClick={this.openModal('Passcode')}>Изменить пасскод</Button>
                    </Col>
                </Row>
            </Grid>
            {this.generateDataModal()}
            {this.generateUserModal()}
            {this.generatePasscodeModal()}
        </main>;
    }
    
    render() {
        var page;

        if (!this.state.settingsLoaded) {
            this.getSettingsData();
        }

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
