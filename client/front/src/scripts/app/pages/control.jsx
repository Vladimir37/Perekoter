import * as React from 'react';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export class Control extends React.Component {
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
        return (
            <div>
                <Header/>
                {this.generatePage()}
                <Footer/>
            </div>
        );
    }
}
