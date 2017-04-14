import React, { PropTypes } from 'react';
import classnames from 'classnames';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const Accordion = ({ children, className }) => {
  const classNames = classnames('bx--accordion', className);
  return (
    <ul className={classNames}>
      {children}
    </ul>
  );
};

Accordion.propTypes = propTypes;

export default Accordion;