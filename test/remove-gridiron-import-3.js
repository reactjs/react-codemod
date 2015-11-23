import React from "react";

@component
@fooBar({foo: "bar"})
class DebugPanel extends React.Component {
    render() {
        return (
            <div> test </div>
        );
    }
}

export default DebugPanel;
