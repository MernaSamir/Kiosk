import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoldOrderElement from './Hold_Order_Element'
import Back_Button from 'components/Back_Button'
import { map,get } from 'lodash';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';
import Search from 'components/search'

export class Hold_Order extends Component {
    static propTypes = {
        prop: PropTypes
    }

    state = {
        orders: []
    }
    componentWillUnmount=()=>{
        const {setMain} = this.props
        setMain('main', {Search:''})
       
    }

    ordersList = () => {
        const { setMain, filters } = this.props
        let count = 0;
      
        const data = filters?applyFilters({
            key: 'Search',
            data:this.list,
            params:{
            call_name:filters,
            note:filters
            }
        }):this.list
        return map(data, (e, index) => {
            return <HoldOrderElement
                key={index}
                {...e}
                setMain={setMain}
                count={count}
            />
        })
    }

    render() {
        const {t} = this.props
        this.list = applyFilters({
            key: 'Filter', 
            path: 'orders__main', 
            params: {
                end_time: null
            },
            then: {
                key: 'Reject',
                params: {
                    hold_time: null
                }
            }
        })
        return (
            <div className={classes.HO_main}>
                <Back_Button />

                <div className={classes.HO_up}>
                    {/* <div className={classes.HO_Search} >
                        <div style={{ flexGrow: '3', paddingLeft: '1.5vw' }}>
                            <FontAwesomeIcon icon='search' size='lg' className={classes.icon} />
                        </div> 
                        <input className={classes.HO_input} placeholder="Search" /> 
                    </div> */}
                        <Search />

                    {/* <div className={classes.HO_pagination_div}>
                        <button type="button" className={classes.HO_pagination_btn}>
                            <FontAwesomeIcon icon="caret-left" className={classes.btn_icon} />
                        </button>
                        <p>1 of 2</p>
                        <button type="button" className={classes.HO_pagination_btn}>
                            <FontAwesomeIcon icon="caret-right" className={classes.btn_icon} />
                        </button>
                    </div> */}
                </div>
                <div className={classes.HO_TableDiv}>
                    <table style={{ backgroundColor: '#f5f5f5' }}>
                        <tr>
                            <th className={classes.HO_tableDiv_th} style={{ width: '5%' }}></th>
                            <th className={classes.HO_tableDiv_th} style={{ width: '65%' }}>{t("Call Name or Note")}</th>
                            <th className={classes.HO_tableDiv_th} style={{ width: '30%' }}>{t("Status")}</th>
                            <th className={classes.HO_tableDiv_th} style={{ width: '10%' }}></th>
                        </tr>
                        {this.ordersList()}
                    </table>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    item: state.item,
    active: state.active,
    params: {
        end_time__isnull: 1
    },
    filters: get(state.main,'search', false)

});


export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Hold_Order))
