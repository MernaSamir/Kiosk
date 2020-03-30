import React from 'react';
import InputComponent from 'helpers/components/input.js'
import classes from './style.less'
import Slider from '@material-ui/lab/Slider';

export default class selectShape extends InputComponent {
    
  
    onClick = (event, d)=>{
        this.onChange(d)
    }
   
  
    
    render() {
        const {field} = this.props;
        return (
            <div className={classes.sliderdiv}>

            <Slider
                classes={{ track: classes.slider, thumb: classes.thumb, thumbWrapper: classes.thumbWrapper }}
                value={field.value||2}
                min={2}
                max={4}
                step={1}
                onChange={this.onClick}
                    />
                    </div>
        );
    }
}
