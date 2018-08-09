import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { promiseMiddleware} from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';
import App from './App';

function todos(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.text]);
        default:
            return state;
    }
}

const logger = createLogger();

const store = createStore(todos, applyMiddleware(promiseMiddleware(), logger));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
