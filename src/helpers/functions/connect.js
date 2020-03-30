import {connect} from 'react-redux';
import {buildReducers} from 'store/reducers/main';
import {appActions} from "helpers/actions/main";
import {SagasApp} from 'helpers/app/sagas';
import store from 'store'

export default (mapStateToProps, app, Component)=>{
    const mapDispatchToProps = appActions(app);
    const MainComponent = connect(mapStateToProps, mapDispatchToProps)(Component)
    
    store.attachReducers(buildReducers(app.name))
    store.runSagas({[app.name]: SagasApp(app)})
    return MainComponent
}
