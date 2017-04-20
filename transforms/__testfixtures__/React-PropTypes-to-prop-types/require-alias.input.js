const React = require('react');
const { Component, PropTypes: PT } = React;

class ClassComponent extends Component {
    static propTypes = {
        foo: PT.string.isRequired,
    }
}
