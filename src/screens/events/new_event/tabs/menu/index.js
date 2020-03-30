import React, { Component } from 'react'
import SetMenu from './tabs/set_menu/index';
import LaCarte from './tabs/La_carte';
import { get , find } from 'lodash'
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';


 class Menu extends Component {
    state = {
        activeTab: "Set Menu"
    }
    tabs = [
        { name: "Set Menu", Component: SetMenu },
        { name: "A La Carte", Component: LaCarte },
    ]
    setActive=(d)=>{
        this.setState({activeTab:d.name},()=>{
        })
    }
    renderTabs=()=> {
        return Render([{
            name: "basic.sub_type",
            type: 'selectButtons',
            className: classes.inputButton,
            selectFirst: true,

            options: [
                { id: 'SM', name: 'Set Menu' },
                { id: 'LC', name: 'A La Carte' },
              ],
              onClick:this.setActive

        }])
    }
    render() {
         const {t, values} = this.props
        const Component = find(this.tabs,{name:this.state.activeTab})
        return (
            <div className={classes.contaier}>
                <div className={classes.header}>
                <p>{t("Menu Details")}</p>
                    <div className={classes.tabs}>
                        {this.renderTabs()}
                    </div>
                    <p>{t("Total")}: 00.00</p>
                </div>
           
               {get(this.state,'activeTab', false)&& Component.Component && <Component.Component values={values}/>}
            </div>
        )
    }
}
export default withTranslation()(Menu)