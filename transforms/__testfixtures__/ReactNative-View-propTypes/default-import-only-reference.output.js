import { PropTypes } from 'react';
import Text from 'Text';
import ViewPropTypes from 'ViewPropTypes';

function Component() {
  return <Text>text</Text>;
}

Component.propTypes = ViewPropTypes;

module.exports = Component;
