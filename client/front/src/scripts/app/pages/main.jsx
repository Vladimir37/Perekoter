import * as React from 'react';
import {Table, Modal, Button, Alert} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';

export class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            threads: [],
            threadsLoaded: false,
            editedBoard: {}
        };

        this.loadThreads = this.loadThreads.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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

    generateModal() {
        var currentThread = 'https://2ch.hk/' + this.state.editedBoard.Addr + '/' + this.state.editedCurrentThread + '.html';
        var numberingBlock;
        var headerBlock;
        if (this.state.editedNumbering) {
            numberingBlock = <div>
                <p><b>Нумерация римскими цифрами:</b> {this.state.editedRoman ? 'Да' : 'Нет'} </p>
                <p><b>Текущий номер:</b> {this.state.editedCurrentNum}</p>
            </div>;
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

        var threads = this.state.threads.map((thread) => {
            return <tr key={thread.ID}>
                <td>{thread.ID}</td>
                <td>{thread.Title}</td>
                <td>{thread.Board.Name}</td>
                <td><Button bsStyle="primary" bsSize="xsmall" onClick={this.openModal(thread)}>Подробно</Button></td>
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
                </tr>
                </thead>
                <tbody>
                    {threads}
                </tbody>
            </Table>
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
