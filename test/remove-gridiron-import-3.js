import GridironComponent from "@nfl/gridiron";
import React from "react";

@component
@fooBar({foo: "bar"})
class DebugPanel extends GridironComponent {
    render() {
        return (
            <div> test </div>
        );
    }
}

export default DebugPanel;
