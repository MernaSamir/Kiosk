import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters';
import { get, map, isEmpty, filter } from 'lodash';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Removals from './removals'
import Replacements from './replacements';
class No extends Component {
    
    static onSubmit (props, values){
        const {detail, setMain} = props
        const removals = map(get(values,'items', ''), d=>(
            {stock_item: d.stock_item, detail:detail.id,_type: 'rm', remove:d.remove, id:d.id}
        ) )
        const replacements = map(filter ( get(values,'repalcements', ''), r=>!isEmpty(r.alter) ), d=>{
            console.log('d--->', d)
            const main = applyFilters({path:`items__recipe.data.${d.main}`})
            const alter = applyFilters({path:`items__recipe_alter.data.${d.alter}`})
            return {id:d.id, stock_item: main.stock_item, detail:detail.id, replaced:alter.stock_item, _type: 'rc'}
        })
       
        setMain('orders__recipe_removals', {item:{data:[...removals,...replacements], action:'bulkEdit', onSuccess:this.afterAdd.bind(this,props)}})

    }
    static afterAdd(props, data){
        const {onCancel} = props
        onCancel()
        return []
      
    }
    remove=(d)=>{
        const {setMain} =  this.props
        setMain('orders__recipe_removals', {item:{id:d.id, action:'delete'}})
    }
    replaced=()=>{
        const {detail} = this.props
        const replacements = applyFilters({
            key:'Filter',
            path:'orders__recipe_removals',
            params:{
                detail:detail.id,
                _type:'rc'
            }
        })
        return map(replacements, (d, key)=>{
            const main = applyFilters({path:`stock__items.data.${d.stock_item}`})
            const alter = applyFilters({path:`stock__items.data.${d.replaced}`})
            return<div className ={classes.replaced} key={key} onClick={this.remove.bind(this, d)}>
                <p>{main.name} By {alter.name}</p>
                <FontAwesomeIcon icon="times" className={classes.icon} />
                
            </div>
        })

    }

    

   

    
    

    render() {
        const {onCancel,detail, t} =this.props
        const replacements = applyFilters({
            key:'Filter',
            path:'orders__recipe_removals',
            params:{
                detail:detail.id,
                _type:'rc'
            }
        })
        return (
            <div className={classes.container}>
                <p className={classes.title}>NO</p>
                <div className={classes.ingredients_div}>
                <p>Exclude Ingredients: </p>
                <Removals detail={detail} Render={Render}/>
                <Replacements detail={detail} Render={Render} />
                {Boolean(replacements.length)&&<p>Your Replaced</p>}
                {this.replaced()}
            </div>
                <div className={classes.saveBtns}>
                    <button onClick={onCancel}> {t('Cancel')}</button>
                    <button type='submit'>{t('Ok')}</button>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    detail: get(state.orders__details.data, state.orders__details.active,''),
    data: state.orders__recipe_removals.data
})


export default withTranslation() (connect(mapStateToProps, mapDispatchToProps)(Form(No) ) )
