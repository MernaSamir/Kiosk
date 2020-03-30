import React from 'react'
import DropDown from './Components/drop_down'

const RenderdropDown = (props) => {
    const Component = DropDown(props.appName);
    return <Component {...props} />

}
export default RenderdropDown