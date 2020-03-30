import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.less'
import { get } from 'lodash'


export class index extends Component {

    state = {

    }

    render() {
        return (
            <div className={style.table_list_search}>
                <div className={style.iconDiv}>
                    <FontAwesomeIcon icon="search" className={style.icon} size="sm" />
                </div>
                <div>
                    <input className={style.input_table_list} type="text" placeholder="Search" />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    name: get(state, 'apps.active', '')
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(index)
