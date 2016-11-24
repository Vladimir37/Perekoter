import * as React from 'react';
import {ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser, forbiddenGenerator} from '../utility/checkUser.jsx';


export class Control extends React.Component {
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
            <ListGroup>
                <ListGroupItem href="/boards">Доски</ListGroupItem>
                <ListGroupItem href="/threads">Треды</ListGroupItem>
                <ListGroupItem href="/errors">Ошибки</ListGroupItem>
                <ListGroupItem href="/issues">Предложения</ListGroupItem>
                <ListGroupItem href="/history">История</ListGroupItem>
                <ListGroupItem href="/settings">Настройки</ListGroupItem>
            </ListGroup>
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
