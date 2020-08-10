/* eslint-disable no-invalid-this */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import {get, omit,filter, isEmpty} from 'lodash'
import {withTranslation} from 'react-i18next';
import classes from './menu_style.less'

class SubClass extends Component {
  // DeleteMod(d) {
  //   const { setMain } = this.props
  //   const popup = {
  //     type: 'CancelCustomer', visable: true, width: "50%",
  //     childProps: {
  //       Title: '',
  //       first_msg: `Are you sure you want to delete ${d.quantity} x ${d.name}`,
  //       pressYes: () => this.deletemodifer(d)
  //     }
  //   }
  //   setMain('popup', { popup })
  // }

  // deletemodifer = (d) => {
  //   const { setMain, appendPath, details, setAll } = this.props
  //   setAll([
  //     { type: 'set_main', app: 'popup', data: { popup: {} } },
  //     { type: 'set_main', app: 'form_actions', data: { details: omit(details, d.id) } },
  //     { type: 'set_main', app: 'form_actions', data: { CartStatus: false } }

  //   ])
  //   appendPath("form_actions", `details.${[d.id]}`, {});
  //   this.setState({ show: false })
  // }
  renderHeader() {
    const {eSub, Child, index, modifs} = this.props
    const style = {
      paddingLeft: (index * 2) + '%',
    };
  console.log(modifs,"mooooo")
    // if (isEmpty(modifs) ){
    //   if (!eSub.removal) {
    //     return (
    //       <div className={classes.modfcont}>
    //         <div className={classes.flex}>
    //           <div className={classes.modfir}>
    //             {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, eSub)}>x</button>}
    //             <p>{eSub.quantity} x {eSub.name}</p>
    //           </div>
    //           <p className={classes.et}>{eSub.price}</p>
    //           <p > {eSub.quantity ? eSub.price * eSub.quantity : eSub.price}</p>
    //         </div>
    //       </div>
    //     )
    //   }
    //   else
    //   return (
    //     <div className={classes.modfcont}>
    //       <div className={classes.flex}>
    //         <div className={classes.modfir}>
    //         {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, eSub)}>x</button>}
    //         {<p style={{marginRight:"1%"}}>NO</p>}
  
    //           <p>{eSub.name}</p>
    //         </div>
    //       </div>
    //     </div>
    //   )

    // }
    return <Child className={classes.parent}
      style={style}
      element = {eSub}
      data_filter={eSub.id}
      >
        
    </Child>
  }
  render() {
    return (
      this.renderHeader()
    )
  }
}
export const Sub = withTranslation()(SubClass)

const mapStateToProps = (state, props) => ({
  active: get(state, 'apps.active', {}),
  location: props.history.location,
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Sub)
export default withRouter(wrapper)
