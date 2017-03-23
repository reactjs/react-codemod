import { PropTypes } from 'react';
import Text from 'Text';
import View from 'View';

function Component() {
  return <Text>text</Text>;
}

Component.propTypes = View.propTypes;

module.exports = Component;
