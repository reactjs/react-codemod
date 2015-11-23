const chalk = require("chalk");

module.exports = function formatError(title, msg) {
    console.error([
        chalk.styles.bold.open,
        title,
        chalk.styles.bold.close
    ].join(""));

    console.error([
        chalk.styles.red.open,
        msg,
        chalk.styles.red.close
    ].join(""));

    // spacer.gif
    console.error();
};
