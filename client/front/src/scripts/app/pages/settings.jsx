import * as React from 'react';
import {Modal, FormGroup, FormControl, ControlLabel, Checkbox, Table, Button, Grid, Col, Row} from 'react-bootstrap';
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
            loaded: false,
            logged: false
        };

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

    generateDataModal() {
        return <Modal show={this.state.showDataModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение данных</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        value={this.state.notification}
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
                        disabled={this.state.notification}
                        placeholder="Текст уведомления"
                        onChange={this.changeForm("notification_text")}
                    />
                </FormGroup>
                <FormGroup
                    controlId="notification-text-data"
                >
                    <ControlLabel>Секретный ключ (применяется для шифрования)</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.secret_key}
                        placeholder="Секретный ключ"
                        onChange={this.changeForm("secret_key")}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success">Сохранить данные</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generateUserModal() {
        return <Modal show={this.state.showUserModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение юзера</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        onChange={this.changeForm("old_pass")}
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
                        onChange={this.changeForm("new_pass")}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success">Изменить юзера</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generatePasscodeModal() {
        return <Modal show={this.state.showPasscodeModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Изменение пасскода</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                <Button bsStyle="success">Изменить пасскод</Button>
                <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
            </Modal.Footer>
        </Modal>;
    }

    generatePage() {
        return <main>
            <article className="settings">
                <Table striped bordered condensed hover>
                    <tbody>
                        <tr>
                        <td>Частота проверки (в минутах)</td>
                        <td>Название</td>
                    </tr>
                    <tr>
                        <td>Адрес</td>
                        <td>Название</td>
                    </tr>
                    <tr>
                        <td>Имя бота (допускается трипкод)</td>
                        <td>Название</td>
                    </tr>
                    <tr>
                        <td>Уведомления в тонущий тред</td>
                        <td>Название</td>
                    </tr>
                    <tr>
                        <td>Текст уведомления (после текста идёт номер треда без ">>")</td>
                        <td>Название</td>
                    </tr>
                    <tr>
                        <td>Секретный ключ (для шифрования)</td>
                        <td>Название</td>
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
