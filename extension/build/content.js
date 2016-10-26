/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _isJson = __webpack_require__(39);

	var _isJson2 = _interopRequireDefault(_isJson);

	var _getJson = __webpack_require__(40);

	var _getJson2 = _interopRequireDefault(_getJson);

	var _controls = __webpack_require__(41);

	var _controls2 = _interopRequireDefault(_controls);

	var _constants = __webpack_require__(37);

	var _expanderClick = __webpack_require__(42);

	var _expanderClick2 = _interopRequireDefault(_expanderClick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// var css = require('../content')
	var preTags = null;

	var main = function main(json) {
	  var port = chrome.extension.connect({ name: _constants.PORTNAME });
	  if (!port) return;

	  // inject html for controls and return hooks
	  var controlsHooks = (0, _controls2.default)();

	  controlsHooks.form.addEventListener('submit', function (e) {
	    e.preventDefault();

	    port.postMessage({
	      type: _constants.SEND_JSON_STRING,
	      text: json,
	      length: json.length,
	      inputJsonPath: controlsHooks.input.value || '$'
	    });
	  });

	  port.onMessage.addListener(function (msg) {
	    console.log('msg from bg', msg);
	    if (msg.type === _constants.FORMATTED) {
	      controlsHooks.inside.innerHTML = msg.html;
	      preTags = document.getElementsByTagName('pre');

	      preTags[0].hidden = true;
	    }
	  });

	  controlsHooks.switcherRaw.addEventListener('change', function (e) {
	    controlsHooks.inside.hidden = true;
	    document.querySelector('pre').hidden = false;
	  });
	  controlsHooks.switcherFormatted.addEventListener('change', function (e) {
	    controlsHooks.inside.hidden = false;
	    document.querySelector('pre').hidden = true;
	  });
	  document.addEventListener('click', _expanderClick2.default, false // No need to propogate down
	  );

	  port.postMessage({
	    type: _constants.SEND_JSON_STRING,
	    text: json,
	    length: json.length,
	    inputJsonPath: controlsHooks.input.value || '$'
	  });
	};

	window.onload = function () {
	  var jsonString = (0, _getJson2.default)();

	  if (jsonString) {

	    main(jsonString);
	  }
	};

/***/ },

/***/ 37:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MESSAGE = exports.MESSAGE = 'MESSAGE';
	var SEND_JSON_STRING = exports.SEND_JSON_STRING = 'SEND_JSON_STRING';
	var PORTNAME = exports.PORTNAME = 'PORTNAME';
	var FORMATTED = exports.FORMATTED = 'FORMATTED';
	var FORMATTING = exports.FORMATTING = 'FORMATTING';

	var NOT_JSON = exports.NOT_JSON = 'NOT_JSON';
	var ERROR_JSONPATH = exports.ERROR_JSONPATH = 'ERROR_JSONPATH';

/***/ },

/***/ 39:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isJson = function isJson() {
	  return document.body.childNodes[0].tagName === 'PRE';
	};

	exports.default = isJson;

/***/ },

/***/ 40:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var getJson = function getJson() {
	  var orig;

	  if (document.body.childNodes[0].tagName === 'PRE') {
	    return document.body.childNodes[0].innerText;
	  } else if (orig = document.getElementById('orig')) {
	    return orig.innerText;
	  } else {
	    return false;
	  }
	};

	exports.default = getJson;

/***/ },

