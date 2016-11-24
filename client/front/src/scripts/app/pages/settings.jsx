import * as React from 'react';
import {Table, Button, Grid, Col, Row} from 'react-bootstrap';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
                        <Button bsStyle="primary">Изменить данные</Button>
                    </Col>
                    <Col md={3}>
                        <Button bsStyle="primary">Изменить юзера</Button>
                    </Col>
                    <Col md={3}>
                        <Button bsStyle="primary">Изменить пасскод</Button>
                    </Col>
                </Row>
            </Grid>
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
