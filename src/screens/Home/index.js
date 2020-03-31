import React, { Component } from 'react'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import Loading from "helpers/components/loading";
import classes from './style.less'
import Table from '../../assets/images/003-serving-dish@3x.png';

class Home extends Component {
    
    
    render() {
        
        const chain = applyFilters({
            key: 'Find',
            path: 'licensing__chain.data',
            params: {
                id: this.props.chain_id
            }
        })
        const items = applyFilters({
            key: 'Filter',
            path: 'items__custom_menu.data',
            params: {
                active:true
            }
        })

        //scr image 8alt l7ad mytb3t
        const renderItems=()=>{
           return items.map((d,v)=>{
               return(
                   <div key={v} className={classes.buttonContainer} onClick={()=>selectItem(d)}>
                   <div className={classes.button}>
                       <img src={Table} className={classes.pic}/>
                   </div>
                   <div className={classes.title}>{d.name}</div>
                   </div>
                       
               )
           })

        }
       const selectItem=(item)=>{
        const { history,setMain } = this.props;
        history.push("/order");
        setMain('items__custom_menu',{active:item.id})

        }

        
        return(
            !chain ? <Loading/>
            :<div className={classes.Container}>
           
                <div className={classes.space}></div>
              <p className={classes.Text}> Welcome To {chain.name}</p>
              
              <p className={classes.Text}> shwayt klam gai mn database lama yt7at fel database yb2a y7lha rabna </p>
              <div className={classes.btnContainer}>
                  {renderItems()}
              </div>
               
            </div>
            )

    }
}
const mapStateToProps = state => ({
    chain_id: get(state.licensing__chain, 'active', {}),
})
export default connect(mapStateToProps,mapDispatchToProps)(Home);

