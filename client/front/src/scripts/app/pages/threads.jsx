import * as React from 'react';
import {Table, Modal, Button, Alert, FormControl, Checkbox, FieldGroup} from 'react-bootstrap';
import Axios from 'axios';
import Switcher from 'react-switcher';
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
            showUploadModal: false,
            showDeleteModal: false,
            editedBoard: {},
            board: 1,
            error: null,
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.switchActive = this.switchActive.bind(this);
        this.createNew = this.createNew.bind(this);
        this.editThread = this.editThread.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.generateNewModal = this.generateNewModal.bind(this);
        this.generateEditModal = this.generateEditModal.bind(this);
        this.generateUploadModal = this.generateUploadModal.bind(this);
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
                    editedID: thread.ID,
                    editedNumbering: thread.Numbering,
                    editedRoman: thread.Roman,
                    editedCurrentNum: thread.CurrentNum,
                    editedCurrentThread: thread.CurrentThread,
                    editedTitle: thread.Title,
                    editedHeaderLink: thread.HeaderLink,
                    editedHeader: thread.Header,
                    editedBoard: thread.Board.ID,
                    currentImage: thread.Image
                });
            }
        }
    }

    closeModal() {
        this.setState({
            showNewModal: false,
            showEditModal: false,
            showUploadModal: false,
            showDeleteModal: false,
            errorDelete: null
        });
    }

    switchActive(thread) {
        return () => {
            Axios.post('/api/threads/switch_thread_activity', {
                num: thread
            }).then((response) => {
                    response = response.data;
                    if (response.status == 0) {
                        this.loadThreads();
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

    editThread() {
        var allData = (this.state.editedTitle && this.state.editedHeader && this.state.editedBoard);
        
        if (!allData) {
            this.setState({
                errorEdit: "Не все поля заполнены"
            });
            return false;
        }

        if (
            (this.state.editedCurrentThread && isNaN(this.state.editedCurrentThread)) || 
            (this.state.editedCurrentNum && isNaN(this.state.editedCurrentNum))
        ) {
            this.setState({
                errorNew: 'Текущий тред и текущий номер должны быть цифрами'
            });
            return false;
        }

        var req_data = {
            id: this.state.editedID,
            numbering: this.state.editedNumbering,
            roman: this.state.editedRoman,
            current_num: Number(this.state.editedCurrentNum),
            current_thread: Number(this.state.editedCurrentThread),
            title: this.state.editedTitle,
            header_link: this.state.editedHeaderLink,
            header: this.state.editedHeader,
            board_num: Number(this.state.editedBoard)
        };

        Axios.post('/api/threads/edit_thread', req_data)
            .then((response) => {
                response = response.data;
                if (response.status == 0) {
                    this.setState({
                        errorEdit: null
                    })
                    this.loadThreads();
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

    uploadImage(e) {
        if (!this.state.newCover) {
            this.setState({
                errorUpload: "Новое изображение не загружено"
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

    generateEditModal() {
        var errorPanel;
        if (this.state.errorEdit) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorEdit}</Alert>;
        }

        var boards = this.state.boards.map((board) => {
            return <option key={board.ID} value={board.ID}>{board.Name} (/{board.Addr}/)</option>;
        });

        return <Modal show={this.state.showEditModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить тред</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <FormControl
                        type="text"
                        value={this.state.editedTitle}
                        placeholder="Название"
                        onChange={this.changeForm("editedTitle")}
                    />
                    <Checkbox
                        value={true}
                        checked={this.state.editedNumbering}
                        onChange={this.changeCheckbox("editedNumbering")}
                    >Нумерация</Checkbox>
                    <Checkbox
                        value={true}
                        checked={this.state.editedRoman}
                        onChange={this.changeCheckbox("editedRoman")}
                        disabled={!this.state.editedNumbering}
                    >Нумерация римскими цифрами</Checkbox>
                    <FormControl
                        type="text"
                        value={this.state.editedCurrentNum}
                        placeholder="Текущий номер треда"
                        onChange={this.changeForm("editedCurrentNum")}
                        disabled={!this.state.editedNumbering}
                    />
                    <br/>
                    <FormControl
                        type="text"
                        value={this.state.editedCurrentThread}
                        placeholder="Текущий тред (номер ОП-поста)"
                        onChange={this.changeForm("editedCurrentThread")}
                    />
                    <br/>
                    <Checkbox
                        value={true}
                        checked={this.state.editedHeaderLink}
                        onChange={this.changeCheckbox("editedHeaderLink")}
                    >Шапка в виде документа по ссылке</Checkbox>
                    <br/>
                    <FormControl 
                        componentClass="textarea" 
                        placeholder={this.state.editedHeaderLink ? "Ссылка на шапку" : "Шапка"}
                        value={this.state.editedHeader}
                        onChange={this.changeForm("editedHeader")}
                    />
                    <br/>
                    <FormControl 
                        value={this.state.editedBoard} 
                        componentClass="select"
                        placeholder="select"
                        onChange={this.changeForm("editedBoard")}>
                            {boards}
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.editThread}>Изменить</Button>
                    <Button bsStyle="primary" onClick={this.closeModal}>Закрыть</Button>
                </Modal.Footer>
            </Modal>;
    }

    generateUploadModal() {
        var errorPanel;
        if (this.state.errorUpload) {
            errorPanel = <Alert bsStyle="danger">{this.state.errorUpload}</Alert>;
        }

        return <Modal show={this.state.showUploadModal} onHide={this.closeModal}>
                <form action="/api/threads/upload_image" method="POST" encType="multipart/form-data" onSubmit={this.uploadImage}>
                <Modal.Header closeButton>
                    <Modal.Title>Новый тред</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorPanel}
                    <img src={"/covers/" + this.state.currentImage} className="cover" alt="thread_image"/>
                    <FormControl
                        type="hidden"
                        name="redirect"
                        value={true}
                    />
                    <FormControl
                        type="hidden"
                        name="num"
                        value={this.state.editedID}
                    />
                    
                    <FormControl
                        type="file"
                        name="cover"
                        value={this.state.newCover}
                        onChange={this.changeForm("newCover")}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" type="submit">Загрузить</Button>
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
                <td><Switcher on={thread.Active} onClick={this.switchActive(thread.ID)}>{thread.Active ? ' Активен' : ' Неактивен'}</Switcher></td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal('Edit', thread)}>Редактировать</Button></td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal('Upload', thread)}>Изображение</Button></td>
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
                    <th>Активность</th>
                    <th></th>
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
            {this.generateEditModal()}
            {this.generateUploadModal()}
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
