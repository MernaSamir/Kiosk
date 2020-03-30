import * as Actions from './index'
import * as mainActions from './main'
import { bindActionCreators } from 'redux';
export default (dispatch, ownProps) => ({
    ...bindActionCreators(Actions, dispatch),
    ...mainActions,
})