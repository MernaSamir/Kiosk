export default (app)=>({
    FetchApp: (params, onSuccess, onError, name=app.name) => ({ type: `Fetching`, app: name, params, onSuccess, onError }),
    CreateApp: (data, onSuccess, onError, name=app.name) => ({ type: `Creating`, app: name, data, onSuccess, onError }),
    CreateManyApp: (data, onSuccess, onError, name=app.name) => ({ type: `CreatingMany`, app: name, data, onSuccess, onError }),
    CreateBulkApp: (data, onSuccess, onError, name=app.name) => ({ type: `CreatingBulk`, app: name, data, onSuccess, onError }),
    UpdateApp: (data, onSuccess, onError, name=app.name) => ({ type: `Updating`, app: name, data, onSuccess, onError }),
    UpdateManyApp: (data, onSuccess, onError, name=app.name) => ({ type: `UpdatingMany`, app: name, data, onSuccess, onError }),
    UpdateBulkApp: (data, onSuccess, onError, name=app.name) => ({ type: `UpdatingBulk`, app: name, data, onSuccess, onError }),
    DeleteApp: (data, onSuccess, onError, name=app.name) => ({ type: `Deleting`, app: name, data, onSuccess, onError }),
    DeleteManyApp: (data, onSuccess, onError, name=app.name) => ({ type: `DeletingMany`, app: name, data, onSuccess, onError }),
    UpdateModels: (data, onSuccess, onError) => ({ type: `UpdatingModels`, data, onSuccess, onError }),
    FetchAllApp: (apps, onSuccess, onError, name=app.name) => ({ type: `FetchingAll`, app: name, apps, onSuccess, onError })
})
