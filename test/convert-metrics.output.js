import React from "react";
import {exposeMetrics} from "react-metrics";
import {getPageName} from "metrics.config.js";

@exposeMetrics
class Home extends GridironComponent {
    static willTrackPageView() {
        const tracking = getPageName({
            siteName: "nfl.com",
            siteSection: "anthology",
            siteSubsection: "super bowl",
            pageDetail: "landing"
        });
        return tracking;
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Home;
