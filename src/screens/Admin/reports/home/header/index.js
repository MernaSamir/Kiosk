import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Back from 'components/Back_Button'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import {withRouter} from 'react-router-dom'
import Search from 'components/search'
import HeaderBack from 'components/header_back'

class Header extends Component {

    renderBack = () => {
       
        return <Back onClick={this.back}/>
    }
    back=()=>{
        const {setMain, history} =  this.props
        setMain('main', {search:''})
        history.goBack();
    }
   
    search=(input)=>{
      const{setMain} = this.props
      setMain('main', {search:input})
    }
    renderPagination = () => {
        return <div className={classes.pag_div}>
            <button type="button" className={classes.pag_btns}>
                <FontAwesomeIcon icon="caret-left" className={classes.icon} />
            </button>
            <p>1 of 2</p>
            <button type="button" className={classes.pag_btns}>
                <FontAwesomeIcon icon="caret-right" className={classes.icon} />
            </button>
        </div>
    }

    render() {
        const {t} =  this.props
        return (
            <div className={classes.title_div}>
                {/* {this.renderBack()}
                <p>{t('Reports')}</p> */}
                 <HeaderBack name={t("Reports")} />
                <div className={classes.pag_search_div}>

                    {/* <button type="button" className={classes.search_btn} onClick={this.openPopup}>
                        <FontAwesomeIcon icon="search" />
                    </button> */}
                    {/* <Search/>

                    {this.renderPagination()} */}


                </div>
            </div>
        )
    }
}

export default connect(null,mapDispatchToProps)(withRouter(Header))