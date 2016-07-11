class Component extends React.Component {
  constructor() {
    super();
    const self: any = this;
    self._onMapResize = debounceCore(this._onMapResize.bind(this), 100);
  }
  onClick = () => { };
  onMapResize() { }
}
