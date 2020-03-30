import React, { Component } from 'react'

class Image extends Component {
    state={
        src: this.props.src
    }

   
    onError=()=>{
        this.setState({
            src: './logo.png',
            errored: true,
          });
    }

    render() {
        const { src } = this.state;
        return (
            
            <img src={src}  onError={this.onError}/>
               
        )
    }
}


export default Image