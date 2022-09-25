import * as React from "react";

<div ref={current => {
  if (process.env.NODE_ENV !== 'production') {
    if (Object.isSealed(this.refs)) {
      this.refs = {};
    }
  }

  this.refs['bad'] = current;
}} />;
