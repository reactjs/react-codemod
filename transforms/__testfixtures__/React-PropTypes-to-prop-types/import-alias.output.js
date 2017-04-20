import PT from 'prop-types';
import React, { Component } from 'react';

class ClassComponent extends Component {
    static propTypes = {
        foo: PT.string.isRequired,
    }
}
