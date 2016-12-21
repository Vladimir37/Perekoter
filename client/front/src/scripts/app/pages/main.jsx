import * as React from 'react';
import {Table, Modal, Button, ButtonGroup, Alert} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';

export class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            category: 0,
            threads: [],
            boards: [],
            threadsLoaded: false,
            boardsLoaded: false,
            editedBoard: {}
        };

        this.loadThreads = this.loadThreads.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.checkCategory = this.checkCategory.bind(this);
        this.generateModal = this.generateModal.bind(this);
    }

    openModal(thread) {
        return () => {
            this.setState({
                showModal: true
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
                    editedBoard: thread.Board,
                    editedLastPosts: thread.LastPosts,
                    editedLastPerekot: thread.LastPerekot,
                    currentImage: thread.Image
                });
            }
        }
    }

    closeModal() {
        this.setState({
            showModal: false
        });
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

    generateModal() {
        var currentThread = 'https://2ch.hk/' + this.state.editedBoard.Addr + '/res/' + this.state.editedCurrentThread + '.html';
        var lastPerekotDate = this.state.editedLastPerekot * 1000;
        var numberingBlock;
        var headerBlock;
        if (this.state.editedNumbering) {
            numberingBlock = <div>
                <p><b>Нумерация римскими цифрами:</b> {this.state.editedRoman ? 'Да' : 'Нет'} </p>
                <p><b>Текущий номер:</b> {this.state.editedCurrentNum}</p>
            </div>;
        }
        if (lastPerekotDate > 0) {
            lastPerekotDate = new Date(lastPerekotDate);
            lastPerekotDate = (lastPerekotDate.getHours()) + ':' + (lastPerekotDate.getMinutes()) + ' ' + (lastPerekotDate.getDate()) + '-' + (lastPerekotDate.getMonth() + 1) + '-' + (lastPerekotDate.getFullYear());
        } else {
            lastPerekotDate = 'Не перекатывался';
        }
        if (this.state.editedHeaderLink) {
            headerBlock = <p><b>Ссылка на шапку:</b> <a target="_blank" href={this.state.editedHeader}>{this.state.editedHeader}</a></p>
        } else {
            headerBlock = <div>
                <b>Шапка:</b>
                <br/>
                <textarea className="public-header" disabled={true}>{this.state.editedHeader}</textarea>
            </div>;
        }

        return <Modal show={this.state.showModal} onHide={this.closeModal}>
                <form action="/api/threads/upload_image" method="POST" encType="multipart/form-data" onSubmit={this.uploadImage}>
                <Modal.Header closeButton>
                    <Modal.Title>Информация о треде</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={"/covers/" + this.state.currentImage} className="cover" alt="thread_image"/>
                    <h2>{this.state.editedTitle}</h2>
                    <p><b>Доска:</b> {this.state.editedBoard.Name} (/{this.state.editedBoard.Addr}/)</p>
                    <p><b>Нумерация:</b> {this.state.editedNumbering ? 'Да' : 'Нет'}</p>
                    {numberingBlock}
                    <p><b>Текущий тред:</b> <a target="_blank" href={currentThread}>{currentThread}</a></p>
                    <p><b>Последний Перекот:</b> {lastPerekotDate}</p>
                    <p><b>Число постов при последней проверке:</b> {this.state.editedLastPosts}</p>
                    <p><b>Тип шапки:</b> {this.state.editedHeaderLink ? 'Ссылка на шапку' : 'Текст шапки'}</p>
                    {headerBlock}
                </Modal.Body>
                <Modal.Footer>
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
                <td>{thread.LastPosts}</td>
                <td>{thread.Board.Name}</td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal(thread)}>Подробно</Button></td>
            </tr>;
        });

        var boards = this.state.boards.map((board) => {
            return <tr>
                <td>{board.ID}</td>
                <td>{board.Name}</td>
                <td>/{board.Addr}/</td>
                <td>{board.Bumplimit}</td>
            </tr>;
        });

        return <main>
            {errorPanel}
            <ButtonGroup justified>
                <Button href="#" active={this.checkCategory(0)} onClick={this.changeCategory(0)}>Треды</Button>
                <Button href="#" active={this.checkCategory(1)} onClick={this.changeCategory(1)}>Доски</Button>
            </ButtonGroup>
            <section className={this.state.category == 0 ? '' : 'hidden'}>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>Посты</th>
                        <th>Доска</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {threads}
                    </tbody>
                </Table>
            </section>
            <section className={this.state.category == 1 ? '' : 'hidden'}>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Адрес</th>
                        <th>Бамплимит</th>
                    </tr>
                    </thead>
                    <tbody>
                        {boards}
                    </tbody>
                </Table>
            </section>
            {this.generateModal()}
        </main>;
    }
    
    render() {
        return (
            <div>
                <Header/>
                {this.generatePage()}
                <Footer/>
            </div>
        );
    }
}
