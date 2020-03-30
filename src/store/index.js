import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { reduxBatch } from '@manaflair/redux-batch';
import rootReducer from './reducers'
import dynostore, { dynamicReducers, shallowStateHandler } from "@redux-dynostore/core";
import { dynamicSagas } from "@redux-dynostore/redux-saga";
import createSagaMiddleware from 'redux-saga'
// import app from 'helpers/app'
import {Sagas, ExtraSagas} from "helpers/app/sagas";
import init from './init';



// import { persistStore, persistReducer } from 'redux-persist';
// // import storage from 'redux-persist/lib/storage';
// import logger from 'redux-logger';
// import createEncryptor from 'redux-persist-transform-encrypt';
// import createCompressor from 'redux-persist-transform-compress';
// import createExpirationTransform from 'redux-persist-transform-expire';




const initialState = init();
const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware];
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const enhancer = composeEnhancer(
    compose(
        reduxBatch,
        dynostore(
            dynamicReducers({ stateHandler: shallowStateHandler }),
            dynamicSagas(sagaMiddleware)
        ),
        applyMiddleware(...middleware),
    )
);



// const encryptor = createEncryptor({
//     secretKey: 'Ec#RsqI&*78@',
// });

// const compressor = createCompressor();
// const expireTransform = createExpirationTransform();

// const persistConfig = {
//     key: 'cusineRoot',
//     // storage,
//     transforms: [
//         encryptor,
//         compressor,
//         expireTransform,
//     ],
// };


// const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = {
    ...createStore(rootReducer, initialState, enhancer),
    runSaga: sagaMiddleware.run
};
store.runSaga(Sagas())
store.runSaga(ExtraSagas())
store.dispatch({type: 'Clock'})
// export const persistor = persistStore(store);


// const store = createStore(
//     rootReducer,
//     initialState,
//     compose(
//         dynostore(
//             dynamicReducers(),
//             dynamicSagas(sagaMiddleware)
//         ),
//         applyMiddleware(...middleware),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     )
// );
if(window){
    window.st = store
}
export default store;
