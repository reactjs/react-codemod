/* code taken from https://github.com/reactjs/react-router/blob/master/modules/IndexRoute.js */
/* @flow */

import React from 'react'
import warning from './routerWarning'
import invariant from 'invariant'
import { createRouteFromReactElement } from './RouteUtils'
import { component, components, falsy } from './InternalPropTypes'

const { func } = React.PropTypes

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */
class IndexRoute extends React.Component {
  props: {
    path?: $FlowFixMe,
    component?: $FlowFixMe,
    components?: $FlowFixMe,
    getComponent?: $FlowFixMe,
    getComponents?: $FlowFixMe,
  };

  static createRouteFromReactElement(element, parentRoute) {
    /* istanbul ignore else: sanity check */
    if (parentRoute) {
      parentRoute.indexRoute = createRouteFromReactElement(element)
    } else {
      warning(
        false,
        'An <IndexRoute> does not make sense at the root of your route config'
      )
    }
  }

  static propTypes = {
    path: falsy,
    component,
    components,
    getComponent: func,
    getComponents: func
  };

  /* istanbul ignore next: sanity check */
  render() {
    invariant(
      false,
      '<IndexRoute> elements are for router configuration only and should not be rendered'
    )
  }
}

export default IndexRoute
