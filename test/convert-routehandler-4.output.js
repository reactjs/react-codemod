import React from "react";

class Admin extends React.Component {
    static propTypes = {
        foo: React.PropTypes.shape({
            bar: React.PropTypes.string.isRequired
        }),

        children: React.PropTypes.node
    }

    render() {
        const hasHeader = true;

        return (
            <main>
                {this.props.children}
            </main>
        );
    }
}

export default Admin;
