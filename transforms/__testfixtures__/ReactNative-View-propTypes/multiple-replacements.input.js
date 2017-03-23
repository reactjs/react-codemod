const React = require('React');
const ScrollView = require('ScrollView');
const View = require('View');

const PropTypes = React.PropTypes;

class AdsManagerAbstractRow extends React.Component {
  static propTypes = {
    containerStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  render() {
    let child = null;
    if (this.props.child) {
      child = (
        <View style={this.props.childContainerStyle}>
          {this.props.child}
        </View>
      );
    }

    return (
      <ScrollView style={this.props.style}>
        {child}
      </ScrollView>
    );
  }
}
