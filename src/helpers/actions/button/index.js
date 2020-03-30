import * as actions from './main';
import { get, pick } from 'lodash'
import store from 'store'
const takeAction = (button, data, state=store.getState(), props)=>{
    const action = get(actions, button.action, ()=>{})
    action(button, data, {...props})
    if(button.then){
        takeAction({ ...pick(button, ['reduxName']), ...button.then}, data, state, props);
    }
}

export default takeAction