import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './style.less'
import Content from './content';



class Selector extends Component {

    state = {
        display: "none",
        className: this.props.btnClass
    }

    displaySelector = () => {
        const { display } = this.state

        if (display == "none") {
            this.setState({
                display: "block",
                className: this.props.clickedclass
            })
        }
        else {
            this.setState({
                display: "none",
                className: this.props.btnClass
            })
        }
    }


    render() {
        const { selectorName, data, indata } = this.props
        const { display } = this.state

        return (
            <>
                <button className={this.state.className} onClick={this.displaySelector.bind()}>
                    {selectorName}
                    <FontAwesomeIcon className={classes.icon} icon="list-ul" />
                </button>
                {display == "block" && <Content data={data} indata={indata} />}

            </>
        )
    }
}
export default Selector
