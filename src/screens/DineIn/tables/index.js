import React, { Component } from 'react'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import GridArea from './table_grid'
import { connect } from 'react-redux'
import Floors from '../floors'
import Zones from './zones'
import Popup from './admin_popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash';
import {withTranslation} from 'react-i18next'
import Back from 'components/Back_Button'
class TablesContainer extends Component {

  display = classes.display

  addNewTable = () => {
    const { setMain } = this.props
    setMain('popup', { popup: { type: 'AddTable', visable: true, width: '70%' } })
  }

  move = () => {
    const { setMain, move } = this.props
    setMain("dinin__tables", { move: !move, active: '' })
  }


  render() {
    const { move, t } = this.props
    return (
      <div className={classes.tablesContainer}>
        <div className={classes.height}>
          <div className={classes.tables_container_header}>
            <div className={classes.table_header_left}>
              <Back/>
                
              <Floors containerClass={classes.floor_details} t={t}/>
              <div className={classes.floor_details}>
                <span>{t('Zone')}</span>
                <Zones t={t}/>
              </div>

            </div>
            <div className={classes.rightHeader}>
              <div >
                <button className={move ? classes.clicked : ""} onClick={this.move}>
                  <FontAwesomeIcon className={classes.icon} icon='arrows-alt'></FontAwesomeIcon>
                  {t('Move')}
                </button>
                <button onClick={this.addNewTable}>{t('Add New Table')}</button>
                {/* <button  onClick={this.addNewTable}>Add Multiple Table</button> */}
              </div>
            </div>
          </div>
          <div className={classes.tableGrid}>
            <div className={classes.gridRadius}>
              <GridArea sendTable={this.sendTable} />
              <Popup t = {t}></Popup>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  item: get(state.dinin__tables, 'item', {}),
  move: get(state.dinin__tables, 'move', false)
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)( withTranslation()(TablesContainer) )
export default wrapper