// this is a copy of convert-to-radium-test.js, except that styles won't be imported
import React from "react";
import classNames from "classnames";
import styles from "styles/bad-styles.js";

import component from "component";
import fooBar from "fooBar";

@component
@fooBar({foo: "bar"})
class Article extends React.Component {
    render() {
        return (
            <div>
                // string literal classNames stay as classNames
                <span className="icon-class"></span>
                <span className={"icon-class"}></span>
                <span className={classNames("icon-class")}></span>
                <span className={classNames("icon-class")} style={{width: "10px"}}></span>

                // js objects will get converted to style tags
                // and merged into one object
                // Calls to the classNames module will be stripped out
                <span className={styles.one}></span>
                <span className={classNames(styles.one)}></span>
                <span className={classNames(styles.one, styles.two)}></span>
                <span className={styles.one} style={{width: "10px"}}></span>
                <span className={classNames("icon", "other-icon", styles.one, styles.two)}></span>

                // nodes with interactive styles (hover state, media queries)
                // don't get a "key" attribute added to them
                <span className={styles.hover}></span>
                <span className={styles.media1}></span>
                <span className={styles.media2}></span>
                <span className={styles.media3}></span>
                <span className={styles.media4}></span>

                // conditional styles in a classNames call cannot be
                // migrated programmatically, will stay unchanged
                <span className={classNames("icon", {"someStyle": booleanValue})}></span>
            </div>
        );
    }
}

