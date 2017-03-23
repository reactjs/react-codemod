const React = require('React');
const ScrollView = require('ScrollView');
const View = require('View');

const ViewPropTypes = require('ViewPropTypes');

const PropTypes = React.PropTypes;

class AdsManagerAbstractRow extends React.Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
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
