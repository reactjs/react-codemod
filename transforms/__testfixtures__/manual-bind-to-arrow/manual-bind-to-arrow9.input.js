class Component extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }
    onClick() { }
}

class Component2 extends React.Component {
    constructor() {
        super();
        this.didClick = this.didClick.bind(this);
    }
    didClick() { }
}