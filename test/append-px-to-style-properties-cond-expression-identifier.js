const style1 = {
  height: '10',
};

const style2 = {
  height: '20',
};

class Cool extends Component {
  render() {
    const showing = this.props.showing;
    return (
      <div style={showing ? style1 : style2}>
        hello
      </div>
    );
  }
}
