import React from "react";
import {GridironComponent} from "@nfl/gridiron";
import {Helmet} from "@nfl/gridiron/addons";

import Prefetch from "react-wildcat-prefetch";

class Home extends GridironComponent {
    constructor(...args) {
        super(...args);
    }

    static async prefetchVideo(props) {}

    render() {}
}

export {Home as PageComponent};
export default Prefetch(Home.prefetchVideo)(Home)
;
