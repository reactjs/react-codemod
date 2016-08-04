class Component extends React.Component {
  constructor() {
    super();
    (this: any).onClick = this.onClick.bind(this);
  }
  onClick() { }
}
