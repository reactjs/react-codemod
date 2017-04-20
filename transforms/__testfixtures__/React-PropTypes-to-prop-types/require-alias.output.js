const PT = require('prop-types');
const React = require('react');
const {
    Component
} = React;

class ClassComponent extends Component {
    static propTypes = {
        foo: PT.string.isRequired,
    }
}
