import React, { Component } from 'react'
import FireImg from 'assets/images/fire (1).svg'
import whiteIMG from 'assets/images/fire (2).svg'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
import classes from './style.less';
import { get } from 'lodash';
class Fire extends Component {
    openPopup=()=>{
        const {setMain} = this.props
        const popup = {type: 'Fire', visable:true,width:"50%"}
        setMain('popup',{popup})
    }

    renderButton = () => {
        const {popup, t} = this.props
        return <button className={popup=='Fire'?`${classes.btn} ${classes.active}`:classes.btn} onClick={this.openPopup}>
                    <img className={classes.fire}  src={popup=='Fire'?whiteIMG:FireImg} />
                    <span>{t("Fire Order")}</span>
                </button>
    }
    render() {
        return (
                this.renderButton()
               

        )
    }
}
const mapStateToProps = (state) =>({
    popup: get(state.popup ,'popup.type', '' )
})
 export default connect (mapStateToProps,mapDispatchToProps)(Fire)