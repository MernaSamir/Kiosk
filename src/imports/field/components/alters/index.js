import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty, get, map, find, } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import AlterItems from './alters'
import classes from './style.less';
class Alters extends Component {
    state = {
        active: ''
    }

    onChange = (value) => {
        const { field } = this.props;
        field.onChange({
            target: {
                name: field.name,
                value
            }
        })
    }
    onClick = (d) => {
        const { active } = this.state
        if (d.id == active.id) {
            this.setState({ active: "" })
        }
        else {

            this.setState({ active: d })
        }
        const { field } = this.props;
        const value = isEmpty(field.value) ? [] : field.value;
        const found = find(value, v => (v.main == d.id));
        if (found) {
            // let newVal = reject(value, v=>(v.main == found.main))
            // this.onChange(newVal)
        }
        else {
            this.onChange([...value, { main: d.id, alter: '' }])
        }



    }


    renderOptions = () => {
        const { list, field, disabled = [], alters } = this.props
        const {active} = this.state
        return map(list, (d, idx) => {
         
            const found = find(field.value, s => s.main == d.id)
            const alter = found ? find(alters, d => found.alter == d.id) : undefined
            return  <button disabled={disabled.includes(d.main) ? true : false}key={idx} type="button" className={active.id==d.id ? "active" : alter?'alter':''} onClick={this.onClick.bind(this, d)}>
            {alter ? alter.name : d.name}
        </button>
           
          
            
            
        }

        )
    }
    render() {
        const {  field, alters } = this.props
        console.log(field.value)
        const {active} = this.state
        const found = find(field.value, s => s.main == active.id)
        const alter = found ? find(alters, d => found.alter == d.id) : undefined
        return (
            <div className={classes.container}>
                <div className={classes.main}>

                {this.renderOptions()}
            </div>
                {active&&<p>By:</p> }
                {active&& <AlterItems main={active} showMain={Boolean(alter) && !found.id} {...this.props}></AlterItems>}
              </div>
        );
    }
}
const mapStateToProps = (state, props) =>
    ({ list: props.options || get(state, `${get(props.app, 'name', '')}.data`, {}) })
export default connect(mapStateToProps, mapDispatchToProps)(Alters);