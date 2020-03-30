import socket from 'config/socket'
import * as functions from './functions'
import {get} from 'lodash'

const takeAction=(action, data)=>{
    get(functions, action, () => { })(data)
}
