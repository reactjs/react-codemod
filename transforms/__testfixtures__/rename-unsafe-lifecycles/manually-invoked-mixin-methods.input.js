const React = require('react');
const SomeOtherComponent = require('SomeOtherComponent');

class PMTAuthenticationFailureDialog extends React.Component<any, any> {
  componentDidMount(): void {
    SomeOtherComponent.mixin.componentDidMount.apply(this);
  }

  componentWillMount(): void {
    SomeOtherComponent.mixin.componentWillMount.apply(this);
  }

  componentWillUnmount(): void {
    SomeOtherComponent.mixin.componentWillUnmount.apply(this);
  }

  render() {
    return null;
  }
}