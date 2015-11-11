import React from 'react';
import {GridironComponent} from "@nfl/gridiron";

class TestComponent extends GridironComponent {
  render() {
    return (
      <aside className='debug'>
        <ul>
          <li>test</li>
        </ul>
      </aside>
    );
  }
}

export default TestComponent;