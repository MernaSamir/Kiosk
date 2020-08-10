import React, { Component, Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import Loading from "helpers/components/loading";
import loadable from "@loadable/component";

const Popup = lazy(() => import('components/popups'))

const Home = lazy(() => import("screens/Home/web"), {
  fallback: <Loading />,
});
const Header = loadable(() => import("containers/Header"), {
  fallback: <Loading />,
});
const Languages = loadable(() => import("screens/language"), {
  fallback: <Loading />,
});
const Welcome = loadable(() => import("screens/welcome_msg"), {
  fallback: <Loading />,
});
const Setting = loadable(() => import("screens/setting/web"), {
  fallback: <Loading />,
});
const Order = loadable(() => import("screens/order/web"), {
  fallback: <Loading />,
});
const Details = loadable(() => import("screens/details/web"), {
  fallback: <Loading />,
});
const Combo = loadable(() => import("screens/combo_item"), {
  fallback: <Loading />,
});
const modifier = loadable(() => import("screens/modifier/web"), {
  fallback: <Loading />,
});
const Quantity = loadable(() => import("screens/my_cart/quantity"), {
  fallback: <Loading />,
});
const MyCart = loadable(() => import("screens/my_cart/cart"), {
  fallback: <Loading />,
});
const Payment = loadable(() => import("screens/PaymentLocation"), {
  fallback: <Loading />,
});

const Final = loadable(() => import("screens/final"), {
  fallback: <Loading />,
});


// const Quantity = loadable(() => import("screens/details/qtn"), {
//   fallback: <Loading />,
// });



// const Cart = loadable(() => import("screens/cart"), {
//   fallback: <Loading />,
// });

const Start_screen = lazy(() => import("screens/start"));
import classes from "./style.less";
import { connect } from "react-redux";
import { get } from 'lodash'

import mapDispatchToProps from "helpers/actions/main";

const Routes = (props) => (
  <>
    <Suspense fallback={<Loading />}>
      <Route exact path="/" component={Start_screen} />
      {props.show && <Header />}
      <Route exact path="/language" component={Languages} />
      <Route exact path="/welcome" component={Welcome} />

      <Route exact path="/setting" component={Setting} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/order" component={Order} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/final" component={Final} />
      <Route exact path="/details" component={Details} />
      <Route exact path="/combo" component={Combo} />

      {/* <Route exact path="/details/qtn" component={Quantity} /> */}
      <Route exact path="/modifier" component={modifier} />
      <Route exact path="/quantity" component={Quantity} />
      <Route exact path="/cart" component={MyCart} />
      <Route exact path="/payment" component={Payment} />


      {/* <Route exact path="/cart" component={Cart} /> */}
      <Popup />
    </Suspense>
  </>
);

class AppRouting extends Component {
  constructor(props) {
    super(props)
    props.setMain('show', { data: true })
  }
  render() {
    return (
      <div className={classes.app_container}>
        <Routes show={this.props.show} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    shift: state.orders__shifts.active,
    show: get(state.show, 'data', undefined)
  }),
  mapDispatchToProps
)(AppRouting);
