import React from "react";
import {RouteHandler} from "react-router";

class Admin extends React.Component {
    static propTypes = {
        foo: React.PropTypes.shape({
            bar: React.PropTypes.string.isRequired
        })
    }

    render() {
        const hasHeader = true;

        return (
            <main>
                <RouteHandler
                    hasHeader={hasHeader}
                    {...this.props}
                    {...this.state}
                />
            </main>
        );
    }
}

export default Admin;
