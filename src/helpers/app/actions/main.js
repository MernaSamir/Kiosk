import store from 'store'
export const reset = (app, data)=>(store.dispatch({
    type: `set_main_${app}`, data
}))
export const append_path = (app, path, data)=>(store.dispatch({
    type: `append_path_${app}`, path, data
}))
export const reset_path = (app, path, data)=>(store.dispatch({
    type: `set_path_${app}`, path, data
}))

export const omit_data_app = (app, data)=>(store.dispatch({
    type: `omit_data_${app}`, data
}))
