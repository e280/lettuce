"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freshId = freshId;
var stz_1 = require("@e280/stz");
function freshId() {
    return stz_1.hex.random(32);
}