/***/ 41:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var template = '\n  <aside class="controls">\n    <form id="controls__form">\n      <input\n        id="controls__input"\n        class="controls__input"\n        name="jsonpath"\n        value=""\n        placeholder="jsonpath"\n        autofocus\n      />\n      <button class="controls__submit">submit</button>\n    </form>\n    <span>\n      <label><input type="radio" name="switcher" value="raw" id="controls__raw" />raw</label>\n      <label><input type="radio" name="switcher" value="formatted" id="controls__formatted" checked />formatted</label>\n    </span>\n  </aside>\n  <div id="orig"></div>\n  <style>\n  body{-webkit-user-select:text;overflow-y:scroll !important;margin:0;position:relative}#optionBar{-webkit-user-select:none;display:block;position:absolute;top:9px;right:17px}#buttonFormatted,#buttonPlain{-webkit-border-radius:2px;-webkit-box-shadow:0px 1px 3px rgba(0,0,0,0.1);-webkit-user-select:none;background:-webkit-linear-gradient(#fafafa, #f4f4f4 40%, #e5e5e5);border:1px solid #aaa;color:#444;font-size:12px;margin-bottom:0px;min-width:4em;padding:3px 0;position:relative;z-index:10;display:inline-block;width:80px;text-shadow:1px 1px rgba(255,255,255,0.3)}#buttonFormatted{margin-left:0;border-top-left-radius:0;border-bottom-left-radius:0}#buttonPlain{margin-right:0;border-top-right-radius:0;border-bottom-right-radius:0;border-right:none}#buttonFormatted:hover,#buttonPlain:hover{-webkit-box-shadow:0px 1px 3px rgba(0,0,0,0.2);background:#ebebeb -webkit-linear-gradient(#fefefe, #f8f8f8 40%, #e9e9e9);border-color:#999;color:#222}#buttonFormatted:active,#buttonPlain:active{-webkit-box-shadow:inset 0px 1px 3px rgba(0,0,0,0.2);background:#ebebeb -webkit-linear-gradient(#f4f4f4, #efefef 40%, #dcdcdc);color:#333}#buttonFormatted.selected,#buttonPlain.selected{-webkit-box-shadow:inset 0px 1px 5px rgba(0,0,0,0.2);background:#ebebeb -webkit-linear-gradient(#e4e4e4, #dfdfdf 40%, #dcdcdc);color:#333}#buttonFormatted:focus,#buttonPlain:focus{outline:0}#jsonpOpener,#jsonpCloser{padding:4px 0 0 8px;color:#000;margin-bottom:-6px}#jsonpCloser{margin-top:0}#formattedJson{padding-left:28px;padding-top:6px}pre{padding:36px 5px 5px 5px}.kvov{display:block;padding-left:20px;margin-left:-20px;position:relative}.collapsed{white-space:nowrap}.collapsed>.blockInner{display:none}.collapsed>.ell:after{content:"\u2026";font-weight:bold}.collapsed>.ell{margin:0 4px;color:#888}.collapsed .kvov{display:inline}.e{width:20px;height:18px;display:block;position:absolute;left:-2px;top:1px;z-index:5;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYGBgOADE%2F3Hgw0DM4IRHgSsDFOzFInmMAQnY49ONzZRjDFiADT7dMLALiE8y4AGW6LoBAgwAuIkf%2F%2FB7O9sAAAAASUVORK5CYII%3D");background-repeat:no-repeat;background-position:center center;display:block;opacity:0.15}.collapsed>.e{-webkit-transform:rotate(-90deg);width:18px;height:20px;left:0px;top:0px}.e:hover{opacity:0.35}.e:active{opacity:0.5}.collapsed .kvov .e{display:none}.blockInner{display:block;padding-left:24px;border-left:1px dotted #bbb;margin-left:2px}#formattedJson,#jsonpOpener,#jsonpCloser{color:#333;font:13px/18px monospace}#formattedJson{color:#444}.b{font-weight:bold}.s{color:#0B7500;word-wrap:break-word}a:link,a:visited{text-decoration:none;color:inherit}a:hover,a:active{text-decoration:underline;color:#050}.bl,.nl,.n{font-weight:bold;color:#1A01CC}.k{color:#000}#formattingMsg{font:13px "Lucida Grande","Segoe UI","Tahoma";padding:10px 0 0 8px;margin:0;color:#333}#formattingMsg>svg{margin:0 7px;position:relative;top:1px}[hidden]{display:none !important}span{white-space:pre-wrap}@-webkit-keyframes spin{from{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}#spinner{-webkit-animation:spin 2s 0 infinite}*{-webkit-font-smoothing:antialiased}\n  </style>\n';

	var controls = function controls() {
	  document.body.insertAdjacentHTML('afterbegin', template);

	  return {
	    form: document.getElementById('controls__form'),
	    input: document.getElementById('controls__input'),
	    inside: document.getElementById('orig'),
	    switcherRaw: document.getElementById('controls__raw'),
	    switcherFormatted: document.getElementById('controls__formatted')
	  };
	};

	exports.default = controls;

