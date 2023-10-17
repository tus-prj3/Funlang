"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var Block = /** @class */ (function () {
    function Block(x, y, width, height, identifier, appendClass) {
        if (appendClass === void 0) { appendClass = 'simple_block'; }
        var _a;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.identifier = identifier;
        this.parent = null;
        this.children = [];
        this.element = document.createElement("div");
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
        this.element.className = appendClass;
        this.element.onmousedown = this.onMouseDown;
        (_a = document.getElementById('workspace')) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);
    }
    Block.prototype.onMouseDown = function (event) {
        var targetBlock = this.element.getBoundingClientRect();
        console.info(targetBlock);
    };
    return Block;
}());
exports.Block = Block;
