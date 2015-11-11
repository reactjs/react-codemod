import React from "react";

class Article extends React.Component {
    render() {
        return (
            <div>
                // string literal classNames stay as classNames
                <span className="icon-class"></span>
                <span className="icon-class"></span>
                <span className="icon-class"></span>
                <span style={{width: "10px"}} className="icon-class"></span>

                // js objects will get converted to style tags
                // and merged with Object.assign if necessary.
                // Calls to the classNames module will be stripped out
                <span style={styles.one}></span>
                <span style={styles.one}></span>
                <span style={Object.assign({}, styles.one, styles.two)}></span>
                <span style={Object.assign({}, styles.one, {width: "10px"})}></span>
                <span
                    style={Object.assign({}, styles.one, styles.two)}
                    className="icon other-icon"></span>

                // conditional styles in a classNames call cannot be
                // migrated programmatically, will stay unchanged
                <span className={classNames("icon", {"someStyle": booleanValue})}></span>
            </div>
        );
    }
}
