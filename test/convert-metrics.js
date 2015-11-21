import React from "react";
import {getPageName} from "analytics.config";

class Home extends GridironComponent {
    static willTrackPageView() {
        const tracking = getPageName({
            siteName: "nfl.com",
            siteSection: "anthology",
            siteSubsection: "super bowl",
            pageDetail: "landing"
        });
        return Promise.resolve(tracking);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Home;
