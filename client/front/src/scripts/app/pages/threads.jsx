import * as React from 'react';
import {Table, Modal, Button, Alert, FormControl} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Threads extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            threads: [],
            threadsLoaded: false,
            error: null,
            loaded: false,
            logged: false
        };

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

    openModal(type, board) {
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
