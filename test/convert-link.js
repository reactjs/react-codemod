import React from "react";
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
                <Link to={this.props.isLoggedIn ? "dashboard" : `/login?returnTo=/admin/dashboard`}>
                    You can go about your business
                </Link>

                <Link
                    to="superbowl"
                    params={linkParams}
                    style={styles.filterOption}
                >
                    {game.romanNumeral}
                </Link>

                <Link
                    style={linkedBrochureStyles.mobileLinkOverlay}
                    to="guide"
                    params={{id}}
                />

                <Link
                    to="dai-editor"
                    params={{
                        primaryId,
                        backupId
                    }}
                    query={{
                        ip: `38`
                    }}
                >
                    Primary {primaryId} {(backupId) ? `/ Backup ${backupId}` : null} / ip-address: 38
                </Link>
            </div>
        );
    }
}

export default NotFound;
