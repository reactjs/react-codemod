const styles = {
    one: {
        color: "red"
    },
    two: {
        color: "green"
    },
    hover: {
        [":hover"]: {
            color: "blue"
        }
    },
    media1: {
        ["min-width: 100px"]: {
            color: "blue"
        }
    },
    media2: {
        ["minWidth: 100px"]: {
            color: "blue"
        }
    },
    media3: {
        ["max-width: 100px"]: {
            color: "blue"
        }
    },
    media4: {
        ["maxWidth: 100px"]: {
            color: "blue"
        }
    }
};

export default styles;
