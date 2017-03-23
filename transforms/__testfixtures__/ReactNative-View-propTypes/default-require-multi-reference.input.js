var React = require('React');
var View = require('View');

var PropTypes = React.PropTypes;

class ASTrackView extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
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
