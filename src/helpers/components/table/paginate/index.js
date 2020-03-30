import React, { Component } from 'react';
import styles from './style.less';
// import {FontAwesomeIcon} from '@fontawesome/react-fontawesome'
class paginate extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {size, changeSize, pages, page} = this.props;
        return (
             <div className={styles.mgFooter}>
                <p className={styles.PagescounterP}>{size} per page: {pages}</p>
                <FontAwesomeIcon className={styles.Pages_caret} icon="caret-down" onClick={changeSize.bind(this, page-1)} />
                <p className={styles.PagescounterP}>{page}  of  {pages}</p>
                {page > 0 && <FontAwesomeIcon className={styles.Pages_chevron} icon="chevron-left" onClick={changeSize.bind(this, page-1)} />}
                {(page+1)!= pages && <FontAwesomeIcon className={styles.Pages_chevron} icon="chevron-left" style={{ transform: "rotate(180deg)" }} onClick={changeSize(this, page+1)} />}
            </div>

        );
    }
}

export default paginate;
