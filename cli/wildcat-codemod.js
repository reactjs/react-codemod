#! /usr/bin/env babel-node

import {echo, exit, pwd} from "shelljs";
import nomnom from "nomnom";

const {src} = nomnom.parse();

if (!src) {
    echo("src option is required");
    exit(1);
}

console.log(pwd());
