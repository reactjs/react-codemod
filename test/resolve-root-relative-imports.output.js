import React from "react";
import {playerActions} from "components/DeionPlayer";
import DebugBar from "components/DebugBar";
import {mediaQueries} from "domains/nfl/www/sites/Gamepass/pages/Site/styles/globals";
import UserStorage from "domains/nfl/www/sites/SSO/test/e2e/objects/UserStorage";

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
