const React = require('react');
const SomeOtherComponent = require('SomeOtherComponent');

class PMTAuthenticationFailureDialog extends React.Component<any, any> {
  componentDidMount(): void {
    SomeOtherComponent.mixin.componentDidMount.apply(this);
  }

  UNSAFE_componentWillMount(): void {
    SomeOtherComponent.mixin.UNSAFE_componentWillMount.apply(this);
  }

  componentWillUnmount(): void {
    SomeOtherComponent.mixin.componentWillUnmount.apply(this);
  }

  render() {
    return null;
  }
}