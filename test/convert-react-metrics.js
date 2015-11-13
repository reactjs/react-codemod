import React from "react";
import {GridironComponent} from "@nfl/gridiron";
import metrics from "@nfl/react-metrics";
import foo from "./foo/index.js";


class TestComponent extends GridironComponent {
    render() {
        return (
            <div>
                <li>test</li>
            </div>
        );
    }
}

export default TestComponent;
