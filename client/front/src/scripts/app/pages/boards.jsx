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
            showDeleteModal: false,
            error: null,
            errorNew: null,
            errorEdit: null,
            errorDelete: null,
            boards: [],
            loaded: false,
            logged: false
        };

        this.generateNewModal = this.generateNewModal.bind(this);
        this.generateEditModal = this.generateEditModal.bind(this);
        this.generateDeleteModal = this.generateDeleteModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createNew = this.createNew.bind(this);
        this.editBoard = this.editBoard.bind(this);
        this.deleteBoard = this.deleteBoard.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.generatePage = this.generatePage.bind(this);
    }

    openModal(type, board) {
        return () => {
            this.setState({
                ['show' + type + 'Modal']: true
            });

            if (board) {
                this.setState({
                    editedID: board.ID,
                    editedName: board.Name,
                    editedAddr: board.Addr,
                    editedBumplimit: board.Bumplimit
                });
            }
        }
    }

    closeModal() {
        this.setState({
            showNewModal: false,
            showEditModal: false,
            showDeleteModal: false,
            errorDelete: null
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

    editBoard() {
        var allData = (this.state.editedName && this.state.editedAddr && this.state.editedBumplimit);
        
        if (!allData) {
            this.setState({
                errorEdit: "Не все поля заполнены"
            });
            return false;
        }

        if (isNaN(this.state.editedBumplimit)) {
            this.setState({
                errorEdit: "Бамплимит должен быть числом"
            });
            return false;
        }

        var req_data = {
            id: Number(this.state.editedID),
            name: this.state.editedName,
            addr: this.state.editedAddr,
            bumplimit: Number(this.state.editedBumplimit)
        };

        Axios.post('/api/boards/edit_board', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorEdit: null
                    })
                    this.loadBoards();
                    this.closeModal();
                } else {
                    this.setState({
                        errorEdit: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorEdit: "Ошибка сервера"
                });
            });
    }

    deleteBoard() {
        var req_data = {
            num: Number(this.state.editedID)
        };

        Axios.post('/api/boards/delete_board', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorDelete: null
                    })
                    this.loadBoards();
                    this.closeModal();
                } else if (response.status == 1) {
                    this.setState({
                        errorDelete: "Вы не можете удалить доску, к которой прикреплены треды"
                    });
                } else {
                    this.setState({
                        errorDelete: "Ошибка сервера"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    errorDelete: "Ошибка сервера"
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

    generateEditModal() {
        var errorPanel;
        if (this.state.errorEdit) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorEdit}</Alert>;
        }

        return <Modal show={this.state.showEditModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать доску</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <FormControl
                        type="text"
                        value={this.state.editedName}
                        placeholder="Имя"
                        onChange={this.changeForm("editedName")}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.editedAddr}
                        placeholder="Адрес"
                        onChange={this.changeForm("editedAddr")}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.editedBumplimit}
                        placeholder="Бамплимит"
                        onChange={this.changeForm("editedBumplimit")}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.editBoard}>Редактировать</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
                </Modal.Footer>
            </Modal>;
    }

    generateDeleteModal() {
        var errorPanel;
        if (this.state.errorDelete) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorDelete}</Alert>;
        }

        return <Modal show={this.state.showDeleteModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить доску</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <p>Вы уверены, что хотите удалить доску "{this.state.editedName}" (/{this.state.editedAddr}/)?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="warning" onClick={this.deleteBoard}>Удалить</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Отмена</Button>
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

        var boards = this.state.boards.map((board) => {
            return <tr key={board.ID}>
                <td>{board.ID}</td>
                <td>{board.Name}</td>
                <td>{board.Addr}</td>
                <td>{board.Bumplimit}</td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal('Edit', board)}>Редактировать</Button></td>
                <td><Button bsStyle="warning" bsSize="xsmall" onClick={this.openModal('Delete', board)}>Удалить</Button></td>
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
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {boards}
                </tbody>
            </Table>
            <Button bsStyle="primary" onClick={this.openModal("New")}>Создать</Button>
            {this.generateNewModal()}
            {this.generateEditModal()}
            {this.generateDeleteModal()}
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
