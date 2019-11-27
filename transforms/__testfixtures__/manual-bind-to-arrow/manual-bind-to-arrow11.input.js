class Component extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (fn) {
      fn.apply(this, Array.prototype.slice.call(arguments, 1))
    }
  }
}
