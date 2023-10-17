/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/blocks/Block.ts":
/*!****************************!*\
  !*** ./ts/blocks/Block.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Block = void 0;\nvar Block = /** @class */ (function () {\n    function Block(x, y, width, height, identifier, appendClass) {\n        if (appendClass === void 0) { appendClass = 'simple_block'; }\n        var _a;\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n        this.identifier = identifier;\n        this.parent = null;\n        this.children = [];\n        this.element = document.createElement(\"div\");\n        this.element.style.left = x + \"px\";\n        this.element.style.top = y + \"px\";\n        this.element.style.width = width + \"px\";\n        this.element.style.height = height + \"px\";\n        this.element.className = appendClass;\n        this.element.onmousedown = this.onMouseDown;\n        (_a = document.getElementById('workspace')) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);\n    }\n    Block.prototype.onMouseDown = function (event) {\n        var targetBlock = this.element.getBoundingClientRect();\n        console.info(targetBlock);\n    };\n    return Block;\n}());\nexports.Block = Block;\n\n\n//# sourceURL=webpack://funlang/./ts/blocks/Block.ts?");

/***/ }),

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar BlockStore_1 = __webpack_require__(/*! ./store/BlockStore */ \"./ts/store/BlockStore.ts\");\nvar Block_1 = __webpack_require__(/*! ./blocks/Block */ \"./ts/blocks/Block.ts\");\nvar generateButton = document.getElementById('generate');\ngenerateButton.onclick = function (_) {\n    BlockStore_1.blocks.push(new Block_1.Block(100, 100, 100, 50, \"test_\".concat(BlockStore_1.blocks.length)));\n};\n\n\n//# sourceURL=webpack://funlang/./ts/index.ts?");

/***/ }),

/***/ "./ts/store/BlockStore.ts":
/*!********************************!*\
  !*** ./ts/store/BlockStore.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.blocks = void 0;\nexports.blocks = [];\n\n\n//# sourceURL=webpack://funlang/./ts/store/BlockStore.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ts/index.ts");
/******/ 	
/******/ })()
;