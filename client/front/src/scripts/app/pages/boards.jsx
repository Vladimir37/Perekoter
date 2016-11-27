import * as React from 'react';
import {Table, Modal, Button, Alert, FormControl} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Boards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boardsLoaded: false,
            showNewModal: false,
            showEditModal: false,
            error: null,
            errorNew: null,
            boards: [],
            loaded: false,
            logged: false
        };

        this.generateNewModal = this.generateNewModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createNew = this.createNew.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.generatePage = this.generatePage.bind(this);
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
            showNewModal: false,
            showEditModal: false
        });
    }

    loadBoards() {
        Axios.get('/api/boards/get_all_boards')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    response.body = response.body.reverse();
                    this.setState({
                        boards: response.body,
                        boardsLoaded: true
                    });
                } else {
                    this.setState({
                        error: "Ошибка сервера",
                        boardsLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера",
                    boardsLoaded: true
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

    changeForm(type) {
        return (e) => {
            this.setState({
                [type]: e.target.value
            });
        }
    }

    createNew() {
        var allData = (this.state.name && this.state.addr && this.state.bumplimit);
        
        if (!allData) {
            this.setState({
                errorNew: "Не все поля заполнены"
            });
            return false;
        }

        if (isNaN(this.state.bumplimit)) {
            this.setState({
                errorNew: "Бамплимит должен быть числом"
            });
            return false;
        }

        var req_data = {
            name: this.state.name,
            addr: this.state.addr,
            bumplimit: Number(this.state.bumplimit)
        };

        Axios.post('/api/boards/add_board', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorNew: null
                    })
                    this.loadBoards();
                    this.closeModal();
                } else {
                    this.setState({
                        errorNew: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorNew: "Ошибка сервера"
                });
            });
    }

    generateNewModal() {
        var errorPanel;
        if (this.state.errorNew) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorNew}</Alert>;
        }

        return <Modal show={this.state.showNewModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Новая доска</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder="Имя"
                        onChange={this.changeForm("name")}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.addr}
                        placeholder="Адрес"
                        onChange={this.changeForm("addr")}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.bumplimit}
                        placeholder="Бамплимит"
                        onChange={this.changeForm("bumplimit")}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.createNew}>Создать</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
                </Modal.Footer>
            </Modal>;
    }

    generatePage() {
        var errorPanel;
        if (this.state.error) {
            errorPanel = <Alert bsStyle="danger">{this.state.error}</Alert>;
        }

        if (!this.state.boardsLoaded) {
            this.loadBoards();
        }

        var boards = this.state.boards.map(function (board) {
            return <tr key={board.ID}>
                <td>{board.ID}</td>
                <td>{board.Name}</td>
                <td>{board.Addr}</td>
                <td>{board.Bumplimit}</td>
                <td><Button bsStyle="primary" bsSize="xsmall">Редактировать</Button></td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Имя</th>
                    <th>Адрес</th>
                    <th>Бамплимит</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {boards}
                </tbody>
            </Table>
            <Button bsStyle="primary" onClick={this.openModal("New")}>Создать</Button>
            {this.generateNewModal()}
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
