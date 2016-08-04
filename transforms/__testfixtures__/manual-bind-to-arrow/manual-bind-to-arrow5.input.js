class Component extends React.Component {
  constructor() {
    super();
    const self: any = this;
    self.onClick = this.onClick.bind(this);
  }
  onClick() { }
}