/***/ },

/***/ 42:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var lastKvovIdGiven = 0;

	function collapse(elements) {
	  // console.log('elements', elements) ;

	  var el, i, blockInner, count;

	  for (i = elements.length - 1; i >= 0; i--) {
	    el = elements[i];
	    el.classList.add('collapsed');

	    // (CSS hides the contents and shows an ellipsis.)

	    // Add a count of the number of child properties/items (if not already done for this item)
	    if (!el.id) {
	      el.id = 'kvov' + ++lastKvovIdGiven;

	      // Find the blockInner
	      blockInner = el.firstElementChild;
	      while (blockInner && !blockInner.classList.contains('blockInner')) {
	        blockInner = blockInner.nextElementSibling;
	      }
	      if (!blockInner) continue;

	      // See how many children in the blockInner
	      count = blockInner.children.length;

	      // Generate comment text eg "4 items"
	      var comment = count + (count === 1 ? ' item' : ' items');
	      // Add CSS that targets it
	      // jfStyleEl.insertAdjacentHTML(
	      //   'beforeend',
	      //   '\n#kvov'+lastKvovIdGiven+'.collapsed:after{color: #aaa; content:" // '+comment+'"}'
	      // ) ;
	    }
	  }
	}
	function expand(elements) {
	  for (var i = elements.length - 1; i >= 0; i--) {
	    elements[i].classList.remove('collapsed');
	  }
	}

	function expanderClick(ev) {
	  // console.log('click', ev) ;

	  if (ev.which === 1) {
	    var elem = ev.target;

	    if (elem.className === 'e') {
	      // It's a click on an expander.

	      ev.preventDefault();

	      var parent = elem.parentNode,
	          div = document.getElementById('orig'),
	          prevBodyHeight = document.body.offsetHeight,
	          scrollTop = document.body.scrollTop,
	          parentSiblings;

	      // Expand or collapse
	      if (parent.classList.contains('collapsed')) {
	        // EXPAND
	        // if (modKey(ev))
	        //   expand(parent.parentNode.children) ;
	        // else
	        expand([parent]);
	      } else {
	        // COLLAPSE
	        // if (modKey(ev))
	        //   collapse(parent.parentNode.children) ;
	        // else
	        collapse([parent]);
	      }

	      // Restore scrollTop somehow
	      // Clear current extra margin, if any
	      div.style.marginBottom = 0;

	      // No need to worry if all content fits in viewport
	      if (document.body.offsetHeight < window.innerHeight) {
	        // console.log('document.body.offsetHeight < window.innerHeight; no need to adjust height') ;
	        return;
	      }

	      // And no need to worry if scrollTop still the same
	      if (document.body.scrollTop === scrollTop) {
	        // console.log('document.body.scrollTop === scrollTop; no need to adjust height') ;
	        return;
	      }

	      // console.log('Scrolltop HAS changed. document.body.scrollTop is now '+document.body.scrollTop+'; was '+scrollTop) ;

	      // The body has got a bit shorter.
	      // We need to increase the body height by a bit (by increasing the bottom margin on the jfContent div). The amount to increase it is whatever is the difference between our previous scrollTop and our new one.

	      // Work out how much more our target scrollTop is than this.
	      var difference = scrollTop - document.body.scrollTop + 8; // it always loses 8px; don't know why

	      // Add this difference to the bottom margin
	      //var currentMarginBottom = parseInt(div.style.marginBottom) || 0 ;
	      div.style.marginBottom = difference + 'px';

	      // Now change the scrollTop back to what it was
	      document.body.scrollTop = scrollTop;

	      return;
	    }
	  }
	}

	exports.default = expanderClick;

/***/ }

/******/ });
//# sourceMappingURL=content.js.map