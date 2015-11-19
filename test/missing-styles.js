import React from "react";
import styles from "styles/bad-styles.js";

class Article extends React.Component {
    render() {
        return (
            <div>
                // if styles cannot be imported,
                // no elements will receive a key attribute
                <span className={styles.one}></span>
            </div>
        );
    }
}
