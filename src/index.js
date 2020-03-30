import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from'./translate/config'
// import * as serviceWorker from './serviceWorker';
import interceptor from './interceptor'
// import socket from './socket';
const onDeviceReady = () => {
    interceptor()
    // socket()
    ReactDOM.render(
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    , document.getElementById('root'))
}
if (window.cordova) {
    document.addEventListener('deviceready', onDeviceReady, false)
} else {
    onDeviceReady()
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// if(serviceWorker){
//     serviceWorker.unregister();
// }
