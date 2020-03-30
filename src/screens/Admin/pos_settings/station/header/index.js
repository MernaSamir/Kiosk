import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Back from 'components/Back_Button'

class Header extends Component {

    

    renderPagination = () => {
        const { page, maxLen, handelClick } = this.props
        return <div className={classes.pag_div}>
            <button type="button" className={classes.pag_btns} onClick={handelClick.bind(this,-1)}>
                <FontAwesomeIcon icon="caret-left" className={classes.icon} />
            </button>
            <p>{`${page} of ${maxLen}`}</p>
            <button type="button" className={classes.pag_btns} onClick={handelClick.bind(this,1)} >
                <FontAwesomeIcon icon="caret-right" className={classes.icon} />
            </button>
        </div>
    }

    render() {
        const {t} =  this.props
        return (
            <div className={classes.title_div}>
                <Back/>
                <p>{t('POS Settings')}</p>
                {/* <div className={classes.pag_search_div}>

                    <button type="button" className={classes.search_btn} >
                        <FontAwesomeIcon icon="search" />
                    </button>
                    {this.renderPagination()}
                </div> */}
            </div>
        )
    }
}

export default Header