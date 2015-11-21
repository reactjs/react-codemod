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
                {React.cloneElement(this.props.children, {
                    hasHeader: hasHeader,
                    ...this.props,
                    ...this.state
                })}
            </main>
        );
    }
}

export default Admin;
