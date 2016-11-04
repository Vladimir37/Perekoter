import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import {Main} from './app/pages/main.jsx';
import {NotFound} from './app/pages/404.jsx';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/' component={Main}/>
        <Route path='*' component={NotFound}/>
    </Router>,
    document.getElementById('root')
);
