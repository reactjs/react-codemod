import React from "react";

class Admin extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    render() {
        const {
            children,
            ...props
        } = this.props;

        return (
            <main>
                {React.cloneElement(children, {
                    hasHeader: true,
                    ...props,
                    ...this.state
                })}
            </main>
        );
    }
}

export default Admin;
