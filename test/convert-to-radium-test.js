import something from 'something';
import classNames from 'classnames';

class Article extends React.Component {
  render() {
    return (
      <div>
        <span className="icon-class"></span>
        <span className={"icon-class"}></span>
        <span className={classNames('icon-class')}></span>
        <span className={classNames('icon-class')} style={{width:'10px'}}></span>
        <span className={styles.one} style={{width:'10px'}}></span>
        <span className={classNames(styles.one)}></span>
        <span className={classNames(styles.one, styles.two)}></span>
        <span className={classNames('icon', 'other-icon', styles.one, styles.two)}></span>
        <span className={classNames('hey', {'someStyle': true})}></span> // must be updated manually
      </div>
    );
  }
}