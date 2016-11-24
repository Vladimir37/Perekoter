import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import {Main} from './app/pages/main.jsx';
import {Control} from './app/pages/control.jsx';
import {Errors} from './app/pages/errors.jsx';
import {Issues} from './app/pages/issues.jsx';
import {History} from './app/pages/history.jsx';
import {Settings} from './app/pages/settings.jsx';
import {NotFound} from './app/pages/404.jsx';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/' component={Main}/>
        <Route path='/control' component={Control}/>
        <Route path='/errors' component={Errors}/>
        <Route path='/issues' component={Issues}/>
        <Route path='/history' component={History}/>
        <Route path='/settings' component={Settings}/>
        <Route path='*' component={NotFound}/>
    </Router>,
    document.getElementById('root')
);
