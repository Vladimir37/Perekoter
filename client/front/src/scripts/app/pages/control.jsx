import * as React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser} from '../utility/checkUser.jsx';


export class Control extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            page: null
        };

        this.generatePage = this.generatePage.bind(this);
        this.loadPage = this.loadPage.bind(this);
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

    loadPage() {
        checkUser(this.generatePage).then((page) => {
            this.setState({
                loaded: true,
                page
            });
        }).catch((page) => {
            this.setState({
                loaded: true,
                page
            });
        });
    }
    
    render() {
        if (!this.state.loaded) {
            this.loadPage();
        }
        
        return (
            <div>
                <Header/>
                {this.state.page}
                <Footer/>
            </div>
        );
    }
}
