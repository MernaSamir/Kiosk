import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import applyFilters from 'helpers/functions/filters';
import Loading from "helpers/components/loading";
import classes from './style.less'
import Table from '../../../assets/images/003-serving-dish@3x.png';
import HomeWrap from "helpers/wrap/screens_wraps/home"
class Home extends Component {
    renderItems = () => {
        const { sub_cat , selectItem} = this.props
        return sub_cat.map((d, v) => {
            return (
                <button key={v} className={classes.buttonContainer} onClick={() => selectItem(d)}>
                    <div className={classes.button}>
                        <img src={Table} className={classes.pic} />
                    </div>
                    <div className={classes.title}>
                        <p >
                            {d.name}
                        </p>
                    </div>
                </button>

            )
        })

    }
    render() {
        const { chain } = this.props
        console.log(chain)
        return (
            !chain ? <Loading />
                : <div className={classes.Container}>
                    {/* {console.log(refundedItems)} */}
                    <p className={classes.Text}> Welcome To {chain.name}</p>
                    {/* <p className={classes.Text}>  klam gai mn database lama yt7at fel database yb2a y7lha rabna </p> */}
                    <div className={classes.btnContainer}>
                        {this.renderItems()}
                    </div>

                </div>
        )

    }
}
// const mapStateToProps = state => ({
//       chain: get(state.licensing__chain, `data.${get(state.licensing__chain, 'active', '')}`, {}),

// })
export default connect(null, mapDispatchToProps)(HomeWrap(Home));

