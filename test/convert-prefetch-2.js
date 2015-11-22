import React from "react";
import {GridironComponent} from "@nfl/gridiron";
import {Helmet, Prefetch} from "@nfl/gridiron/addons";

class Home extends GridironComponent {
    constructor(...args) {
        super(...args);
    }

    static async prefetchVideo(props) {}

    render() {}
}

export {Home as PageComponent};
export default Prefetch(Home, Home.prefetchVideo);
