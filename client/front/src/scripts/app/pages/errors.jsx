import * as React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {Header} from '../components/header.jsx';
import {Footer} from '../components/footer.jsx';
import {checkUser} from '../utility/checkUser.jsx';


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
            page: null
        };

        this.generatePage = this.generatePage.bind(this);
        this.loadPage = this.loadPage.bind(this);
    }

    generatePage() {
        return <main>
            <ButtonGroup justified>
                <Button href="#">Новые</Button>
                <Button href="#">Просмотренные</Button>
                <Button href="#">Все</Button>
            </ButtonGroup>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Текст</th>
                    <th>Активна</th>
                    <th>Username</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                </tbody>
            </Table>
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
