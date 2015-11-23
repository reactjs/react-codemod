import React from "react";

class Admin extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    render() {
        return (
            <main>
                {React.cloneElement(this.props.children, {
                    hasHeader: true,
                    ...this.props,
                    ...this.state
                })}
            </main>
        );
    }
}

export default Admin;
