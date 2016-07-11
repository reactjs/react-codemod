class SomeName extends React.Component {
  _onChange: Function;

  constructor(props: Object) {
    super(props);
    this._onChange = this._onChange.bind(this);
    if (!this.props.something.somePreference) {
      this._onChange(SomeConstantsOptions.SOME_CONSTANT);
    }
  }

  /* Some comment */
  _onChange(value: String): void {
    Dispatcher.handleViewAction({
      type: SomeConstantsOptions.SOME_CONSTANT,
      payload: value,
    });
  }
}
