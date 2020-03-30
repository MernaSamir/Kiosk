export default (app)=>({
    Fetch: (params, onSuccess, onError) => ({ type: `Fetching_${app.name}`, params, onSuccess, onError}),
    Create: (data, onSuccess, onError)=>({type: `Creating_${app.name}`, data, onSuccess, onError}),
    CreateMany: (data, onSuccess, onError)=>({type: `CreatingMany_${app.name}`, data, onSuccess, onError}),
    Update: (data, onSuccess, onError)=>({type: `Updating_${app.name}`, data, onSuccess, onError}),
    CreateBulk: (data, onSuccess, onError)=>({type: `CreatingBulk_${app.name}`, app, data, onSuccess, onError}),
    Delete: (data, onSuccess, onError)=>({type: `Deleting_${app.name}`, data, onSuccess, onError}),
    FetchAll: (apps, onSuccess, onError) => ({ type: `FetchingAll_${app.name}`, apps, onSuccess, onError}),
    FetchStatistics: (data, onSuccess, onError) => ({ type: `FetchingStatistics_${app.name}`, data, onSuccess, onError}),
    UpdateBulk: (data, onSuccess, onError) => ({ type: `UpdatingBulk_${app.name}`, data, onSuccess, onError }),
    UpdateMany: (data, onSuccess, onError) => ({ type: `UpdatingMany_${app.name}`, data, onSuccess, onError }),
    DeleteMany: (data, onSuccess, onError) => ({ type: `DeletingMany_${app.name}`, data, onSuccess, onError }),
    SetMain: (data)=>({type: `set_main_${app.name}`, data})
})
