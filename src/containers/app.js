import React, { Suspense, Component, lazy } from 'react'
import Loading from 'helpers/components/loading'
import {get} from 'lodash'
import {connect} from 'react-redux'
const Ordering = React.lazy(()=>import('screens/ordering'))
const Admin = React.lazy(()=>import('screens/Admin'))
const Packing = React.lazy(() => import('screens/displays/Packing'))
const Kitchen = React.lazy(() => import('screens/displays/Kitchen'))
const Stock = React.lazy(() => import('screens/Admin/stock'))
const CWH = React.lazy(() => import('screens/Admin/stock_cwh'))
const DeliveryDispatcher = lazy(()=>import('screens/displays/delivery'))
// import Stock from 'screens/Admin/stock'
// console.log(Stock)
// import Popup from 'components/popups'
const components = {
    pos: Ordering,
    sma_w: Ordering,
    kit: Kitchen,
    pac: Packing,
    stock: Stock,
    d_dis: DeliveryDispatcher,
    cwh: CWH
}
class AppContainer extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const {station={}, history } = this.props
        let MainComponent = get(components, station._type, components.pos)
        if(!get(station, 'modes.length') && station._type == 'pos'){
            history.push('/admin')
        }
        return (
            <Suspense fallback={<Loading />}>
                <MainComponent />
            </Suspense>
        )
    }
}
const mapStateToProps = (state) => ({
  station: get(state.licensing__station.data, state.licensing__station.active)  
})
export default connect(mapStateToProps)(AppContainer)
