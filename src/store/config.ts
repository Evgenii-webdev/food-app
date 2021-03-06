import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    }
}

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('hit!t-state');
        if (serializedState === null) {
            return {};
        }

        return JSON.parse(serializedState);
    } catch (error) {
        return {};
    }
};

const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('hit!t-state', serializedState);
    } catch (error) {
        console.log('Local Storage: Save failed with code ', error);
    }
};

const peristedState = loadState();
export default function configureStore() {
    const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        peristedState,
        storeEnhancers(applyMiddleware(thunk))
    );

    store.subscribe(() => {
        saveState(store.getState());
    });

    return store;
}
