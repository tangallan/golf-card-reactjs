import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import createSagaMiddleware from 'redux-saga';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

// reducers
import authReducer from './store/reducers/auth';
import signUpReducer from './store/reducers/signup';
import gamesReducer from './store/reducers/games';

// sagas
import { watchAuth } from './store/sagas/auth';
import { watchSignUp } from './store/sagas/signup';
import { watchGame } from './store/sagas/games';

// compose enhancers
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: null || compose;

const rootReducers = combineReducers({
    auth: authReducer,
    signup: signUpReducer,
    gameProvider: gamesReducer
});
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducers,
    composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchSignUp);
sagaMiddleware.run(watchGame);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
