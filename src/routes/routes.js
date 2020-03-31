import React, { Component, Suspense, lazy } from 'react'
import { Route } from 'react-router-dom';
import Loading from "helpers/components/loading";
import loadable from '@loadable/component'

const Home = lazy(() => import('screens/Home'),{
    fallback:<Loading/>,
})
const Header = loadable(() => import('containers/Header'), {
    fallback: <Loading />,
})
const Setting = loadable(() => import('screens/setting'), {
    fallback: <Loading />,
})
const Order = loadable(() => import('screens/order'), {
    fallback: <Loading />,
})

const Start_screen =lazy(()=>import('screens/start'))
import classes from './style.less'
import { connect } from 'react-redux'


import mapDispatchToProps from 'helpers/actions/main'

const Routes = (props) => (

<>
    <Suspense fallback={<Loading />}>
        <Route exact path ="/" component={Start_screen}/>
        <Header />
        <Route exact path ="/setting" component={Setting}/>
        <Route exact path ="/home" component={Home}/>
        <Route exact path ="/order" component={Order}/>

        {/* <Route exact path="/lock" component={errorMsg} />
        <Route path="/admin" component={Admin} />
        <Route path="/Home" component={Home}/>
        <Route path="/customer-summary" component={CustomerSummery} />
        <Route path="/new/:type" component={CustomerInformation} />
        <Route path="/edit/:id" component={CustomerEdit} />
        <Route path="/list" component={CustomerList} />
        <Route path="/station" component={Station} />
        <Route path="/holdorder" component={Hold_Order} />
        <Route path="/floor-plan" component={FloorPlanner} />
        <Route path="/tables-planner" component={TablesPlanner} />
        <Route path="/split-check" component={SplitCheck} />
        <Route path="/call_center" component={CallCenter} />
        <Route path="/delivery" component={Delivery} />
        <Route path="/Counter" component={Counter} />
        <Route path="/group_Dif" component={GroupDif} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/packing" component={Packing} />
        <Route path="/dispatcher" component={DeliveryDispatcher} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/assign_tables" component={AssignTables} />
        <Route path="/new_reservation" component={NewReservation} />
        <Route path="/edit_rese/:id" component={ReservationEdit} />
        <Route path="/edit_event/:id" component={EditEvent} />
        <Route path="/event_list" component={Events} />
        <Route path="/new_event" component={NewEvent} />
        <Route path="/events" component={TodayEvents} />
        <Route path="/event_tabs" component={EventTabs} />
        <Route path="/catering" component={Catering} />
        <Route path="/new_cat" component={NewCatering} />
        <Route path="/edit_catring/:id" component={EditCatring} />

        <Route path="/catring_list" component={CateringList} />
        <Route path="/call_center_list" component={CallCenterList} />
        <Route path="/staff" component={Staff} />
        <Route path="/app" component={FormContainer} />
        <Popup /> */}
    </Suspense>
</>)


class AppRouting extends Component {
    render() {
        return (
                <div className={classes.app_container}>
                    <Routes /> 
                </div>
         
        )
    }
}

export default connect((state) => ({
    shift: state.orders__shifts.active
}), mapDispatchToProps)(AppRouting)
