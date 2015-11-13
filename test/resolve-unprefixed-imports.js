import React from "react";
import stub from "./fixtures/import-stubs/baz";

class TestComponent extends GridironComponent {
    render() {
        return (
            <aside className="debug">
                <ul>
                    <li>test</li>
                </ul>
            </aside>
        );
    }
}

export default TestComponent;
