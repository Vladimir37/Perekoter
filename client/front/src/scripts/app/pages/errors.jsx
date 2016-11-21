import * as React from 'react';
import {ButtonGroup, Button, Table} from 'react-bootstrap';
import Axios from 'axios';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Errors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: 0,
            allErrors: [],
            newErrors: [],
            oldErrors: [],
            errorsLoaded: false, 
            loaded: false,
            logged: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.generatePage = this.generatePage.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.checkCategory = this.checkCategory.bind(this);
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

    loadErrors() {
        Axios.get('/api/')
    }

    generatePage() {
        return <main>
            <ButtonGroup justified>
                <Button href="#" active={this.checkCategory(0)} onClick={this.changeCategory(0)}>Новые</Button>
                <Button href="#" active={this.checkCategory(1)} onClick={this.changeCategory(1)}>Просмотренные</Button>
                <Button href="#" active={this.checkCategory(2)} onClick={this.changeCategory(2)}>Все</Button>
            </ButtonGroup>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Текст</th>
                    <th>Активна</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td><Button bsStyle="primary" bsSize="xsmall">Просмотрено</Button></td>
                    </tr>
                </tbody>
            </Table>
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
