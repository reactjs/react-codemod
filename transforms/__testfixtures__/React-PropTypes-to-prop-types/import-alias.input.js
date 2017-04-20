import React, { Component, PropTypes as PT } from 'react';

class ClassComponent extends Component {
    static propTypes = {
        foo: PT.string.isRequired,
    }
}
