var React = require('React');
var View = require('View');

const ViewPropTypes = require('ViewPropTypes');

var PropTypes = React.PropTypes;

class ASTrackView extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    track: PropTypes.object.isRequired,
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.props.track}
      </View>
    );
  }
}
