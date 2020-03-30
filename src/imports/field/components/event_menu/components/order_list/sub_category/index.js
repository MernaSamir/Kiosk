import React, { Component } from 'react'
import { get } from 'lodash';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { Category } from './buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Item from './item'
import MenuItem from '../menu'
import classes from './style.less'
class MenuItemClass extends Component {

  selectType(active) {
    const { setMain } = this.props;
    setMain({ active })
  }

  renderMenuList() {
    const { types } = this.props;
    return <MenuItem list={types.slice(0, 4)} />
  }

  renderBack() {
    const { reset } = this.props;
    return (<button
      className={classes.cat_btn}
      onClick={reset.bind(this, "items__custom_menu", undefined)}>
      <FontAwesomeIcon icon="bars" className={classes.icon} />
    </button>)
  }

  renderSelect(selected_menu) {
    const { types } = this.props
    // const nth = get(this.props.types, 3, {})
    let i = 0
    for (i; i < Object.keys(types).length; i++) {
      if (types[i] == selected_menu) {
        break
      }
    }
    if (i > 3) {
      return <div className={classes.notstickysubcat_row}>
        <p>{get(selected_menu, 'name', '')}</p>
        <div className={classes.arrow_up} />
      </div>
    }
  }

  renderList(active, selected_menu) {
    const { option ,  } = this.props;
    const nth = get(this.props.types, 3, {})
    let height
    if (selected_menu.id > nth.id) {
      height = '80%'
    }
    if (active) {
      return <Item subCat={active} height={"78%"}
        notSticky={selected_menu.id > nth} option={option}/>
    }
    return (
      <Category {...{ height }} />
    )
  }

  renderListOnly = (active, selected_menu) => {
    const { option ,  } = this.props;
    let height = '100%'
    if (active) {
      return <Item subCat={active} height={"92%"} option={option} />
    }
    return (
      <Category {...{ height }} />
    )
  }

  render() {
    const { active, selected_menu, settings } = this.props;
    return <>{
      get(settings, 'menuShow', 'true') == "true" ?
        <>
          {this.renderMenuList()}
          {this.renderBack()}
          {this.renderSelect(selected_menu)}
          {this.renderList(active, selected_menu)}
        </>
        : this.renderListOnly(active, selected_menu)
    }
    </>
  }
}

export default connect((state) => {
  return {
    active: state.items__base_sales_cat.active,
    selected_menu: get(state.items__custom_menu, `data.${get(state.items__custom_menu, 'active')}`, {}),
    activeAction: get(state.actions, 'active'),
    pos_settings: get(state.main, 'pos_settings', {}),
    active_station: get(state.licensing__station, 'active', ''),
    active_mode: get(state.settings__mode, 'active', ''),
    get settings() { return get(get(this.pos_settings, this.active_station, {}), this.active_mode, {}) }
  }
}, mapDispatchToProps)(MenuItemClass);