// import store from './reducers/store'
import axios from "axios";
// Add a request interceptor
import {last} from 'lodash'
export default (() => {
    axios.interceptors
        .request
        .use((config) => {
            // Do something before request is sent
            // if localstorage token
            //  config.Authorization = "Bearer {Token}"
            const serverUrl = localStorage.getItem('ip_address') || 'http://localhost:8000';
            if(!config.url.includes('http://')){
                config.url = serverUrl + config.url;
            }
            if(last(config.url)!='/'){
                config.url = config.url+'/'
            }
            const Token = localStorage.getItem('tk');
            if(Token){
                config.headers.Authorization = `Token ${Token}`
            }
            return config;
        }, (error) => {
            // Do something with request error
            // store.dispatch({type:'Show_Loading',loading:true})
            return Promise.reject(error);
        });

    // Add a response interceptor
    axios
        .interceptors
        .response
        .use((response) => {
            // store.dispatch({type:'Show_Loading',loading:false})
            // Do something with response data
            return response;
        }, (error) => {
            // store.dispatch({type:'Show_Loading',loading:false})
            // Do something with response error
            return Promise.reject(error);
        });
})
