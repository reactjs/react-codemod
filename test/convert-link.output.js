import React from "react";
import {routeHelper as route} from "addons/RouteHelper.js";
import {Link} from "react-router";

@component
@fooBar({foo: "bar"})
class NotFound extends React.Component {
    static propTypes = {
        isLoggedIn: React.PropTypes.bool.isRequired
    }

    render() {
        return (
            <div className="not-found">
                <Link to={route.for(this.props.isLoggedIn ? "dashboard" : `/login?returnTo=/admin/dashboard`)}>
                    You can go about your business
                </Link>

                <Link to={route.for("superbowl", linkParams)} style={styles.filterOption}>
                    {game.romanNumeral}
                </Link>

                <Link
                    style={linkedBrochureStyles.mobileLinkOverlay}
                    to={route.for("guide", {id})} />

                <Link
                    to={route.for("dai-editor", {
                        primaryId,
                        backupId
                    })}
                    query={{
                        ip: `38`
                    }}>
                    Primary {primaryId} {(backupId) ? `/ Backup ${backupId}` : null} / ip-address: 38
                </Link>
            </div>
        );
    }
}

export default NotFound;
