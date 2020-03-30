import React, { Component} from 'react'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import {withTranslation} from 'react-i18next'

class EditTable extends Component {

    openPopup=(params)=>{
        const { setMain} = this.props
        setMain('popup', {popup: {type: params.type,visable:true, width: '50%',
        childProps:get(params,'childProps',{})
      }})

    }
    seperate =(combined)=>{
      const {setMain} = this.props

      setMain('dinin__tables', { 
        item: { 
          id: combined.id, 
          combined:null,  
          action: 'update',
          onSuccess(){
            return [{
              type: 'set_main_popup',
              data: {popup:{}}
            }]
          } 
        }
      })
    }
    combine=()=>{
      const {table , t} = this.props
      let combined = applyFilters({
        key: 'Find',
        path:'dinin__tables',
        params:{
          combined:table.id

        }
      })

      if(combined){
        return <button onClick={this.seperate.bind(this, combined)}>{t("seperte")}</button>
      }
      else{
        const authorize = applyFilters({
          key: 'authorize', compare: ['combine_table']
      })
      return<>
      <button disabled={!authorize} onClick={this.openPopup.bind(this,{type:'CombineTable', childProps:{type:'order'} } )}>{t("combine order")}</button>
      <button disabled={!authorize} onClick={this.openPopup.bind(this,{type:'CombineTable',childProps:{type:'table'} }  )}>{t("combine table")}</button>
      </>
      }
    }

  render() {
    const { table, serve, order , t} = this.props
    const authorize = applyFilters({key: 'authorize', compare: ['transfer_table']})
    return (
      <div className={classes.container}>
          <p>{table.name}</p>
          <p>{t("waiter")}: {serve.name}</p>
          <p>{t("Guests")}: {order.guests_num}</p>
        <div className={classes.btnsDiv}>
            <button disabled={!authorize} onClick={this.openPopup.bind(this,{type:'TransferTable'})}>{t("transfer")}</button>
            {this.combine()}
        </div>
        <button onClick={this.openPopup.bind(this,{type:'TablePopup', width: '50%'})}
        disabled={!applyFilters({key: 'authorize', compare: ['edit_table']})}>
        <FontAwesomeIcon className = {classes.icon} icon={['far','edit']}/>
        {t("Edit")}</button>
      </div>
    )
  }
}
const mapStateToProps = (state) =>({
    table: get(state.dinin__tables, `data.${state.dinin__tables.active}`, {}),
    get order(){return get(state.orders__main.data, this.table.active, {})},
    get serve(){return get(state.users.data, this.order.serve, {})}
    

})


export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()( EditTable))
