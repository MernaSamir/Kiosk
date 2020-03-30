import React from 'react'
import classes from './../style.less'
import IconBtn from './../../../clicked_icon'

const Pagaing =  ({ page, pageMax, handelPageClick }) => (
   pageMax>1? <div className={classes.paging}>
        <IconBtn name="caret-left" onClick={handelPageClick.bind(this, -1)} />
        <div>{page}/{pageMax}</div>
        <IconBtn name="caret-right" onClick={handelPageClick.bind(this, 1)} />
    </div> :<div></div>
)

export default Pagaing