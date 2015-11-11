import something from 'something';
import classNames from 'classnames';

class Article extends React.Component {
  render() {
    return (
      <div>
        // string literal classNames stay as classNames
        <span className="icon-class"></span>
        <span className={"icon-class"}></span>
        <span className={classNames('icon-class')}></span>
        <span className={classNames('icon-class')} style={{width:'10px'}}></span>

        // js objects will get converted to style tags
        // and merged with Object.assign if necessary.
        // Calls to the classNames module will be stripped out
        <span className={classNames(styles.one)}></span>
        <span className={classNames(styles.one, styles.two)}></span>
        <span className={styles.one} style={{width:'10px'}}></span>
        <span className={classNames('icon', 'other-icon', styles.one, styles.two)}></span>

        // conditional styles in a classNames call cannot be
        // migrated programmatically, will stay unchanged
        <span className={classNames('hey', {'someStyle': booleanValue})}></span>
      </div>
    );
  }
}