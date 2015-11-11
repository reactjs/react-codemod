import something from 'something';

class Article extends React.Component {
  render() {
    return (
      <div>
        <span className="icon-class"></span>
        <span className="icon-class"></span>
        <span className="icon-class"></span>
        <span style={{width:'10px'}} className="icon-class"></span>
        <span style={Object.assign({}, styles.one, {width:'10px'})}></span>
        <span style={styles.one}></span>
        <span style={Object.assign({}, styles.one, styles.two)}></span>
        <span
          style={Object.assign({}, styles.one, styles.two)}
          className="icon other-icon"></span>
        <span className={classNames('hey', {'someStyle': true})}></span> // must be updated manually
      </div>
    );
  }
}