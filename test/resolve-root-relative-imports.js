import React from "react";
import {playerActions} from "src/components/DeionPlayer";
import DebugBar from "src/components/DebugBar";
import {mediaQueries} from "src/domains/NFL/sites/Gamepass/pages/Site/styles/globals";
import UserStorage from "src/domains/NFL/sites/SSO/test/e2e/objects/UserStorage";

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
