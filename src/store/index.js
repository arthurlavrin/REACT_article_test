import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import logger from '../middlewares/logger';
import randomid from '../middlewares/randomid';
import api from '../middlewares/api';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import history from '../history';

const enhancer = applyMiddleware(thunk, routerMiddleware(history), /*logger,*/ api, randomid);

const store = createStore(reducer, {}, enhancer);

//dev only
window.store = store;

export default store