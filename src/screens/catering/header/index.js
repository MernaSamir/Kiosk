import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from 'components/search'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class Header extends Component {

    renderTitlt = () => {
        const { t } = this.props
        return <div className={classes.title}>
            <p>{t("Catering")}</p>
        </div>
    }

    renderSearch = () => {
        return <div className={classes.search}> <Search /></div>

    }

    NewCat = () => {
        const { history ,setMain} = this.props
        setMain('parties__customer', { active: ''})

        history.push('/new_cat')
    }

    renderNewCutBtn = () => {
        const { t } = this.props

        return <button type="button" onClick={this.NewCat.bind()} className={classes.btn}>{t('New Catering')}</button>
    }

    renderPagination = () => {
        return < div className={classes.search_btn_pag_row} >
            {this.renderSearch()}
            <div className={classes.btn_pag_div}>
                {this.renderNewCutBtn()}
                <div className={classes.pag_div}>
                    {this.renderPagBtns("left", -1)}
                    {this.renderPageNum()}
                    {this.renderPagBtns("right", 1)}
                </div>
            </div>
        </div >
    }

    renderPagBtns = (type, value) => {
        return <button type="button" className={classes.pag_btn} onClick={this.onClick.bind(this, value)}>
            <FontAwesomeIcon icon={`caret-${type}`} className={classes.icon} />
        </button>
    }

    onClick = (value) => {
        const { handleClick } = this.props
        handleClick(value)
    }

    renderPageNum = () => {
        const { maxPage, page } = this.props
        return <p>{page} of {maxPage}</p>
    }

    render() {
        return (
            <>
                {this.renderTitlt()}
                {this.renderPagination()}
            </>
        )
    }
}
export default connect(null,mapDispatchToProps) (withRouter(withTranslation()(Header)))
