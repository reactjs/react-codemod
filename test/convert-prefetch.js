import React from "react";
import {Helmet} from "@nfl/gridiron";
import {Prefetch} from "@nfl/gridiron/addons";

import {Prefetch, Helmet} from "@nfl/gridiron/addons";
import GameStore from "../../stores/GameStore";

@component
@foo({bar: true})
class SuperBowl extends React.Component {
    render() {}
}

export default Prefetch(SuperBowl, GameStore.getGame, "superBowlData");
