import React, { Component } from 'react'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Zones from 'screens/DineIn/zones'
import Floors from 'screens/DineIn/floors'
import Grid from './grid'
import classes from './style.less'
import {withTranslation} from 'react-i18next'
class Tables extends Component {
    assignTables = (id) =>{
        const {appendPath} = this.props
        appendPath('parties__reservation', 'item',{table: id, action: 'add'})
    }
  render() {
    const {t} = this.props
    return (
      <div className={classes.body} >
                <div className={`${classes.contanier} ${classes.header} `}>
                    <Zones t={t} mode = 'reservation'></Zones>
                     <Floors t={t}></Floors>
                </div>
                <div className={classes.tableGrid}>
                    <div className={classes.gridRadius}>
                        <Grid />
                        {this.props.children}
                    </div>
                </div>
                
            </div>
    )
  }
}
const mapStateToProps = () =>({

})

export default withTranslation() (connect (mapStateToProps, mapDispatchToProps)(Tables) )
