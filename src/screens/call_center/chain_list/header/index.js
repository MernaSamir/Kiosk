import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import ServiceProvider from 'components/actions/service_provider'
import Search from 'components/search'
import { withTranslation } from 'react-i18next';
import applyFilters from 'helpers/functions/filters'

class Header extends Component {

    renderTitle = () => {
        const { t } = this.props
        return <div className={classes.title}>
            <p>{t("Call In")}</p>

            {this.renderInfoBtn()}
        </div>
    }

    renderInfoBtn = () => {
        return <button type="button" onClick={this.getinfo.bind()} >
            <FontAwesomeIcon icon="info" />
        </button>
    }

    getinfo = () => {
        const { setMain } = this.props
        setMain('popup', {
            popup: {
                type: 'Information', visable: true, width: '60vw', border: '1.5px solid #d73f7c'
            }
        })

    }

    renderSearch = () => {
        return <div className={classes.search}><Search /></div>
    }

    renderNewCusBtn = () => {
        const { t } = this.props
        return <button  disabled={!applyFilters({key: 'authorize', compare: ['customer_add']})} type="button" className={classes.btn}
            onClick={() => this.props.history.push('/new/pr')}>{t("New Customer")}</button>
    }
    renderService = () => {
        return <ServiceProvider className={classes.btn} />
    }

    renderPagination = () => {
        return < div className={classes.search_btn_pag_row} >
            {this.renderSearch()}
            <div className={classes.btn_pag_div}>
                {this.renderNewCusBtn()}
                {this.renderService()}
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
        const { maxPage, page,t } = this.props
        return <p>{page} {t("of")} {maxPage}</p>
    }

    render() {
        return (
            <>
                {this.renderTitle()}
                {this.renderPagination()}
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    active: get(state.licensing__chain.data, state.licensing__chain.active, {})
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(Header)))