import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, get } from 'lodash'
import classes from './style.less'
import { withRouter } from 'react-router'
import moment from 'moment';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';

class CardCollapse extends Component {
    state = {
        display: "none",
        transform: "rotate(180deg)",
        transitionDuration: ".4s",
        page: 1
    }
    handelPagination = (delta)=>{
        const {page} = this.state
        this.setState({page: page+delta})
    }
    active = () => {
        if (this.state.display == "none") {
            this.setState({
                display: 'block',
                transform: 'rotate(0deg)'
            })
        }

        else {
            this.setState({
                display: 'none',
                transform: 'rotate(180deg)'
            })
        }
    }
    tackAction = (onClick) => {
        get(this, onClick, () => { })()
    }

    AddNew = () => {

        const { history , setMain, customer} = this.props
        setMain("form_actions",{active_tab:'2'})
        setMain("parties__customer",{active: customer})
        history.push('/edit/' + customer)
    }
    renderCustomerInf = (child, idx) => {
        const { data } = this.props
        let list = get (data, child.data,"")
        if(child.list=='page') {
            const {page} = this.state;
            const element =list[page-1];
            return <p> &nbsp;{get(element,child.show)}</p>
        }
        if(child.list=='list')
        {            return map(list,(d)=>{
             return <p > &nbsp;{get(d,child.show,'Not Assign')}</p>
            })
        }
        if(child.list=='date'){
            const value = get(get(data, child.data, data.customer), child.show)
            return <p > &nbsp; {value ? moment(value).format('DD-MM-YYYY'):"Not Assign"}</p>

        }
   
        else {
            return <p > &nbsp; {get(get(data, child.data, data.customer), child.show) || get(data, child.alter, '')}</p>
        }
        

    }
    renderBasic = () => {
        const { meta, data , t } = this.props
        return map(get(meta, 'basicFields', {}), (child, idx) => {
            if (child.type) {
                return <child.type
                    className={child.class}
                    onClick={this.tackAction.bind(this, child.onClick)}
                    maxLength = {data.addresses.length}
                    page={this.state.page}
                    handelClick={this.handelPagination.bind(this)}
                >{t(child.title)}

                </child.type>
            }
            else {

                return <div className={classes.row}>

                    <p className={classes.key}>{t(idx)}  </p>
                    <div className={get(child, 'classDiv' ,classes.valueList)}>
                         {this.renderCustomerInf(child, idx)}</div>
                </div>
            }
        }
        )

    }
    renderExtended = () => {
        const { meta  } = this.props
        return map(get(meta, 'extendedFields', {}), (child, idx) => {
            return <div className={classes.row}>
                <p className={classes.key}>{idx}  </p>
                <div className={get(child, 'classDiv' ,classes.valueList)}>
                 {this.renderCustomerInf(child, idx)}</div>
            </div>
        }
        )

    }
    render() {
        const { style, name , t} = this.props
        const { display } = this.state;
        return (
            <div className={classes.cont} style={{ ...style }}>

                <div className={classes.header} >

                    <p >{t(name)}</p>
                    {(name != 'Address'|| name!='العنوان') ?
                        <FontAwesomeIcon
                            icon="chevron-down"
                            className={classes.icon}
                            style={{ transform: this.state.transform, transitionDuration: this.state.transitionDuration }}
                            onClick={this.active}
                        /> : undefined
                    }
                </div>

                <div className={name == 'Address' ? classes.addressCard : classes.body}  >
                    {
                        this.renderBasic()


                    }
                </div>

                <div className={classes.body} style={{ display: display }}>
                    {
                        this.renderExtended()
                    }
                </div>


            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    customer: get(state.parties__customer,'active')
})

export default withTranslation() (withRouter( connect(mapStateToProps, mapDispatchToProps)(CardCollapse)))