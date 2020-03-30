import React, { Component } from 'react'
import { Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Item extends Component {
    state = {
        contact:'',
    }
    handelChangeItem = () => {
        const { name, setValues, form, field, extra={} } = this.props
        const { contact } = this.state
        // this.setState({ contact : event.target.value })
        
        
        form.setValues([...form.values, { contact, ...extra }])
    }
    
    handleChangeInput = (value) =>{
        console.log(event.target.value)
        
        this.setState({
            contact : event.target.value
        })
       
    }

    render() {
        const { handleChange, field, type } = this.props;
        let r = ''
        return (
            <div>
                <Input
                    
                    {...this.props}
                    onChange={()=>this.handleChangeInput(this.state.contact)}
                    // value={row ? row.contact : undefined}
                    // defaultValue={row ? row.contact : 'asdasdasdas'}
                    placeholder="4t4t4t"
                    name={r}
                // value={(field.value|| [])[index]}
                // name={field.name}

                />
                <FontAwesomeIcon icon="plus-circle" className="PlusIcon" onClick={this.handelChangeItem} />
                {()=>this.handleChangeInput(this.state.contact)}
            </div>

        )
    }
}
