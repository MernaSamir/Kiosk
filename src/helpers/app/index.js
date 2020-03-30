import {appReducer as Reducer} from "./reducer";
import {Sagas} from "./sagas";
import dynamic from "@redux-dynostore/react-redux";
import subspaced from "@redux-dynostore/react-redux-subspace";
import { attachReducer } from "@redux-dynostore/redux-subspace";
import runSaga from "@redux-dynostore/redux-subspace-saga";
import * as Actions from './actions';
import {connect} from 'react-redux'
import {get} from 'lodash';
import * as mainActions from './actions/main'
import { bindActionCreators } from "redux";
export const appHelper = {
  Reducer,
  Sagas,
  Actions
};

export const attachApp = (app, Component) => (dynamic(
  app.name,
  attachReducer(Reducer),
  runSaga(
    Sagas(app.settings)
  ),
  subspaced({
    mapExtraState: (state, rootState) => ({ ...get(app, 'extraState', ()=>({}))(state, rootState) })
  })
)(Component))

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(Actions, dispatch),
  ...mainActions,
})
export default (app, mapStateToProps, Component)=>{
  const MainComponent = connect(mapStateToProps, mapDispatchToProps, null,
    {
      pure: false
    })(Component)
  const attached = attachApp(app, MainComponent)
  return attached
}

