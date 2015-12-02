import React from "react";

class Admin extends React.Component {
    static propTypes = {
        foo: React.PropTypes.shape({
            bar: React.PropTypes.string.isRequired
        }),

        children: React.PropTypes.node
    }

    render() {
        const {
            children,
            ...props
        } = this.props;

        const hasHeader = true;

        return (
            <main>
                {React.cloneElement(children, {
                    ...props
                })}
            </main>
        );
    }
}

export default Admin;
