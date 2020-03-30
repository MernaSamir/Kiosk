import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import Prices from './prices';

class ItemInfo extends Component {

    render() {
        const { item, category, price } = this.props
        return (
            <div className={classes.item_info_container}>
                <div className={classes.title}>
                    <p>{item.name}</p>
                </div>
                <div className={classes.cover}>
                    <img className={classes.img} src={item.photo_path} />
                </div>
                <div className={classes.description}>
                    <p>Description</p>
                </div>
                <div className={classes.cat_price}>
                    <div className={classes.cat}>
                        <p id={classes.bold}>Category:</p>
                        <p>{category}</p>
                    </div>
                </div>
                <div className={classes.details}>
                    <p>{item.desc}</p>
                </div>
                {price.length >0 && <Prices price={price} item={item} />}
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(ItemInfo);
