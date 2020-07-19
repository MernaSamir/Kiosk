import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';
import menuStyle from './style.less'
import Content from './content'
import mapDispatchToProps from 'helpers/actions/main'
import {get, map, find, isEqual, pick} from 'lodash'
import {withTranslation} from 'react-i18next';

class GlobalCart extends Component {
  // constructor(props) {
  //   super(props)
  //   this.setAppPath(props)
  // }
  // setAppPath(props) {
  //     props.setMain('form_actions', {CartStatus: true})
    
  // }
  shouldComponentUpdate = (nextProps, nextState) => {
    // const compare = ["active", "data", "name"]
    const su =  !isEqual(this.props.CartStatus, nextProps.CartStatus);
    // if(this.pathname != nextProps.history.location.pathname){
    //     this.setAppPath(nextProps)
    // }
    return su
}
    showContent = () => {
      const {mode, CartStatus, setMain} = this.props

        return <Content mode={mode} CartStatus={CartStatus} setMain={setMain}/>
      
    }
    

    render() {
      const {homeApp, CartStatus, t} = this.props
      

      return (

            this.showContent()

      )
    }
}


const mapStateToProps = (state) => ({
  mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus',false),
})


const wrapper = connect(mapStateToProps, mapDispatchToProps, null)(withTranslation()(GlobalCart))
export default withRouter(wrapper)
