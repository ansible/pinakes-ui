import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import App from './AppEntry';

ReactDOM.render(<App logger={logger} />, document.getElementById('root'));
