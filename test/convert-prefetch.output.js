import React from "react";
import {Helmet} from "@nfl/gridiron";
import Prefetch from "react-wildcat-prefetch";

import {Helmet} from "@nfl/gridiron/addons";
import Prefetch from "react-wildcat-prefetch";
import GameStore from "../../stores/GameStore";

@component
@foo({bar: true})
class SuperBowl extends React.Component {
    render() {}
}

export default Prefetch(GameStore.getGame, "superBowlData")(SuperBowl)
;
