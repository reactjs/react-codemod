import React from "react";
import radium from "react-wildcat-radium";
import styles from "styles/bad-styles.js";

@radium
class Article extends React.Component {
    render() {
        return (
            <div>
                // if styles cannot be imported,
                // no elements will receive a key attribute
                <span style={styles.one}></span>
            </div>
        );
    }
}
