import * as React from 'react';
import {Table, Modal, Button, Alert, FormControl, Checkbox, FieldGroup} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Threads extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            threads: [],
            boards: [],
            threadsLoaded: false,
            boardsLoaded: false,
            showNewModal: false,
            showEditModal: false,
            showDeleteModal: false,
            board: 1,
            error: null,
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createNew = this.createNew.bind(this);
        this.generateNewModal = this.generateNewModal.bind(this);
        this.generatePage = this.generatePage.bind(this);
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

    loadThreads() {
        Axios.get('/api/threads/get_all_threads')
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    response.body = response.body.reverse();
                    this.setState({
                        threads: response.body,
                        threadsLoaded: true
                    });
                } else {
                    this.setState({
                        error: "Ошибка сервера",
                        threadsLoaded: true
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: "Ошибка сервера",
                    threadsLoaded: true
                });
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
                        board: response.body[0] ? response.body[0].ID : 1,
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

    openModal(type, thread) {
        return () => {
            this.setState({
                ['show' + type + 'Modal']: true
            });

            if (thread) {
                this.setState({
                    //
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

    createNew(e) {
        var allData = (this.state.title && this.state.header && this.state.board && this.state.cover);

        if (!allData) {
            this.setState({
                errorNew: 'Не все поля заполнены'
            });

            e.preventDefault();
            return false;
        }

        if (
            (this.state.current_thread && isNaN(this.state.current_thread)) || 
            (this.state.current_num && isNaN(this.state.current_num))
        ) {
            this.setState({
                errorNew: 'Текущий тред и текущий номер должны быть цифрами'
            });

            e.preventDefault();
            return false;
        }

        return true;
    }

    generateNewModal() {
        var errorPanel;
        if (this.state.errorNew) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorNew}</Alert>;
        }

        var boards = this.state.boards.map((board) => {
            return <option key={board.ID} value={board.ID}>{board.Name} (/{board.Addr}/)</option>;
        });

        return <Modal show={this.state.showNewModal} onHide={this.closeModal}>
                <form action="/api/threads/add_thread" method="POST" encType="multipart/form-data" onSubmit={this.createNew}>
                <Modal.Header closeButton>
                    <Modal.Title>Новый тред</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <FormControl
                        type="hidden"
                        name="redirect"
                        value={true}
                    />
                    <FormControl
                        type="text"
                        value={this.state.title}
                        name="title"
                        placeholder="Название"
                        onChange={this.changeForm("title")}
                    />
                    <Checkbox
                        value={true}
                        name="numbering"
                        checked={this.state.numbering}
                        onChange={this.changeCheckbox("numbering")}
                    >Нумерация</Checkbox>
                    <Checkbox
                        value={true}
                        checked={this.state.roman}
                        name="roman"
                        onChange={this.changeCheckbox("roman")}
                        disabled={!this.state.numbering}
                    >Нумерация римскими цифрами</Checkbox>
                    <FormControl
                        type="text"
                        value={this.state.current_num}
                        name="current_num"
                        placeholder="Текущий номер треда"
                        onChange={this.changeForm("current_num")}
                        disabled={!this.state.numbering}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.current_thread}
                        name="current_thread"
                        placeholder="Текущий тред (номер ОП-поста)"
                        onChange={this.changeForm("current_thread")}
                    />
                    <br/>
                    <Checkbox
                        value={true}
                        checked={this.state.header_link}
                        name="header_link"
                        onChange={this.changeCheckbox("header_link")}
                    >Шапка в виде документа по ссылке</Checkbox>
                    <br/>
                    <FormControl 
                        componentClass="textarea" 
                        name="header"
                        placeholder={this.state.header_link ? "Ссылка на шапку" : "Шапка"}
                        value={this.state.header}
                        onChange={this.changeForm("header")}
                    />
                    <br/>
                    <FormControl 
                        value={this.state.board} 
                        componentClass="select"
                        name="board_num"
                        placeholder="select"
                        onChange={this.changeForm("board")}>
                            {boards}
                    </FormControl>
                    <br/>
                    <FormControl
                        type="file"
                        name="cover"
                        value={this.state.cover}
                        onChange={this.changeForm("cover")}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" type="submit">Создать</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
                </Modal.Footer>
                </form>
            </Modal>;
    }

    generatePage() {
        var errorPanel;
        if (this.state.error) {
            errorPanel = <Alert bsStyle="danger">{this.state.error}</Alert>;
        }

        if (!this.state.threadsLoaded) {
            this.loadThreads();
        }

        if (!this.state.boardsLoaded) {
            this.loadBoards();
        }

        var threads = this.state.threads.map((thread) => {
            return <tr key={thread.ID}>
                <td>{thread.ID}</td>
                <td>{thread.Title}</td>
                <td>{thread.Board.Name}</td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal('Edit', thread)}>Редактировать</Button></td>
                <td><Button bsStyle="warning" bsSize="xsmall" onClick={this.openModal('Delete', thread)}>Удалить</Button></td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Имя</th>
                    <th>Доска</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {threads}
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
