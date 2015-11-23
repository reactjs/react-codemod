import React from "react";
import {RouteHandler} from "react-router";

class Admin extends React.Component {
    render() {
        return (
            <main>
                <RouteHandler
                    hasHeader={true}
                    {...this.props}
                    {...this.state}
                />
            </main>
        );
    }
}

export default Admin;
