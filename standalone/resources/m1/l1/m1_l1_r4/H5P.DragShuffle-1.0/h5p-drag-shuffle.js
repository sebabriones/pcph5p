/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/h5p-lib-controls/src/scripts/aria/drag.js":
/*!*****************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/aria/drag.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Drag)
/* harmony export */ });
/* harmony import */ var _utils_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/elements */ "../node_modules/h5p-lib-controls/src/scripts/utils/elements.js");
/* harmony import */ var _utils_functional__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/functional */ "../node_modules/h5p-lib-controls/src/scripts/utils/functional.js");



/**
 * @type {string}
 * @readonly
 */
const ATTRIBUTE_ARIA_GRABBED = 'aria-grabbed';

/**
 * @type {function} setGrabbedTrue
 * @param {HTMLElement} element
 */
const setGrabbed = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(ATTRIBUTE_ARIA_GRABBED);

/**
 * @type {function} isGrabbed
 * @param {HTMLElement} element
 */
const isGrabbed = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.attributeEquals)(ATTRIBUTE_ARIA_GRABBED, 'true');

/**
 * @type {function} filterHasAttributeDropEffect
 */
const filterHasAttributeGrabbed = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.filter)((0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.hasAttribute)(ATTRIBUTE_ARIA_GRABBED));

/**
 * Sets all aria-grabbed to 'false'
 * @param {HTMLElement[]} elements
 * @type {function} setAllGrabbedToFalse
 */
const setAllGrabbedToFalse = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.compose)((0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.forEach)((0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(ATTRIBUTE_ARIA_GRABBED, 'false')), filterHasAttributeGrabbed);

/**
 * @type {function} hasGrabbed
 * @param {HTMLElement[]} elements
 */
const hasGrabbed = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.compose)((0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.some)(isGrabbed), filterHasAttributeGrabbed);

/**
 * @class
 */
class Drag {
  /**
   * Inits this class
   *
   * @param {Controls} controls
   */
  init(controls) {
    /**
     * @type {Controls}
     */
    this.controls = controls;

    // handle select event
    this.controls.on('select', this.select, this);
  };

  /**
   * Marks element as aria-grabbed = 'false' and adds to controller
   *
   * @param element
   */
  addElement(element) {
    setGrabbed('false', element);
    this.controls.addElement(element);
  }

  /**
   * Sets aria-grabbed to 'false' for all elements that has it
   */
  setAllGrabbedToFalse() {
    setAllGrabbedToFalse(this.controls.elements);
  }

  /**
   * Returns true if any of the elements are grabbed
   *
   * @return {boolean}
   */
  hasAnyGrabbed() {
    return hasGrabbed(this.controls.elements)
  }

  /**
   * Un selects all, but selects new element if not already selected
   *
   * @param {HTMLElement} element
   */
  select({element}) {
    const alreadyGrabbed = isGrabbed(element);

    this.setAllGrabbedToFalse();

    if(!alreadyGrabbed) {
      setGrabbed('true', element);
    }
  }
}

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/aria/drop.js":
/*!*****************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/aria/drop.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Drop)
/* harmony export */ });
/* harmony import */ var _utils_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/elements */ "../node_modules/h5p-lib-controls/src/scripts/utils/elements.js");
/* harmony import */ var _utils_functional__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/functional */ "../node_modules/h5p-lib-controls/src/scripts/utils/functional.js");



/**
 * @type {string}
 * @readonly
 */
const ATTRIBUTE_ARIA_DROPEFFECT = 'aria-dropeffect';

/**
 * @type {function} setDropEffectNone
 */
const setDropEffectNone = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(ATTRIBUTE_ARIA_DROPEFFECT, 'none');

/**
 * @type {function} setDropEffectNone
 */
const setDropEffectMove = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)(ATTRIBUTE_ARIA_DROPEFFECT, 'move');

/**
 * @type {function} filterHasAttributeDropEffect
 */
const filterHasAttributeDropEffect = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.filter)((0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.hasAttribute)(ATTRIBUTE_ARIA_DROPEFFECT));

/**
 * Sets all drop zones to move
 * @param {HTMLElement[]} elements
 * @type {function} setDropZoneEffectsToMove
 */
const setAllDropEffectsToMove = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.compose)((0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.forEach)(setDropEffectMove), filterHasAttributeDropEffect);

/**
 * Sets all drop zones to none
 * @param {HTMLElement[]} elements
 * @type {function} setAllDropEffectsToNone
 */
const setAllDropEffectsToNone = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.compose)((0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.forEach)(setDropEffectNone), filterHasAttributeDropEffect);

/**
 * Class for handling Drop Zones
 *
 * @class
 */
class Drop {
  /**
   * Inits this class
   * @param {Controls} controls
   */
  init(controls) {
    /**
     * @type {Controls}
     */
    this.controls = controls;
  };

  /**
   * On elements with aria-dropeffect, set aria-dropeffect to 'move'
   * @public
   */
  setAllToMove() {
    setAllDropEffectsToMove(this.controls.elements);
  }

  /**
   * On elements with aria-dropeffect, set aria-dropeffect to 'none'
   * @public
   */
  setAllToNone() {
    setAllDropEffectsToNone(this.controls.elements);
  }
}

/**
 * Enum for ARIA drop effects
 * @readonly
 * @enum {string}
 */
Drop.DropEffect = {
  COPY: 'copy',
  MOVE: 'move',
  EXECUTE: 'execute',
  POPUP: 'popup',
  NONE: 'none'
};

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/controls.js":
/*!****************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/controls.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var _utils_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/elements */ "../node_modules/h5p-lib-controls/src/scripts/utils/elements.js");
/* harmony import */ var _utils_functional__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/functional */ "../node_modules/h5p-lib-controls/src/scripts/utils/functional.js");
/* harmony import */ var _mixins_eventful__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mixins/eventful */ "../node_modules/h5p-lib-controls/src/scripts/mixins/eventful.js");




/**
 * Controls Event
 * @typedef {Object} ControlsEvent
 * @property {HTMLElement} element
 * @property {number} index
 * @property {HTMLElement[]} elements
 * @property {HTMLElement} oldElement
 */
/**
 * Add element event
 * @event Controls#addElement
 * @type ControlsEvent
 */
/**
 * Remove element event
 * @event Controls#removeElement
 * @type ControlsEvent
 */
/**
 * Previous element event
 * @event Controls#previousElement
 * @type ControlsEvent
 */
/**
 * Next element event
 * @event Controls#nextElement
 * @type ControlsEvent
 */
/**
 * Select option event
 * @event Controls#select
 * @type ControlsEvent
 */
/**
 * Close event
 * @event Controls#close
 * @type ControlsEvent
 */
/**
 * Drag element event
 * @event Controls#drag
 * @type ControlsEvent
 */

/**
 * @type {function} removeTabIndex
 */
const removeTabIndex = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.removeAttribute)('tabindex');
/**
 * @type {function} removeTabIndexForAll
 */
const removeTabIndexForAll = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.forEach)(removeTabIndex);
/**
 * @type {function} setTabIndexZero
 */
const setTabIndexZero = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)('tabindex', '0');
/**
 * @type {function} setTabIndexMinusOne
 */
const setTabIndexMinusOne = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.setAttribute)('tabindex', '-1');
/**
 * @type {function} hasTabIndex
 */
const hasTabIndex = (0,_utils_elements__WEBPACK_IMPORTED_MODULE_0__.hasAttribute)('tabindex');

/**
 * @class
 * @mixes Eventful
 */
class Controls {
  constructor(plugins) {
    // add event system
    Object.assign(this, (0,_mixins_eventful__WEBPACK_IMPORTED_MODULE_2__.Eventful)());

    /**
     *@property {HTMLElement} tabbableElement
     */
    /**
     * @property {object[]} plugins
     */
    this.plugins = plugins || [];

    /**
     * @property {HTMLElement[]} elements
     */
    this.elements = [];

    /**
     * @property {boolean} useNegativeTabIndex
     */
    this.negativeTabIndexAllowed = false;

    // move tabindex to next element
    this.on('nextElement', this.nextElement, this);

    // move tabindex to previous element
    this.on('previousElement', this.previousElement, this);

    // move tabindex for fist element
    this.on('firstElement', this.firstElement, this);

    // move tabindex for last element
    this.on('lastElement', this.lastElement, this);

    // init plugins
    this.initPlugins();
  }

  /**
   * Add controls to an element
   *
   * @param {HTMLElement} el
   *
   * @fires Controls#addElement
   * @public
   */
  addElement(el) {
    this.elements.push(el);

    this.firesEvent('addElement', el);

    if (this.elements.length === 1) { // if first
      this.setTabbable(el);
    }
  };

  /**
   * Add controls to an element
   *
   * @param {HTMLElement} el
   * @param {number} position
   *
   * @fires Controls#addElement
   * @public
   */
  insertElementAt(el, position) {
    this.elements.splice(position, 0, el);

    this.firesEvent('addElement', el);

    if (this.elements.length === 1) { // if first
      this.setTabbable(el);
    }
  }

  /**
   * Add controls to an element
   *
   * @param {HTMLElement} el
   *
   * @fires Controls#addElement
   * @public
   */
  removeElement(el) {
    this.elements = (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.without)([el], this.elements);

    // if removed element was selected
    if(hasTabIndex(el)) {
      this.setUntabbable(el);

      // set first element selected if exists
      if(this.elements[0]) {
        this.setTabbable(this.elements[0]);
      }
    }

    this.firesEvent('removeElement', el);
  };

  /**
   * Returns the number of elements is controlled by this object
   *
   * @return {number}
   */
  count() {
    return this.elements.length;
  }

  /**
   * Fire event
   *
   * @param {string} type
   * @param {HTMLElement|EventTarget} el
   *
   * @public
   */
  firesEvent(type, el) {
    const index = this.elements.indexOf(el);

    return this.fire(type, {
      element: el,
      index: index,
      elements: this.elements,
      oldElement: this.tabbableElement
    });
  }

  /**
   * Sets tabindex on an element, remove it from all others
   *
   * @param {number} index
   *
   * @private
   */
  nextElement({index}) {
    const isLastElement = index === (this.elements.length - 1);
    const nextEl = this.elements[isLastElement ? 0 : (index + 1)];

    this.setTabbable(nextEl);
    nextEl.focus();
  }

  /**
   * Sets tabindex on the first element, remove it from all others
   *
   * @private
   */
  firstElement() {
    const element = this.elements[0];
    this.setTabbable(element);
    element.focus();
  }

  /**
   * Sets tabindex on the first element, remove it from all others
   *
   * @private
   */
  lastElement() {
    const element = this.elements[this.elements.length - 1];
    this.setTabbable(element);
    element.focus();
  }

  /**
   * Selects the element at a position given by argument
   *
   * @param {number} index
   * @public
   */
  setTabbableByIndex(index) {
    const nextEl = this.elements[index];

    if (nextEl) {
      this.setTabbable(nextEl);
    }
  }

  /**
   * Sets tabindex on an element, remove it from all others
   *
   * @param {HTMLElement} el
   * @public
   */
  setTabbable(el) {
    (0,_utils_functional__WEBPACK_IMPORTED_MODULE_1__.forEach)(this.setUntabbable.bind(this), this.elements);
    setTabIndexZero(el);
    this.tabbableElement = el;
  }

  /**
   * Removes tabbability from an element
   *
   * @param {HTMLElement} el
   */
  setUntabbable(el) {
    if (el === document.activeElement) {
      return;
    }

    if(this.negativeTabIndexAllowed) {
      setTabIndexMinusOne(el);
    }
    else {
      removeTabIndex(el);
    }
  }

  /**
   * Sets tabindex on an element, remove it from all others
   *
   * @param {number} index
   *
   * @private
   */
  previousElement({index}) {
    const isFirstElement = index === 0;
    const prevEl = this.elements[isFirstElement ? (this.elements.length - 1) : (index - 1)];

    this.setTabbable(prevEl);
    prevEl.focus();
  }

  /**
   * Use tabindex="-1" instead of removing tabindex for non-focused elements
   */
  useNegativeTabIndex() {
    this.negativeTabIndexAllowed = true;
    this.elements.forEach(element => {
      if(!element.hasAttribute('tabindex')){
        setTabIndexMinusOne(element);
      }
    })
  }

  /**
   * Initializes the plugins
   *
   * @private
   */
  initPlugins() {
    this.plugins.forEach(function(plugin){
      if(plugin.init !== undefined){
        plugin.init(this);
      }
    }, this);
  }
}

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/mixins/eventful.js":
/*!***********************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/mixins/eventful.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Eventful: () => (/* binding */ Eventful)
/* harmony export */ });
/**
 * @mixin
 */
const Eventful = () => ({
  listeners: {},

  /**
   * Listen to event
   *
   * @param {string} type
   * @param {function} listener
   * @param {object} [scope]
   *
   * @function
   * @return {Eventful}
   */
  on: function(type, listener, scope) {
    /**
     * @typedef {object} Trigger
     * @property {function} listener
     * @property {object} scope
     */
    const trigger = {
      'listener': listener,
      'scope': scope
    };

    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(trigger);

    return this;
  },

  /**
   * Fire event. If any of the listeners returns false, return false
   *
   * @param {string} type
   * @param {object} [event]
   *
   * @function
   * @return {boolean}
   */
  fire: function(type, event) {
    const triggers = this.listeners[type] || [];

    return triggers.every(function(trigger) {
      return trigger.listener.call(trigger.scope || this, event) !== false;
    });
  },

  /**
   * Listens for events on another Eventful, and propagate it trough this Eventful
   *
   * @param {string[]} types
   * @param {Eventful} eventful
   */
  propagate: function(types, eventful) {
    let self = this;
    types.forEach(type => eventful.on(type, event => self.fire(type, event)));
  }
});

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/ui/keyboard.js":
/*!*******************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/ui/keyboard.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Keyboard)
/* harmony export */ });
/**
 * @class
 * @classdesc Keyboard navigation for accessibility support
 */
class Keyboard {
  constructor() {
    /**
     * @property {boolean} selectability
     */
    this.selectability = true;
  }

  /**
   * Inits this class
   *
   * @param {Controls} controls
   */
  init(controls) {
    /**
     * Need to have a common binding of handleKeyDown, so that it can be a
     * common instance to be used for addEventListener and removeEventListener
     * @type {function}
     */
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);

    /**
     * @type {Controls}
     */
    this.controls = controls;
    this.controls.on('addElement', this.listenForKeyDown, this);
    this.controls.on('removeElement', this.removeKeyDownListener, this);
  };

  /**
   * Listens for a keyboard press when element is focused
   *
   * @param {HTMLElement} element
   * @private
   */
  listenForKeyDown({element}) {
    element.addEventListener('keydown', this.boundHandleKeyDown);
  };

  /**
   * Remove a keyboard press listener
   *
   * @param {HTMLElement} element
   * @private
   */
  removeKeyDownListener({element}) {
    element.removeEventListener('keydown', this.boundHandleKeyDown);
  };

  /**
   * Handles key down
   *
   * @param {KeyboardEvent} event Keyboard event
   * @private
   */
  handleKeyDown(event) {
    switch (event.which) {
      case 27: // Escape
        this.close(event.target);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 35: // End
        this.lastElement(event.target);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 36: // Home
        this.firstElement(event.target);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 13: // Enter
      case 32: // Space
        this.select(event.target);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 37: // Left Arrow
      case 38: // Up Arrow
        // ignore with modifiers, so not to interfere with Chromevox
        if(!this.hasChromevoxModifiers(event)) {
          this.previousElement(event.target);
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 39: // Right Arrow
      case 40: // Down Arrow
        // ignore with modifiers, so not to interfere with Chromevox
        if(!this.hasChromevoxModifiers(event)) {
          this.nextElement(event.target);
          event.preventDefault();
          event.stopPropagation();
        }
        break;
    }
  };

  /**
   * Checks if the Chromevox modifiers are pressed
   *
   * @param {KeyboardEvent} event Keyboard event
   * @private
   */
  hasChromevoxModifiers(event) {
    return event.shiftKey || event.ctrlKey;
  }

  /**
   * Fires the previous element event
   *
   * @param {HTMLElement|EventTarget} el
   * @fires Controls#previousElement
   */
  previousElement(el) {
    if(this.controls.firesEvent('beforePreviousElement', el) !== false) {
      this.controls.firesEvent('previousElement', el);
      this.controls.firesEvent('afterPreviousElement', el);
    }
  };

  /**
   * Fire the next element event
   *
   * @param {HTMLElement|EventTarget} el
   * @fires Controls#nextElement
   */
  nextElement(el) {
    if(this.controls.firesEvent('beforeNextElement', el) !== false) {
      this.controls.firesEvent('nextElement', el);
      this.controls.firesEvent('afterNextElement', el);
    }
  };

  /**
   * Fires the select event
   *
   * @param {EventTarget|HTMLElement} el
   * @fires Controls#select
   */
  select(el){
    if(this.selectability) {
      if(this.controls.firesEvent('before-select', el) !== false) {
        this.controls.firesEvent('select', el);
        this.controls.firesEvent('after-select', el)
      }
    }
  };

  /**
   * Fire the next element event
   *
   * @param {HTMLElement|EventTarget} el
   * @fires Controls#nextElement
   */
  firstElement(el) {
    if(this.controls.firesEvent('beforeFirstElement', el) !== false) {
      this.controls.firesEvent('firstElement', el);
      this.controls.firesEvent('afterFirstElement', el);
    }
  };

  /**
   * Fire the next element event
   *
   * @param {HTMLElement|EventTarget} el
   * @fires Controls#nextElement
   */
  lastElement(el) {
    if(this.controls.firesEvent('beforeLastElement', el) !== false) {
      this.controls.firesEvent('lastElement', el);
      this.controls.firesEvent('afterLastElement', el);
    }
  };

  /**
   * Disable possibility to select a word trough click and space or enter
   *
   * @public
   */
  disableSelectability() {
    this.selectability = false;
  };

  /**
   * Enable possibility to select a word trough click and space or enter
   *
   * @public
   */
  enableSelectability() {
    this.selectability = true;
  }

  /**
   * Fires the close event
   *
   * @param {HTMLElement|EventTarget} el
   * @fires Controls#close
   */
  close(el) {
    if(this.controls.firesEvent('before-close', el) !== false) {
      this.controls.firesEvent('close', el);
      this.controls.firesEvent('after-close', el)
    }
  }
}

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/ui/mouse.js":
/*!****************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/ui/mouse.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Mouse)
/* harmony export */ });
/**
 * @class
 * @classdesc Keyboard navigation for accessibility support
 */
class Mouse {
  constructor() {
    /**
     * @property {boolean} selectability
     */
    this.selectability = true;
    this.handleClickBound = this.handleClick.bind(this);
    this.handleDragBound = this.handleDrag.bind(this);
  }

  /**
   * Inits this class
   *
   * @param {Controls} controls
   */
  init(controls) {
    /**
     * @type {Controls}
     */
    this.controls = controls;
    this.controls.on('addElement', this.listenForKeyDown, this);
    this.controls.on('removeElement', this.unlistenForKeyDown, this);
    
  };

  /**
   * Listens for a keyboard press when element is focused
   *
   * @param {HTMLElement} element
   * @private
   */
  listenForKeyDown({element}) {
    element.addEventListener('click', this.handleClickBound);
    element.addEventListener('drag', this.handleClickBound);
  };

  /** 
   * Remove listeners 
   * 
   * @param {HTMLElement} element
   * @private
  */
  unlistenForKeyDown({element}) {
    element.removeEventListener('click', this.handleClickBound);
    element.removeEventListener('drag', this.handleDragBound);
  };

  /**
   * Handles mouseClick
   *
   * @param {MouseEvent} event Keyboard event
   * @private
   */
  handleClick(event) {
    this.controls.firesEvent('select', event.currentTarget);
  };

  /**
   * Handles key down
   *
   * @param {MouseEvent} event Keyboard event
   * @private
   */
  handleDrag(event) {
    this.controls.firesEvent('drag', event.currentTarget);
  };

  /**
   * Disable possibility to select a word trough click and space or enter
   *
   * @public
   */
  disableSelectability() {
    this.selectability = false;
  };

  /**
   * Enable possibility to select a word trough click and space or enter
   *
   * @public
   */
  enableSelectability() {
    this.selectability = true;
  }
}

/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/utils/elements.js":
/*!**********************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/utils/elements.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addClass: () => (/* binding */ addClass),
/* harmony export */   appendChild: () => (/* binding */ appendChild),
/* harmony export */   attributeEquals: () => (/* binding */ attributeEquals),
/* harmony export */   classListContains: () => (/* binding */ classListContains),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   getAttribute: () => (/* binding */ getAttribute),
/* harmony export */   hasAttribute: () => (/* binding */ hasAttribute),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   nodeListToArray: () => (/* binding */ nodeListToArray),
/* harmony export */   querySelector: () => (/* binding */ querySelector),
/* harmony export */   querySelectorAll: () => (/* binding */ querySelectorAll),
/* harmony export */   removeAttribute: () => (/* binding */ removeAttribute),
/* harmony export */   removeChild: () => (/* binding */ removeChild),
/* harmony export */   removeClass: () => (/* binding */ removeClass),
/* harmony export */   setAttribute: () => (/* binding */ setAttribute),
/* harmony export */   show: () => (/* binding */ show),
/* harmony export */   toggleAttribute: () => (/* binding */ toggleAttribute),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass),
/* harmony export */   toggleVisibility: () => (/* binding */ toggleVisibility)
/* harmony export */ });
/* harmony import */ var _functional__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functional */ "../node_modules/h5p-lib-controls/src/scripts/utils/functional.js");


/**
 * Get an attribute value from element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {string}
 */
const getAttribute = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, el) => el.getAttribute(name));

/**
 * Set an attribute on a html element
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 */
const setAttribute = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, value, el) => el.setAttribute(name, value));

/**
 * Remove attribute from html element
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
const removeAttribute = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, el) => el.removeAttribute(name));

/**
 * Check if element has an attribute
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
const hasAttribute = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, el) => el.hasAttribute(name));

/**
 * Check if element has an attribute that equals
 *
 * @param {string} name
 * @param {string} value
 * @param {HTMLElement} el
 *
 * @function
 * @return {boolean}
 */
const attributeEquals = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, value, el) => el.getAttribute(name) === value);

/**
 * Toggles an attribute between 'true' and 'false';
 *
 * @param {string} name
 * @param {HTMLElement} el
 *
 * @function
 */
const toggleAttribute = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((name, el) => {
  const value = getAttribute(name, el);
  setAttribute(name, (0,_functional__WEBPACK_IMPORTED_MODULE_0__.inverseBooleanString)(value), el);
});

/**
 * The appendChild() method adds a node to the end of the list of children of a specified parent node.
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 *
 * @function
 * @return {HTMLElement}
 */
const appendChild = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((parent, child) => parent.appendChild(child));

/**
 * Returns the first element that is a descendant of the element on which it is invoked
 * that matches the specified group of selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {HTMLElement}
 */
const querySelector = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((selector, el) => el.querySelector(selector));

/**
 * Transforms a NodeList to an Array
 *
 * @param {NodeList} nodeList
 *
 * @return {Node[]}
 */
const nodeListToArray = nodeList => Array.prototype.slice.call(nodeList);

/**
 * Returns a non-live NodeList of all elements descended from the element on which it
 * is invoked that matches the specified group of CSS selectors.
 *
 * @param {string} selector
 * @param {HTMLElement} el
 *
 * @function
 * @return {Node[]}
 */
const querySelectorAll = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((selector, el) => nodeListToArray(el.querySelectorAll(selector)));

/**
 * The removeChild() method removes a child node from the DOM. Returns removed node.
 *
 * @param {Node} parent
 * @param {Node} oldChild
 *
 * @return {Node}
 */
const removeChild = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((parent, oldChild) => parent.removeChild(oldChild));

/**
 * Returns true if a node has a class
 *
 * @param {string} cls
 * @param {HTMLElement} el
 *
 * @function
 */
const classListContains = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((cls, el) => el.classList.contains(cls));

/**
 * Adds a css class to an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
const addClass = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((cls, element) => element.classList.add(cls));

/**
 * Removes a css class from an element
 *
 * @param {string} cls
 * @param {Element} element
 *
 * @function
 */
const removeClass = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((cls, element) => element.classList.remove(cls));

/**
 * Adds hidden class on an element
 *
 * @param {HTMLElement} element
 * @function
 */
const hide = addClass('hidden');

/**
 * Removes hidden class from an element
 * @function
 */
const show = removeClass('hidden');

/**
 * Toggles hidden class on an element
 *
 * @param {boolean} visible
 * @param {HTMLElement} element
 */
const toggleVisibility = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((visible, element) => (visible ? show : hide)(element));

/**
 * Toggles a class on an element
 *
 * @param {string} cls
 * @param {boolean} add
 * @param {HTMLElement} element
 */
const toggleClass = (0,_functional__WEBPACK_IMPORTED_MODULE_0__.curry)((cls, add, element) => {
  element.classList[add ? 'add' : 'remove'](cls)
});

/**
 * Helper for creating a DOM element
 *
 * @function
 *
 * @param {string} tag
 * @param {string} [id]
 * @param {string[]} [classes] - array of strings
 * @param {Object} [attributes]
 *
 * @return {HTMLElement}
 */
const createElement = ({tag, id, classes, attributes}) => {
  let element = document.createElement(tag);

  if (id) {
    element.id = id;
  }
  if (classes) {
    classes.forEach(clazz => {element.classList.add(clazz)});
  }
  if (attributes) {
    Object.keys(attributes).forEach(key => {element.setAttribute(key, attributes[key])})
  }

  return element;
};


/***/ }),

/***/ "../node_modules/h5p-lib-controls/src/scripts/utils/functional.js":
/*!************************************************************************!*\
  !*** ../node_modules/h5p-lib-controls/src/scripts/utils/functional.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compose: () => (/* binding */ compose),
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   curry: () => (/* binding */ curry),
/* harmony export */   filter: () => (/* binding */ filter),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   inverseBooleanString: () => (/* binding */ inverseBooleanString),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   some: () => (/* binding */ some),
/* harmony export */   without: () => (/* binding */ without)
/* harmony export */ });
/**
 * Returns a curried version of a function
 *
 * @param {function} fn
 *
 * @public
 *
 * @return {function}
 */
const curry = function(fn) {
  const arity = fn.length;

  return function f1() {
    const args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= arity) {
      return fn.apply(null, args);
    }
    else {
      return function f2() {
        const args2 = Array.prototype.slice.call(arguments, 0);
        return f1.apply(null, args.concat(args2));
      }
    }
  };
};

/**
 * Compose functions together, executing from right to left
 *
 * @param {function...} fns
 *
 * @function
 * @public
 *
 * @return {function}
 */
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

/**
 * Applies a function to each element in an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const forEach = curry(function (fn, arr) {
  arr.forEach(fn);
});

/**
 * Maps a function to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const map = curry(function (fn, arr) {
  return arr.map(fn);
});

/**
 * Applies a filter to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const filter = curry(function (fn, arr) {
  return arr.filter(fn);
});

/**
 * Applies a some to an array
 *
 * @param {function} fn
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const some = curry(function (fn, arr) {
  return arr.some(fn);
});

/**
 * Returns true if an array contains a value
 *
 * @param {*} value
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const contains = curry(function (value, arr) {
  return arr.indexOf(value) != -1;
});

/**
 * Returns an array without the supplied values
 *
 * @param {Array} values
 * @param {Array} arr
 *
 * @function
 * @public
 *
 * @return {function}
 */
const without = curry(function (values, arr) {
  return filter(value => !contains(value, values), arr)
});

/**
 * Takes a string that is either 'true' or 'false' and returns the opposite
 *
 * @param {string} bool
 *
 * @public
 * @return {string}
 */
const inverseBooleanString = function (bool) {
  return (bool !== 'true').toString();
};

/***/ }),

/***/ "./drag-utils.js":
/*!***********************!*\
  !*** ./drag-utils.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragUtils)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DragUtils = /*#__PURE__*/function () {
  function DragUtils() {
    _classCallCheck(this, DragUtils);
  }
  return _createClass(DragUtils, null, [{
    key: "setElementOpacity",
    value:
    /**
     * Makes element background transparent.
     *
     * @param {jQuery} $element
     * @param {Number} opacity
     */
    function setElementOpacity($element, opacity) {
      DragUtils.setOpacity($element, 'borderColor', opacity);
      DragUtils.setOpacity($element, 'boxShadow', opacity);
      DragUtils.setOpacity($element, 'background', opacity);
    }

    /**
     * Makes element background, border and shadow transparent.
     *
     * @param {jQuery} $element
     * @param {String} property
     * @param {Number} opacity
     */
  }, {
    key: "setOpacity",
    value: function setOpacity($element, property, opacity) {
      if (property === 'background') {
        // Set both color and gradient.
        DragUtils.setOpacity($element, 'backgroundColor', opacity);
        DragUtils.setOpacity($element, 'backgroundImage', opacity);
        return;
      }
      opacity = opacity === undefined ? 1 : opacity / 100;

      // Private. Get css properties objects.
      function getProperties(property, value) {
        switch (property) {
          case 'borderColor':
            return {
              borderTopColor: value,
              borderRightColor: value,
              borderBottomColor: value,
              borderLeftColor: value
            };
          default:
            var properties = {};
            properties[property] = value;
            return properties;
        }
      }
      var original = $element.css(property);

      // Reset css to be sure we're using CSS and not inline values.
      var properties = getProperties(property, '');
      $element.css(properties);

      // Determine prop and assume all props are the same and use the first.
      for (var prop in properties) {
        break;
      }

      // Get value from css
      var style = $element.css(prop);
      if (style === '' || style === 'none') {
        // No value from CSS, fall back to original
        style = original;
      }
      style = DragUtils.setAlphas(style, 'rgba(', opacity); // Update rgba
      style = DragUtils.setAlphas(style, 'rgb(', opacity); // Convert rgb

      $element.css(getProperties(property, style));
    }

    /**
     * Updates alpha channel for colors in the given style.
     *
     * @param {String} style
     * @param {String} prefix
     * @param {Number} alpha
     */
  }, {
    key: "setAlphas",
    value: function setAlphas(style, prefix, alpha) {
      // Style undefined
      if (!style) {
        return;
      }
      var colorStart = style.indexOf(prefix);
      while (colorStart !== -1) {
        var colorEnd = style.indexOf(')', colorStart);
        var channels = style.substring(colorStart + prefix.length, colorEnd).split(',');

        // Set alpha channel
        channels[3] = channels[3] !== undefined ? parseFloat(channels[3]) * alpha : alpha;
        style = style.substring(0, colorStart) + 'rgba(' + channels.join(',') + style.substring(colorEnd, style.length);

        // Look for more colors
        colorStart = style.indexOf(prefix, colorEnd);
      }
      return style;
    }

    /**
     * Find draggable instance from element
     *
     * @private
     * @param {Draggable[]} draggables
     * @param {Element} element
     */
  }, {
    key: "elementToDraggable",
    value: function elementToDraggable(draggables, element) {
      for (var i = 0; i < draggables.length; i++) {
        if (!draggables[i]) {
          continue;
        }
        var result = draggables[i].findElement(element);
        if (result) {
          result.draggable = draggables[i];
          return result;
        }
      }
    }

    /**
     * Find draggable instance from element
     *
     * @private
     * @param {DropZone[]} dropZones
     * @param {Element} element
     */
  }, {
    key: "elementToDropZone",
    value: function elementToDropZone(dropZones, element) {
      for (var i = 0; i < dropZones.length; i++) {
        if (dropZones[i].$dropZone.is(element)) {
          return dropZones[i];
        }
      }
    }

    /**
     * Get css position in percentage.
     *
     * @param {jQuery} $container
     * @param {jQuery} $element
     * @returns {Object} CSS position
     */
  }, {
    key: "positionToPercentage",
    value: function positionToPercentage($container, $element) {
      return {
        top: parseInt($element.css('top')) * 100 / $container.innerHeight() + '%',
        left: parseInt($element.css('left')) * 100 / $container.innerWidth() + '%'
      };
    }

    /**
     * Makes sure element gets correct opacity when hovered.
     *
     * @param {jQuery} $element
     * @param {Object} element
     */
  }, {
    key: "addHover",
    value: function addHover($element, backgroundOpacity) {
      $element.hover(function () {
        $element.addClass('h5p-draggable-hover');
        if (!$element.parent().hasClass('h5p-dragging')) {
          DragUtils.setElementOpacity($element, backgroundOpacity);
        }
      }, function () {
        if (!$element.parent().hasClass('h5p-dragging')) {
          setTimeout(function () {
            $element.removeClass('h5p-draggable-hover');
            DragUtils.setElementOpacity($element, backgroundOpacity);
          }, 1);
        }
      });
      DragUtils.setElementOpacity($element, backgroundOpacity);
    }

    /**
     * Stripping away html tags
     *
     * @param {string} html
     * @return {string}
     */
  }, {
    key: "strip",
    value: function strip(html) {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
  }]);
}();


/***/ }),

/***/ "./draggable.js":
/*!**********************!*\
  !*** ./draggable.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Draggable)
/* harmony export */ });
/* harmony import */ var _drag_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drag-utils */ "./drag-utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }

var $ = H5P.jQuery;

// Helper to stop propagating events
var stopPropagation = function stopPropagation(event) {
  return event.stopPropagation();
};
var Draggable = /*#__PURE__*/function (_H5P$EventDispatcher) {
  /**
   * Creates a new draggable instance.
   * Makes it easier to keep track of all instance variables and elements.
   *
   * @class
   * @param {Object} element
   * @param {number} id
   * @param {Array} [answers] from last session
   * @param {Object.<string, string>} l10n
   * @param {Array} [dropZones] Dropzones for a draggable
   */
  function Draggable(element, id, answers, l10n, dropZones, draggableNum) {
    var _this;
    _classCallCheck(this, Draggable);
    _this = _callSuper(this, Draggable);
    var self = _this;
    self.$ = $(self);
    self.id = id;
    self.elements = [];
    self.x = element.x;
    self.y = element.y;
    self.width = element.width;
    self.height = element.height;
    self.backgroundOpacity = element.backgroundOpacity;
    self.dropZones = element.dropZones;
    self.type = element.type;
    self.multiple = element.multiple;
    self.l10n = l10n;
    self.allDropzones = dropZones;
    self.draggableNum = draggableNum;
    if (answers) {
      if (self.multiple) {
        // Add base element
        self.elements.push({});
      }

      // Add answers
      for (var i = 0; i < answers.length; i++) {
        self.elements.push({
          dropZone: answers[i].dz,
          position: {
            left: answers[i].x + '%',
            top: answers[i].y + '%'
          }
        });
      }
    }
    return _this;
  }

  /**
   * Insert draggable elements into the given container.
   *
   * @param {jQuery} $container
   * @param {Number} contentId
   * @returns {undefined}
   */
  _inherits(Draggable, _H5P$EventDispatcher);
  return _createClass(Draggable, [{
    key: "appendTo",
    value: function appendTo($container, contentId) {
      var self = this;
      if (!self.elements.length) {
        self.attachElement(null, $container, contentId);
      } else {
        for (var i = 0; i < self.elements.length; i++) {
          self.attachElement(i, $container, contentId);
        }
      }
    }

    /**
     * Attach the given element to the given container.
     *
     * @param {Number} index
     * @param {jQuery} $container
     * @param {Number} contentId
     * @returns {undefined}
     */
  }, {
    key: "attachElement",
    value: function attachElement(index, $container, contentId) {
      var self = this;
      var element;
      if (index === null) {
        // Create new element
        element = {};
        self.elements.push(element);
        index = self.elements.length - 1;
      } else {
        // Get old element
        element = self.elements[index];
      }
      $.extend(element, {
        clone: function clone() {
          self.attachElement(null, $container, contentId);
        },
        reset: function reset() {
          if (element.dropZone !== undefined) {
            // Let everyone know we're leaving the drop zone
            self.trigger('leavingDropZone', element);
            delete element.dropZone;
          }
          if (self.multiple) {
            // Remove element
            element.$.remove();
            delete self.elements[index];
            self.trigger('elementremove', element.$[0]);
          }
          delete element.position;
        }
      });

      // Attach element
      element.$ = $('<div/>', {
        "class": 'h5p-draggable',
        tabindex: '-1',
        role: 'button',
        css: {
          left: self.x + '%',
          top: self.y + '%',
          width: self.width + 'em',
          height: self.height + 'em'
        },
        appendTo: $container,
        title: self.type.params.title
      }).on('click', function () {
        self.trigger('focus', this);
      }).on('touchmove', stopPropagation).on('touchstart', stopPropagation).on('touchend', stopPropagation).draggable({
        revert: function revert(dropZone) {
          $container.removeClass('h5p-dragging');
          var $this = $(this);
          $this.data("uiDraggable").originalPosition = {
            top: self.y + '%',
            left: self.x + '%'
          };
          self.updatePlacement(element);
          $this[0].setAttribute('aria-grabbed', 'false');
          self.trigger('dragend');
          return !dropZone;
        },
        start: function start() {
          var $this = $(this);
          var mustCopyElement = self.mustCopyElement(element);
          if (mustCopyElement) {
            // Leave a new element for next drag
            element.clone();
          }

          // Send element to the top!
          $this.removeClass('h5p-wrong').detach().appendTo($container);
          $container.addClass('h5p-dragging');
          _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setElementOpacity($this, self.backgroundOpacity);
          this.setAttribute('aria-grabbed', 'true');
          self.trigger('focus', this);
          self.trigger('dragstart', {
            element: this,
            effect: mustCopyElement ? 'copy' : 'move'
          });
        },
        stop: function stop() {
          var $this = $(this);

          // Convert position to % to support scaling.
          element.position = _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].positionToPercentage($container, $this);
          $this.css(element.position);
          var addToZone = $this.data('addToZone');
          if (addToZone !== undefined) {
            $this.removeData('addToZone');
            self.addToDropZone(index, element, addToZone);
          } else {
            element.reset();
          }
        }
      }).css('position', '');
      self.element = element;
      if (element.position) {
        // Restore last position
        element.$.css(element.position);
        self.updatePlacement(element);
      }
      _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].addHover(element.$, self.backgroundOpacity);
      H5P.newRunnable(self.type, contentId, element.$);

      // Add prefix for good a11y
      $('<span class="h5p-hidden-read">' + self.l10n.prefix.replace('{num}', self.draggableNum) + '</span>').prependTo(element.$);

      // Add suffix for good a11y
      $('<span class="h5p-hidden-read"></span>').appendTo(element.$);

      // Update opacity when element is attached.
      setTimeout(function () {
        _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setElementOpacity(element.$, self.backgroundOpacity);
      }, 0);
      self.trigger('elementadd', element.$[0]);
    }

    /**
     * Set feedback for a draggable.
     * @param {string} feedback
     * @param {number} dropZoneId
     */
  }, {
    key: "setFeedback",
    value: function setFeedback(feedback, dropZoneId) {
      this.elements.forEach(function (element) {
        if (element.dropZone === dropZoneId) {
          if (element.$feedback === undefined) {
            element.$feedback = $('<span>', {
              'class': 'h5p-hidden-read',
              appendTo: element.$
            });
          }
          element.$feedback.html(feedback);
        }
      });
    }

    /**
     * Determine if element should be copied when tragging, i.e. infinity instances.
     *
     * @param {Object} element
     * @returns {boolean}
     */
  }, {
    key: "mustCopyElement",
    value: function mustCopyElement(element) {
      return this.multiple && element.dropZone === undefined;
    }

    /**
     * Check if this element can be dragged to the given drop zone.
     *
     * @param {Number} id
     * @returns {Boolean}
     */
  }, {
    key: "hasDropZone",
    value: function hasDropZone(id) {
      var self = this;
      for (var i = 0; i < self.dropZones.length; i++) {
        if (parseInt(self.dropZones[i]) === id) {
          return true;
        }
      }
      return false;
    }

    /**
     * Places the draggable element in the given drop zone.
     *
     * @param {number} index Internal element index
     * @param {Object} element
     * @param {number} addToZone Dropzone index
     */
  }, {
    key: "addToDropZone",
    value: function addToDropZone(index, element, addToZone) {
      var self = this;
      if (self.multiple) {
        // Check that we're the only element here
        for (var i = 0; i < self.elements.length; i++) {
          if (i !== index && self.elements[i] !== undefined && self.elements[i].dropZone === addToZone) {
            // Copy of element already in drop zone

            // Remove current element
            if (self.elements[index].dropZone !== undefined && self.elements[index].dropZone !== addToZone) {
              // Leaving old drop zone!
              self.trigger('leavingDropZone', element);
            }
            element.$.remove();
            delete self.elements[index];
            self.trigger('elementremove', this.element.$[0]);
            return;
          }
        }
      }
      if (element.dropZone !== undefined && element.dropZone !== addToZone) {
        // Leaving old drop zone!
        self.trigger('leavingDropZone', element);
      }
      element.dropZone = addToZone;
      self.updatePlacement(element);
      self.trigger('interacted');
    }

    /**
     * Update the visuals to match the position of the element
     */
  }, {
    key: "updatePlacement",
    value: function updatePlacement(element) {
      if (element.$suffix) {
        // Always remove old a11y text. (drop zone may have changed)
        element.$suffix.remove();
      }
      if (element.dropZone !== undefined) {
        element.$.addClass('h5p-dropped');
        _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setElementOpacity(element.$, self.backgroundOpacity);

        // Add suffix for good a11y

        // Use dropzone label or dropzone number
        var dropZoneLabel = this.allDropzones[element.dropZone].label;
        if (dropZoneLabel) {
          var labelElement = document.createElement('div');
          labelElement.innerHTML = dropZoneLabel;
          dropZoneLabel = labelElement.innerText;
        } else {
          dropZoneLabel = element.dropZone + 1;
        }
        element.$suffix = $('<span class="h5p-hidden-read">' + this.l10n.suffix.replace('{num}', dropZoneLabel) + '</span>').appendTo(element.$);
      } else {
        element.$.removeClass('h5p-dropped').removeClass('h5p-wrong').removeClass('h5p-correct').css({
          border: '',
          background: ''
        });
        _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setElementOpacity(element.$, this.backgroundOpacity);
      }
    }

    /**
     * Resets the position of the draggable to its' original position.
     */
  }, {
    key: "resetPosition",
    value: function resetPosition() {
      var self = this;
      this.elements.forEach(function (draggable) {
        if (draggable.$feedback) {
          draggable.$feedback.remove();
          delete draggable.$feedback;
        }

        //If the draggable is in a dropzone reset its' position and feedback.
        if (draggable.dropZone !== undefined) {
          var element = draggable.$;

          //Revert the button to initial position and then remove it.
          element.animate({
            left: self.x + '%',
            top: self.y + '%'
          }, function () {
            //Remove the draggable if it is an infinity draggable.
            if (self.multiple) {
              if (element.dropZone !== undefined) {
                self.trigger('leavingDropZone', element);
              }
              element.remove();
              //Delete the element from elements list to avoid a cluster of draggables on top of infinity draggable.
              if (self.elements.indexOf(draggable) >= 0) {
                delete self.elements[self.elements.indexOf(draggable)];
              }
              self.trigger('elementremove', element[0]);
            }
          });

          // Reset element style
          self.updatePlacement(draggable);
        }
      });
      if (self.element) {
        // Draggable removed from dropzone.
        if (self.element.dropZone !== undefined) {
          self.trigger('leavingDropZone', self.element);
          delete self.element.dropZone;
        }

        // Reset style on initial element
        // Reset element style
        self.updatePlacement(self.element);
      }
    }

    /**
     * Look for the given DOM element inside this draggable.
     *
     * @param {Element} element
     * @returns {Object}
     */
  }, {
    key: "findElement",
    value: function findElement(element) {
      var self = this;
      for (var i = 0; i < self.elements.length; i++) {
        if (self.elements[i] !== undefined && self.elements[i].$.is(element)) {
          return {
            element: self.elements[i],
            index: i
          };
        }
      }
    }

    /**
     * Detemine if any of our elements is in the given drop zone.
     *
     * @param {Number} id
     * @returns {Boolean}
     */
  }, {
    key: "isInDropZone",
    value: function isInDropZone(id) {
      var self = this;
      for (var i = 0; i < self.elements.length; i++) {
        if (self.elements[i] !== undefined && self.elements[i].dropZone === id) {
          return true;
        }
      }
      return false;
    }

    /**
     * Disables the draggable.
     * @public
     */
  }, {
    key: "disable",
    value: function disable() {
      var self = this;
      for (var i = 0; i < self.elements.length; i++) {
        var element = self.elements[i];
        if (element) {
          element.$.draggable('disable');
          self.trigger('elementremove', element.$[0]);
        }
      }
    }

    /**
     * Enables the draggable.
     * @public
     */
  }, {
    key: "enable",
    value: function enable() {
      var self = this;
      for (var i = 0; i < self.elements.length; i++) {
        var element = self.elements[i];
        if (element) {
          element.$.draggable('enable');
          self.trigger('elementadd', element.$[0]);
        }
      }
    }

    /**
     * Calculate score for this draggable.
     *
     * @param {boolean} skipVisuals
     * @param {Array} solutions
     * @param {H5P.Question.ScorePoints} scorePoints
     * @returns {number}
     */
  }, {
    key: "results",
    value: function results(skipVisuals, solutions, scorePoints) {
      var self = this;
      var i,
        j,
        element,
        correct,
        points = 0;
      self.rawPoints = 0;
      if (solutions === undefined) {
        // We should not be anywhere.
        for (i = 0; i < self.elements.length; i++) {
          element = self.elements[i];
          if (element !== undefined && element.dropZone !== undefined) {
            // ... but we are!
            if (skipVisuals !== true) {
              self.markElement(element, 'wrong', scorePoints);
            }
            points--;
          }
        }
        return points;
      }

      // Are we somewhere we should be?
      for (i = 0; i < self.elements.length; i++) {
        element = self.elements[i];
        if (element === undefined || element.dropZone === undefined) {
          continue; // We have not been placed anywhere, we're neither wrong nor correct.
        }
        correct = false;
        for (j = 0; j < solutions.length; j++) {
          if (element.dropZone === solutions[j]) {
            // Yepp!
            if (skipVisuals !== true) {
              self.markElement(element, 'correct', scorePoints);
            }
            correct = true;
            self.rawPoints++;
            points++;
            break;
          }
        }
        if (!correct) {
          // Nope, we're in another zone
          if (skipVisuals !== true) {
            self.markElement(element, 'wrong', scorePoints);
          }
          points--;
        }
      }
      return points;
    }

    /**
     * Marks given element as either correct or wrong
     *
     * @param {Object} element
     * @param {string} status 'correct' or 'wrong'
     * @param {H5P.Question.ScorePoints} scorePoints
     */
  }, {
    key: "markElement",
    value: function markElement(element, status, scorePoints) {
      var $elementResult = $('<span/>', {
        'class': 'h5p-hidden-read',
        html: this.l10n[status + 'Answer'] + '. '
      });
      if (scorePoints) {
        $elementResult = $elementResult.add(scorePoints.getElement(status === 'correct'));
      }
      element.$suffix = element.$suffix.add($elementResult);
      element.$.addClass('h5p-' + status).append($elementResult);
      _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setElementOpacity(element.$, this.backgroundOpacity);
    }
  }]);
}(H5P.EventDispatcher);


/***/ }),

/***/ "./dropzone.js":
/*!*********************!*\
  !*** ./dropzone.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DropZone)
/* harmony export */ });
/* harmony import */ var _drag_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drag-utils */ "./drag-utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var $ = H5P.jQuery;
var DropZone = /*#__PURE__*/function () {
  /**
   * Creates a new drop zone instance.
   * Makes it easy to keep track of all instance variables.
   *
   * @param {Object} dropZone
   * @param {Number} id
   * @param {string[]} l10n
   * @returns {_L8.DropZone}
   */
  function DropZone(dropZone, id, l10n) {
    _classCallCheck(this, DropZone);
    var self = this;
    H5P.EventDispatcher.call(self);
    self.id = id;
    self.showLabel = dropZone.showLabel;
    self.label = dropZone.label;
    self.x = dropZone.x;
    self.y = dropZone.y;
    self.width = dropZone.width;
    self.height = dropZone.height;
    self.backgroundOpacity = dropZone.backgroundOpacity;
    self.tip = dropZone.tipsAndFeedback.tip || '';
    self.single = dropZone.single;
    self.autoAlignable = dropZone.autoAlign;
    self.alignables = [];
    self.l10n = l10n;
  }

  /**
   * Insert drop zone in the given container.
   *
   * @param {jQuery} $container
   * @param {Array} draggables
   * @returns {undefined}
   */
  return _createClass(DropZone, [{
    key: "appendTo",
    value: function appendTo($container, draggables) {
      var self = this;

      // Prepare inner html with prefix for good a11y
      var html = '<div class="h5p-inner"></div>';
      var extraClass = '';
      if (self.showLabel) {
        html = '<div class="h5p-label">' + self.label + '<span class="h5p-hidden-read"></span></div>' + html;
        extraClass = ' h5p-has-label';
      }
      html = '<span class="h5p-hidden-read">' + self.l10n.prefix.replace('{num}', self.id + 1) + (!self.showLabel ? self.label : '') + '</span>' + html;

      // Create drop zone element
      self.$dropZone = $('<div/>', {
        "class": 'h5p-dropzone' + extraClass,
        tabindex: '-1',
        role: 'button',
        'aria-disabled': true,
        css: {
          left: self.x + '%',
          top: self.y + '%',
          width: self.width + 'em',
          height: self.height + 'em'
        },
        html: html
      }).appendTo($container).children('.h5p-inner').droppable({
        activeClass: 'h5p-active',
        tolerance: 'intersect',
        accept: function accept(element) {
          /**
           * Functional note:
           * This will fire every time a draggable is starting to get dragged, globally
           * for all initialized drop zones  <-> draggables. That means in a compound H5P this
           * function will fire for all Drag Questions within that compound content type,
           * no matter if it is at a different timestamp, already completed or otherwise
           * intuitively would be disabled. This can lead to some unexpected behaviour if you
           * don't take this into consideration.
           */

          // Find draggable element belongs to
          var result = _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].elementToDraggable(draggables, element);

          // Found no Draggable that the element belongs to. Don't accept it.
          if (!result) {
            return false;
          }

          // Figure out if the drop zone will accept the draggable
          return self.accepts(result.draggable, draggables);
        },
        drop: function drop(event, ui) {
          var $this = $(this);
          _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setOpacity($this.removeClass('h5p-over'), 'background', self.backgroundOpacity);
          ui.draggable.data('addToZone', self.id);
          if (self.getIndexOf(ui.draggable) === -1) {
            // Add to alignables
            self.alignables.push(ui.draggable);
          }
          if (self.autoAlignable.enabled) {
            // Trigger alignment
            self.autoAlign();
          }
        },
        over: function over() {
          _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setOpacity($(this).addClass('h5p-over'), 'background', self.backgroundOpacity);
        },
        out: function out() {
          _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setOpacity($(this).removeClass('h5p-over'), 'background', self.backgroundOpacity);
        }
      }).end().focus(function () {
        if ($tip instanceof H5P.jQuery) {
          $tip.attr('tabindex', '0');
        }
      }).blur(function () {
        if ($tip instanceof H5P.jQuery) {
          $tip.attr('tabindex', '-1');
        }
      });

      // Add tip after setOpacity(), so this does not get background opacity:
      var $tip = H5P.JoubelUI.createTip(self.tip, {
        tipLabel: self.l10n.tipLabel,
        tabcontrol: true
      });
      if ($tip instanceof H5P.jQuery) {
        // Create wrapper for tip
        $('<span/>', {
          'class': 'h5p-dq-tipwrap',
          'aria-label': self.l10n.tipAvailable,
          'append': $tip,
          'appendTo': self.$dropZone
        });
      }
      draggables.forEach(function (draggable) {
        var dragEl = draggable.element.$;

        // Add to alignables
        if (draggable.isInDropZone(self.id) && self.getIndexOf(dragEl) === -1) {
          self.alignables.push(dragEl);
        }
      });
      if (self.autoAlignable.enabled) {
        self.autoAlign();
      }

      // Set element opacity when element has been appended
      setTimeout(function () {
        self.updateBackgroundOpacity();
      }, 0);
    }

    /**
     * Update the background opacity
     */
  }, {
    key: "updateBackgroundOpacity",
    value: function updateBackgroundOpacity() {
      _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setOpacity(this.$dropZone.children('.h5p-label'), 'background', this.backgroundOpacity);
      _drag_utils__WEBPACK_IMPORTED_MODULE_0__["default"].setOpacity(this.$dropZone.children('.h5p-inner'), 'background', this.backgroundOpacity);
    }

    /**
     * Help determine if the drop zone can accept this draggable
     */
  }, {
    key: "accepts",
    value: function accepts(draggable, draggables) {
      var self = this;
      if (!draggable.hasDropZone(self.id)) {
        // Doesn't belong in this drop zone
        return false;
      }
      if (self.single) {
        // Make sure no other draggable is placed here
        for (var i = 0; i < draggables.length; i++) {
          if (draggables[i] && draggables[i].isInDropZone(self.id)) {
            // This drop zone is occupied
            return false;
          }
        }
      }
      return true;
    }

    /**
     * Find index of given alignable
     *
     * @param {jQuery} $alignable
     * @return {number}
     */
  }, {
    key: "getIndexOf",
    value: function getIndexOf($alignable) {
      var self = this;
      for (var i = 0; i < self.alignables.length; i++) {
        if (self.alignables[i][0] === $alignable[0]) {
          return i;
        }
      }
      return -1;
    }

    /**
     * Remove alignable
     *
     * @param {jQuery} $alignable
     */
  }, {
    key: "removeAlignable",
    value: function removeAlignable($alignable) {
      var self = this;

      // Find alignable index
      var index = self.getIndexOf($alignable);
      if (index !== -1) {
        // Remove alignable
        self.alignables.splice(index, 1);
        if (self.autoAlignTimer === undefined && self.autoAlignable.enabled) {
          // Schedule re-aligment of alignables left
          self.autoAlignTimer = setTimeout(function () {
            delete self.autoAlignTimer;
            self.autoAlign();
          }, 1);
        }
      }
    }

    /**
     * Auto-align alignable elements inside drop zone.
     */
  }, {
    key: "autoAlign",
    value: function autoAlign() {
      var self = this;

      // Determine container size in order to calculate percetages
      var containerSize = self.$dropZone.parent()[0].getBoundingClientRect();

      // Calcuate borders and spacing values in percetage
      var spacing = {
        x: self.autoAlignable.spacing / self.autoAlignable.size.width * 100,
        y: self.autoAlignable.spacing / self.autoAlignable.size.height * 0
      };

      // Determine coordinates for first 'spot'
      var pos = {
        x: self.x + spacing.x,
        y: self.y + spacing.y
      };

      // Determine space inside drop zone
      var dropZoneSize = self.$dropZone[0].getBoundingClientRect();
      var space = {
        x: dropZoneSize.width - spacing.x * 2,
        y: dropZoneSize.height - spacing.y * 2
      };

      // Set current space left inside drop zone
      var spaceLeft = {
        x: space.x,
        y: space.y
      };

      // Set height for the active row of elements
      var currentRowHeight = 0;

      // Current alignable element and it's size
      var $alignable, alignableSize;

      /**
       * Helper doing the actual positioning of the element + recalculating
       * next position and space left.
       *
       * @private
       */
      var alignElement = function alignElement() {
        // Position element at current spot
        $alignable.css({
          left: pos.x + '%',
          top: pos.y + '%'
        });
        self.trigger('elementaligned', $alignable);

        // Update horizontal space left + next position
        var spaceDiffX = alignableSize.width + self.autoAlignable.spacing;
        spaceLeft.x -= spaceDiffX;
        pos.x += spaceDiffX / containerSize.width * 100;

        // Keep track of the highest element in this row
        var spaceDiffY = alignableSize.height + self.autoAlignable.spacing;
        if (spaceDiffY > currentRowHeight) {
          currentRowHeight = spaceDiffY;
        }
      };

      // Try to order and align the alignables inside the drop zone
      // (in the order they were added)
      for (var i = 0; i < self.alignables.length; i++) {
        // Determine alignable size
        $alignable = self.alignables[i];
        alignableSize = $alignable[0].getBoundingClientRect();

        // Try to fit on the current row
        if (spaceLeft.x >= alignableSize.width) {
          alignElement();
        } else {
          // Did not fit, try next row

          // Reset X values
          spaceLeft.x = space.x;
          pos.x = self.x + spacing.x;

          // Bump Y values
          if (currentRowHeight) {
            // Update Y space and position according to previous row height
            spaceLeft.y -= currentRowHeight;
            pos.y += currentRowHeight / containerSize.height * 100;

            // Reset
            currentRowHeight = 0;
          }
          if (spaceLeft.y <= 0) {
            return; // No more vertical space left, stop all aliging
          }
          alignElement();
        }
      }
    }

    /**
     * Highlight the current drop zone
     */
  }, {
    key: "highlight",
    value: function highlight() {
      this.$dropZone.attr('aria-disabled', 'false').children('.h5p-inner').addClass('h5p-active');
    }

    /**
     * De-highlight the current drop zone
     */
  }, {
    key: "dehighlight",
    value: function dehighlight() {
      this.$dropZone.attr('aria-disabled', 'true').children('.h5p-inner').removeClass('h5p-active');
    }

    /**
     * Invoked when reset task is run. Cleanup any internal states. 
     */
  }, {
    key: "reset",
    value: function reset() {
      // Remove alignables
      this.alignables = [];
    }
  }]);
}();


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./drag-question.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var h5p_lib_controls_src_scripts_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! h5p-lib-controls/src/scripts/controls */ "../node_modules/h5p-lib-controls/src/scripts/controls.js");
/* harmony import */ var h5p_lib_controls_src_scripts_aria_drag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! h5p-lib-controls/src/scripts/aria/drag */ "../node_modules/h5p-lib-controls/src/scripts/aria/drag.js");
/* harmony import */ var h5p_lib_controls_src_scripts_aria_drop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! h5p-lib-controls/src/scripts/aria/drop */ "../node_modules/h5p-lib-controls/src/scripts/aria/drop.js");
/* harmony import */ var h5p_lib_controls_src_scripts_ui_keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! h5p-lib-controls/src/scripts/ui/keyboard */ "../node_modules/h5p-lib-controls/src/scripts/ui/keyboard.js");
/* harmony import */ var h5p_lib_controls_src_scripts_ui_mouse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! h5p-lib-controls/src/scripts/ui/mouse */ "../node_modules/h5p-lib-controls/src/scripts/ui/mouse.js");
/* harmony import */ var _drag_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drag-utils */ "./drag-utils.js");
/* harmony import */ var _dropzone__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dropzone */ "./dropzone.js");
/* harmony import */ var _draggable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./draggable */ "./draggable.js");








var $ = H5P.jQuery;
var numInstances = 0;
var desordenar = true;

/**
 * Constructor
 *
 * @class
 * @extends H5P.Question
 * @param {Object} options Run parameters
 * @param {number} id Content identification
 * @param {Object} contentData
 */
function C(options, contentId, contentData) {
  var self = this;
  var i, j;
  numInstances++;
  this.id = this.contentId = contentId;
  this.contentData = contentData;
  H5P.Question.call(self, 'dragquestion');
  this.options = $.extend(true, {}, {
    scoreShow: 'Check',
    tryAgain: 'Retry',
    grabbablePrefix: 'Grabbable {num} of {total}.',
    grabbableSuffix: 'Placed in dropzone {num}.',
    dropzonePrefix: 'Dropzone {num} of {total}.',
    noDropzone: 'No dropzone',
    tipLabel: 'Show tip.',
    tipAvailable: 'Tip available',
    correctAnswer: 'Correct answer',
    wrongAnswer: 'Wrong answer',
    feedbackHeader: 'Feedback',
    scoreBarLabel: 'You got :num out of :total points',
    scoreExplanationButtonLabel: 'Show score explanation',
    question: {
      settings: {
        questionTitle: this.contentData && this.contentData.metadata && this.contentData.metadata.title ? this.contentData.metadata.title : 'Drag and drop',
        size: {
          width: 620,
          height: 310
        }
      },
      task: {
        elements: [],
        dropZones: []
      }
    },
    overallFeedback: [],
    behaviour: {
      enableRetry: true,
      enableCheckButton: true,
      preventResize: false,
      singlePoint: false,
      applyPenalties: true,
      enableScoreExplanation: true,
      dropZoneHighlighting: 'dragging',
      autoAlignSpacing: 2,
      showScorePoints: true,
      showTitle: false
    },
    a11yCheck: 'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
    a11yRetry: 'Retry the task. Reset all responses and start the task over again.',
    submit: 'Submit'
  }, options);

  // If single point is enabled, it makes no sense displaying
  // the score explanation. Note: In the editor, the score explanation is hidden
  // by the showWhen widget if singlePoint is enabled
  if (this.options.behaviour.singlePoint) {
    this.options.behaviour.enableScoreExplanation = false;
  }
  this.draggables = [];
  this.dropZones = [];
  this.answered = contentData && contentData.previousState !== undefined && contentData.previousState.answers !== undefined && contentData.previousState.answers.length;
  this.blankIsCorrect = true;
  this.backgroundOpacity = this.options.behaviour.backgroundOpacity === undefined || this.options.behaviour.backgroundOpacity.trim() === '' ? undefined : this.options.behaviour.backgroundOpacity;
  self.$noDropZone = $('<div class="h5p-dq-no-dz" role="button" style="display:none;"><span class="h5p-hidden-read">' + self.options.noDropzone + '</span></div>');

  // Initialize controls for good a11y
  var controls = getControls(self.draggables, self.dropZones, self.$noDropZone[0]);

  /**
   * Update the drop effect for all drop zones accepting this draggable.
   *
   * @private
   * @param {string} effect
   */
  var setDropEffect = function setDropEffect(effect) {
    for (var i = 0; i < controls.drop.elements.length; i++) {
      controls.drop.elements[i].setAttribute('aria-dropeffect', effect);
    }
  };

  // List of drop zones that has no elements, i.e. not used for the task
  var dropZonesWithoutElements = [];

  // Create map over correct drop zones for elements
  var task = this.options.question.task;
  this.correctDZs = [];

  // @pmasquiaran

  var shufflePos = [];
  for (var posicion = 0; posicion < task.elements.length; posicion++) {
    shufflePos.push(posicion);
  }
  shufflePos.sort(function (a, b) {
    return Math.random() >= 0.5 ? -1 : 1;
  });
  shufflePos = fisherYatesShuffle(shufflePos);
  function fisherYatesShuffle(array) {
    for (var _i = array.length - 1; _i > 0; _i--) {
      var _j = Math.floor(Math.random() * (_i + 1)); // random index from 0 to i
      // swap elements at i and j
      var _ref = [array[_j], array[_i]];
      array[_i] = _ref[0];
      array[_j] = _ref[1];
    }
    return array;
  }
  var shuffleElem = [];
  for (var indice = 0; indice < task.elements.length; indice++) {
    shuffleElem.push({
      'ejex': task.elements[shufflePos[indice]].x,
      'ejey': task.elements[shufflePos[indice]].y
    });
  }

  // @pmasquiaran

  for (i = 0; i < task.dropZones.length; i++) {
    dropZonesWithoutElements.push(true); // All true by default

    var correctElements = task.dropZones[i].correctElements;
    for (j = 0; j < correctElements.length; j++) {
      var correctElement = correctElements[j];
      if (this.correctDZs[correctElement] === undefined) {
        this.correctDZs[correctElement] = [];
      }
      this.correctDZs[correctElement].push(i);
    }
  }
  this.weight = 1;
  var isDraggable = function isDraggable(element) {
    return !(element.dropZones === undefined || !element.dropZones.length);
  };

  // Add draggable elements
  var grabbablel10n = {
    prefix: self.options.grabbablePrefix.replace('{total}', task.elements.filter(isDraggable).length),
    suffix: self.options.grabbableSuffix,
    correctAnswer: self.options.correctAnswer,
    wrongAnswer: self.options.wrongAnswer
  };
  var draggableNum = 1; // Human readable label (a11y)
  for (i = 0; i < task.elements.length; i++) {
    var element = task.elements[i];

    // @pmasquiaran
    //console.log('Y original antes', task.elements[i].y, 'Y shuffle antes', shuffleElem[i].y);
    //console.log('[' + i + '] antes', element);
    element.x = shuffleElem[i].ejex;
    element.y = shuffleElem[i].ejey;
    //console.log('Y original ac', task.elements[i].y, 'Y shuffle ac', shuffleElem[i].y);
    //console.log('[' + i + '] despues', element);
    //console.log('---');
    // @pmasquiaran

    if (!isDraggable(element)) {
      continue; // Not a draggable
    }
    if (this.backgroundOpacity !== undefined) {
      element.backgroundOpacity = this.backgroundOpacity;
    }

    // Restore answers from last session
    var answers = null;
    if (contentData && contentData.previousState !== undefined && contentData.previousState.answers !== undefined && contentData.previousState.answers[i] !== undefined) {
      answers = contentData.previousState.answers[i];
    }

    // Create new draggable instance
    var draggable = new _draggable__WEBPACK_IMPORTED_MODULE_7__["default"](element, i, answers, grabbablel10n, task.dropZones, draggableNum++);
    var highlightDropZones = self.options.behaviour.dropZoneHighlighting === 'dragging';
    draggable.on('elementadd', function (event) {
      controls.drag.addElement(event.data);
    });
    draggable.on('elementremove', function (event) {
      controls.drag.removeElement(event.data);
      if (event.data.getAttribute('aria-grabbed') === 'true') {
        controls.drag.firesEvent('select', event.data);
        event.data.removeAttribute('aria-grabbed');
      }
    });
    draggable.on('focus', function (event) {
      controls.drag.setTabbable(event.data);
      event.data.focus();
    });
    draggable.on('dragstart', function (event) {
      if (highlightDropZones) {
        self.$container.addClass('h5p-dq-highlight-dz');
      }
      setDropEffect(event.data);
    });
    draggable.on('dragend', function () {
      if (highlightDropZones) {
        self.$container.removeClass('h5p-dq-highlight-dz');
      }
      setDropEffect('none');
    });
    draggable.on('interacted', function () {
      self.answered = true;
      self.triggerXAPI('interacted');
    });
    draggable.on('leavingDropZone', function (event) {
      self.dropZones[event.data.dropZone].removeAlignable(event.data.$);
    });
    this.draggables[i] = draggable;
    for (j = 0; j < element.dropZones.length; j++) {
      dropZonesWithoutElements[element.dropZones[j]] = false;
    }
  }

  // Create a count to subtrack from score
  this.numDropZonesWithoutElements = 0;
  var dropzonel10n = {
    prefix: self.options.dropzonePrefix.replace('{total}', task.dropZones.length),
    tipLabel: self.options.tipLabel,
    tipAvailable: self.options.tipAvailable
  };

  // Add drop zones
  for (i = 0; i < task.dropZones.length; i++) {
    var dropZone = task.dropZones[i];
    if (dropZonesWithoutElements[i] === true) {
      this.numDropZonesWithoutElements += 1;
    }
    if (this.blankIsCorrect && dropZone.correctElements.length) {
      this.blankIsCorrect = false;
    }
    dropZone.autoAlign = {
      enabled: dropZone.autoAlign,
      spacing: self.options.behaviour.autoAlignSpacing,
      size: self.options.question.settings.size
    };
    this.dropZones[i] = new _dropzone__WEBPACK_IMPORTED_MODULE_6__["default"](dropZone, i, dropzonel10n);

    // Update element internal position when aligned
    this.dropZones[i].on('elementaligned', function (event) {
      var $aligned = event.data;
      for (var _i2 = 0; _i2 < self.draggables.length; _i2++) {
        var _draggable = self.draggables[_i2];
        if (!_draggable || !_draggable.elements || !_draggable.elements.length) {
          continue;
        }
        for (var _j2 = 0; _j2 < _draggable.elements.length; _j2++) {
          var _element = _draggable.elements[_j2];
          if (!_element || _element.$[0] !== $aligned[0]) {
            continue;
          }

          // Update position
          _element.position = _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].positionToPercentage(self.$container, _element.$);
          return;
        }
      }
    });
  }
  this.on('resize', self.resize, self);
  this.on('domChanged', function (event) {
    if (self.contentId === event.data.contentId) {
      self.trigger('resize');
    }
  });
  this.on('enterFullScreen', function () {
    if (self.$container) {
      self.$container.parents('.h5p-content').css('height', '100%');
      self.trigger('resize');
    }
  });
  this.on('exitFullScreen', function () {
    if (self.$container) {
      self.$container.parents('.h5p-content').css('height', 'auto');
      self.trigger('resize');
    }
  });
}
C.prototype = Object.create(H5P.Question.prototype);
C.prototype.constructor = C;

/**
 * Registers this question type's DOM elements before they are attached.
 * Called from H5P.Question.
 */
C.prototype.registerDomElements = function () {
  var self = this;

  // Register introduction section
  if (self.options.behaviour.showTitle) {
    self.$introduction = $('<p class="h5p-dragquestion-introduction" id="dq-intro-' + numInstances + '">' + self.options.question.settings.questionTitle + '</p>');
    self.setIntroduction(self.$introduction);
  }

  // Set class if no background
  var classes = '';
  if (this.options.question.settings.background !== undefined) {
    classes += 'h5p-dragquestion-has-no-background';
  }
  if (self.options.behaviour.dropZoneHighlighting === 'always') {
    if (classes) {
      classes += ' ';
    }
    classes += 'h5p-dq-highlight-dz-always';
  }

  // Register task content area
  self.setContent(self.createQuestionContent(), {
    'class': classes
  });

  // First we check if full screen is supported
  if (H5P.canHasFullScreen !== false && this.options.behaviour.enableFullScreen) {
    // We create a function that is used to enter or
    // exit full screen when our button is pressed
    var toggleFullScreen = function toggleFullScreen() {
      if (H5P.isFullscreen) {
        H5P.exitFullScreen(self.$container);
      } else {
        H5P.fullScreen(self.$container.parent().parent(), self);
      }
    };

    // Create full screen button
    var $fullScreenButton = $('<div/>', {
      'class': 'h5p-my-fullscreen-button-enter',
      title: this.options.localize.fullscreen,
      role: 'button',
      tabindex: 0,
      on: {
        click: toggleFullScreen,
        keypress: function keypress(event) {
          if (event.which === 13 || event.which === 32) {
            toggleFullScreen();
            event.preventDefault();
          }
        }
      },
      prependTo: this.$container.parent()
    });

    // Respond to enter full screen event
    this.on('enterFullScreen', function () {
      $fullScreenButton.attr('class', 'h5p-my-fullscreen-button-exit');
      $fullScreenButton.attr('title', this.options.localize.exitFullscreen);
    });

    // Respond to exit full screen event
    this.on('exitFullScreen', function () {
      $fullScreenButton.attr('class', 'h5p-my-fullscreen-button-enter');
      $fullScreenButton.attr('title', this.options.localize.fullscreen);
    });
  }

  // ... and buttons
  self.registerButtons();
  setTimeout(function () {
    self.trigger('resize');
  }, 200);
};

/**
 * Get xAPI data.
 * Contract used by report rendering engine.
 *
 * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
 *
 * @return {Object} xAPI data
 */
C.prototype.getXAPIData = function () {
  var xAPIEvent = this.createXAPIEventTemplate('answered');
  this.addQuestionToXAPI(xAPIEvent);
  this.addResponseToXAPI(xAPIEvent);
  return {
    statement: xAPIEvent.data.statement
  };
};

/**
 * Add the question itselt to the definition part of an xAPIEvent
 */
C.prototype.addQuestionToXAPI = function (xAPIEvent) {
  var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
  $.extend(definition, this.getXAPIDefinition());
};

/**
 * Get object definition for xAPI statement.
 *
 * @return {Object} xAPI object definition
 */
C.prototype.getXAPIDefinition = function () {
  var definition = {};
  definition.description = {
    // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
    'en-US': $('<div>' + this.options.question.settings.questionTitle + '</div>').text()
  };
  definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
  definition.interactionType = 'matching';

  // Add sources, i.e. draggables
  definition.source = [];
  for (var i = 0; i < this.options.question.task.elements.length; i++) {
    var el = this.options.question.task.elements[i];
    if (el.dropZones && el.dropZones.length) {
      var desc = el.type.params.alt ? el.type.params.alt : el.type.params.text;
      definition.source.push({
        'id': '' + i,
        'description': {
          // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
          'en-US': $('<div>' + desc + '</div>').text()
        }
      });
    }
  }

  // Add targets, i.e. drop zones, and the correct response pattern.
  definition.correctResponsesPattern = [''];
  definition.target = [];
  var firstCorrectPair = true;
  for (i = 0; i < this.options.question.task.dropZones.length; i++) {
    definition.target.push({
      'id': '' + i,
      'description': {
        // Remove tags, must wrap in div tag because jQuery 1.9 will crash if the string isn't wrapped in a tag.
        'en-US': $('<div>' + this.options.question.task.dropZones[i].label + '</div>').text()
      }
    });
    if (this.options.question.task.dropZones[i].correctElements) {
      for (var j = 0; j < this.options.question.task.dropZones[i].correctElements.length; j++) {
        /**
         * NOTE: The editor allows you to turn a draggable that was correct
         * in a dropzone into a non-draggable, but leaves the non-draggable
         * associated with the dropzone if it was previously marked as correct
         * within that dropzone.
         * Because of this we have to check if the draggable that is marked
         * as correct within this dropzone can actually be dropped on this
         * dropzone in the draggable's data.
         */
        var task = this.options.question.task;
        var draggable = task.elements[task.dropZones[i].correctElements[j]];
        if (!draggable || draggable.dropZones.indexOf(i.toString()) < 0) {
          continue;
        }
        if (!firstCorrectPair) {
          definition.correctResponsesPattern[0] += '[,]';
        }
        definition.correctResponsesPattern[0] += i + '[.]' + task.dropZones[i].correctElements[j];
        firstCorrectPair = false;
      }
    }
  }
  return definition;
};

/**
 * Add the response part to an xAPI event
 *
 * @param {H5P.XAPIEvent} xAPIEvent
 *  The xAPI event we will add a response to
 */
C.prototype.addResponseToXAPI = function (xAPIEvent) {
  var maxScore = this.getMaxScore();
  var score = this.getScore();
  var success = score == maxScore ? true : false;
  xAPIEvent.setScoredResult(score, maxScore, this, true, success);
  xAPIEvent.data.statement.result.response = this.getUserXAPIResponse();
};

/**
 * Get what the user has answered encoded as an xAPI response pattern
 *
 * @return {string} xAPI encoded user response pattern
 */
C.prototype.getUserXAPIResponse = function () {
  var answers = this.getUserAnswers();
  if (!answers) {
    return '';
  }
  return answers.filter(function (answerMapping) {
    return answerMapping.elements.length;
  }).map(function (answerMapping) {
    return answerMapping.elements.filter(function (element) {
      return element.dropZone !== undefined;
    }).map(function (element) {
      return element.dropZone + '[.]' + answerMapping.index;
    }).join('[,]');
  }).filter(function (pattern) {
    return pattern !== undefined && pattern !== '';
  }).join('[,]');
};

/**
 * Returns user answers
 */
C.prototype.getUserAnswers = function () {
  return this.draggables.map(function (draggable, index) {
    return {
      index: index,
      draggable: draggable
    };
  }).filter(function (draggableMapping) {
    return draggableMapping.draggable !== undefined && draggableMapping.draggable.elements;
  }).map(function (draggableMapping) {
    return {
      index: draggableMapping.index,
      elements: draggableMapping.draggable.elements
    };
  });
};

/**
 * Append field to wrapper.
 */
C.prototype.createQuestionContent = function () {
  var i;
  // If reattaching, we no longer show solution. So forget that we
  // might have done so before.

  this.$container = $('<div class="h5p-inner" role="application" aria-labelledby="dq-intro-' + numInstances + '"></div>');
  if (this.options.question.settings.background !== undefined) {
    this.$container.css('backgroundImage', 'url("' + H5P.getPath(this.options.question.settings.background.path, this.id) + '")');
  }
  var task = this.options.question.task;

  // Add elements (static and draggable)
  for (i = 0; i < task.elements.length; i++) {
    var element = task.elements[i];
    if (element.dropZones !== undefined && element.dropZones.length !== 0) {
      // Attach draggable elements
      this.draggables[i].appendTo(this.$container, this.id);
    } else {
      // Add static element
      var $element = this.addElement(element, 'static', i);
      H5P.newRunnable(element.type, this.id, $element);
      var timedOutOpacity = function timedOutOpacity($el, el) {
        setTimeout(function () {
          _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].setOpacity($el, 'background', el.backgroundOpacity);
        }, 0);
      };
      timedOutOpacity($element, element);
    }
  }

  // Attach invisible 'reset' drop zone for keyboard users
  this.$noDropZone.appendTo(this.$container);

  // Attach drop zones
  for (i = 0; i < this.dropZones.length; i++) {
    this.dropZones[i].appendTo(this.$container, this.draggables);
  }
  return this.$container;
};
C.prototype.registerButtons = function () {
  if (this.options.behaviour.enableCheckButton) {
    // Add show score button
    this.addSolutionButton();
  }
  this.addRetryButton();
};

/**
 * Add solution button to our container.
 */
C.prototype.addSolutionButton = function () {
  var that = this;
  this.addButton('check-answer', this.options.scoreShow, function () {
    that.answered = true;
    that.showAllSolutions();
    that.showScore();
    that.addExplanation();
    var xAPIEvent = that.createXAPIEventTemplate('answered');
    that.addQuestionToXAPI(xAPIEvent);
    that.addResponseToXAPI(xAPIEvent);
    that.trigger(xAPIEvent);

    // Focus top of task for better focus and read-speaker flow
    var $nextFocus = that.$introduction ? that.$introduction : that.$container.children().first();
    $nextFocus.focus();
  }, true, {
    'aria-label': this.options.a11yCheck
  }, {
    contentData: this.contentData,
    textIfSubmitting: this.options.submit
  });
};

/**
 * Add explanation/feedback (the part on the bottom part)
 */
C.prototype.addExplanation = function () {
  var _this = this;
  var task = this.options.question.task;
  var explanations = [];

  // Go through all dropzones, and find answers:
  task.dropZones.forEach(function (dropZone, dropZoneId) {
    var feedback = {
      correct: dropZone.tipsAndFeedback.feedbackOnCorrect,
      incorrect: dropZone.tipsAndFeedback.feedbackOnIncorrect
    };
    // Don't run this code if feedback is not configured;
    if (feedback.correct === undefined && feedback.incorrect === undefined) {
      return;
    }

    // Index for correct draggables
    var correctElements = dropZone.correctElements;

    // Find all dragables placed on this dropzone:
    var placedDraggables = {};
    _this.draggables.forEach(function (draggable) {
      draggable.elements.forEach(function (dz) {
        if (dz.dropZone == dropZoneId) {
          // Save reference to draggable, and mark it as correct/incorrect
          placedDraggables[draggable.id] = {
            instance: draggable,
            correct: correctElements.indexOf("" + draggable.id) !== -1
          };
        }
      });
    });

    // Go through each placed draggable
    Object.keys(placedDraggables).forEach(function (draggableId) {
      var draggable = placedDraggables[draggableId];
      var draggableLabel = _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].strip(draggable.instance.type.params.alt || draggable.instance.type.params.text) || '?';
      var dropZoneLabel = _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].strip(dropZone.label);
      if (draggable.correct && feedback.correct) {
        explanations.push({
          correct: dropZoneLabel + ' + ' + draggableLabel,
          text: feedback.correct
        });
        draggable.instance.setFeedback(feedback.correct, dropZoneId);
      } else if (!draggable.correct && feedback.incorrect) {
        explanations.push({
          correct: dropZoneLabel + ' + ',
          wrong: draggableLabel,
          text: feedback.incorrect
        });
        draggable.instance.setFeedback(feedback.incorrect, dropZoneId);
      }
    });
  });
  if (explanations.length !== 0) {
    this.setExplanation(explanations, this.options.feedbackHeader);
  }
};

/**
 * Add retry button to our container.
 */
C.prototype.addRetryButton = function () {
  var that = this;
  this.addButton('try-again', this.options.tryAgain, function () {
    that.resetTask();
    that.showButton('check-answer');
    that.hideButton('try-again');
  }, false, {
    'aria-label': this.options.a11yRetry
  });
};

/**
 * Add element/drop zone to task.
 *
 * @param {Object} element
 * @param {String} type Class
 * @param {Number} id
 * @returns {jQuery}
 */
C.prototype.addElement = function (element, type, id) {
  return $('<div class="h5p-' + type + '" style="left:' + element.x + '%;top:' + element.y + '%;width:' + element.width + 'em;height:' + element.height + 'em"></div>').appendTo(this.$container).data('id', id);
};

/**
 * Set correct height of container
 */
C.prototype.resize = function (e) {
  var self = this;
  // Make sure we use all the height we can get. Needed to scale up.
  if (this.$container === undefined || !this.$container.is(':visible')) {
    // Not yet attached or visible – not possible to resize correctly
    return;
  }

  // Update background opacity for dropzones (in case they were not previously
  // appended)
  self.dropZones.forEach(function (dropzone) {
    dropzone.updateBackgroundOpacity();
  });

  // Check if decreasing iframe size
  var decreaseSize = e && e.data && e.data.decreaseSize;
  if (!decreaseSize) {
    self.$container.parents('.h5p-standalone.h5p-dragquestion').css('width', '');
  }
  var size = this.options.question.settings.size;
  var ratio = size.width / size.height;
  var parentContainer = this.$container.parent();
  // Use parent container as basis for resize.
  var width = parentContainer.width() - parseFloat(parentContainer.css('margin-left')) - parseFloat(parentContainer.css('margin-right'));

  // Check if we need to apply semi full screen fix.
  var $semiFullScreen = self.$container.parents('.h5p-standalone.h5p-dragquestion.h5p-semi-fullscreen');
  if ($semiFullScreen.length) {
    // Reset semi fullscreen width
    $semiFullScreen.css('width', '');

    // Decrease iframe size
    if (!decreaseSize) {
      self.$container.css('width', '10px');
      $semiFullScreen.css('width', '');

      // Trigger changes
      setTimeout(function () {
        self.trigger('resize', {
          decreaseSize: true
        });
      }, 200);
    }

    // Set width equal to iframe parent width, since iframe content has not been update yet.
    var $iframe = $(window.frameElement);
    if ($iframe) {
      var $iframeParent = $iframe.parent();
      width = $iframeParent.width();
      $semiFullScreen.css('width', width + 'px');
    }
  }
  var height = width / ratio;

  // Set natural size if no parent width
  if (width <= 0) {
    width = size.width;
    height = size.height;
  }
  this.$container.css({
    width: width + 'px',
    height: height + 'px',
    fontSize: 16 * (width / size.width) + 'px'
  });
};

/**
 * Disables all draggables.
 * @public
 */
C.prototype.disableDraggables = function () {
  this.draggables.forEach(function (draggable) {
    draggable.disable();
  });
};

/**
 * Enables all draggables.
 * @public
 */
C.prototype.enableDraggables = function () {
  this.draggables.forEach(function (draggable) {
    draggable.enable();
  });
};

/**
 * Shows the correct solutions on the boxes and disables input and buttons depending on settings.
 * @public
 * @params {Boolean} skipVisuals Skip visual animations.
 */
C.prototype.showAllSolutions = function (skipVisuals) {
  this.points = 0;
  this.rawPoints = 0;

  // One correct point for each "no solution" dropzone if there are no solutions
  if (this.blankIsCorrect) {
    this.points = 1;
    this.rawPoints = 1;
  }
  var scorePoints;
  if (!skipVisuals && this.options.behaviour.showScorePoints && !this.options.behaviour.singlePoint && this.options.behaviour.applyPenalties) {
    scorePoints = new H5P.Question.ScorePoints();
  }
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }

    //Disable all draggables in check mode.
    if (!skipVisuals) {
      draggable.disable();
    }

    // Find out where we are.
    this.points += draggable.results(skipVisuals, this.correctDZs[i], scorePoints);
    this.rawPoints += draggable.rawPoints;
  }
  if (this.points < 0) {
    this.points = 0;
  }
  if (!this.answered && this.blankIsCorrect) {
    this.points = this.weight;
  }
  if (this.options.behaviour.singlePoint) {
    this.points = this.points === this.calculateMaxScore() ? 1 : 0;
  }
  if (!skipVisuals) {
    this.hideButton('check-answer');
  }
  if (this.options.behaviour.enableRetry && !skipVisuals) {
    this.showButton('try-again');
  }
  if (this.hasButton('check-answer') && (this.options.behaviour.enableRetry === false || this.points === this.getMaxScore())) {
    // Max score reached, or the user cannot try again.
    this.hideButton('try-again');
  }
};

/**
 * Display the correct solutions, hides button and disables input.
 * Used in contracts.
 * @public
 */
C.prototype.showSolutions = function () {
  this.showAllSolutions();
  this.showScore();
  //Hide solution button:
  this.hideButton('check-answer');
  this.hideButton('try-again');

  //Disable dragging during "solution" mode
  this.disableDraggables();
};

/**
 * Resets the task.
 * Used in contracts.
 * @public
 */
C.prototype.resetTask = function () {
  this.points = 0;
  this.rawPoints = 0;
  this.answered = false;

  // If DOM loaded - reset it
  if (this.$container) {
    this.dropZones.forEach(function (dropzone) {
      dropzone.reset();
    });

    // Enables Draggables
    this.enableDraggables();

    //Reset position and feedback.
    this.draggables.forEach(function (draggable) {
      draggable.resetPosition();
    });
  } else {
    // Reset actual position values
    for (var i = 0; i < this.draggables.length; i++) {
      if (this.draggables[i] !== undefined) {
        for (var j = 0; j < this.draggables[i].elements.length; j++) {
          if (this.draggables[i].elements[j] !== undefined) {
            this.draggables[i].elements[j].dropZone = undefined;
            this.draggables[i].elements[j].position = undefined;
          }
        }
      }
    }
  }

  //Show solution button
  this.showButton('check-answer');
  this.hideButton('try-again');
  this.removeFeedback();
  this.setExplanation();
};

/**
 * Calculates the real max score.
 *
 * @returns {Number} Max points
 */
C.prototype.calculateMaxScore = function () {
  var max = 0;
  if (this.blankIsCorrect) {
    return 1;
  }
  var elements = this.options.question.task.elements;
  for (var i = 0; i < elements.length; i++) {
    var correctDropZones = this.correctDZs[i];
    if (correctDropZones === undefined || !correctDropZones.length) {
      continue;
    }
    if (elements[i].multiple) {
      max += correctDropZones.length;
    } else {
      max++;
    }
  }
  return max;
};

/**
 * Get maximum score.
 *
 * @returns {Number} Max points
 */
C.prototype.getMaxScore = function () {
  return this.options.behaviour.singlePoint ? this.weight : this.calculateMaxScore();
};

/**
 * Count the number of correct answers.
 * Only works while showing solution.
 *
 * @returns {Number} Points
 */
C.prototype.getScore = function () {
  this.showAllSolutions(true);
  var actualPoints = this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint ? this.points : this.rawPoints;
  delete this.points;
  delete this.rawPoints;
  return actualPoints;
};

/**
 * Checks if all has been answered.
 *
 * @returns {Boolean}
 */
C.prototype.getAnswerGiven = function () {
  return this.answered || this.blankIsCorrect;
};

/**
 * Shows the score to the user when the score button is pressed.
 */
C.prototype.showScore = function () {
  var maxScore = this.calculateMaxScore();
  if (this.options.behaviour.singlePoint) {
    maxScore = 1;
  }
  var actualPoints = this.options.behaviour.applyPenalties || this.options.behaviour.singlePoint ? this.points : this.rawPoints;
  var scoreText = H5P.Question.determineOverallFeedback(this.options.overallFeedback, actualPoints / maxScore).replace('@score', actualPoints).replace('@total', maxScore);
  var helpText = this.options.behaviour.enableScoreExplanation && this.options.behaviour.applyPenalties ? this.options.scoreExplanation : false;
  this.setFeedback(scoreText, actualPoints, maxScore, this.options.scoreBarLabel, helpText, undefined, this.options.scoreExplanationButtonLabel);
};

/**
 * Packs info about the current state of the task into a object for
 * serialization.
 *
 * @public
 * @returns {object}
 */
C.prototype.getCurrentState = function () {
  var state = {
    answers: []
  };
  for (var i = 0; i < this.draggables.length; i++) {
    var draggable = this.draggables[i];
    if (draggable === undefined) {
      continue;
    }
    var draggableAnswers = [];
    for (var j = 0; j < draggable.elements.length; j++) {
      var element = draggable.elements[j];
      if (element === undefined || element.dropZone === undefined) {
        continue;
      }

      // Store position and drop zone.
      draggableAnswers.push({
        x: element.position ? Number(element.position.left.replace('%', '')) : null,
        y: element.position ? Number(element.position.top.replace('%', '')) : null,
        dz: element.dropZone
      });
    }
    if (draggableAnswers.length) {
      // Add answers to state object for storage
      state.answers[i] = draggableAnswers;
    }
  }
  return state;
};
C.prototype.getTitle = function () {
  return H5P.createTitle(this.contentData && this.contentData.metadata && this.contentData.metadata.title ? this.contentData.metadata.title : 'Drag and drop');
};

/**
 * Initialize controls to improve a11Y.
 *
 * @private
 * @param {Draggable[]} draggables
 * @param {DropZone[]} dropZones
 * @param {Element} noDropzone
 * @return {Object<string, Controls>}
 */
var getControls = function getControls(draggables, dropZones, noDropzone) {
  // Initialize controls components
  var controls = {
    drag: new h5p_lib_controls_src_scripts_controls__WEBPACK_IMPORTED_MODULE_0__["default"]([new h5p_lib_controls_src_scripts_ui_keyboard__WEBPACK_IMPORTED_MODULE_3__["default"](), new h5p_lib_controls_src_scripts_ui_mouse__WEBPACK_IMPORTED_MODULE_4__["default"](), new h5p_lib_controls_src_scripts_aria_drag__WEBPACK_IMPORTED_MODULE_1__["default"]()]),
    drop: new h5p_lib_controls_src_scripts_controls__WEBPACK_IMPORTED_MODULE_0__["default"]([new h5p_lib_controls_src_scripts_ui_keyboard__WEBPACK_IMPORTED_MODULE_3__["default"](), new h5p_lib_controls_src_scripts_ui_mouse__WEBPACK_IMPORTED_MODULE_4__["default"](), new h5p_lib_controls_src_scripts_aria_drop__WEBPACK_IMPORTED_MODULE_2__["default"]()])
  };
  controls.drag.useNegativeTabIndex();
  controls.drop.useNegativeTabIndex();

  // Keep track of current selected draggable (selected via keyboard)
  var selected;

  /**
   * De-selects the currently selected draggable element.
   *
   * @private
   */
  var deselect = function deselect() {
    selected.draggable.trigger('dragend');
    selected.element.$.removeClass('h5p-draggable-hover');
    _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);
    if (controls.drop.elements.indexOf(noDropzone) !== -1) {
      controls.drop.removeElement(noDropzone);
      noDropzone.style.display = 'none';
    }
    for (var i = 0; i < dropZones.length; i++) {
      var dropZone = dropZones[i];

      // Remove highlighting
      dropZone.dehighlight();
      if (controls.drop.elements.indexOf(dropZone.$dropZone[0]) !== -1) {
        controls.drop.removeElement(dropZone.$dropZone[0]);
      }
    }
    if (selected.element.$.is(':visible')) {
      // Put focus back on element after deselecting
      selected.element.$.focus();
    } else {
      // Put focus on next draggable element
      var $next = selected.draggable.elements[selected.draggable.elements.length - 1].$;
      controls.drag.setTabbable($next[0]);
      $next.focus();
    }
    selected = undefined;
  };

  // Handle draggable selected through keyboard
  controls.drag.on('select', function (event) {
    controls.drag.removeElement(noDropzone);
    var result = _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].elementToDraggable(draggables, event.element);
    if (selected) {
      // De-select
      deselect();
      return;
    }
    selected = result;

    // Select
    selected.element.$.addClass('h5p-draggable-hover');
    _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].setElementOpacity(selected.element.$, selected.draggable.backgroundOpacity);
    selected.draggable.trigger('dragstart', selected.draggable.mustCopyElement(selected.element) ? 'copy' : 'move');

    // Add special drop zone to reset
    controls.drop.addElement(noDropzone);

    // Position at element position
    noDropzone.style.display = 'block';
    noDropzone.style.left = selected.draggable.x + '%';
    noDropzone.style.top = selected.draggable.y + '%';
    noDropzone.style.width = selected.draggable.width + 'em';
    noDropzone.style.height = selected.draggable.height + 'em';

    // Figure out which drop zones will accept this draggable
    var $first;
    for (var i = 0; i < dropZones.length; i++) {
      var dropZone = dropZones[i];

      /*
       * Draggable.isInDropzone only compares the draggable number, and
       * will also return true if the draggable is not in the dropzone but
       * if there can be infinite instances of the draggable.
       */
      var elementInstanceIsInDropZone = selected.draggable.isInDropZone(dropZone.id) && event.element !== selected.draggable.element.$[0];
      if (dropZone.accepts(selected.draggable, draggables) || elementInstanceIsInDropZone) {
        dropZone.highlight();
        controls.drop.addElement(dropZone.$dropZone[0]);
        if (!$first || selected.element.dropZone === dropZone.id) {
          $first = dropZone.$dropZone;
        }
      }
    }
    if ($first) {
      // Focus the first drop zone after selecting a draggable
      controls.drop.setTabbable($first[0]);
      $first.focus();
    } else {
      controls.drag.addElement(noDropzone);
    }
  });

  // Handle dropzone selected through keyboard
  controls.drop.on('select', function (event) {
    if (!selected) {
      return;
    }
    if (event.element === noDropzone) {
      // Reset position

      if (selected.element.dropZone !== undefined) {
        selected.element.reset();
      }
      if (selected !== undefined) {
        // Equals draggable.multiple === false
        selected.element.$.css({
          left: selected.draggable.x + '%',
          top: selected.draggable.y + '%',
          width: selected.draggable.width + 'em',
          height: selected.draggable.height + 'em'
        });
        selected.draggable.updatePlacement(selected.element);
        selected.element.$[0].setAttribute('aria-grabbed', 'false');
        deselect();
      }
      return;
    }
    var dropZone = _drag_utils__WEBPACK_IMPORTED_MODULE_5__["default"].elementToDropZone(dropZones, event.element);
    var mustCopyElement = selected.draggable.mustCopyElement(selected.element);
    if (mustCopyElement) {
      // Leave a new element for next drag
      selected.element.clone();
    }

    // Add draggable to drop zone
    selected.draggable.addToDropZone(selected.index, selected.element, dropZone.id);

    // Set position in case DZ is full (auto align doesn't work)
    selected.element.$.css({
      left: dropZone.x + '%',
      top: dropZone.y + '%'
    });
    if (dropZone.getIndexOf(selected.element.$) === -1) {
      // Add to alignables
      dropZone.alignables.push(selected.element.$);
    }

    // Trigger alignment
    dropZone.autoAlign();

    // Reset selected
    selected.element.$[0].setAttribute('aria-grabbed', 'false');
    deselect();
  });
  return controls;
};
H5P.DragShuffle = C;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUV3RCxRQUFRLENBQUNoQixFQUFFLENBQUM7O0lBRS9FO0lBQ0F5VixRQUFRLENBQUNqWSxPQUFPLENBQUNpQyxDQUFDLENBQUNsRCxHQUFHLENBQUM7TUFDckIrQixJQUFJLEVBQUUwQyxRQUFRLENBQUNSLENBQUMsR0FBRyxHQUFHO01BQ3RCckMsR0FBRyxFQUFFNkMsUUFBUSxDQUFDUCxDQUFDLEdBQUc7SUFDcEIsQ0FBQyxDQUFDO0lBRUYsSUFBSU8sUUFBUSxDQUFDc0YsVUFBVSxDQUFDbVAsUUFBUSxDQUFDalksT0FBTyxDQUFDaUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7TUFDbEQ7TUFDQXVCLFFBQVEsQ0FBQzRFLFVBQVUsQ0FBQzdFLElBQUksQ0FBQzBVLFFBQVEsQ0FBQ2pZLE9BQU8sQ0FBQ2lDLENBQUMsQ0FBQztJQUM5Qzs7SUFFQTtJQUNBdUIsUUFBUSxDQUFDMkUsU0FBUyxDQUFDLENBQUM7O0lBRXBCO0lBQ0E4UCxRQUFRLENBQUNqWSxPQUFPLENBQUNpQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM4QyxZQUFZLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztJQUMzRG1ULFFBQVEsQ0FBQyxDQUFDO0VBQ1osQ0FBQyxDQUFDO0VBRUYsT0FBT2xLLFFBQVE7QUFDakIsQ0FBQztBQUVEOUwsR0FBRyxDQUFDcVcsV0FBVyxHQUFHL00sQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9oNXAtbGliLWNvbnRyb2xzL3NyYy9zY3JpcHRzL2FyaWEvZHJhZy5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL2g1cC1saWItY29udHJvbHMvc3JjL3NjcmlwdHMvYXJpYS9kcm9wLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvaDVwLWxpYi1jb250cm9scy9zcmMvc2NyaXB0cy9jb250cm9scy5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL2g1cC1saWItY29udHJvbHMvc3JjL3NjcmlwdHMvbWl4aW5zL2V2ZW50ZnVsLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvaDVwLWxpYi1jb250cm9scy9zcmMvc2NyaXB0cy91aS9rZXlib2FyZC5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL2g1cC1saWItY29udHJvbHMvc3JjL3NjcmlwdHMvdWkvbW91c2UuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9oNXAtbGliLWNvbnRyb2xzL3NyYy9zY3JpcHRzL3V0aWxzL2VsZW1lbnRzLmpzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvaDVwLWxpYi1jb250cm9scy9zcmMvc2NyaXB0cy91dGlscy9mdW5jdGlvbmFsLmpzIiwid2VicGFjazovLy8uL2RyYWctdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vZHJhZ2dhYmxlLmpzIiwid2VicGFjazovLy8uL2Ryb3B6b25lLmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL2RyYWctcXVlc3Rpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthdHRyaWJ1dGVFcXVhbHMsIGhhc0F0dHJpYnV0ZSwgc2V0QXR0cmlidXRlfSBmcm9tICcuLi91dGlscy9lbGVtZW50cyc7XG5pbXBvcnQge2NvbXBvc2UsIGZvckVhY2gsIGZpbHRlciwgc29tZX0gZnJvbSAnLi4vdXRpbHMvZnVuY3Rpb25hbCc7XG5cbi8qKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEByZWFkb25seVxuICovXG5jb25zdCBBVFRSSUJVVEVfQVJJQV9HUkFCQkVEID0gJ2FyaWEtZ3JhYmJlZCc7XG5cbi8qKlxuICogQHR5cGUge2Z1bmN0aW9ufSBzZXRHcmFiYmVkVHJ1ZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICovXG5jb25zdCBzZXRHcmFiYmVkID0gc2V0QXR0cmlidXRlKEFUVFJJQlVURV9BUklBX0dSQUJCRUQpO1xuXG4vKipcbiAqIEB0eXBlIHtmdW5jdGlvbn0gaXNHcmFiYmVkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKi9cbmNvbnN0IGlzR3JhYmJlZCA9IGF0dHJpYnV0ZUVxdWFscyhBVFRSSUJVVEVfQVJJQV9HUkFCQkVELCAndHJ1ZScpO1xuXG4vKipcbiAqIEB0eXBlIHtmdW5jdGlvbn0gZmlsdGVySGFzQXR0cmlidXRlRHJvcEVmZmVjdFxuICovXG5jb25zdCBmaWx0ZXJIYXNBdHRyaWJ1dGVHcmFiYmVkID0gZmlsdGVyKGhhc0F0dHJpYnV0ZShBVFRSSUJVVEVfQVJJQV9HUkFCQkVEKSk7XG5cbi8qKlxuICogU2V0cyBhbGwgYXJpYS1ncmFiYmVkIHRvICdmYWxzZSdcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gZWxlbWVudHNcbiAqIEB0eXBlIHtmdW5jdGlvbn0gc2V0QWxsR3JhYmJlZFRvRmFsc2VcbiAqL1xuY29uc3Qgc2V0QWxsR3JhYmJlZFRvRmFsc2UgPSBjb21wb3NlKGZvckVhY2goc2V0QXR0cmlidXRlKEFUVFJJQlVURV9BUklBX0dSQUJCRUQsICdmYWxzZScpKSwgZmlsdGVySGFzQXR0cmlidXRlR3JhYmJlZCk7XG5cbi8qKlxuICogQHR5cGUge2Z1bmN0aW9ufSBoYXNHcmFiYmVkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IGVsZW1lbnRzXG4gKi9cbmNvbnN0IGhhc0dyYWJiZWQgPSBjb21wb3NlKHNvbWUoaXNHcmFiYmVkKSwgZmlsdGVySGFzQXR0cmlidXRlR3JhYmJlZCk7XG5cbi8qKlxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYWcge1xuICAvKipcbiAgICogSW5pdHMgdGhpcyBjbGFzc1xuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRyb2xzfSBjb250cm9sc1xuICAgKi9cbiAgaW5pdChjb250cm9scynCoHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Q29udHJvbHN9XG4gICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuXG4gICAgLy8gaGFuZGxlIHNlbGVjdCBldmVudFxuICAgIHRoaXMuY29udHJvbHMub24oJ3NlbGVjdCcsIHRoaXMuc2VsZWN0LCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFya3MgZWxlbWVudCBhcyBhcmlhLWdyYWJiZWQgPSAnZmFsc2UnIGFuZCBhZGRzIHRvIGNvbnRyb2xsZXJcbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIGFkZEVsZW1lbnQoZWxlbWVudCkge1xuICAgIHNldEdyYWJiZWQoJ2ZhbHNlJywgZWxlbWVudCk7XG4gICAgdGhpcy5jb250cm9scy5hZGRFbGVtZW50KGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYXJpYS1ncmFiYmVkIHRvICdmYWxzZScgZm9yIGFsbCBlbGVtZW50cyB0aGF0IGhhcyBpdFxuICAgKi9cbiAgc2V0QWxsR3JhYmJlZFRvRmFsc2UoKSB7XG4gICAgc2V0QWxsR3JhYmJlZFRvRmFsc2UodGhpcy5jb250cm9scy5lbGVtZW50cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGFueSBvZiB0aGUgZWxlbWVudHMgYXJlIGdyYWJiZWRcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc0FueUdyYWJiZWQoKSB7XG4gICAgcmV0dXJuIGhhc0dyYWJiZWQodGhpcy5jb250cm9scy5lbGVtZW50cylcbiAgfVxuXG4gIC8qKlxuICAgKiBVbiBzZWxlY3RzIGFsbCwgYnV0IHNlbGVjdHMgbmV3IGVsZW1lbnQgaWYgbm90IGFscmVhZHkgc2VsZWN0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKi9cbiAgc2VsZWN0KHtlbGVtZW50fSnCoHtcbiAgICBjb25zdCBhbHJlYWR5R3JhYmJlZCA9IGlzR3JhYmJlZChlbGVtZW50KTtcblxuICAgIHRoaXMuc2V0QWxsR3JhYmJlZFRvRmFsc2UoKTtcblxuICAgIGlmKCFhbHJlYWR5R3JhYmJlZCkge1xuICAgICAgc2V0R3JhYmJlZCgndHJ1ZScsIGVsZW1lbnQpO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7c2V0QXR0cmlidXRlLCBoYXNBdHRyaWJ1dGV9IGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcbmltcG9ydCB7Y29tcG9zZSwgZm9yRWFjaCwgZmlsdGVyfSBmcm9tICcuLi91dGlscy9mdW5jdGlvbmFsJztcblxuLyoqXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQHJlYWRvbmx5XG4gKi9cbmNvbnN0IEFUVFJJQlVURV9BUklBX0RST1BFRkZFQ1QgPSAnYXJpYS1kcm9wZWZmZWN0JztcblxuLyoqXG4gKiBAdHlwZSB7ZnVuY3Rpb259IHNldERyb3BFZmZlY3ROb25lXG4gKi9cbmNvbnN0IHNldERyb3BFZmZlY3ROb25lID0gc2V0QXR0cmlidXRlKEFUVFJJQlVURV9BUklBX0RST1BFRkZFQ1QsICdub25lJyk7XG5cbi8qKlxuICogQHR5cGUge2Z1bmN0aW9ufSBzZXREcm9wRWZmZWN0Tm9uZVxuICovXG5jb25zdCBzZXREcm9wRWZmZWN0TW92ZSA9IHNldEF0dHJpYnV0ZShBVFRSSUJVVEVfQVJJQV9EUk9QRUZGRUNULCAnbW92ZScpO1xuXG4vKipcbiAqIEB0eXBlIHtmdW5jdGlvbn0gZmlsdGVySGFzQXR0cmlidXRlRHJvcEVmZmVjdFxuICovXG5jb25zdCBmaWx0ZXJIYXNBdHRyaWJ1dGVEcm9wRWZmZWN0ID0gZmlsdGVyKGhhc0F0dHJpYnV0ZShBVFRSSUJVVEVfQVJJQV9EUk9QRUZGRUNUKSk7XG5cbi8qKlxuICogU2V0cyBhbGwgZHJvcCB6b25lcyB0byBtb3ZlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IGVsZW1lbnRzXG4gKiBAdHlwZSB7ZnVuY3Rpb259IHNldERyb3Bab25lRWZmZWN0c1RvTW92ZVxuICovXG5jb25zdCBzZXRBbGxEcm9wRWZmZWN0c1RvTW92ZSA9IGNvbXBvc2UoZm9yRWFjaChzZXREcm9wRWZmZWN0TW92ZSksIGZpbHRlckhhc0F0dHJpYnV0ZURyb3BFZmZlY3QpO1xuXG4vKipcbiAqIFNldHMgYWxsIGRyb3Agem9uZXMgdG8gbm9uZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudFtdfSBlbGVtZW50c1xuICogQHR5cGUge2Z1bmN0aW9ufSBzZXRBbGxEcm9wRWZmZWN0c1RvTm9uZVxuICovXG5jb25zdCBzZXRBbGxEcm9wRWZmZWN0c1RvTm9uZSA9IGNvbXBvc2UoZm9yRWFjaChzZXREcm9wRWZmZWN0Tm9uZSksIGZpbHRlckhhc0F0dHJpYnV0ZURyb3BFZmZlY3QpO1xuXG4vKipcbiAqIENsYXNzIGZvciBoYW5kbGluZyBEcm9wIFpvbmVzXG4gKlxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3Age1xuICAvKipcbiAgICogSW5pdHMgdGhpcyBjbGFzc1xuICAgKiBAcGFyYW0ge0NvbnRyb2xzfSBjb250cm9sc1xuICAgKi9cbiAgaW5pdChjb250cm9scynCoHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Q29udHJvbHN9XG4gICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBPbiBlbGVtZW50cyB3aXRoIGFyaWEtZHJvcGVmZmVjdCwgc2V0IGFyaWEtZHJvcGVmZmVjdCB0byAnbW92ZSdcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc2V0QWxsVG9Nb3ZlKCkge1xuICAgIHNldEFsbERyb3BFZmZlY3RzVG9Nb3ZlKHRoaXMuY29udHJvbHMuZWxlbWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9uIGVsZW1lbnRzIHdpdGggYXJpYS1kcm9wZWZmZWN0LCBzZXQgYXJpYS1kcm9wZWZmZWN0IHRvICdub25lJ1xuICAgKiBAcHVibGljXG4gICAqL1xuICBzZXRBbGxUb05vbmUoKSB7XG4gICAgc2V0QWxsRHJvcEVmZmVjdHNUb05vbmUodGhpcy5jb250cm9scy5lbGVtZW50cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBFbnVtIGZvciBBUklBIGRyb3AgZWZmZWN0c1xuICogQHJlYWRvbmx5XG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5Ecm9wLkRyb3BFZmZlY3QgPSB7XG4gIENPUFk6ICdjb3B5JyxcbiAgTU9WRTogJ21vdmUnLFxuICBFWEVDVVRFOiAnZXhlY3V0ZScsXG4gIFBPUFVQOiAncG9wdXAnLFxuICBOT05FOiAnbm9uZSdcbn07IiwiaW1wb3J0IHsgc2V0QXR0cmlidXRlLCByZW1vdmVBdHRyaWJ1dGUsIGhhc0F0dHJpYnV0ZSB9IGZyb20gJy4vdXRpbHMvZWxlbWVudHMnO1xuaW1wb3J0IHsgZm9yRWFjaCwgd2l0aG91dCB9IGZyb20gJy4vdXRpbHMvZnVuY3Rpb25hbCc7XG5pbXBvcnQgeyBFdmVudGZ1bCB9IGZyb20gJy4vbWl4aW5zL2V2ZW50ZnVsJztcblxuLyoqXG4gKiBDb250cm9scyBFdmVudFxuICogQHR5cGVkZWYge09iamVjdH0gQ29udHJvbHNFdmVudFxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGluZGV4XG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50W119IGVsZW1lbnRzXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBvbGRFbGVtZW50XG4gKi9cbi8qKlxuICogQWRkIGVsZW1lbnQgZXZlbnRcbiAqIEBldmVudCBDb250cm9scyNhZGRFbGVtZW50XG4gKiBAdHlwZSBDb250cm9sc0V2ZW50XG4gKi9cbi8qKlxuICogUmVtb3ZlIGVsZW1lbnQgZXZlbnRcbiAqIEBldmVudCBDb250cm9scyNyZW1vdmVFbGVtZW50XG4gKiBAdHlwZSBDb250cm9sc0V2ZW50XG4gKi9cbi8qKlxuICogUHJldmlvdXMgZWxlbWVudCBldmVudFxuICogQGV2ZW50IENvbnRyb2xzI3ByZXZpb3VzRWxlbWVudFxuICogQHR5cGUgQ29udHJvbHNFdmVudFxuICovXG4vKipcbiAqIE5leHQgZWxlbWVudCBldmVudFxuICogQGV2ZW50IENvbnRyb2xzI25leHRFbGVtZW50XG4gKiBAdHlwZSBDb250cm9sc0V2ZW50XG4gKi9cbi8qKlxuICogU2VsZWN0IG9wdGlvbiBldmVudFxuICogQGV2ZW50IENvbnRyb2xzI3NlbGVjdFxuICogQHR5cGUgQ29udHJvbHNFdmVudFxuICovXG4vKipcbiAqIENsb3NlIGV2ZW50XG4gKiBAZXZlbnQgQ29udHJvbHMjY2xvc2VcbiAqIEB0eXBlIENvbnRyb2xzRXZlbnRcbiAqL1xuLyoqXG4gKiBEcmFnIGVsZW1lbnQgZXZlbnRcbiAqIEBldmVudCBDb250cm9scyNkcmFnXG4gKiBAdHlwZSBDb250cm9sc0V2ZW50XG4gKi9cblxuLyoqXG4gKiBAdHlwZSB7ZnVuY3Rpb259IHJlbW92ZVRhYkluZGV4XG4gKi9cbmNvbnN0IHJlbW92ZVRhYkluZGV4ID0gcmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuLyoqXG4gKiBAdHlwZSB7ZnVuY3Rpb259IHJlbW92ZVRhYkluZGV4Rm9yQWxsXG4gKi9cbmNvbnN0IHJlbW92ZVRhYkluZGV4Rm9yQWxsID0gZm9yRWFjaChyZW1vdmVUYWJJbmRleCk7XG4vKipcbiAqIEB0eXBlIHtmdW5jdGlvbn0gc2V0VGFiSW5kZXhaZXJvXG4gKi9cbmNvbnN0IHNldFRhYkluZGV4WmVybyA9IHNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuLyoqXG4gKiBAdHlwZSB7ZnVuY3Rpb259IHNldFRhYkluZGV4TWludXNPbmVcbiAqL1xuY29uc3Qgc2V0VGFiSW5kZXhNaW51c09uZSA9IHNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbi8qKlxuICogQHR5cGUge2Z1bmN0aW9ufSBoYXNUYWJJbmRleFxuICovXG5jb25zdCBoYXNUYWJJbmRleCA9IGhhc0F0dHJpYnV0ZSgndGFiaW5kZXgnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBtaXhlcyBFdmVudGZ1bFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9scyB7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbnMpIHtcbiAgICAvLyBhZGQgZXZlbnQgc3lzdGVtXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFdmVudGZ1bCgpKTtcblxuICAgIC8qKlxuICAgICAqQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFiYmFibGVFbGVtZW50XG4gICAgICovXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtvYmplY3RbXX0gcGx1Z2luc1xuICAgICAqL1xuICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnMgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50W119IGVsZW1lbnRzXG4gICAgICovXG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSB1c2VOZWdhdGl2ZVRhYkluZGV4XG4gICAgICovXG4gICAgdGhpcy5uZWdhdGl2ZVRhYkluZGV4QWxsb3dlZCA9IGZhbHNlO1xuXG4gICAgLy8gbW92ZSB0YWJpbmRleCB0byBuZXh0IGVsZW1lbnRcbiAgICB0aGlzLm9uKCduZXh0RWxlbWVudCcsIHRoaXMubmV4dEVsZW1lbnQsIHRoaXMpO1xuXG4gICAgLy8gbW92ZSB0YWJpbmRleCB0byBwcmV2aW91cyBlbGVtZW50XG4gICAgdGhpcy5vbigncHJldmlvdXNFbGVtZW50JywgdGhpcy5wcmV2aW91c0VsZW1lbnQsIHRoaXMpO1xuXG4gICAgLy8gbW92ZSB0YWJpbmRleCBmb3IgZmlzdCBlbGVtZW50XG4gICAgdGhpcy5vbignZmlyc3RFbGVtZW50JywgdGhpcy5maXJzdEVsZW1lbnQsIHRoaXMpO1xuXG4gICAgLy8gbW92ZSB0YWJpbmRleCBmb3IgbGFzdCBlbGVtZW50XG4gICAgdGhpcy5vbignbGFzdEVsZW1lbnQnLCB0aGlzLmxhc3RFbGVtZW50LCB0aGlzKTtcblxuICAgIC8vIGluaXQgcGx1Z2luc1xuICAgIHRoaXMuaW5pdFBsdWdpbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY29udHJvbHMgdG8gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICAgKlxuICAgKiBAZmlyZXMgQ29udHJvbHMjYWRkRWxlbWVudFxuICAgKiBAcHVibGljXG4gICAqL1xuICBhZGRFbGVtZW50KGVsKcKge1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbCk7XG5cbiAgICB0aGlzLmZpcmVzRXZlbnQoJ2FkZEVsZW1lbnQnLCBlbCk7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50cy5sZW5ndGggPT09IDEpIHsgLy8gaWYgZmlyc3RcbiAgICAgIHRoaXMuc2V0VGFiYmFibGUoZWwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWRkIGNvbnRyb2xzIHRvIGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uXG4gICAqXG4gICAqIEBmaXJlcyBDb250cm9scyNhZGRFbGVtZW50XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGluc2VydEVsZW1lbnRBdChlbCwgcG9zaXRpb24pIHtcbiAgICB0aGlzLmVsZW1lbnRzLnNwbGljZShwb3NpdGlvbiwgMCwgZWwpO1xuXG4gICAgdGhpcy5maXJlc0V2ZW50KCdhZGRFbGVtZW50JywgZWwpO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudHMubGVuZ3RoID09PSAxKSB7IC8vIGlmIGZpcnN0XG4gICAgICB0aGlzLnNldFRhYmJhYmxlKGVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGNvbnRyb2xzIHRvIGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAgICpcbiAgICogQGZpcmVzIENvbnRyb2xzI2FkZEVsZW1lbnRcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcmVtb3ZlRWxlbWVudChlbCnCoHtcbiAgICB0aGlzLmVsZW1lbnRzID0gd2l0aG91dChbZWxdLCB0aGlzLmVsZW1lbnRzKTtcblxuICAgIC8vIGlmIHJlbW92ZWQgZWxlbWVudCB3YXMgc2VsZWN0ZWRcbiAgICBpZihoYXNUYWJJbmRleChlbCkpIHtcbiAgICAgIHRoaXMuc2V0VW50YWJiYWJsZShlbCk7XG5cbiAgICAgIC8vIHNldCBmaXJzdCBlbGVtZW50IHNlbGVjdGVkIGlmIGV4aXN0c1xuICAgICAgaWYodGhpcy5lbGVtZW50c1swXSkge1xuICAgICAgICB0aGlzLnNldFRhYmJhYmxlKHRoaXMuZWxlbWVudHNbMF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZmlyZXNFdmVudCgncmVtb3ZlRWxlbWVudCcsIGVsKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGlzIGNvbnRyb2xsZWQgYnkgdGhpcyBvYmplY3RcbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmUgZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxFdmVudFRhcmdldH0gZWxcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZmlyZXNFdmVudCh0eXBlLCBlbCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5lbGVtZW50cy5pbmRleE9mKGVsKTtcblxuICAgIHJldHVybiB0aGlzLmZpcmUodHlwZSwge1xuICAgICAgZWxlbWVudDogZWwsXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBlbGVtZW50czogdGhpcy5lbGVtZW50cyxcbiAgICAgIG9sZEVsZW1lbnQ6IHRoaXMudGFiYmFibGVFbGVtZW50XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0YWJpbmRleCBvbiBhbiBlbGVtZW50LCByZW1vdmUgaXQgZnJvbSBhbGwgb3RoZXJzXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbmV4dEVsZW1lbnQoe2luZGV4fSkge1xuICAgIGNvbnN0IGlzTGFzdEVsZW1lbnQgPSBpbmRleCA9PT0gKHRoaXMuZWxlbWVudHMubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgbmV4dEVsID0gdGhpcy5lbGVtZW50c1tpc0xhc3RFbGVtZW50ID8gMCA6IChpbmRleCArIDEpXTtcblxuICAgIHRoaXMuc2V0VGFiYmFibGUobmV4dEVsKTtcbiAgICBuZXh0RWwuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRhYmluZGV4IG9uIHRoZSBmaXJzdCBlbGVtZW50LCByZW1vdmUgaXQgZnJvbSBhbGwgb3RoZXJzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmaXJzdEVsZW1lbnQoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbMF07XG4gICAgdGhpcy5zZXRUYWJiYWJsZShlbGVtZW50KTtcbiAgICBlbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0YWJpbmRleCBvbiB0aGUgZmlyc3QgZWxlbWVudCwgcmVtb3ZlIGl0IGZyb20gYWxsIG90aGVyc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGFzdEVsZW1lbnQoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudHNbdGhpcy5lbGVtZW50cy5sZW5ndGggLSAxXTtcbiAgICB0aGlzLnNldFRhYmJhYmxlKGVsZW1lbnQpO1xuICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBlbGVtZW50IGF0IGEgcG9zaXRpb24gZ2l2ZW4gYnkgYXJndW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNldFRhYmJhYmxlQnlJbmRleChpbmRleCkge1xuICAgIGNvbnN0IG5leHRFbCA9IHRoaXMuZWxlbWVudHNbaW5kZXhdO1xuXG4gICAgaWYgKG5leHRFbCnCoHtcbiAgICAgIHRoaXMuc2V0VGFiYmFibGUobmV4dEVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0YWJpbmRleCBvbiBhbiBlbGVtZW50LCByZW1vdmUgaXQgZnJvbSBhbGwgb3RoZXJzXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNldFRhYmJhYmxlKGVsKSB7XG4gICAgZm9yRWFjaCh0aGlzLnNldFVudGFiYmFibGUuYmluZCh0aGlzKSwgdGhpcy5lbGVtZW50cyk7XG4gICAgc2V0VGFiSW5kZXhaZXJvKGVsKTtcbiAgICB0aGlzLnRhYmJhYmxlRWxlbWVudCA9IGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGFiYmFiaWxpdHkgZnJvbSBhbiBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gICAqL1xuICBzZXRVbnRhYmJhYmxlKGVsKSB7XG4gICAgaWYgKGVsID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYodGhpcy5uZWdhdGl2ZVRhYkluZGV4QWxsb3dlZCkge1xuICAgICAgc2V0VGFiSW5kZXhNaW51c09uZShlbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVtb3ZlVGFiSW5kZXgoZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRhYmluZGV4IG9uIGFuIGVsZW1lbnQsIHJlbW92ZSBpdCBmcm9tIGFsbCBvdGhlcnNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcmV2aW91c0VsZW1lbnQoe2luZGV4fSkge1xuICAgIGNvbnN0IGlzRmlyc3RFbGVtZW50ID0gaW5kZXggPT09IDA7XG4gICAgY29uc3QgcHJldkVsID0gdGhpcy5lbGVtZW50c1tpc0ZpcnN0RWxlbWVudCA/ICh0aGlzLmVsZW1lbnRzLmxlbmd0aCAtIDEpIDogKGluZGV4IC0gMSldO1xuXG4gICAgdGhpcy5zZXRUYWJiYWJsZShwcmV2RWwpO1xuICAgIHByZXZFbC5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0YWJpbmRleD1cIi0xXCIgaW5zdGVhZCBvZiByZW1vdmluZyB0YWJpbmRleCBmb3Igbm9uLWZvY3VzZWQgZWxlbWVudHNcbiAgICovXG4gIHVzZU5lZ2F0aXZlVGFiSW5kZXgoKSB7XG4gICAgdGhpcy5uZWdhdGl2ZVRhYkluZGV4QWxsb3dlZCA9IHRydWU7XG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgaWYoIWVsZW1lbnQuaGFzQXR0cmlidXRlKCd0YWJpbmRleCcpKXtcbiAgICAgICAgc2V0VGFiSW5kZXhNaW51c09uZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBwbHVnaW5zXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0UGx1Z2lucygpwqB7XG4gICAgdGhpcy5wbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKXtcbiAgICAgIGlmKHBsdWdpbi5pbml0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBwbHVnaW4uaW5pdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfVxufSIsIi8qKlxuICogQG1peGluXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudGZ1bCA9ICgpID0+ICh7XG4gIGxpc3RlbmVyczoge30sXG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgKiBAcGFyYW0ge29iamVjdH0gW3Njb3BlXVxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHJldHVybiB7RXZlbnRmdWx9XG4gICAqL1xuICBvbjogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIHNjb3BlKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGVkZWYge29iamVjdH0gVHJpZ2dlclxuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IHNjb3BlXG4gICAgICovXG4gICAgY29uc3QgdHJpZ2dlciA9IHtcbiAgICAgICdsaXN0ZW5lcic6IGxpc3RlbmVyLFxuICAgICAgJ3Njb3BlJzogc2NvcGVcbiAgICB9O1xuXG4gICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0gPSB0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXTtcbiAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKHRyaWdnZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZpcmUgZXZlbnQuIElmIGFueSBvZiB0aGUgbGlzdGVuZXJzIHJldHVybnMgZmFsc2UsIHJldHVybiBmYWxzZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50XVxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZpcmU6IGZ1bmN0aW9uKHR5cGUsIGV2ZW50KSB7XG4gICAgY29uc3QgdHJpZ2dlcnMgPSB0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXTtcblxuICAgIHJldHVybiB0cmlnZ2Vycy5ldmVyeShmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlci5saXN0ZW5lci5jYWxsKHRyaWdnZXIuc2NvcGUgfHwgdGhpcywgZXZlbnQpICE9PSBmYWxzZTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVucyBmb3IgZXZlbnRzIG9uIGFub3RoZXIgRXZlbnRmdWwsIGFuZCBwcm9wYWdhdGUgaXQgdHJvdWdoIHRoaXMgRXZlbnRmdWxcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdHlwZXNcbiAgICogQHBhcmFtIHtFdmVudGZ1bH0gZXZlbnRmdWxcbiAgICovXG4gIHByb3BhZ2F0ZTogZnVuY3Rpb24odHlwZXMsIGV2ZW50ZnVsKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBldmVudGZ1bC5vbih0eXBlLCBldmVudCA9PiBzZWxmLmZpcmUodHlwZSwgZXZlbnQpKSk7XG4gIH1cbn0pOyIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEtleWJvYXJkIG5hdmlnYXRpb24gZm9yIGFjY2Vzc2liaWxpdHkgc3VwcG9ydFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc2VsZWN0YWJpbGl0eVxuICAgICAqL1xuICAgIHRoaXMuc2VsZWN0YWJpbGl0eSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogSW5pdHMgdGhpcyBjbGFzc1xuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRyb2xzfSBjb250cm9sc1xuICAgKi9cbiAgaW5pdChjb250cm9scynCoHtcbiAgICAvKipcbiAgICAgKiBOZWVkIHRvIGhhdmUgYSBjb21tb24gYmluZGluZyBvZiBoYW5kbGVLZXlEb3duLCBzbyB0aGF0IGl0IGNhbiBiZSBhXG4gICAgICogY29tbW9uIGluc3RhbmNlIHRvIGJlIHVzZWQgZm9yIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5ib3VuZEhhbmRsZUtleURvd24gPSB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtDb250cm9sc31cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gICAgdGhpcy5jb250cm9scy5vbignYWRkRWxlbWVudCcsIHRoaXMubGlzdGVuRm9yS2V5RG93biwgdGhpcyk7XG4gICAgdGhpcy5jb250cm9scy5vbigncmVtb3ZlRWxlbWVudCcsIHRoaXMucmVtb3ZlS2V5RG93bkxpc3RlbmVyLCB0aGlzKTtcbiAgfTtcblxuICAvKipcbiAgICogTGlzdGVucyBmb3IgYSBrZXlib2FyZCBwcmVzcyB3aGVuIGVsZW1lbnQgaXMgZm9jdXNlZFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsaXN0ZW5Gb3JLZXlEb3duKHtlbGVtZW50fSkge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmRIYW5kbGVLZXlEb3duKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlIGEga2V5Ym9hcmQgcHJlc3MgbGlzdGVuZXJcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlS2V5RG93bkxpc3RlbmVyKHtlbGVtZW50fSkge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmRIYW5kbGVLZXlEb3duKTtcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBrZXkgZG93blxuICAgKlxuICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEtleWJvYXJkIGV2ZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgc3dpdGNoIChldmVudC53aGljaCkge1xuICAgICAgY2FzZSAyNzogLy8gRXNjYXBlXG4gICAgICAgIHRoaXMuY2xvc2UoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzNTogLy8gRW5kXG4gICAgICAgIHRoaXMubGFzdEVsZW1lbnQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzNjogLy8gSG9tZVxuICAgICAgICB0aGlzLmZpcnN0RWxlbWVudChldmVudC50YXJnZXQpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDEzOiAvLyBFbnRlclxuICAgICAgY2FzZSAzMjogLy8gU3BhY2VcbiAgICAgICAgdGhpcy5zZWxlY3QoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzNzogLy8gTGVmdCBBcnJvd1xuICAgICAgY2FzZSAzODogLy8gVXAgQXJyb3dcbiAgICAgICAgLy8gaWdub3JlIHdpdGggbW9kaWZpZXJzLCBzbyBub3QgdG8gaW50ZXJmZXJlIHdpdGggQ2hyb21ldm94XG4gICAgICAgIGlmKCF0aGlzLmhhc0Nocm9tZXZveE1vZGlmaWVycyhldmVudCkpIHtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzRWxlbWVudChldmVudC50YXJnZXQpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM5OiAvLyBSaWdodCBBcnJvd1xuICAgICAgY2FzZSA0MDogLy8gRG93biBBcnJvd1xuICAgICAgICAvLyBpZ25vcmUgd2l0aCBtb2RpZmllcnMsIHNvIG5vdCB0byBpbnRlcmZlcmUgd2l0aCBDaHJvbWV2b3hcbiAgICAgICAgaWYoIXRoaXMuaGFzQ2hyb21ldm94TW9kaWZpZXJzKGV2ZW50KSkge1xuICAgICAgICAgIHRoaXMubmV4dEVsZW1lbnQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBDaHJvbWV2b3ggbW9kaWZpZXJzIGFyZSBwcmVzc2VkXG4gICAqXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgS2V5Ym9hcmQgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhc0Nocm9tZXZveE1vZGlmaWVycyhldmVudCkge1xuICAgIHJldHVybiBldmVudC5zaGlmdEtleSB8fCBldmVudC5jdHJsS2V5O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBwcmV2aW91cyBlbGVtZW50IGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8RXZlbnRUYXJnZXR9IGVsXG4gICAqIEBmaXJlcyBDb250cm9scyNwcmV2aW91c0VsZW1lbnRcbiAgICovXG4gIHByZXZpb3VzRWxlbWVudChlbCkge1xuICAgIGlmKHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnYmVmb3JlUHJldmlvdXNFbGVtZW50JywgZWwpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jb250cm9scy5maXJlc0V2ZW50KCdwcmV2aW91c0VsZW1lbnQnLCBlbCk7XG4gICAgICB0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2FmdGVyUHJldmlvdXNFbGVtZW50JywgZWwpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRmlyZSB0aGUgbmV4dCBlbGVtZW50IGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8RXZlbnRUYXJnZXR9IGVsXG4gICAqIEBmaXJlcyBDb250cm9scyNuZXh0RWxlbWVudFxuICAgKi9cbiAgbmV4dEVsZW1lbnQoZWwpIHtcbiAgICBpZih0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2JlZm9yZU5leHRFbGVtZW50JywgZWwpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5jb250cm9scy5maXJlc0V2ZW50KCduZXh0RWxlbWVudCcsIGVsKTtcbiAgICAgIHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnYWZ0ZXJOZXh0RWxlbWVudCcsIGVsKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEZpcmVzIHRoZSBzZWxlY3QgZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldHxIVE1MRWxlbWVudH0gZWxcbiAgICogQGZpcmVzIENvbnRyb2xzI3NlbGVjdFxuICAgKi9cbiAgc2VsZWN0KGVsKXtcbiAgICBpZih0aGlzLnNlbGVjdGFiaWxpdHkpIHtcbiAgICAgIGlmKHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnYmVmb3JlLXNlbGVjdCcsIGVsKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5maXJlc0V2ZW50KCdzZWxlY3QnLCBlbCk7XG4gICAgICAgIHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnYWZ0ZXItc2VsZWN0JywgZWwpXG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBGaXJlIHRoZSBuZXh0IGVsZW1lbnQgZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxFdmVudFRhcmdldH0gZWxcbiAgICogQGZpcmVzIENvbnRyb2xzI25leHRFbGVtZW50XG4gICAqL1xuICBmaXJzdEVsZW1lbnQoZWwpIHtcbiAgICBpZih0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2JlZm9yZUZpcnN0RWxlbWVudCcsIGVsKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnZmlyc3RFbGVtZW50JywgZWwpO1xuICAgICAgdGhpcy5jb250cm9scy5maXJlc0V2ZW50KCdhZnRlckZpcnN0RWxlbWVudCcsIGVsKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEZpcmUgdGhlIG5leHQgZWxlbWVudCBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fEV2ZW50VGFyZ2V0fSBlbFxuICAgKiBAZmlyZXMgQ29udHJvbHMjbmV4dEVsZW1lbnRcbiAgICovXG4gIGxhc3RFbGVtZW50KGVsKSB7XG4gICAgaWYodGhpcy5jb250cm9scy5maXJlc0V2ZW50KCdiZWZvcmVMYXN0RWxlbWVudCcsIGVsKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnbGFzdEVsZW1lbnQnLCBlbCk7XG4gICAgICB0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2FmdGVyTGFzdEVsZW1lbnQnLCBlbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHBvc3NpYmlsaXR5IHRvIHNlbGVjdCBhIHdvcmQgdHJvdWdoIGNsaWNrIGFuZCBzcGFjZSBvciBlbnRlclxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBkaXNhYmxlU2VsZWN0YWJpbGl0eSgpIHtcbiAgICB0aGlzLnNlbGVjdGFiaWxpdHkgPSBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogRW5hYmxlIHBvc3NpYmlsaXR5IHRvIHNlbGVjdCBhIHdvcmQgdHJvdWdoIGNsaWNrIGFuZCBzcGFjZSBvciBlbnRlclxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBlbmFibGVTZWxlY3RhYmlsaXR5KCkge1xuICAgIHRoaXMuc2VsZWN0YWJpbGl0eSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgdGhlIGNsb3NlIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8RXZlbnRUYXJnZXR9IGVsXG4gICAqIEBmaXJlcyBDb250cm9scyNjbG9zZVxuICAgKi9cbiAgY2xvc2UoZWwpIHtcbiAgICBpZih0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2JlZm9yZS1jbG9zZScsIGVsKSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuZmlyZXNFdmVudCgnY2xvc2UnLCBlbCk7XG4gICAgICB0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2FmdGVyLWNsb3NlJywgZWwpXG4gICAgfVxuICB9XG59IiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgS2V5Ym9hcmQgbmF2aWdhdGlvbiBmb3IgYWNjZXNzaWJpbGl0eSBzdXBwb3J0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBzZWxlY3RhYmlsaXR5XG4gICAgICovXG4gICAgdGhpcy5zZWxlY3RhYmlsaXR5ID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrQm91bmQgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVEcmFnQm91bmQgPSB0aGlzLmhhbmRsZURyYWcuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0cyB0aGlzIGNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udHJvbHN9IGNvbnRyb2xzXG4gICAqL1xuICBpbml0KGNvbnRyb2xzKcKge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtDb250cm9sc31cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gICAgdGhpcy5jb250cm9scy5vbignYWRkRWxlbWVudCcsIHRoaXMubGlzdGVuRm9yS2V5RG93biwgdGhpcyk7XG4gICAgdGhpcy5jb250cm9scy5vbigncmVtb3ZlRWxlbWVudCcsIHRoaXMudW5saXN0ZW5Gb3JLZXlEb3duLCB0aGlzKTtcbiAgICBcbiAgfTtcblxuICAvKipcbiAgICogTGlzdGVucyBmb3IgYSBrZXlib2FyZCBwcmVzcyB3aGVuIGVsZW1lbnQgaXMgZm9jdXNlZFxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBsaXN0ZW5Gb3JLZXlEb3duKHtlbGVtZW50fSkge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrQm91bmQpO1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIHRoaXMuaGFuZGxlQ2xpY2tCb3VuZCk7XG4gIH07XG5cbiAgLyoqIFxuICAgKiBSZW1vdmUgbGlzdGVuZXJzIFxuICAgKiBcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAqL1xuICB1bmxpc3RlbkZvcktleURvd24oe2VsZW1lbnR9KSB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2tCb3VuZCk7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnJywgdGhpcy5oYW5kbGVEcmFnQm91bmQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIG1vdXNlQ2xpY2tcbiAgICpcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBLZXlib2FyZCBldmVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ3NlbGVjdCcsIGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGtleSBkb3duXG4gICAqXG4gICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgS2V5Ym9hcmQgZXZlbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhbmRsZURyYWcoZXZlbnQpIHtcbiAgICB0aGlzLmNvbnRyb2xzLmZpcmVzRXZlbnQoJ2RyYWcnLCBldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgfTtcblxuICAvKipcbiAgICogRGlzYWJsZSBwb3NzaWJpbGl0eSB0byBzZWxlY3QgYSB3b3JkIHRyb3VnaCBjbGljayBhbmQgc3BhY2Ugb3IgZW50ZXJcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZGlzYWJsZVNlbGVjdGFiaWxpdHkoKSB7XG4gICAgdGhpcy5zZWxlY3RhYmlsaXR5ID0gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBwb3NzaWJpbGl0eSB0byBzZWxlY3QgYSB3b3JkIHRyb3VnaCBjbGljayBhbmQgc3BhY2Ugb3IgZW50ZXJcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZW5hYmxlU2VsZWN0YWJpbGl0eSgpIHtcbiAgICB0aGlzLnNlbGVjdGFiaWxpdHkgPSB0cnVlO1xuICB9XG59IiwiaW1wb3J0IHtjdXJyeSwgaW52ZXJzZUJvb2xlYW5TdHJpbmd9IGZyb20gJy4vZnVuY3Rpb25hbCdcblxuLyoqXG4gKiBHZXQgYW4gYXR0cmlidXRlIHZhbHVlIGZyb20gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgZ2V0QXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiBlbC5nZXRBdHRyaWJ1dGUobmFtZSkpO1xuXG4vKipcbiAqIFNldCBhbiBhdHRyaWJ1dGUgb24gYSBodG1sIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3Qgc2V0QXR0cmlidXRlID0gY3VycnkoKG5hbWUsIHZhbHVlLCBlbCkgPT4gZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSk7XG5cbi8qKlxuICogUmVtb3ZlIGF0dHJpYnV0ZSBmcm9tIGh0bWwgZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlQXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkpO1xuXG4vKipcbiAqIENoZWNrIGlmIGVsZW1lbnQgaGFzIGFuIGF0dHJpYnV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGhhc0F0dHJpYnV0ZSA9IGN1cnJ5KChuYW1lLCBlbCkgPT4gZWwuaGFzQXR0cmlidXRlKG5hbWUpKTtcblxuLyoqXG4gKiBDaGVjayBpZiBlbGVtZW50IGhhcyBhbiBhdHRyaWJ1dGUgdGhhdCBlcXVhbHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZUVxdWFscyA9IGN1cnJ5KChuYW1lLCB2YWx1ZSwgZWwpID0+IGVsLmdldEF0dHJpYnV0ZShuYW1lKSA9PT0gdmFsdWUpO1xuXG4vKipcbiAqIFRvZ2dsZXMgYW4gYXR0cmlidXRlIGJldHdlZW4gJ3RydWUnIGFuZCAnZmFsc2UnO1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxuICpcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlQXR0cmlidXRlID0gY3VycnkoKG5hbWUsIGVsKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gZ2V0QXR0cmlidXRlKG5hbWUsIGVsKTtcbiAgc2V0QXR0cmlidXRlKG5hbWUsIGludmVyc2VCb29sZWFuU3RyaW5nKHZhbHVlKSwgZWwpO1xufSk7XG5cbi8qKlxuICogVGhlIGFwcGVuZENoaWxkKCkgbWV0aG9kIGFkZHMgYSBub2RlIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgY2hpbGRyZW4gb2YgYSBzcGVjaWZpZWQgcGFyZW50IG5vZGUuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjaGlsZFxuICpcbiAqIEBmdW5jdGlvblxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBjb25zdCBhcHBlbmRDaGlsZCA9IGN1cnJ5KChwYXJlbnQsIGNoaWxkKSA9PiBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgYSBkZXNjZW5kYW50IG9mIHRoZSBlbGVtZW50IG9uIHdoaWNoIGl0IGlzIGludm9rZWRcbiAqIHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGdyb3VwIG9mIHNlbGVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VsZWN0b3IgPSBjdXJyeSgoc2VsZWN0b3IsIGVsKSA9PiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSk7XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIE5vZGVMaXN0IHRvIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZUxpc3RcbiAqXG4gKiBAcmV0dXJuIHtOb2RlW119XG4gKi9cbmV4cG9ydCBjb25zdCBub2RlTGlzdFRvQXJyYXkgPSBub2RlTGlzdCA9PiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG5cbi8qKlxuICogUmV0dXJucyBhIG5vbi1saXZlIE5vZGVMaXN0IG9mIGFsbCBlbGVtZW50cyBkZXNjZW5kZWQgZnJvbSB0aGUgZWxlbWVudCBvbiB3aGljaCBpdFxuICogaXMgaW52b2tlZCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBncm91cCBvZiBDU1Mgc2VsZWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEByZXR1cm4ge05vZGVbXX1cbiAqL1xuZXhwb3J0IGNvbnN0IHF1ZXJ5U2VsZWN0b3JBbGwgPSBjdXJyeSgoc2VsZWN0b3IsIGVsKSA9PiBub2RlTGlzdFRvQXJyYXkoZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpKTtcblxuLyoqXG4gKiBUaGUgcmVtb3ZlQ2hpbGQoKSBtZXRob2QgcmVtb3ZlcyBhIGNoaWxkIG5vZGUgZnJvbSB0aGUgRE9NLiBSZXR1cm5zIHJlbW92ZWQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudFxuICogQHBhcmFtIHtOb2RlfSBvbGRDaGlsZFxuICpcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVDaGlsZCA9IGN1cnJ5KChwYXJlbnQsIG9sZENoaWxkKSA9PiBwYXJlbnQucmVtb3ZlQ2hpbGQob2xkQ2hpbGQpKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBub2RlIGhhcyBhIGNsYXNzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcbiAqXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNsYXNzTGlzdENvbnRhaW5zID0gY3VycnkoKGNscywgZWwpID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhjbHMpKTtcblxuLyoqXG4gKiBBZGRzIGEgY3NzIGNsYXNzIHRvIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGFkZENsYXNzID0gY3VycnkoKGNscywgZWxlbWVudCkgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNscykpO1xuXG4vKipcbiAqIFJlbW92ZXMgYSBjc3MgY2xhc3MgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKlxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzcyA9IGN1cnJ5KChjbHMsIGVsZW1lbnQpID0+IGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbHMpKTtcblxuLyoqXG4gKiBBZGRzIGhpZGRlbiBjbGFzcyBvbiBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBoaWRlID0gYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG4vKipcbiAqIFJlbW92ZXMgaGlkZGVuIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBzaG93ID0gcmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXG4vKipcbiAqIFRvZ2dsZXMgaGlkZGVuIGNsYXNzIG9uIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVZpc2liaWxpdHkgPSBjdXJyeSgodmlzaWJsZSwgZWxlbWVudCkgPT4gKHZpc2libGUgPyBzaG93IDogaGlkZSkoZWxlbWVudCkpO1xuXG4vKipcbiAqIFRvZ2dsZXMgYSBjbGFzcyBvbiBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICogQHBhcmFtIHtib29sZWFufSBhZGRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZUNsYXNzID0gY3VycnkoKGNscywgYWRkLCBlbGVtZW50KSA9PiB7XG4gIGVsZW1lbnQuY2xhc3NMaXN0W2FkZCA/ICdhZGQnIDogJ3JlbW92ZSddKGNscylcbn0pO1xuXG4vKipcbiAqIEhlbHBlciBmb3IgY3JlYXRpbmcgYSBET00gZWxlbWVudFxuICpcbiAqIEBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbY2xhc3Nlc10gLSBhcnJheSBvZiBzdHJpbmdzXG4gKiBAcGFyYW0ge09iamVjdH0gW2F0dHJpYnV0ZXNdXG4gKlxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVFbGVtZW50ID0gKHt0YWcsIGlkLCBjbGFzc2VzLCBhdHRyaWJ1dGVzfSkgPT4ge1xuICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cbiAgaWYgKGNsYXNzZXMpIHtcbiAgICBjbGFzc2VzLmZvckVhY2goY2xhenogPT4ge2VsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGF6eil9KTtcbiAgfVxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goa2V5ID0+IHtlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZXNba2V5XSl9KVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuIiwiLyoqXG4gKiBSZXR1cm5zIGEgY3VycmllZCB2ZXJzaW9uIG9mIGEgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuICpcbiAqIEBwdWJsaWNcbiAqXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGN1cnJ5ID0gZnVuY3Rpb24oZm4pIHtcbiAgY29uc3QgYXJpdHkgPSBmbi5sZW5ndGg7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGYxKCkge1xuICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+PSBhcml0eSkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBmMigpIHtcbiAgICAgICAgY29uc3QgYXJnczIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICByZXR1cm4gZjEuYXBwbHkobnVsbCwgYXJncy5jb25jYXQoYXJnczIpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIENvbXBvc2UgZnVuY3Rpb25zIHRvZ2V0aGVyLCBleGVjdXRpbmcgZnJvbSByaWdodCB0byBsZWZ0XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbi4uLn0gZm5zXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcHVibGljXG4gKlxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKC4uLmZucykgPT4gZm5zLnJlZHVjZSgoZiwgZykgPT4gKC4uLmFyZ3MpID0+IGYoZyguLi5hcmdzKSkpO1xuXG4vKipcbiAqIEFwcGxpZXMgYSBmdW5jdGlvbiB0byBlYWNoIGVsZW1lbnQgaW4gYW4gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcHVibGljXG4gKlxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKi9cbmV4cG9ydCBjb25zdCBmb3JFYWNoID0gY3VycnkoZnVuY3Rpb24gKGZuLCBhcnIpIHtcbiAgYXJyLmZvckVhY2goZm4pO1xufSk7XG5cbi8qKlxuICogTWFwcyBhIGZ1bmN0aW9uIHRvIGFuIGFycmF5XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEBmdW5jdGlvblxuICogQHB1YmxpY1xuICpcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5leHBvcnQgY29uc3QgbWFwID0gY3VycnkoZnVuY3Rpb24gKGZuLCBhcnIpIHtcbiAgcmV0dXJuIGFyci5tYXAoZm4pO1xufSk7XG5cbi8qKlxuICogQXBwbGllcyBhIGZpbHRlciB0byBhbiBhcnJheVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBwdWJsaWNcbiAqXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGZpbHRlciA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZuKTtcbn0pO1xuXG4vKipcbiAqIEFwcGxpZXMgYSBzb21lIHRvIGFuIGFycmF5XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEBmdW5jdGlvblxuICogQHB1YmxpY1xuICpcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5leHBvcnQgY29uc3Qgc29tZSA9IGN1cnJ5KGZ1bmN0aW9uIChmbiwgYXJyKSB7XG4gIHJldHVybiBhcnIuc29tZShmbik7XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYW4gYXJyYXkgY29udGFpbnMgYSB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEBmdW5jdGlvblxuICogQHB1YmxpY1xuICpcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5leHBvcnQgY29uc3QgY29udGFpbnMgPSBjdXJyeShmdW5jdGlvbiAodmFsdWUsIGFycikge1xuICByZXR1cm4gYXJyLmluZGV4T2YodmFsdWUpICE9IC0xO1xufSk7XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSB3aXRob3V0IHRoZSBzdXBwbGllZCB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXNcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEBmdW5jdGlvblxuICogQHB1YmxpY1xuICpcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5leHBvcnQgY29uc3Qgd2l0aG91dCA9IGN1cnJ5KGZ1bmN0aW9uICh2YWx1ZXMsIGFycikge1xuICByZXR1cm4gZmlsdGVyKHZhbHVlID0+ICFjb250YWlucyh2YWx1ZSwgdmFsdWVzKSwgYXJyKVxufSk7XG5cbi8qKlxuICogVGFrZXMgYSBzdHJpbmcgdGhhdCBpcyBlaXRoZXIgJ3RydWUnIG9yICdmYWxzZScgYW5kIHJldHVybnMgdGhlIG9wcG9zaXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJvb2xcbiAqXG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBpbnZlcnNlQm9vbGVhblN0cmluZyA9IGZ1bmN0aW9uIChib29sKSB7XG4gIHJldHVybiAoYm9vbCAhPT0gJ3RydWUnKS50b1N0cmluZygpO1xufTsiLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYWdVdGlscyB7XG5cbiAgLyoqXG4gICAqIE1ha2VzIGVsZW1lbnQgYmFja2dyb3VuZCB0cmFuc3BhcmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtqUXVlcnl9ICRlbGVtZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcGFjaXR5XG4gICAqL1xuICBzdGF0aWMgc2V0RWxlbWVudE9wYWNpdHkoJGVsZW1lbnQsIG9wYWNpdHkpIHtcbiAgICBEcmFnVXRpbHMuc2V0T3BhY2l0eSgkZWxlbWVudCwgJ2JvcmRlckNvbG9yJywgb3BhY2l0eSk7XG4gICAgRHJhZ1V0aWxzLnNldE9wYWNpdHkoJGVsZW1lbnQsICdib3hTaGFkb3cnLCBvcGFjaXR5KTtcbiAgICBEcmFnVXRpbHMuc2V0T3BhY2l0eSgkZWxlbWVudCwgJ2JhY2tncm91bmQnLCBvcGFjaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBlbGVtZW50IGJhY2tncm91bmQsIGJvcmRlciBhbmQgc2hhZG93IHRyYW5zcGFyZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1lbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcGFjaXR5XG4gICAqL1xuICBzdGF0aWMgc2V0T3BhY2l0eSgkZWxlbWVudCwgcHJvcGVydHksIG9wYWNpdHkpIHtcbiAgICBpZiAocHJvcGVydHkgPT09ICdiYWNrZ3JvdW5kJykge1xuICAgICAgLy8gU2V0IGJvdGggY29sb3IgYW5kIGdyYWRpZW50LlxuICAgICAgRHJhZ1V0aWxzLnNldE9wYWNpdHkoJGVsZW1lbnQsICdiYWNrZ3JvdW5kQ29sb3InLCBvcGFjaXR5KTtcbiAgICAgIERyYWdVdGlscy5zZXRPcGFjaXR5KCRlbGVtZW50LCAnYmFja2dyb3VuZEltYWdlJywgb3BhY2l0eSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3BhY2l0eSA9IChvcGFjaXR5ID09PSB1bmRlZmluZWQgPyAxIDogb3BhY2l0eSAvIDEwMCk7XG5cbiAgICAvLyBQcml2YXRlLiBHZXQgY3NzIHByb3BlcnRpZXMgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgc3dpdGNoIChwcm9wZXJ0eSkge1xuICAgICAgICBjYXNlICdib3JkZXJDb2xvcic6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvcmRlclRvcENvbG9yOiB2YWx1ZSxcbiAgICAgICAgICAgIGJvcmRlclJpZ2h0Q29sb3I6IHZhbHVlLFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tQ29sb3I6IHZhbHVlLFxuICAgICAgICAgICAgYm9yZGVyTGVmdENvbG9yOiB2YWx1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHt9O1xuICAgICAgICAgIHByb3BlcnRpZXNbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbmFsID0gJGVsZW1lbnQuY3NzKHByb3BlcnR5KTtcblxuICAgIC8vIFJlc2V0IGNzcyB0byBiZSBzdXJlIHdlJ3JlIHVzaW5nIENTUyBhbmQgbm90IGlubGluZSB2YWx1ZXMuXG4gICAgdmFyIHByb3BlcnRpZXMgPSBnZXRQcm9wZXJ0aWVzKHByb3BlcnR5LCAnJyk7XG4gICAgJGVsZW1lbnQuY3NzKHByb3BlcnRpZXMpO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHByb3AgYW5kIGFzc3VtZSBhbGwgcHJvcHMgYXJlIHRoZSBzYW1lIGFuZCB1c2UgdGhlIGZpcnN0LlxuICAgIGZvciAodmFyIHByb3AgaW4gcHJvcGVydGllcykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gR2V0IHZhbHVlIGZyb20gY3NzXG4gICAgdmFyIHN0eWxlID0gJGVsZW1lbnQuY3NzKHByb3ApO1xuICAgIGlmIChzdHlsZSA9PT0gJycgfHwgc3R5bGUgPT09ICdub25lJykge1xuICAgICAgLy8gTm8gdmFsdWUgZnJvbSBDU1MsIGZhbGwgYmFjayB0byBvcmlnaW5hbFxuICAgICAgc3R5bGUgPSBvcmlnaW5hbDtcbiAgICB9XG5cbiAgICBzdHlsZSA9IERyYWdVdGlscy5zZXRBbHBoYXMoc3R5bGUsICdyZ2JhKCcsIG9wYWNpdHkpOyAvLyBVcGRhdGUgcmdiYVxuICAgIHN0eWxlID0gRHJhZ1V0aWxzLnNldEFscGhhcyhzdHlsZSwgJ3JnYignLCBvcGFjaXR5KTsgLy8gQ29udmVydCByZ2JcblxuICAgICRlbGVtZW50LmNzcyhnZXRQcm9wZXJ0aWVzKHByb3BlcnR5LCBzdHlsZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxwaGEgY2hhbm5lbCBmb3IgY29sb3JzIGluIHRoZSBnaXZlbiBzdHlsZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0eWxlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFscGhhXG4gICAqL1xuICBzdGF0aWMgc2V0QWxwaGFzKHN0eWxlLCBwcmVmaXgsIGFscGhhKSB7XG4gICAgLy8gU3R5bGUgdW5kZWZpbmVkXG4gICAgaWYgKCFzdHlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY29sb3JTdGFydCA9IHN0eWxlLmluZGV4T2YocHJlZml4KTtcblxuICAgIHdoaWxlIChjb2xvclN0YXJ0ICE9PSAtMSkge1xuICAgICAgdmFyIGNvbG9yRW5kID0gc3R5bGUuaW5kZXhPZignKScsIGNvbG9yU3RhcnQpO1xuICAgICAgdmFyIGNoYW5uZWxzID0gc3R5bGUuc3Vic3RyaW5nKGNvbG9yU3RhcnQgKyBwcmVmaXgubGVuZ3RoLCBjb2xvckVuZCkuc3BsaXQoJywnKTtcblxuICAgICAgLy8gU2V0IGFscGhhIGNoYW5uZWxcbiAgICAgIGNoYW5uZWxzWzNdID0gKGNoYW5uZWxzWzNdICE9PSB1bmRlZmluZWQgPyBwYXJzZUZsb2F0KGNoYW5uZWxzWzNdKSAqIGFscGhhIDogYWxwaGEpO1xuXG4gICAgICBzdHlsZSA9IHN0eWxlLnN1YnN0cmluZygwLCBjb2xvclN0YXJ0KSArICdyZ2JhKCcgKyBjaGFubmVscy5qb2luKCcsJykgKyBzdHlsZS5zdWJzdHJpbmcoY29sb3JFbmQsIHN0eWxlLmxlbmd0aCk7XG5cbiAgICAgIC8vIExvb2sgZm9yIG1vcmUgY29sb3JzXG4gICAgICBjb2xvclN0YXJ0ID0gc3R5bGUuaW5kZXhPZihwcmVmaXgsIGNvbG9yRW5kKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGU7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBkcmFnZ2FibGUgaW5zdGFuY2UgZnJvbSBlbGVtZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RHJhZ2dhYmxlW119IGRyYWdnYWJsZXNcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAqL1xuICBzdGF0aWMgZWxlbWVudFRvRHJhZ2dhYmxlKGRyYWdnYWJsZXMsIGVsZW1lbnQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRyYWdnYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghZHJhZ2dhYmxlc1tpXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHQgPSBkcmFnZ2FibGVzW2ldLmZpbmRFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQuZHJhZ2dhYmxlID0gZHJhZ2dhYmxlc1tpXTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZCBkcmFnZ2FibGUgaW5zdGFuY2UgZnJvbSBlbGVtZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RHJvcFpvbmVbXX0gZHJvcFpvbmVzXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgKi9cbiAgc3RhdGljIGVsZW1lbnRUb0Ryb3Bab25lKGRyb3Bab25lcywgZWxlbWVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZHJvcFpvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoZHJvcFpvbmVzW2ldLiRkcm9wWm9uZS5pcyhlbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gZHJvcFpvbmVzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3NzIHBvc2l0aW9uIGluIHBlcmNlbnRhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkY29udGFpbmVyXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbWVudFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDU1MgcG9zaXRpb25cbiAgICovXG4gIHN0YXRpYyBwb3NpdGlvblRvUGVyY2VudGFnZSgkY29udGFpbmVyLCAkZWxlbWVudCkge1xuICAgIHJldHVybiB7XG4gICAgICB0b3A6IChwYXJzZUludCgkZWxlbWVudC5jc3MoJ3RvcCcpKSAqIDEwMCAvICRjb250YWluZXIuaW5uZXJIZWlnaHQoKSkgKyAnJScsXG4gICAgICBsZWZ0OiAocGFyc2VJbnQoJGVsZW1lbnQuY3NzKCdsZWZ0JykpICogMTAwIC8gJGNvbnRhaW5lci5pbm5lcldpZHRoKCkpICsgJyUnXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBzdXJlIGVsZW1lbnQgZ2V0cyBjb3JyZWN0IG9wYWNpdHkgd2hlbiBob3ZlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcbiAgICovXG4gIHN0YXRpYyBhZGRIb3ZlcigkZWxlbWVudCwgYmFja2dyb3VuZE9wYWNpdHkpIHtcbiAgICAkZWxlbWVudC5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxlbWVudC5hZGRDbGFzcygnaDVwLWRyYWdnYWJsZS1ob3ZlcicpO1xuICAgICAgaWYgKCEkZWxlbWVudC5wYXJlbnQoKS5oYXNDbGFzcygnaDVwLWRyYWdnaW5nJykpIHtcbiAgICAgICAgRHJhZ1V0aWxzLnNldEVsZW1lbnRPcGFjaXR5KCRlbGVtZW50LCBiYWNrZ3JvdW5kT3BhY2l0eSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEkZWxlbWVudC5wYXJlbnQoKS5oYXNDbGFzcygnaDVwLWRyYWdnaW5nJykpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2g1cC1kcmFnZ2FibGUtaG92ZXInKTtcbiAgICAgICAgICBEcmFnVXRpbHMuc2V0RWxlbWVudE9wYWNpdHkoJGVsZW1lbnQsIGJhY2tncm91bmRPcGFjaXR5KTtcbiAgICAgICAgfSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgRHJhZ1V0aWxzLnNldEVsZW1lbnRPcGFjaXR5KCRlbGVtZW50LCBiYWNrZ3JvdW5kT3BhY2l0eSk7XG4gIH1cblxuICAvKipcbiAgICogU3RyaXBwaW5nIGF3YXkgaHRtbCB0YWdzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzdHJpcChodG1sKSB7XG4gICAgdmFyIHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0bXAudGV4dENvbnRlbnQgfHwgdG1wLmlubmVyVGV4dCB8fCAnJztcbiAgfVxufVxuIiwiaW1wb3J0IERyYWdVdGlscyBmcm9tICcuL2RyYWctdXRpbHMnO1xuXG5jb25zdCAkID0gSDVQLmpRdWVyeTtcblxuLy8gSGVscGVyIHRvIHN0b3AgcHJvcGFnYXRpbmcgZXZlbnRzXG5jb25zdCBzdG9wUHJvcGFnYXRpb24gPSBldmVudCA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhZ2dhYmxlIGV4dGVuZHMgSDVQLkV2ZW50RGlzcGF0Y2hlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGRyYWdnYWJsZSBpbnN0YW5jZS5cbiAgICogTWFrZXMgaXQgZWFzaWVyIHRvIGtlZXAgdHJhY2sgb2YgYWxsIGluc3RhbmNlIHZhcmlhYmxlcyBhbmQgZWxlbWVudHMuXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge251bWJlcn0gaWRcbiAgICogQHBhcmFtIHtBcnJheX0gW2Fuc3dlcnNdIGZyb20gbGFzdCBzZXNzaW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIHN0cmluZz59IGwxMG5cbiAgICogQHBhcmFtIHtBcnJheX0gW2Ryb3Bab25lc10gRHJvcHpvbmVzIGZvciBhIGRyYWdnYWJsZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgaWQsIGFuc3dlcnMsIGwxMG4sIGRyb3Bab25lcywgZHJhZ2dhYmxlTnVtKSB7XG4gICAgc3VwZXIoKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLiQgPSAkKHNlbGYpO1xuICAgIHNlbGYuaWQgPSBpZDtcbiAgICBzZWxmLmVsZW1lbnRzID0gW107XG4gICAgc2VsZi54ID0gZWxlbWVudC54O1xuICAgIHNlbGYueSA9IGVsZW1lbnQueTtcbiAgICBzZWxmLndpZHRoID0gZWxlbWVudC53aWR0aDtcbiAgICBzZWxmLmhlaWdodCA9IGVsZW1lbnQuaGVpZ2h0O1xuICAgIHNlbGYuYmFja2dyb3VuZE9wYWNpdHkgPSBlbGVtZW50LmJhY2tncm91bmRPcGFjaXR5O1xuICAgIHNlbGYuZHJvcFpvbmVzID0gZWxlbWVudC5kcm9wWm9uZXM7XG4gICAgc2VsZi50eXBlID0gZWxlbWVudC50eXBlO1xuICAgIHNlbGYubXVsdGlwbGUgPSBlbGVtZW50Lm11bHRpcGxlO1xuICAgIHNlbGYubDEwbiA9IGwxMG47XG4gICAgc2VsZi5hbGxEcm9wem9uZXMgPSBkcm9wWm9uZXM7XG4gICAgc2VsZi5kcmFnZ2FibGVOdW0gPSBkcmFnZ2FibGVOdW07XG5cbiAgICBpZiAoYW5zd2Vycykge1xuICAgICAgaWYgKHNlbGYubXVsdGlwbGUpIHtcbiAgICAgICAgLy8gQWRkIGJhc2UgZWxlbWVudFxuICAgICAgICBzZWxmLmVsZW1lbnRzLnB1c2goe30pO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYW5zd2Vyc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNlbGYuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgZHJvcFpvbmU6IGFuc3dlcnNbaV0uZHosXG4gICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIGxlZnQ6IGFuc3dlcnNbaV0ueCArICclJyxcbiAgICAgICAgICAgIHRvcDogYW5zd2Vyc1tpXS55ICsgJyUnXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGRyYWdnYWJsZSBlbGVtZW50cyBpbnRvIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkY29udGFpbmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb250ZW50SWRcbiAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG4gIGFwcGVuZFRvKCRjb250YWluZXIsIGNvbnRlbnRJZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICghc2VsZi5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHNlbGYuYXR0YWNoRWxlbWVudChudWxsLCAkY29udGFpbmVyLCBjb250ZW50SWQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzZWxmLmF0dGFjaEVsZW1lbnQoaSwgJGNvbnRhaW5lciwgY29udGVudElkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIHRoZSBnaXZlbiBlbGVtZW50IHRvIHRoZSBnaXZlbiBjb250YWluZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge051bWJlcn0gY29udGVudElkXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuICBhdHRhY2hFbGVtZW50KGluZGV4LCAkY29udGFpbmVyLCBjb250ZW50SWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZWxlbWVudDtcbiAgICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICAgIC8vIENyZWF0ZSBuZXcgZWxlbWVudFxuICAgICAgZWxlbWVudCA9IHt9O1xuICAgICAgc2VsZi5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgaW5kZXggPSBzZWxmLmVsZW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gR2V0IG9sZCBlbGVtZW50XG4gICAgICBlbGVtZW50ID0gc2VsZi5lbGVtZW50c1tpbmRleF07XG4gICAgfVxuXG4gICAgJC5leHRlbmQoZWxlbWVudCwge1xuICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5hdHRhY2hFbGVtZW50KG51bGwsICRjb250YWluZXIsIGNvbnRlbnRJZCk7XG4gICAgICB9LFxuICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZHJvcFpvbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIExldCBldmVyeW9uZSBrbm93IHdlJ3JlIGxlYXZpbmcgdGhlIGRyb3Agem9uZVxuICAgICAgICAgIHNlbGYudHJpZ2dlcignbGVhdmluZ0Ryb3Bab25lJywgZWxlbWVudCk7XG4gICAgICAgICAgZGVsZXRlIGVsZW1lbnQuZHJvcFpvbmU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5tdWx0aXBsZSkge1xuICAgICAgICAgIC8vIFJlbW92ZSBlbGVtZW50XG4gICAgICAgICAgZWxlbWVudC4kLnJlbW92ZSgpO1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLmVsZW1lbnRzW2luZGV4XTtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2VsZW1lbnRyZW1vdmUnLCBlbGVtZW50LiRbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBlbGVtZW50LnBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQXR0YWNoIGVsZW1lbnRcbiAgICBlbGVtZW50LiQgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICBjbGFzczogJ2g1cC1kcmFnZ2FibGUnLFxuICAgICAgdGFiaW5kZXg6ICctMScsXG4gICAgICByb2xlOiAnYnV0dG9uJyxcbiAgICAgIGNzczoge1xuICAgICAgICBsZWZ0OiBzZWxmLnggKyAnJScsXG4gICAgICAgIHRvcDogc2VsZi55ICsgJyUnLFxuICAgICAgICB3aWR0aDogc2VsZi53aWR0aCArICdlbScsXG4gICAgICAgIGhlaWdodDogc2VsZi5oZWlnaHQgKyAnZW0nXG4gICAgICB9LFxuICAgICAgYXBwZW5kVG86ICRjb250YWluZXIsXG4gICAgICB0aXRsZTogc2VsZi50eXBlLnBhcmFtcy50aXRsZVxuICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgdGhpcyk7XG4gICAgICB9KVxuICAgICAgLm9uKCd0b3VjaG1vdmUnLCBzdG9wUHJvcGFnYXRpb24pXG4gICAgICAub24oJ3RvdWNoc3RhcnQnLCBzdG9wUHJvcGFnYXRpb24pXG4gICAgICAub24oJ3RvdWNoZW5kJywgc3RvcFByb3BhZ2F0aW9uKVxuICAgICAgLmRyYWdnYWJsZSh7XG4gICAgICAgIHJldmVydDogZnVuY3Rpb24gKGRyb3Bab25lKSB7XG4gICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnaDVwLWRyYWdnaW5nJyk7XG4gICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICR0aGlzLmRhdGEoXCJ1aURyYWdnYWJsZVwiKS5vcmlnaW5hbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgdG9wOiBzZWxmLnkgKyAnJScsXG4gICAgICAgICAgICBsZWZ0OiBzZWxmLnggKyAnJSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIHNlbGYudXBkYXRlUGxhY2VtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICR0aGlzWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1ncmFiYmVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2RyYWdlbmQnKTtcblxuICAgICAgICAgIHJldHVybiAhZHJvcFpvbmU7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgdmFyIG11c3RDb3B5RWxlbWVudCA9IHNlbGYubXVzdENvcHlFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgIGlmIChtdXN0Q29weUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIExlYXZlIGEgbmV3IGVsZW1lbnQgZm9yIG5leHQgZHJhZ1xuICAgICAgICAgICAgZWxlbWVudC5jbG9uZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNlbmQgZWxlbWVudCB0byB0aGUgdG9wIVxuICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdoNXAtd3JvbmcnKS5kZXRhY2goKS5hcHBlbmRUbygkY29udGFpbmVyKTtcbiAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdoNXAtZHJhZ2dpbmcnKTtcbiAgICAgICAgICBEcmFnVXRpbHMuc2V0RWxlbWVudE9wYWNpdHkoJHRoaXMsIHNlbGYuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWdyYWJiZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIHRoaXMpO1xuICAgICAgICAgIHNlbGYudHJpZ2dlcignZHJhZ3N0YXJ0Jywge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcyxcbiAgICAgICAgICAgIGVmZmVjdDogbXVzdENvcHlFbGVtZW50ID8gJ2NvcHknIDogJ21vdmUnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAvLyBDb252ZXJ0IHBvc2l0aW9uIHRvICUgdG8gc3VwcG9ydCBzY2FsaW5nLlxuICAgICAgICAgIGVsZW1lbnQucG9zaXRpb24gPSBEcmFnVXRpbHMucG9zaXRpb25Ub1BlcmNlbnRhZ2UoJGNvbnRhaW5lciwgJHRoaXMpO1xuICAgICAgICAgICR0aGlzLmNzcyhlbGVtZW50LnBvc2l0aW9uKTtcblxuICAgICAgICAgIHZhciBhZGRUb1pvbmUgPSAkdGhpcy5kYXRhKCdhZGRUb1pvbmUnKTtcbiAgICAgICAgICBpZiAoYWRkVG9ab25lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICR0aGlzLnJlbW92ZURhdGEoJ2FkZFRvWm9uZScpO1xuICAgICAgICAgICAgc2VsZi5hZGRUb0Ryb3Bab25lKGluZGV4LCBlbGVtZW50LCBhZGRUb1pvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVzZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgc2VsZi5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50LnBvc2l0aW9uKSB7XG4gICAgICAvLyBSZXN0b3JlIGxhc3QgcG9zaXRpb25cbiAgICAgIGVsZW1lbnQuJC5jc3MoZWxlbWVudC5wb3NpdGlvbik7XG4gICAgICBzZWxmLnVwZGF0ZVBsYWNlbWVudChlbGVtZW50KTtcbiAgICB9XG5cbiAgICBEcmFnVXRpbHMuYWRkSG92ZXIoZWxlbWVudC4kLCBzZWxmLmJhY2tncm91bmRPcGFjaXR5KTtcbiAgICBINVAubmV3UnVubmFibGUoc2VsZi50eXBlLCBjb250ZW50SWQsIGVsZW1lbnQuJCk7XG5cbiAgICAvLyBBZGQgcHJlZml4IGZvciBnb29kIGExMXlcbiAgICAkKCc8c3BhbiBjbGFzcz1cImg1cC1oaWRkZW4tcmVhZFwiPicgKyAoc2VsZi5sMTBuLnByZWZpeC5yZXBsYWNlKCd7bnVtfScsIHNlbGYuZHJhZ2dhYmxlTnVtKSkgKyAnPC9zcGFuPicpLnByZXBlbmRUbyhlbGVtZW50LiQpO1xuXG4gICAgLy8gQWRkIHN1ZmZpeCBmb3IgZ29vZCBhMTF5XG4gICAgJCgnPHNwYW4gY2xhc3M9XCJoNXAtaGlkZGVuLXJlYWRcIj48L3NwYW4+JykuYXBwZW5kVG8oZWxlbWVudC4kKTtcblxuICAgIC8vIFVwZGF0ZSBvcGFjaXR5IHdoZW4gZWxlbWVudCBpcyBhdHRhY2hlZC5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIERyYWdVdGlscy5zZXRFbGVtZW50T3BhY2l0eShlbGVtZW50LiQsIHNlbGYuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgIH0sIDApO1xuXG4gICAgc2VsZi50cmlnZ2VyKCdlbGVtZW50YWRkJywgZWxlbWVudC4kWzBdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgZmVlZGJhY2sgZm9yIGEgZHJhZ2dhYmxlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmVlZGJhY2tcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRyb3Bab25lSWRcbiAgICovXG4gIHNldEZlZWRiYWNrKGZlZWRiYWNrLCBkcm9wWm9uZUlkKSB7XG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQuZHJvcFpvbmUgPT09IGRyb3Bab25lSWQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuJGZlZWRiYWNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbGVtZW50LiRmZWVkYmFjayA9ICQoJzxzcGFuPicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdoNXAtaGlkZGVuLXJlYWQnLFxuICAgICAgICAgICAgYXBwZW5kVG86IGVsZW1lbnQuJFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuJGZlZWRiYWNrLmh0bWwoZmVlZGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSBpZiBlbGVtZW50IHNob3VsZCBiZSBjb3BpZWQgd2hlbiB0cmFnZ2luZywgaS5lLiBpbmZpbml0eSBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgbXVzdENvcHlFbGVtZW50KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKHRoaXMubXVsdGlwbGUgJiYgZWxlbWVudC5kcm9wWm9uZSA9PT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQgdG8gdGhlIGdpdmVuIGRyb3Agem9uZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaGFzRHJvcFpvbmUoaWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuZHJvcFpvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocGFyc2VJbnQoc2VsZi5kcm9wWm9uZXNbaV0pID09PSBpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUGxhY2VzIHRoZSBkcmFnZ2FibGUgZWxlbWVudCBpbiB0aGUgZ2l2ZW4gZHJvcCB6b25lLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW50ZXJuYWwgZWxlbWVudCBpbmRleFxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge251bWJlcn0gYWRkVG9ab25lIERyb3B6b25lIGluZGV4XG4gICAqL1xuICBhZGRUb0Ryb3Bab25lKGluZGV4LCBlbGVtZW50LCBhZGRUb1pvbmUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5tdWx0aXBsZSkge1xuICAgICAgLy8gQ2hlY2sgdGhhdCB3ZSdyZSB0aGUgb25seSBlbGVtZW50IGhlcmVcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgc2VsZi5lbGVtZW50c1tpXSAhPT0gdW5kZWZpbmVkICYmIHNlbGYuZWxlbWVudHNbaV0uZHJvcFpvbmUgPT09IGFkZFRvWm9uZSkge1xuICAgICAgICAgIC8vIENvcHkgb2YgZWxlbWVudCBhbHJlYWR5IGluIGRyb3Agem9uZVxuXG4gICAgICAgICAgLy8gUmVtb3ZlIGN1cnJlbnQgZWxlbWVudFxuICAgICAgICAgIGlmIChzZWxmLmVsZW1lbnRzW2luZGV4XS5kcm9wWm9uZSAhPT0gdW5kZWZpbmVkICYmIHNlbGYuZWxlbWVudHNbaW5kZXhdLmRyb3Bab25lICE9PSBhZGRUb1pvbmUpIHtcbiAgICAgICAgICAgIC8vIExlYXZpbmcgb2xkIGRyb3Agem9uZSFcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcignbGVhdmluZ0Ryb3Bab25lJywgZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQuJC5yZW1vdmUoKTtcbiAgICAgICAgICBkZWxldGUgc2VsZi5lbGVtZW50c1tpbmRleF07XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdlbGVtZW50cmVtb3ZlJywgdGhpcy5lbGVtZW50LiRbMF0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbGVtZW50LmRyb3Bab25lICE9PSB1bmRlZmluZWQgJiYgZWxlbWVudC5kcm9wWm9uZSAhPT0gYWRkVG9ab25lKSB7XG4gICAgICAvLyBMZWF2aW5nIG9sZCBkcm9wIHpvbmUhXG4gICAgICBzZWxmLnRyaWdnZXIoJ2xlYXZpbmdEcm9wWm9uZScsIGVsZW1lbnQpO1xuICAgIH1cbiAgICBlbGVtZW50LmRyb3Bab25lID0gYWRkVG9ab25lO1xuICAgIHNlbGYudXBkYXRlUGxhY2VtZW50KGVsZW1lbnQpO1xuXG4gICAgc2VsZi50cmlnZ2VyKCdpbnRlcmFjdGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSB2aXN1YWxzIHRvIG1hdGNoIHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgKi9cbiAgdXBkYXRlUGxhY2VtZW50KGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC4kc3VmZml4KSB7XG4gICAgICAvLyBBbHdheXMgcmVtb3ZlIG9sZCBhMTF5IHRleHQuIChkcm9wIHpvbmUgbWF5IGhhdmUgY2hhbmdlZClcbiAgICAgIGVsZW1lbnQuJHN1ZmZpeC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudC5kcm9wWm9uZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbGVtZW50LiQuYWRkQ2xhc3MoJ2g1cC1kcm9wcGVkJyk7XG4gICAgICBEcmFnVXRpbHMuc2V0RWxlbWVudE9wYWNpdHkoZWxlbWVudC4kLCBzZWxmLmJhY2tncm91bmRPcGFjaXR5KTtcblxuICAgICAgLy8gQWRkIHN1ZmZpeCBmb3IgZ29vZCBhMTF5XG5cbiAgICAgIC8vIFVzZSBkcm9wem9uZSBsYWJlbCBvciBkcm9wem9uZSBudW1iZXJcbiAgICAgIGxldCBkcm9wWm9uZUxhYmVsID0gdGhpcy5hbGxEcm9wem9uZXNbZWxlbWVudC5kcm9wWm9uZV0ubGFiZWw7XG4gICAgICBpZiAoZHJvcFpvbmVMYWJlbCkge1xuICAgICAgICBjb25zdCBsYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGFiZWxFbGVtZW50LmlubmVySFRNTCA9IGRyb3Bab25lTGFiZWw7XG4gICAgICAgIGRyb3Bab25lTGFiZWwgPSBsYWJlbEVsZW1lbnQuaW5uZXJUZXh0O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRyb3Bab25lTGFiZWwgPSBlbGVtZW50LmRyb3Bab25lICsgMTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuJHN1ZmZpeCA9ICQoJzxzcGFuIGNsYXNzPVwiaDVwLWhpZGRlbi1yZWFkXCI+JyArICh0aGlzLmwxMG4uc3VmZml4LnJlcGxhY2UoJ3tudW19JywgZHJvcFpvbmVMYWJlbCkpICsgJzwvc3Bhbj4nKS5hcHBlbmRUbyhlbGVtZW50LiQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnQuJFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2g1cC1kcm9wcGVkJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdoNXAtd3JvbmcnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2g1cC1jb3JyZWN0JylcbiAgICAgICAgLmNzcyh7XG4gICAgICAgICAgYm9yZGVyOiAnJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIERyYWdVdGlscy5zZXRFbGVtZW50T3BhY2l0eShlbGVtZW50LiQsIHRoaXMuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2FibGUgdG8gaXRzJyBvcmlnaW5hbCBwb3NpdGlvbi5cbiAgICovXG4gIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkcmFnZ2FibGUpIHtcblxuICAgICAgaWYgKGRyYWdnYWJsZS4kZmVlZGJhY2spIHtcbiAgICAgICAgZHJhZ2dhYmxlLiRmZWVkYmFjay5yZW1vdmUoKTtcbiAgICAgICAgZGVsZXRlIGRyYWdnYWJsZS4kZmVlZGJhY2s7XG4gICAgICB9XG5cbiAgICAgIC8vSWYgdGhlIGRyYWdnYWJsZSBpcyBpbiBhIGRyb3B6b25lIHJlc2V0IGl0cycgcG9zaXRpb24gYW5kIGZlZWRiYWNrLlxuICAgICAgaWYgKGRyYWdnYWJsZS5kcm9wWm9uZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZHJhZ2dhYmxlLiQ7XG5cbiAgICAgICAgLy9SZXZlcnQgdGhlIGJ1dHRvbiB0byBpbml0aWFsIHBvc2l0aW9uIGFuZCB0aGVuIHJlbW92ZSBpdC5cbiAgICAgICAgZWxlbWVudC5hbmltYXRlKHtcbiAgICAgICAgICBsZWZ0OiBzZWxmLnggKyAnJScsXG4gICAgICAgICAgdG9wOiBzZWxmLnkgKyAnJSdcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vUmVtb3ZlIHRoZSBkcmFnZ2FibGUgaWYgaXQgaXMgYW4gaW5maW5pdHkgZHJhZ2dhYmxlLlxuICAgICAgICAgIGlmIChzZWxmLm11bHRpcGxlKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5kcm9wWm9uZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignbGVhdmluZ0Ryb3Bab25lJywgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgLy9EZWxldGUgdGhlIGVsZW1lbnQgZnJvbSBlbGVtZW50cyBsaXN0IHRvIGF2b2lkIGEgY2x1c3RlciBvZiBkcmFnZ2FibGVzIG9uIHRvcCBvZiBpbmZpbml0eSBkcmFnZ2FibGUuXG4gICAgICAgICAgICBpZiAoc2VsZi5lbGVtZW50cy5pbmRleE9mKGRyYWdnYWJsZSkgPj0gMCkge1xuICAgICAgICAgICAgICBkZWxldGUgc2VsZi5lbGVtZW50c1tzZWxmLmVsZW1lbnRzLmluZGV4T2YoZHJhZ2dhYmxlKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2VsZW1lbnRyZW1vdmUnLCBlbGVtZW50WzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlc2V0IGVsZW1lbnQgc3R5bGVcbiAgICAgICAgc2VsZi51cGRhdGVQbGFjZW1lbnQoZHJhZ2dhYmxlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzZWxmLmVsZW1lbnQpIHtcbiAgICAgIC8vIERyYWdnYWJsZSByZW1vdmVkIGZyb20gZHJvcHpvbmUuXG4gICAgICBpZiAoc2VsZi5lbGVtZW50LmRyb3Bab25lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdsZWF2aW5nRHJvcFpvbmUnLCBzZWxmLmVsZW1lbnQpO1xuICAgICAgICBkZWxldGUgc2VsZi5lbGVtZW50LmRyb3Bab25lO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXNldCBzdHlsZSBvbiBpbml0aWFsIGVsZW1lbnRcbiAgICAgIC8vIFJlc2V0IGVsZW1lbnQgc3R5bGVcbiAgICAgIHNlbGYudXBkYXRlUGxhY2VtZW50KHNlbGYuZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2sgZm9yIHRoZSBnaXZlbiBET00gZWxlbWVudCBpbnNpZGUgdGhpcyBkcmFnZ2FibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgZmluZEVsZW1lbnQoZWxlbWVudCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNlbGYuZWxlbWVudHNbaV0gIT09IHVuZGVmaW5lZCAmJiBzZWxmLmVsZW1lbnRzW2ldLiQuaXMoZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlbGVtZW50OiBzZWxmLmVsZW1lbnRzW2ldLFxuICAgICAgICAgIGluZGV4OiBpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVtaW5lIGlmIGFueSBvZiBvdXIgZWxlbWVudHMgaXMgaW4gdGhlIGdpdmVuIGRyb3Agem9uZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaXNJbkRyb3Bab25lKGlkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2VsZi5lbGVtZW50c1tpXSAhPT0gdW5kZWZpbmVkICYmIHNlbGYuZWxlbWVudHNbaV0uZHJvcFpvbmUgPT09IGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgZHJhZ2dhYmxlLlxuICAgKiBAcHVibGljXG4gICAqL1xuICBkaXNhYmxlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzZWxmLmVsZW1lbnRzW2ldO1xuXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LiQuZHJhZ2dhYmxlKCdkaXNhYmxlJyk7XG4gICAgICAgIHNlbGYudHJpZ2dlcignZWxlbWVudHJlbW92ZScsIGVsZW1lbnQuJFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGRyYWdnYWJsZS5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZW5hYmxlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzZWxmLmVsZW1lbnRzW2ldO1xuXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LiQuZHJhZ2dhYmxlKCdlbmFibGUnKTtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdlbGVtZW50YWRkJywgZWxlbWVudC4kWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHNjb3JlIGZvciB0aGlzIGRyYWdnYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBza2lwVmlzdWFsc1xuICAgKiBAcGFyYW0ge0FycmF5fSBzb2x1dGlvbnNcbiAgICogQHBhcmFtIHtINVAuUXVlc3Rpb24uU2NvcmVQb2ludHN9IHNjb3JlUG9pbnRzXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICByZXN1bHRzKHNraXBWaXN1YWxzLCBzb2x1dGlvbnMsIHNjb3JlUG9pbnRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBpLCBqLCBlbGVtZW50LCBjb3JyZWN0LCBwb2ludHMgPSAwO1xuICAgIHNlbGYucmF3UG9pbnRzID0gMDtcblxuICAgIGlmIChzb2x1dGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gV2Ugc2hvdWxkIG5vdCBiZSBhbnl3aGVyZS5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBzZWxmLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsZW1lbnQgPSBzZWxmLmVsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoZWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGVsZW1lbnQuZHJvcFpvbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIC4uLiBidXQgd2UgYXJlIVxuICAgICAgICAgIGlmIChza2lwVmlzdWFscyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2VsZi5tYXJrRWxlbWVudChlbGVtZW50LCAnd3JvbmcnLCBzY29yZVBvaW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvaW50cy0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cblxuICAgIC8vIEFyZSB3ZSBzb21ld2hlcmUgd2Ugc2hvdWxkIGJlP1xuICAgIGZvciAoaSA9IDA7IGkgPCBzZWxmLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVtZW50ID0gc2VsZi5lbGVtZW50c1tpXTtcblxuICAgICAgaWYgKGVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LmRyb3Bab25lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7IC8vIFdlIGhhdmUgbm90IGJlZW4gcGxhY2VkIGFueXdoZXJlLCB3ZSdyZSBuZWl0aGVyIHdyb25nIG5vciBjb3JyZWN0LlxuICAgICAgfVxuXG4gICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgc29sdXRpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmRyb3Bab25lID09PSBzb2x1dGlvbnNbal0pIHtcbiAgICAgICAgICAvLyBZZXBwIVxuICAgICAgICAgIGlmIChza2lwVmlzdWFscyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2VsZi5tYXJrRWxlbWVudChlbGVtZW50LCAnY29ycmVjdCcsIHNjb3JlUG9pbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgc2VsZi5yYXdQb2ludHMrKztcbiAgICAgICAgICBwb2ludHMrKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvcnJlY3QpIHtcbiAgICAgICAgLy8gTm9wZSwgd2UncmUgaW4gYW5vdGhlciB6b25lXG4gICAgICAgIGlmIChza2lwVmlzdWFscyAhPT0gdHJ1ZSkge1xuICAgICAgICAgIHNlbGYubWFya0VsZW1lbnQoZWxlbWVudCwgJ3dyb25nJywgc2NvcmVQb2ludHMpO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cy0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgZ2l2ZW4gZWxlbWVudCBhcyBlaXRoZXIgY29ycmVjdCBvciB3cm9uZ1xuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzICdjb3JyZWN0JyBvciAnd3JvbmcnXG4gICAqIEBwYXJhbSB7SDVQLlF1ZXN0aW9uLlNjb3JlUG9pbnRzfSBzY29yZVBvaW50c1xuICAgKi9cbiAgbWFya0VsZW1lbnQoZWxlbWVudCwgc3RhdHVzLCBzY29yZVBvaW50cykge1xuICAgIHZhciAkZWxlbWVudFJlc3VsdCA9ICQoJzxzcGFuLz4nLCB7XG4gICAgICAnY2xhc3MnOiAnaDVwLWhpZGRlbi1yZWFkJyxcbiAgICAgIGh0bWw6IHRoaXMubDEwbltzdGF0dXMgKyAnQW5zd2VyJ10gKyAnLiAnXG4gICAgfSk7XG4gICAgaWYgKHNjb3JlUG9pbnRzKSB7XG4gICAgICAkZWxlbWVudFJlc3VsdCA9ICRlbGVtZW50UmVzdWx0LmFkZChzY29yZVBvaW50cy5nZXRFbGVtZW50KHN0YXR1cyA9PT0gJ2NvcnJlY3QnKSk7XG4gICAgfVxuICAgIGVsZW1lbnQuJHN1ZmZpeCA9IGVsZW1lbnQuJHN1ZmZpeC5hZGQoJGVsZW1lbnRSZXN1bHQpO1xuICAgIGVsZW1lbnQuJC5hZGRDbGFzcygnaDVwLScgKyBzdGF0dXMpLmFwcGVuZCgkZWxlbWVudFJlc3VsdCk7XG4gICAgRHJhZ1V0aWxzLnNldEVsZW1lbnRPcGFjaXR5KGVsZW1lbnQuJCwgdGhpcy5iYWNrZ3JvdW5kT3BhY2l0eSk7XG4gIH1cbn1cbiIsImltcG9ydCBEcmFnVXRpbHMgZnJvbSAnLi9kcmFnLXV0aWxzJztcblxuY29uc3QgJCA9IEg1UC5qUXVlcnk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyb3Bab25lIHtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBkcm9wIHpvbmUgaW5zdGFuY2UuXG4gICAqIE1ha2VzIGl0IGVhc3kgdG8ga2VlcCB0cmFjayBvZiBhbGwgaW5zdGFuY2UgdmFyaWFibGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZHJvcFpvbmVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGwxMG5cbiAgICogQHJldHVybnMge19MOC5Ecm9wWm9uZX1cbiAgICovXG4gIGNvbnN0cnVjdG9yIChkcm9wWm9uZSwgaWQsIGwxMG4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgSDVQLkV2ZW50RGlzcGF0Y2hlci5jYWxsKHNlbGYpO1xuXG4gICAgc2VsZi5pZCA9IGlkO1xuICAgIHNlbGYuc2hvd0xhYmVsID0gZHJvcFpvbmUuc2hvd0xhYmVsO1xuICAgIHNlbGYubGFiZWwgPSBkcm9wWm9uZS5sYWJlbDtcbiAgICBzZWxmLnggPSBkcm9wWm9uZS54O1xuICAgIHNlbGYueSA9IGRyb3Bab25lLnk7XG4gICAgc2VsZi53aWR0aCA9IGRyb3Bab25lLndpZHRoO1xuICAgIHNlbGYuaGVpZ2h0ID0gZHJvcFpvbmUuaGVpZ2h0O1xuICAgIHNlbGYuYmFja2dyb3VuZE9wYWNpdHkgPSBkcm9wWm9uZS5iYWNrZ3JvdW5kT3BhY2l0eTtcbiAgICBzZWxmLnRpcCA9IGRyb3Bab25lLnRpcHNBbmRGZWVkYmFjay50aXAgfHwgJyc7XG4gICAgc2VsZi5zaW5nbGUgPSBkcm9wWm9uZS5zaW5nbGU7XG4gICAgc2VsZi5hdXRvQWxpZ25hYmxlID0gZHJvcFpvbmUuYXV0b0FsaWduO1xuICAgIHNlbGYuYWxpZ25hYmxlcyA9IFtdO1xuICAgIHNlbGYubDEwbiA9IGwxMG47XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGRyb3Agem9uZSBpbiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge0FycmF5fSBkcmFnZ2FibGVzXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqL1xuICBhcHBlbmRUbygkY29udGFpbmVyLCBkcmFnZ2FibGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gUHJlcGFyZSBpbm5lciBodG1sIHdpdGggcHJlZml4IGZvciBnb29kIGExMXlcbiAgICB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwiaDVwLWlubmVyXCI+PC9kaXY+JztcbiAgICB2YXIgZXh0cmFDbGFzcyA9ICcnO1xuICAgIGlmIChzZWxmLnNob3dMYWJlbCkge1xuICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwiaDVwLWxhYmVsXCI+JyArIHNlbGYubGFiZWwgKyAnPHNwYW4gY2xhc3M9XCJoNXAtaGlkZGVuLXJlYWRcIj48L3NwYW4+PC9kaXY+JyArIGh0bWw7XG4gICAgICBleHRyYUNsYXNzID0gJyBoNXAtaGFzLWxhYmVsJztcbiAgICB9XG4gICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cImg1cC1oaWRkZW4tcmVhZFwiPicgKyAoc2VsZi5sMTBuLnByZWZpeC5yZXBsYWNlKCd7bnVtfScsIHNlbGYuaWQgKyAxKSkgKyAoIXNlbGYuc2hvd0xhYmVsID8gc2VsZi5sYWJlbCA6ICcnKSArICc8L3NwYW4+JyArIGh0bWw7XG5cbiAgICAvLyBDcmVhdGUgZHJvcCB6b25lIGVsZW1lbnRcbiAgICBzZWxmLiRkcm9wWm9uZSA9ICQoJzxkaXYvPicsIHtcbiAgICAgIGNsYXNzOiAnaDVwLWRyb3B6b25lJyArIGV4dHJhQ2xhc3MsXG4gICAgICB0YWJpbmRleDogJy0xJyxcbiAgICAgIHJvbGU6ICdidXR0b24nLFxuICAgICAgJ2FyaWEtZGlzYWJsZWQnOiB0cnVlLFxuICAgICAgY3NzOiB7XG4gICAgICAgIGxlZnQ6IHNlbGYueCArICclJyxcbiAgICAgICAgdG9wOiBzZWxmLnkgKyAnJScsXG4gICAgICAgIHdpZHRoOiBzZWxmLndpZHRoICsgJ2VtJyxcbiAgICAgICAgaGVpZ2h0OiBzZWxmLmhlaWdodCArICdlbSdcbiAgICAgIH0sXG4gICAgICBodG1sOiBodG1sXG4gICAgfSlcbiAgICAgIC5hcHBlbmRUbygkY29udGFpbmVyKVxuICAgICAgLmNoaWxkcmVuKCcuaDVwLWlubmVyJylcbiAgICAgICAgLmRyb3BwYWJsZSh7XG4gICAgICAgICAgYWN0aXZlQ2xhc3M6ICdoNXAtYWN0aXZlJyxcbiAgICAgICAgICB0b2xlcmFuY2U6ICdpbnRlcnNlY3QnLFxuICAgICAgICAgIGFjY2VwdDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRnVuY3Rpb25hbCBub3RlOlxuICAgICAgICAgICAgICogVGhpcyB3aWxsIGZpcmUgZXZlcnkgdGltZSBhIGRyYWdnYWJsZSBpcyBzdGFydGluZyB0byBnZXQgZHJhZ2dlZCwgZ2xvYmFsbHlcbiAgICAgICAgICAgICAqIGZvciBhbGwgaW5pdGlhbGl6ZWQgZHJvcCB6b25lcyAgPC0+IGRyYWdnYWJsZXMuIFRoYXQgbWVhbnMgaW4gYSBjb21wb3VuZCBINVAgdGhpc1xuICAgICAgICAgICAgICogZnVuY3Rpb24gd2lsbCBmaXJlIGZvciBhbGwgRHJhZyBRdWVzdGlvbnMgd2l0aGluIHRoYXQgY29tcG91bmQgY29udGVudCB0eXBlLFxuICAgICAgICAgICAgICogbm8gbWF0dGVyIGlmIGl0IGlzIGF0IGEgZGlmZmVyZW50IHRpbWVzdGFtcCwgYWxyZWFkeSBjb21wbGV0ZWQgb3Igb3RoZXJ3aXNlXG4gICAgICAgICAgICAgKiBpbnR1aXRpdmVseSB3b3VsZCBiZSBkaXNhYmxlZC4gVGhpcyBjYW4gbGVhZCB0byBzb21lIHVuZXhwZWN0ZWQgYmVoYXZpb3VyIGlmIHlvdVxuICAgICAgICAgICAgICogZG9uJ3QgdGFrZSB0aGlzIGludG8gY29uc2lkZXJhdGlvbi5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyBGaW5kIGRyYWdnYWJsZSBlbGVtZW50IGJlbG9uZ3MgdG9cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBEcmFnVXRpbHMuZWxlbWVudFRvRHJhZ2dhYmxlKGRyYWdnYWJsZXMsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBGb3VuZCBubyBEcmFnZ2FibGUgdGhhdCB0aGUgZWxlbWVudCBiZWxvbmdzIHRvLiBEb24ndCBhY2NlcHQgaXQuXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgaWYgdGhlIGRyb3Agem9uZSB3aWxsIGFjY2VwdCB0aGUgZHJhZ2dhYmxlXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hY2NlcHRzKHJlc3VsdC5kcmFnZ2FibGUsIGRyYWdnYWJsZXMpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZHJvcDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIERyYWdVdGlscy5zZXRPcGFjaXR5KCR0aGlzLnJlbW92ZUNsYXNzKCdoNXAtb3ZlcicpLCAnYmFja2dyb3VuZCcsIHNlbGYuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgICAgICAgICAgdWkuZHJhZ2dhYmxlLmRhdGEoJ2FkZFRvWm9uZScsIHNlbGYuaWQpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5nZXRJbmRleE9mKHVpLmRyYWdnYWJsZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIC8vIEFkZCB0byBhbGlnbmFibGVzXG4gICAgICAgICAgICAgIHNlbGYuYWxpZ25hYmxlcy5wdXNoKHVpLmRyYWdnYWJsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmF1dG9BbGlnbmFibGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGFsaWdubWVudFxuICAgICAgICAgICAgICBzZWxmLmF1dG9BbGlnbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRHJhZ1V0aWxzLnNldE9wYWNpdHkoJCh0aGlzKS5hZGRDbGFzcygnaDVwLW92ZXInKSwgJ2JhY2tncm91bmQnLCBzZWxmLmJhY2tncm91bmRPcGFjaXR5KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG91dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRHJhZ1V0aWxzLnNldE9wYWNpdHkoJCh0aGlzKS5yZW1vdmVDbGFzcygnaDVwLW92ZXInKSwgJ2JhY2tncm91bmQnLCBzZWxmLmJhY2tncm91bmRPcGFjaXR5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5lbmQoKVxuICAgICAgLmZvY3VzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCR0aXAgaW5zdGFuY2VvZiBINVAualF1ZXJ5KSB7XG4gICAgICAgICAgJHRpcC5hdHRyKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuYmx1cihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkdGlwIGluc3RhbmNlb2YgSDVQLmpRdWVyeSkge1xuICAgICAgICAgICR0aXAuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAvLyBBZGQgdGlwIGFmdGVyIHNldE9wYWNpdHkoKSwgc28gdGhpcyBkb2VzIG5vdCBnZXQgYmFja2dyb3VuZCBvcGFjaXR5OlxuICAgIHZhciAkdGlwID0gSDVQLkpvdWJlbFVJLmNyZWF0ZVRpcChzZWxmLnRpcCwge1xuICAgICAgdGlwTGFiZWw6IHNlbGYubDEwbi50aXBMYWJlbCxcbiAgICAgIHRhYmNvbnRyb2w6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoJHRpcCBpbnN0YW5jZW9mIEg1UC5qUXVlcnkpIHtcbiAgICAgIC8vIENyZWF0ZSB3cmFwcGVyIGZvciB0aXBcbiAgICAgICQoJzxzcGFuLz4nLCB7XG4gICAgICAgICdjbGFzcyc6ICdoNXAtZHEtdGlwd3JhcCcsXG4gICAgICAgICdhcmlhLWxhYmVsJzogc2VsZi5sMTBuLnRpcEF2YWlsYWJsZSxcbiAgICAgICAgJ2FwcGVuZCc6ICR0aXAsXG4gICAgICAgICdhcHBlbmRUbyc6IHNlbGYuJGRyb3Bab25lXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkcmFnZ2FibGVzLmZvckVhY2goZnVuY3Rpb24gKGRyYWdnYWJsZSkge1xuICAgICAgdmFyIGRyYWdFbCA9IGRyYWdnYWJsZS5lbGVtZW50LiQ7XG5cbiAgICAgIC8vIEFkZCB0byBhbGlnbmFibGVzXG4gICAgICBpZiAoZHJhZ2dhYmxlLmlzSW5Ecm9wWm9uZShzZWxmLmlkKSAmJiBzZWxmLmdldEluZGV4T2YoZHJhZ0VsKSA9PT0gLTEpIHtcbiAgICAgICAgc2VsZi5hbGlnbmFibGVzLnB1c2goZHJhZ0VsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc2VsZi5hdXRvQWxpZ25hYmxlLmVuYWJsZWQpIHtcbiAgICAgIHNlbGYuYXV0b0FsaWduKCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGVsZW1lbnQgb3BhY2l0eSB3aGVuIGVsZW1lbnQgaGFzIGJlZW4gYXBwZW5kZWRcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYudXBkYXRlQmFja2dyb3VuZE9wYWNpdHkoKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGJhY2tncm91bmQgb3BhY2l0eVxuICAgKi9cbiAgdXBkYXRlQmFja2dyb3VuZE9wYWNpdHkoKSB7XG4gICAgRHJhZ1V0aWxzLnNldE9wYWNpdHkodGhpcy4kZHJvcFpvbmUuY2hpbGRyZW4oJy5oNXAtbGFiZWwnKSwgJ2JhY2tncm91bmQnLCB0aGlzLmJhY2tncm91bmRPcGFjaXR5KTtcbiAgICBEcmFnVXRpbHMuc2V0T3BhY2l0eSh0aGlzLiRkcm9wWm9uZS5jaGlsZHJlbignLmg1cC1pbm5lcicpLCAnYmFja2dyb3VuZCcsIHRoaXMuYmFja2dyb3VuZE9wYWNpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHAgZGV0ZXJtaW5lIGlmIHRoZSBkcm9wIHpvbmUgY2FuIGFjY2VwdCB0aGlzIGRyYWdnYWJsZVxuICAgKi9cbiAgYWNjZXB0cyhkcmFnZ2FibGUsIGRyYWdnYWJsZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCFkcmFnZ2FibGUuaGFzRHJvcFpvbmUoc2VsZi5pZCkpIHtcbiAgICAgIC8vIERvZXNuJ3QgYmVsb25nIGluIHRoaXMgZHJvcCB6b25lXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc2luZ2xlKSB7XG4gICAgICAvLyBNYWtlIHN1cmUgbm8gb3RoZXIgZHJhZ2dhYmxlIGlzIHBsYWNlZCBoZXJlXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRyYWdnYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGRyYWdnYWJsZXNbaV0gJiYgZHJhZ2dhYmxlc1tpXS5pc0luRHJvcFpvbmUoc2VsZi5pZCkpIHtcbiAgICAgICAgICAvLyBUaGlzIGRyb3Agem9uZSBpcyBvY2N1cGllZFxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgaW5kZXggb2YgZ2l2ZW4gYWxpZ25hYmxlXG4gICAqXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkYWxpZ25hYmxlXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldEluZGV4T2YoJGFsaWduYWJsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5hbGlnbmFibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2VsZi5hbGlnbmFibGVzW2ldWzBdID09PSAkYWxpZ25hYmxlWzBdKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxpZ25hYmxlXG4gICAqXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkYWxpZ25hYmxlXG4gICAqL1xuICByZW1vdmVBbGlnbmFibGUoJGFsaWduYWJsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIEZpbmQgYWxpZ25hYmxlIGluZGV4XG4gICAgdmFyIGluZGV4ID0gc2VsZi5nZXRJbmRleE9mKCRhbGlnbmFibGUpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcblxuICAgICAgLy8gUmVtb3ZlIGFsaWduYWJsZVxuICAgICAgc2VsZi5hbGlnbmFibGVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIGlmIChzZWxmLmF1dG9BbGlnblRpbWVyID09PSB1bmRlZmluZWQgJiYgc2VsZi5hdXRvQWxpZ25hYmxlLmVuYWJsZWQpIHtcbiAgICAgICAgLy8gU2NoZWR1bGUgcmUtYWxpZ21lbnQgb2YgYWxpZ25hYmxlcyBsZWZ0XG4gICAgICAgIHNlbGYuYXV0b0FsaWduVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkZWxldGUgc2VsZi5hdXRvQWxpZ25UaW1lcjtcbiAgICAgICAgICBzZWxmLmF1dG9BbGlnbigpO1xuICAgICAgICB9LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXV0by1hbGlnbiBhbGlnbmFibGUgZWxlbWVudHMgaW5zaWRlIGRyb3Agem9uZS5cbiAgICovXG4gIGF1dG9BbGlnbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBEZXRlcm1pbmUgY29udGFpbmVyIHNpemUgaW4gb3JkZXIgdG8gY2FsY3VsYXRlIHBlcmNldGFnZXNcbiAgICB2YXIgY29udGFpbmVyU2l6ZSA9IHNlbGYuJGRyb3Bab25lLnBhcmVudCgpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgLy8gQ2FsY3VhdGUgYm9yZGVycyBhbmQgc3BhY2luZyB2YWx1ZXMgaW4gcGVyY2V0YWdlXG4gICAgdmFyIHNwYWNpbmcgPSB7XG4gICAgICB4OiAoc2VsZi5hdXRvQWxpZ25hYmxlLnNwYWNpbmcgLyBzZWxmLmF1dG9BbGlnbmFibGUuc2l6ZS53aWR0aCkgKiAxMDAsXG4gICAgICB5OiAoc2VsZi5hdXRvQWxpZ25hYmxlLnNwYWNpbmcgLyBzZWxmLmF1dG9BbGlnbmFibGUuc2l6ZS5oZWlnaHQpICogMTAwXG4gICAgfTtcblxuICAgIC8vIERldGVybWluZSBjb29yZGluYXRlcyBmb3IgZmlyc3QgJ3Nwb3QnXG4gICAgdmFyIHBvcyA9IHtcbiAgICAgIHg6IHNlbGYueCArIHNwYWNpbmcueCxcbiAgICAgIHk6IHNlbGYueSArIHNwYWNpbmcueVxuICAgIH07XG5cbiAgICAvLyBEZXRlcm1pbmUgc3BhY2UgaW5zaWRlIGRyb3Agem9uZVxuICAgIHZhciBkcm9wWm9uZVNpemUgPSBzZWxmLiRkcm9wWm9uZVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgc3BhY2UgPSB7XG4gICAgICB4OiBkcm9wWm9uZVNpemUud2lkdGggLSAoc3BhY2luZy54ICogMiksXG4gICAgICB5OiBkcm9wWm9uZVNpemUuaGVpZ2h0IC0gKHNwYWNpbmcueSAqIDIpXG4gICAgfTtcblxuICAgIC8vIFNldCBjdXJyZW50IHNwYWNlIGxlZnQgaW5zaWRlIGRyb3Agem9uZVxuICAgIHZhciBzcGFjZUxlZnQgPSB7XG4gICAgICB4OiBzcGFjZS54LFxuICAgICAgeTogc3BhY2UueVxuICAgIH07XG5cbiAgICAvLyBTZXQgaGVpZ2h0IGZvciB0aGUgYWN0aXZlIHJvdyBvZiBlbGVtZW50c1xuICAgIHZhciBjdXJyZW50Um93SGVpZ2h0ID0gMDtcblxuICAgIC8vIEN1cnJlbnQgYWxpZ25hYmxlIGVsZW1lbnQgYW5kIGl0J3Mgc2l6ZVxuICAgIHZhciAkYWxpZ25hYmxlLCBhbGlnbmFibGVTaXplO1xuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGRvaW5nIHRoZSBhY3R1YWwgcG9zaXRpb25pbmcgb2YgdGhlIGVsZW1lbnQgKyByZWNhbGN1bGF0aW5nXG4gICAgICogbmV4dCBwb3NpdGlvbiBhbmQgc3BhY2UgbGVmdC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdmFyIGFsaWduRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFBvc2l0aW9uIGVsZW1lbnQgYXQgY3VycmVudCBzcG90XG4gICAgICAkYWxpZ25hYmxlLmNzcyh7XG4gICAgICAgIGxlZnQ6IHBvcy54ICsgJyUnLFxuICAgICAgICB0b3A6IHBvcy55ICsgJyUnXG4gICAgICB9KTtcbiAgICAgIHNlbGYudHJpZ2dlcignZWxlbWVudGFsaWduZWQnLCAkYWxpZ25hYmxlKTtcblxuICAgICAgLy8gVXBkYXRlIGhvcml6b250YWwgc3BhY2UgbGVmdCArIG5leHQgcG9zaXRpb25cbiAgICAgIHZhciBzcGFjZURpZmZYID0gKGFsaWduYWJsZVNpemUud2lkdGggKyBzZWxmLmF1dG9BbGlnbmFibGUuc3BhY2luZyk7XG4gICAgICBzcGFjZUxlZnQueCAtPSBzcGFjZURpZmZYO1xuICAgICAgcG9zLnggKz0gKHNwYWNlRGlmZlggLyBjb250YWluZXJTaXplLndpZHRoKSAqIDEwMDtcblxuICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgaGlnaGVzdCBlbGVtZW50IGluIHRoaXMgcm93XG4gICAgICB2YXIgc3BhY2VEaWZmWSA9IChhbGlnbmFibGVTaXplLmhlaWdodCArIHNlbGYuYXV0b0FsaWduYWJsZS5zcGFjaW5nKTtcbiAgICAgIGlmIChzcGFjZURpZmZZID4gY3VycmVudFJvd0hlaWdodCkge1xuICAgICAgICBjdXJyZW50Um93SGVpZ2h0ID0gc3BhY2VEaWZmWTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVHJ5IHRvIG9yZGVyIGFuZCBhbGlnbiB0aGUgYWxpZ25hYmxlcyBpbnNpZGUgdGhlIGRyb3Agem9uZVxuICAgIC8vIChpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIGFkZGVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5hbGlnbmFibGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIC8vIERldGVybWluZSBhbGlnbmFibGUgc2l6ZVxuICAgICAgJGFsaWduYWJsZSA9IHNlbGYuYWxpZ25hYmxlc1tpXTtcbiAgICAgIGFsaWduYWJsZVNpemUgPSAkYWxpZ25hYmxlWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAvLyBUcnkgdG8gZml0IG9uIHRoZSBjdXJyZW50IHJvd1xuICAgICAgaWYgKHNwYWNlTGVmdC54ID49IGFsaWduYWJsZVNpemUud2lkdGgpIHtcbiAgICAgICAgYWxpZ25FbGVtZW50KCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gRGlkIG5vdCBmaXQsIHRyeSBuZXh0IHJvd1xuXG4gICAgICAgIC8vIFJlc2V0IFggdmFsdWVzXG4gICAgICAgIHNwYWNlTGVmdC54ID0gc3BhY2UueDtcbiAgICAgICAgcG9zLnggPSBzZWxmLnggKyBzcGFjaW5nLng7XG5cbiAgICAgICAgLy8gQnVtcCBZIHZhbHVlc1xuICAgICAgICBpZiAoY3VycmVudFJvd0hlaWdodCkge1xuICAgICAgICAgIC8vIFVwZGF0ZSBZIHNwYWNlIGFuZCBwb3NpdGlvbiBhY2NvcmRpbmcgdG8gcHJldmlvdXMgcm93IGhlaWdodFxuICAgICAgICAgIHNwYWNlTGVmdC55IC09IGN1cnJlbnRSb3dIZWlnaHQ7XG4gICAgICAgICAgcG9zLnkgKz0gKGN1cnJlbnRSb3dIZWlnaHQgLyBjb250YWluZXJTaXplLmhlaWdodCkgKiAxMDA7XG5cbiAgICAgICAgICAvLyBSZXNldFxuICAgICAgICAgIGN1cnJlbnRSb3dIZWlnaHQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcGFjZUxlZnQueSA8PSAwKSB7XG4gICAgICAgICAgcmV0dXJuOyAvLyBObyBtb3JlIHZlcnRpY2FsIHNwYWNlIGxlZnQsIHN0b3AgYWxsIGFsaWdpbmdcbiAgICAgICAgfVxuICAgICAgICBhbGlnbkVsZW1lbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0IHRoZSBjdXJyZW50IGRyb3Agem9uZVxuICAgKi9cbiAgaGlnaGxpZ2h0KCkge1xuICAgIHRoaXMuJGRyb3Bab25lLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKS5jaGlsZHJlbignLmg1cC1pbm5lcicpLmFkZENsYXNzKCdoNXAtYWN0aXZlJyk7XG4gIH1cblxuICAvKipcbiAgICogRGUtaGlnaGxpZ2h0IHRoZSBjdXJyZW50IGRyb3Agem9uZVxuICAgKi9cbiAgZGVoaWdobGlnaHQoKSB7XG4gICAgdGhpcy4kZHJvcFpvbmUuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJykuY2hpbGRyZW4oJy5oNXAtaW5uZXInKS5yZW1vdmVDbGFzcygnaDVwLWFjdGl2ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiByZXNldCB0YXNrIGlzIHJ1bi4gQ2xlYW51cCBhbnkgaW50ZXJuYWwgc3RhdGVzLiBcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIC8vIFJlbW92ZSBhbGlnbmFibGVzXG4gICAgdGhpcy5hbGlnbmFibGVzID0gW107XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IENvbnRyb2xzIGZyb20gJ2g1cC1saWItY29udHJvbHMvc3JjL3NjcmlwdHMvY29udHJvbHMnO1xuaW1wb3J0IEFyaWFEcmFnIGZyb20gJ2g1cC1saWItY29udHJvbHMvc3JjL3NjcmlwdHMvYXJpYS9kcmFnJztcbmltcG9ydCBBcmlhRHJvcCBmcm9tICdoNXAtbGliLWNvbnRyb2xzL3NyYy9zY3JpcHRzL2FyaWEvZHJvcCc7XG5pbXBvcnQgVUlLZXlib2FyZCBmcm9tICdoNXAtbGliLWNvbnRyb2xzL3NyYy9zY3JpcHRzL3VpL2tleWJvYXJkJztcbmltcG9ydCBNb3VzZSBmcm9tICdoNXAtbGliLWNvbnRyb2xzL3NyYy9zY3JpcHRzL3VpL21vdXNlJztcblxuaW1wb3J0IERyYWdVdGlscyBmcm9tICcuL2RyYWctdXRpbHMnO1xuaW1wb3J0IERyb3Bab25lIGZyb20gJy4vZHJvcHpvbmUnO1xuaW1wb3J0IERyYWdnYWJsZSBmcm9tICcuL2RyYWdnYWJsZSc7XG5cbmNvbnN0ICQgPSBINVAualF1ZXJ5O1xubGV0IG51bUluc3RhbmNlcyA9IDA7XG5sZXQgZGVzb3JkZW5hciA9IHRydWU7XG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIEg1UC5RdWVzdGlvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgUnVuIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCBDb250ZW50IGlkZW50aWZpY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGVudERhdGFcbiAqL1xuZnVuY3Rpb24gQyhvcHRpb25zLCBjb250ZW50SWQsIGNvbnRlbnREYXRhKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGksIGo7XG4gIG51bUluc3RhbmNlcysrO1xuICB0aGlzLmlkID0gdGhpcy5jb250ZW50SWQgPSBjb250ZW50SWQ7XG4gIHRoaXMuY29udGVudERhdGEgPSBjb250ZW50RGF0YTtcblxuICBINVAuUXVlc3Rpb24uY2FsbChzZWxmLCAnZHJhZ3F1ZXN0aW9uJyk7XG4gIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgc2NvcmVTaG93OiAnQ2hlY2snLFxuICAgIHRyeUFnYWluOiAnUmV0cnknLFxuICAgIGdyYWJiYWJsZVByZWZpeDogJ0dyYWJiYWJsZSB7bnVtfSBvZiB7dG90YWx9LicsXG4gICAgZ3JhYmJhYmxlU3VmZml4OiAnUGxhY2VkIGluIGRyb3B6b25lIHtudW19LicsXG4gICAgZHJvcHpvbmVQcmVmaXg6ICdEcm9wem9uZSB7bnVtfSBvZiB7dG90YWx9LicsXG4gICAgbm9Ecm9wem9uZTogJ05vIGRyb3B6b25lJyxcbiAgICB0aXBMYWJlbDogJ1Nob3cgdGlwLicsXG4gICAgdGlwQXZhaWxhYmxlOiAnVGlwIGF2YWlsYWJsZScsXG4gICAgY29ycmVjdEFuc3dlcjogJ0NvcnJlY3QgYW5zd2VyJyxcbiAgICB3cm9uZ0Fuc3dlcjogJ1dyb25nIGFuc3dlcicsXG4gICAgZmVlZGJhY2tIZWFkZXI6ICdGZWVkYmFjaycsXG4gICAgc2NvcmVCYXJMYWJlbDogJ1lvdSBnb3QgOm51bSBvdXQgb2YgOnRvdGFsIHBvaW50cycsXG4gICAgc2NvcmVFeHBsYW5hdGlvbkJ1dHRvbkxhYmVsOiAnU2hvdyBzY29yZSBleHBsYW5hdGlvbicsXG4gICAgcXVlc3Rpb246IHtcbiAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgIHF1ZXN0aW9uVGl0bGU6ICh0aGlzLmNvbnRlbnREYXRhICYmIHRoaXMuY29udGVudERhdGEubWV0YWRhdGEgJiYgdGhpcy5jb250ZW50RGF0YS5tZXRhZGF0YS50aXRsZSkgPyB0aGlzLmNvbnRlbnREYXRhLm1ldGFkYXRhLnRpdGxlIDogJ0RyYWcgYW5kIGRyb3AnLFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgd2lkdGg6IDYyMCxcbiAgICAgICAgICBoZWlnaHQ6IDMxMFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGFzazoge1xuICAgICAgICBlbGVtZW50czogW10sXG4gICAgICAgIGRyb3Bab25lczogW11cbiAgICAgIH1cbiAgICB9LFxuICAgIG92ZXJhbGxGZWVkYmFjazogW10sXG4gICAgYmVoYXZpb3VyOiB7XG4gICAgICBlbmFibGVSZXRyeTogdHJ1ZSxcbiAgICAgIGVuYWJsZUNoZWNrQnV0dG9uOiB0cnVlLFxuICAgICAgcHJldmVudFJlc2l6ZTogZmFsc2UsXG4gICAgICBzaW5nbGVQb2ludDogZmFsc2UsXG4gICAgICBhcHBseVBlbmFsdGllczogdHJ1ZSxcbiAgICAgIGVuYWJsZVNjb3JlRXhwbGFuYXRpb246IHRydWUsXG4gICAgICBkcm9wWm9uZUhpZ2hsaWdodGluZzogJ2RyYWdnaW5nJyxcbiAgICAgIGF1dG9BbGlnblNwYWNpbmc6IDIsXG4gICAgICBzaG93U2NvcmVQb2ludHM6IHRydWUsXG4gICAgICBzaG93VGl0bGU6IGZhbHNlXG4gICAgfSxcbiAgICBhMTF5Q2hlY2s6ICdDaGVjayB0aGUgYW5zd2Vycy4gVGhlIHJlc3BvbnNlcyB3aWxsIGJlIG1hcmtlZCBhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHVuYW5zd2VyZWQuJyxcbiAgICBhMTF5UmV0cnk6ICdSZXRyeSB0aGUgdGFzay4gUmVzZXQgYWxsIHJlc3BvbnNlcyBhbmQgc3RhcnQgdGhlIHRhc2sgb3ZlciBhZ2Fpbi4nLFxuICAgIHN1Ym1pdDogJ1N1Ym1pdCcsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIC8vIElmIHNpbmdsZSBwb2ludCBpcyBlbmFibGVkLCBpdCBtYWtlcyBubyBzZW5zZSBkaXNwbGF5aW5nXG4gIC8vIHRoZSBzY29yZSBleHBsYW5hdGlvbi4gTm90ZTogSW4gdGhlIGVkaXRvciwgdGhlIHNjb3JlIGV4cGxhbmF0aW9uIGlzIGhpZGRlblxuICAvLyBieSB0aGUgc2hvd1doZW4gd2lkZ2V0IGlmIHNpbmdsZVBvaW50IGlzIGVuYWJsZWRcbiAgaWYgKHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuc2luZ2xlUG9pbnQpIHtcbiAgICB0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLmVuYWJsZVNjb3JlRXhwbGFuYXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuZHJhZ2dhYmxlcyA9IFtdO1xuICB0aGlzLmRyb3Bab25lcyA9IFtdO1xuICB0aGlzLmFuc3dlcmVkID0gKGNvbnRlbnREYXRhICYmIGNvbnRlbnREYXRhLnByZXZpb3VzU3RhdGUgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RGF0YS5wcmV2aW91c1N0YXRlLmFuc3dlcnMgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RGF0YS5wcmV2aW91c1N0YXRlLmFuc3dlcnMubGVuZ3RoKTtcbiAgdGhpcy5ibGFua0lzQ29ycmVjdCA9IHRydWU7XG5cbiAgdGhpcy5iYWNrZ3JvdW5kT3BhY2l0eSA9ICh0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLmJhY2tncm91bmRPcGFjaXR5ID09PSB1bmRlZmluZWQgfHwgdGhpcy5vcHRpb25zLmJlaGF2aW91ci5iYWNrZ3JvdW5kT3BhY2l0eS50cmltKCkgPT09ICcnKSA/IHVuZGVmaW5lZCA6IHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuYmFja2dyb3VuZE9wYWNpdHk7XG5cbiAgc2VsZi4kbm9Ecm9wWm9uZSA9ICQoJzxkaXYgY2xhc3M9XCJoNXAtZHEtbm8tZHpcIiByb2xlPVwiYnV0dG9uXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PHNwYW4gY2xhc3M9XCJoNXAtaGlkZGVuLXJlYWRcIj4nICsgc2VsZi5vcHRpb25zLm5vRHJvcHpvbmUgKyAnPC9zcGFuPjwvZGl2PicpO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHMgZm9yIGdvb2QgYTExeVxuICB2YXIgY29udHJvbHMgPSBnZXRDb250cm9scyhzZWxmLmRyYWdnYWJsZXMsIHNlbGYuZHJvcFpvbmVzLCBzZWxmLiRub0Ryb3Bab25lWzBdKTtcblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBkcm9wIGVmZmVjdCBmb3IgYWxsIGRyb3Agem9uZXMgYWNjZXB0aW5nIHRoaXMgZHJhZ2dhYmxlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWZmZWN0XG4gICAqL1xuICB2YXIgc2V0RHJvcEVmZmVjdCA9IGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnRyb2xzLmRyb3AuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyb2xzLmRyb3AuZWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWRyb3BlZmZlY3QnLCBlZmZlY3QpO1xuICAgIH1cbiAgfTtcblxuICAvLyBMaXN0IG9mIGRyb3Agem9uZXMgdGhhdCBoYXMgbm8gZWxlbWVudHMsIGkuZS4gbm90IHVzZWQgZm9yIHRoZSB0YXNrXG4gIHZhciBkcm9wWm9uZXNXaXRob3V0RWxlbWVudHMgPSBbXTtcblxuICAvLyBDcmVhdGUgbWFwIG92ZXIgY29ycmVjdCBkcm9wIHpvbmVzIGZvciBlbGVtZW50c1xuICB2YXIgdGFzayA9IHRoaXMub3B0aW9ucy5xdWVzdGlvbi50YXNrO1xuICB0aGlzLmNvcnJlY3REWnMgPSBbXTtcblxuICAvLyBAcG1hc3F1aWFyYW5cblxuICBsZXQgc2h1ZmZsZVBvcyA9IFtdO1xuXG4gIGZvciAobGV0IHBvc2ljaW9uID0gMDsgcG9zaWNpb24gPCB0YXNrLmVsZW1lbnRzLmxlbmd0aDsgcG9zaWNpb24rKykge1xuICAgIHNodWZmbGVQb3MucHVzaChwb3NpY2lvbik7XG4gIH1cblxuICBzaHVmZmxlUG9zLnNvcnQoKGEsYik9Pk1hdGgucmFuZG9tKCk+PTAuNT8tMToxKTtcbiAgc2h1ZmZsZVBvcyA9IGZpc2hlcllhdGVzU2h1ZmZsZShzaHVmZmxlUG9zKTtcblxuICBmdW5jdGlvbiBmaXNoZXJZYXRlc1NodWZmbGUoYXJyYXkpIHtcbiAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyByYW5kb20gaW5kZXggZnJvbSAwIHRvIGlcbiAgICAgIFthcnJheVtpXSwgYXJyYXlbal1dID0gW2FycmF5W2pdLCBhcnJheVtpXV07IC8vIHN3YXAgZWxlbWVudHMgYXQgaSBhbmQgalxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICBsZXQgc2h1ZmZsZUVsZW0gPSBbXTtcblxuICBmb3IgKGxldCBpbmRpY2UgPSAwOyBpbmRpY2UgPCB0YXNrLmVsZW1lbnRzLmxlbmd0aDsgaW5kaWNlKyspIHtcbiAgICBzaHVmZmxlRWxlbS5wdXNoKHsnZWpleCc6IHRhc2suZWxlbWVudHNbc2h1ZmZsZVBvc1tpbmRpY2VdXS54LCAnZWpleSc6IHRhc2suZWxlbWVudHNbc2h1ZmZsZVBvc1tpbmRpY2VdXS55fSk7XG4gIH1cblxuICAvLyBAcG1hc3F1aWFyYW5cblxuICBmb3IgKGkgPSAwOyBpIDwgdGFzay5kcm9wWm9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICBkcm9wWm9uZXNXaXRob3V0RWxlbWVudHMucHVzaCh0cnVlKTsgLy8gQWxsIHRydWUgYnkgZGVmYXVsdFxuXG4gICAgdmFyIGNvcnJlY3RFbGVtZW50cyA9IHRhc2suZHJvcFpvbmVzW2ldLmNvcnJlY3RFbGVtZW50cztcbiAgICBmb3IgKGogPSAwOyBqIDwgY29ycmVjdEVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgY29ycmVjdEVsZW1lbnQgPSBjb3JyZWN0RWxlbWVudHNbal07XG4gICAgICBpZiAodGhpcy5jb3JyZWN0RFpzW2NvcnJlY3RFbGVtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdERac1tjb3JyZWN0RWxlbWVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29ycmVjdERac1tjb3JyZWN0RWxlbWVudF0ucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLndlaWdodCA9IDE7XG5cbiAgY29uc3QgaXNEcmFnZ2FibGUgPSBlbGVtZW50ID0+IHtcbiAgICByZXR1cm4gIShlbGVtZW50LmRyb3Bab25lcyA9PT0gdW5kZWZpbmVkIHx8ICFlbGVtZW50LmRyb3Bab25lcy5sZW5ndGgpO1xuICB9O1xuXG4gIC8vIEFkZCBkcmFnZ2FibGUgZWxlbWVudHNcbiAgdmFyIGdyYWJiYWJsZWwxMG4gPSB7XG4gICAgcHJlZml4OiBzZWxmLm9wdGlvbnMuZ3JhYmJhYmxlUHJlZml4LnJlcGxhY2UoJ3t0b3RhbH0nLCB0YXNrLmVsZW1lbnRzLmZpbHRlcihpc0RyYWdnYWJsZSkubGVuZ3RoKSxcbiAgICBzdWZmaXg6IHNlbGYub3B0aW9ucy5ncmFiYmFibGVTdWZmaXgsXG4gICAgY29ycmVjdEFuc3dlcjogc2VsZi5vcHRpb25zLmNvcnJlY3RBbnN3ZXIsXG4gICAgd3JvbmdBbnN3ZXI6IHNlbGYub3B0aW9ucy53cm9uZ0Fuc3dlclxuICB9O1xuICBsZXQgZHJhZ2dhYmxlTnVtID0gMTsgLy8gSHVtYW4gcmVhZGFibGUgbGFiZWwgKGExMXkpXG4gIGZvciAoaSA9IDA7IGkgPCB0YXNrLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICB2YXIgZWxlbWVudCA9IHRhc2suZWxlbWVudHNbaV07XG5cbiAgICAvLyBAcG1hc3F1aWFyYW5cbiAgICAvL2NvbnNvbGUubG9nKCdZIG9yaWdpbmFsIGFudGVzJywgdGFzay5lbGVtZW50c1tpXS55LCAnWSBzaHVmZmxlIGFudGVzJywgc2h1ZmZsZUVsZW1baV0ueSk7XG4gICAgY29uc29sZS5sb2coJ1snK2krJ10gYW50ZXMnLCBlbGVtZW50KTtcbiAgICBlbGVtZW50LnggPSBzaHVmZmxlRWxlbVtpXS5lamV4O1xuICAgIGVsZW1lbnQueSA9IHNodWZmbGVFbGVtW2ldLmVqZXk7XG4gICAgLy9jb25zb2xlLmxvZygnWSBvcmlnaW5hbCBhYycsIHRhc2suZWxlbWVudHNbaV0ueSwgJ1kgc2h1ZmZsZSBhYycsIHNodWZmbGVFbGVtW2ldLnkpO1xuICAgIGNvbnNvbGUubG9nKCdbJytpKyddIGRlc3B1ZXMnLCBlbGVtZW50KTtcbiAgICBjb25zb2xlLmxvZygnLS0tJyk7XG4gICAgLy8gQHBtYXNxdWlhcmFuXG5cbiAgICBpZiAoIWlzRHJhZ2dhYmxlKGVsZW1lbnQpKSB7XG4gICAgICBjb250aW51ZTsgLy8gTm90IGEgZHJhZ2dhYmxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYmFja2dyb3VuZE9wYWNpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZWxlbWVudC5iYWNrZ3JvdW5kT3BhY2l0eSA9IHRoaXMuYmFja2dyb3VuZE9wYWNpdHk7XG4gICAgfVxuXG4gICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gbGFzdCBzZXNzaW9uXG4gICAgdmFyIGFuc3dlcnMgPSBudWxsO1xuICAgIGlmIChjb250ZW50RGF0YSAmJiBjb250ZW50RGF0YS5wcmV2aW91c1N0YXRlICE9PSB1bmRlZmluZWQgJiYgY29udGVudERhdGEucHJldmlvdXNTdGF0ZS5hbnN3ZXJzICE9PSB1bmRlZmluZWQgJiYgY29udGVudERhdGEucHJldmlvdXNTdGF0ZS5hbnN3ZXJzW2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFuc3dlcnMgPSBjb250ZW50RGF0YS5wcmV2aW91c1N0YXRlLmFuc3dlcnNbaV07XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG5ldyBkcmFnZ2FibGUgaW5zdGFuY2VcbiAgICB2YXIgZHJhZ2dhYmxlID0gbmV3IERyYWdnYWJsZShlbGVtZW50LCBpLCBhbnN3ZXJzLCBncmFiYmFibGVsMTBuLCB0YXNrLmRyb3Bab25lcywgZHJhZ2dhYmxlTnVtKyspO1xuICAgIHZhciBoaWdobGlnaHREcm9wWm9uZXMgPSAoc2VsZi5vcHRpb25zLmJlaGF2aW91ci5kcm9wWm9uZUhpZ2hsaWdodGluZyA9PT0gJ2RyYWdnaW5nJyk7XG4gICAgZHJhZ2dhYmxlLm9uKCdlbGVtZW50YWRkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjb250cm9scy5kcmFnLmFkZEVsZW1lbnQoZXZlbnQuZGF0YSk7XG4gICAgfSk7XG4gICAgZHJhZ2dhYmxlLm9uKCdlbGVtZW50cmVtb3ZlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjb250cm9scy5kcmFnLnJlbW92ZUVsZW1lbnQoZXZlbnQuZGF0YSk7XG4gICAgICBpZiAoZXZlbnQuZGF0YS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZ3JhYmJlZCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgY29udHJvbHMuZHJhZy5maXJlc0V2ZW50KCdzZWxlY3QnLCBldmVudC5kYXRhKTtcbiAgICAgICAgZXZlbnQuZGF0YS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZ3JhYmJlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRyYWdnYWJsZS5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGNvbnRyb2xzLmRyYWcuc2V0VGFiYmFibGUoZXZlbnQuZGF0YSk7XG4gICAgICBldmVudC5kYXRhLmZvY3VzKCk7XG4gICAgfSk7XG4gICAgZHJhZ2dhYmxlLm9uKCdkcmFnc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChoaWdobGlnaHREcm9wWm9uZXMpIHtcbiAgICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdoNXAtZHEtaGlnaGxpZ2h0LWR6Jyk7XG4gICAgICB9XG4gICAgICBzZXREcm9wRWZmZWN0KGV2ZW50LmRhdGEpO1xuICAgIH0pO1xuICAgIGRyYWdnYWJsZS5vbignZHJhZ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChoaWdobGlnaHREcm9wWm9uZXMpIHtcbiAgICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdoNXAtZHEtaGlnaGxpZ2h0LWR6Jyk7XG4gICAgICB9XG4gICAgICBzZXREcm9wRWZmZWN0KCdub25lJyk7XG4gICAgfSk7XG4gICAgZHJhZ2dhYmxlLm9uKCdpbnRlcmFjdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5hbnN3ZXJlZCA9IHRydWU7XG4gICAgICBzZWxmLnRyaWdnZXJYQVBJKCdpbnRlcmFjdGVkJyk7XG4gICAgfSk7XG4gICAgZHJhZ2dhYmxlLm9uKCdsZWF2aW5nRHJvcFpvbmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHNlbGYuZHJvcFpvbmVzW2V2ZW50LmRhdGEuZHJvcFpvbmVdLnJlbW92ZUFsaWduYWJsZShldmVudC5kYXRhLiQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kcmFnZ2FibGVzW2ldID0gZHJhZ2dhYmxlO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IGVsZW1lbnQuZHJvcFpvbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBkcm9wWm9uZXNXaXRob3V0RWxlbWVudHNbZWxlbWVudC5kcm9wWm9uZXNbal1dID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gQ3JlYXRlIGEgY291bnQgdG8gc3VidHJhY2sgZnJvbSBzY29yZVxuICB0aGlzLm51bURyb3Bab25lc1dpdGhvdXRFbGVtZW50cyA9IDA7XG5cbiAgdmFyIGRyb3B6b25lbDEwbiA9IHtcbiAgICBwcmVmaXg6IHNlbGYub3B0aW9ucy5kcm9wem9uZVByZWZpeC5yZXBsYWNlKCd7dG90YWx9JywgdGFzay5kcm9wWm9uZXMubGVuZ3RoKSxcbiAgICB0aXBMYWJlbDogc2VsZi5vcHRpb25zLnRpcExhYmVsLFxuICAgIHRpcEF2YWlsYWJsZTogc2VsZi5vcHRpb25zLnRpcEF2YWlsYWJsZVxuICB9O1xuXG4gIC8vIEFkZCBkcm9wIHpvbmVzXG4gIGZvciAoaSA9IDA7IGkgPCB0YXNrLmRyb3Bab25lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkcm9wWm9uZSA9IHRhc2suZHJvcFpvbmVzW2ldO1xuXG4gICAgaWYgKGRyb3Bab25lc1dpdGhvdXRFbGVtZW50c1tpXSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5udW1Ecm9wWm9uZXNXaXRob3V0RWxlbWVudHMgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ibGFua0lzQ29ycmVjdCAmJiBkcm9wWm9uZS5jb3JyZWN0RWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmJsYW5rSXNDb3JyZWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZHJvcFpvbmUuYXV0b0FsaWduID0ge1xuICAgICAgZW5hYmxlZDogZHJvcFpvbmUuYXV0b0FsaWduLFxuICAgICAgc3BhY2luZzogc2VsZi5vcHRpb25zLmJlaGF2aW91ci5hdXRvQWxpZ25TcGFjaW5nLFxuICAgICAgc2l6ZTogc2VsZi5vcHRpb25zLnF1ZXN0aW9uLnNldHRpbmdzLnNpemVcbiAgICB9O1xuXG4gICAgdGhpcy5kcm9wWm9uZXNbaV0gPSBuZXcgRHJvcFpvbmUoZHJvcFpvbmUsIGksIGRyb3B6b25lbDEwbik7XG5cbiAgICAvLyBVcGRhdGUgZWxlbWVudCBpbnRlcm5hbCBwb3NpdGlvbiB3aGVuIGFsaWduZWRcbiAgICB0aGlzLmRyb3Bab25lc1tpXS5vbignZWxlbWVudGFsaWduZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGxldCAkYWxpZ25lZCA9IGV2ZW50LmRhdGE7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZi5kcmFnZ2FibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkcmFnZ2FibGUgPSBzZWxmLmRyYWdnYWJsZXNbaV07XG4gICAgICAgIGlmICghZHJhZ2dhYmxlIHx8ICFkcmFnZ2FibGUuZWxlbWVudHMgfHwgIWRyYWdnYWJsZS5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZHJhZ2dhYmxlLmVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBkcmFnZ2FibGUuZWxlbWVudHNbal07XG4gICAgICAgICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQuJFswXSAhPT0gJGFsaWduZWRbMF0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFVwZGF0ZSBwb3NpdGlvblxuICAgICAgICAgIGVsZW1lbnQucG9zaXRpb24gPSBEcmFnVXRpbHMucG9zaXRpb25Ub1BlcmNlbnRhZ2Uoc2VsZi4kY29udGFpbmVyLCBlbGVtZW50LiQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5vbigncmVzaXplJywgc2VsZi5yZXNpemUsIHNlbGYpO1xuICB0aGlzLm9uKCdkb21DaGFuZ2VkJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoc2VsZi5jb250ZW50SWQgPT09IGV2ZW50LmRhdGEuY29udGVudElkKSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5vbignZW50ZXJGdWxsU2NyZWVuJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLiRjb250YWluZXIpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5wYXJlbnRzKCcuaDVwLWNvbnRlbnQnKS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICBzZWxmLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy5vbignZXhpdEZ1bGxTY3JlZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYuJGNvbnRhaW5lcikge1xuICAgICAgc2VsZi4kY29udGFpbmVyLnBhcmVudHMoJy5oNXAtY29udGVudCcpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcbiAgICAgIHNlbGYudHJpZ2dlcigncmVzaXplJyk7XG4gICAgfVxuICB9KTtcbn1cblxuQy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEg1UC5RdWVzdGlvbi5wcm90b3R5cGUpO1xuQy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDO1xuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGlzIHF1ZXN0aW9uIHR5cGUncyBET00gZWxlbWVudHMgYmVmb3JlIHRoZXkgYXJlIGF0dGFjaGVkLlxuICogQ2FsbGVkIGZyb20gSDVQLlF1ZXN0aW9uLlxuICovXG5DLnByb3RvdHlwZS5yZWdpc3RlckRvbUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gUmVnaXN0ZXIgaW50cm9kdWN0aW9uIHNlY3Rpb25cbiAgaWYgKHNlbGYub3B0aW9ucy5iZWhhdmlvdXIuc2hvd1RpdGxlKSB7XG4gICAgc2VsZi4kaW50cm9kdWN0aW9uID0gJCgnPHAgY2xhc3M9XCJoNXAtZHJhZ3F1ZXN0aW9uLWludHJvZHVjdGlvblwiIGlkPVwiZHEtaW50cm8tJyArIG51bUluc3RhbmNlcyArICdcIj4nICsgc2VsZi5vcHRpb25zLnF1ZXN0aW9uLnNldHRpbmdzLnF1ZXN0aW9uVGl0bGUgKyAnPC9wPicpO1xuICAgIHNlbGYuc2V0SW50cm9kdWN0aW9uKHNlbGYuJGludHJvZHVjdGlvbik7XG4gIH1cblxuXG4gIC8vIFNldCBjbGFzcyBpZiBubyBiYWNrZ3JvdW5kXG4gIHZhciBjbGFzc2VzID0gJyc7XG4gIGlmICh0aGlzLm9wdGlvbnMucXVlc3Rpb24uc2V0dGluZ3MuYmFja2dyb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2xhc3NlcyArPSAnaDVwLWRyYWdxdWVzdGlvbi1oYXMtbm8tYmFja2dyb3VuZCc7XG4gIH1cbiAgaWYgKHNlbGYub3B0aW9ucy5iZWhhdmlvdXIuZHJvcFpvbmVIaWdobGlnaHRpbmcgPT09ICdhbHdheXMnICkge1xuICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICBjbGFzc2VzICs9ICcgJztcbiAgICB9XG4gICAgY2xhc3NlcyArPSAnaDVwLWRxLWhpZ2hsaWdodC1kei1hbHdheXMnO1xuICB9XG5cbiAgLy8gUmVnaXN0ZXIgdGFzayBjb250ZW50IGFyZWFcbiAgc2VsZi5zZXRDb250ZW50KHNlbGYuY3JlYXRlUXVlc3Rpb25Db250ZW50KCksIHtcbiAgICAnY2xhc3MnOiBjbGFzc2VzXG4gIH0pO1xuXG4gIC8vIEZpcnN0IHdlIGNoZWNrIGlmIGZ1bGwgc2NyZWVuIGlzIHN1cHBvcnRlZFxuICBpZiAoSDVQLmNhbkhhc0Z1bGxTY3JlZW4gIT09IGZhbHNlICYmIHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuZW5hYmxlRnVsbFNjcmVlbikge1xuXG4gICAgLy8gV2UgY3JlYXRlIGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGVudGVyIG9yXG4gICAgLy8gZXhpdCBmdWxsIHNjcmVlbiB3aGVuIG91ciBidXR0b24gaXMgcHJlc3NlZFxuICAgIHZhciB0b2dnbGVGdWxsU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKEg1UC5pc0Z1bGxzY3JlZW4pIHtcbiAgICAgICAgSDVQLmV4aXRGdWxsU2NyZWVuKHNlbGYuJGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgSDVQLmZ1bGxTY3JlZW4oc2VsZi4kY29udGFpbmVyLnBhcmVudCgpLnBhcmVudCgpLCBzZWxmKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ3JlYXRlIGZ1bGwgc2NyZWVuIGJ1dHRvblxuICAgIHZhciAkZnVsbFNjcmVlbkJ1dHRvbiA9ICQoJzxkaXYvPicsIHtcbiAgICAgICdjbGFzcyc6ICdoNXAtbXktZnVsbHNjcmVlbi1idXR0b24tZW50ZXInLFxuICAgICAgdGl0bGU6IHRoaXMub3B0aW9ucy5sb2NhbGl6ZS5mdWxsc2NyZWVuLFxuICAgICAgcm9sZTogJ2J1dHRvbicsXG4gICAgICB0YWJpbmRleDogMCxcbiAgICAgIG9uOiB7XG4gICAgICAgIGNsaWNrOiB0b2dnbGVGdWxsU2NyZWVuLFxuICAgICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxMyB8fCBldmVudC53aGljaCA9PT0gMzIpIHtcbiAgICAgICAgICAgIHRvZ2dsZUZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJlcGVuZFRvOiB0aGlzLiRjb250YWluZXIucGFyZW50KClcbiAgICB9KTtcblxuICAgIC8vIFJlc3BvbmQgdG8gZW50ZXIgZnVsbCBzY3JlZW4gZXZlbnRcbiAgICB0aGlzLm9uKCdlbnRlckZ1bGxTY3JlZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkZnVsbFNjcmVlbkJ1dHRvbi5hdHRyKCdjbGFzcycsICdoNXAtbXktZnVsbHNjcmVlbi1idXR0b24tZXhpdCcpO1xuICAgICAgJGZ1bGxTY3JlZW5CdXR0b24uYXR0cigndGl0bGUnLCB0aGlzLm9wdGlvbnMubG9jYWxpemUuZXhpdEZ1bGxzY3JlZW4pO1xuICAgIH0pO1xuXG4gICAgLy8gUmVzcG9uZCB0byBleGl0IGZ1bGwgc2NyZWVuIGV2ZW50XG4gICAgdGhpcy5vbignZXhpdEZ1bGxTY3JlZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkZnVsbFNjcmVlbkJ1dHRvbi5hdHRyKCdjbGFzcycsICdoNXAtbXktZnVsbHNjcmVlbi1idXR0b24tZW50ZXInKTtcbiAgICAgICRmdWxsU2NyZWVuQnV0dG9uLmF0dHIoJ3RpdGxlJywgdGhpcy5vcHRpb25zLmxvY2FsaXplLmZ1bGxzY3JlZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gLi4uIGFuZCBidXR0b25zXG4gIHNlbGYucmVnaXN0ZXJCdXR0b25zKCk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi50cmlnZ2VyKCdyZXNpemUnKTtcbiAgfSwgMjAwKTtcbn07XG5cbi8qKlxuICogR2V0IHhBUEkgZGF0YS5cbiAqIENvbnRyYWN0IHVzZWQgYnkgcmVwb3J0IHJlbmRlcmluZyBlbmdpbmUuXG4gKlxuICogQHNlZSBjb250cmFjdCBhdCB7QGxpbmsgaHR0cHM6Ly9oNXAub3JnL2RvY3VtZW50YXRpb24vZGV2ZWxvcGVycy9jb250cmFjdHMjZ3VpZGVzLWhlYWRlci02fVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0geEFQSSBkYXRhXG4gKi9cbkMucHJvdG90eXBlLmdldFhBUElEYXRhID0gZnVuY3Rpb24gKCkge1xuICB2YXIgeEFQSUV2ZW50ID0gdGhpcy5jcmVhdGVYQVBJRXZlbnRUZW1wbGF0ZSgnYW5zd2VyZWQnKTtcbiAgdGhpcy5hZGRRdWVzdGlvblRvWEFQSSh4QVBJRXZlbnQpO1xuICB0aGlzLmFkZFJlc3BvbnNlVG9YQVBJKHhBUElFdmVudCk7XG4gIHJldHVybiB7XG4gICAgc3RhdGVtZW50OiB4QVBJRXZlbnQuZGF0YS5zdGF0ZW1lbnRcbiAgfTtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBxdWVzdGlvbiBpdHNlbHQgdG8gdGhlIGRlZmluaXRpb24gcGFydCBvZiBhbiB4QVBJRXZlbnRcbiAqL1xuQy5wcm90b3R5cGUuYWRkUXVlc3Rpb25Ub1hBUEkgPSBmdW5jdGlvbih4QVBJRXZlbnQpIHtcbiAgdmFyIGRlZmluaXRpb24gPSB4QVBJRXZlbnQuZ2V0VmVyaWZpZWRTdGF0ZW1lbnRWYWx1ZShbJ29iamVjdCcsICdkZWZpbml0aW9uJ10pO1xuICAkLmV4dGVuZChkZWZpbml0aW9uLCB0aGlzLmdldFhBUElEZWZpbml0aW9uKCkpO1xufTtcblxuLyoqXG4gKiBHZXQgb2JqZWN0IGRlZmluaXRpb24gZm9yIHhBUEkgc3RhdGVtZW50LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0geEFQSSBvYmplY3QgZGVmaW5pdGlvblxuICovXG5DLnByb3RvdHlwZS5nZXRYQVBJRGVmaW5pdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRlZmluaXRpb24gPSB7fTtcbiAgZGVmaW5pdGlvbi5kZXNjcmlwdGlvbiA9IHtcbiAgICAvLyBSZW1vdmUgdGFncywgbXVzdCB3cmFwIGluIGRpdiB0YWcgYmVjYXVzZSBqUXVlcnkgMS45IHdpbGwgY3Jhc2ggaWYgdGhlIHN0cmluZyBpc24ndCB3cmFwcGVkIGluIGEgdGFnLlxuICAgICdlbi1VUyc6ICQoJzxkaXY+JyArIHRoaXMub3B0aW9ucy5xdWVzdGlvbi5zZXR0aW5ncy5xdWVzdGlvblRpdGxlICsgJzwvZGl2PicpLnRleHQoKVxuICB9O1xuICBkZWZpbml0aW9uLnR5cGUgPSAnaHR0cDovL2FkbG5ldC5nb3YvZXhwYXBpL2FjdGl2aXRpZXMvY21pLmludGVyYWN0aW9uJztcbiAgZGVmaW5pdGlvbi5pbnRlcmFjdGlvblR5cGUgPSAnbWF0Y2hpbmcnO1xuXG4gIC8vIEFkZCBzb3VyY2VzLCBpLmUuIGRyYWdnYWJsZXNcbiAgZGVmaW5pdGlvbi5zb3VyY2UgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMucXVlc3Rpb24udGFzay5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbCA9IHRoaXMub3B0aW9ucy5xdWVzdGlvbi50YXNrLmVsZW1lbnRzW2ldO1xuICAgIGlmIChlbC5kcm9wWm9uZXMgJiYgZWwuZHJvcFpvbmVzLmxlbmd0aCkge1xuICAgICAgdmFyIGRlc2MgPSBlbC50eXBlLnBhcmFtcy5hbHQgPyBlbC50eXBlLnBhcmFtcy5hbHQgOiBlbC50eXBlLnBhcmFtcy50ZXh0O1xuXG4gICAgICBkZWZpbml0aW9uLnNvdXJjZS5wdXNoKHtcbiAgICAgICAgJ2lkJzogJycgKyBpLFxuICAgICAgICAnZGVzY3JpcHRpb24nOiB7XG4gICAgICAgICAgLy8gUmVtb3ZlIHRhZ3MsIG11c3Qgd3JhcCBpbiBkaXYgdGFnIGJlY2F1c2UgalF1ZXJ5IDEuOSB3aWxsIGNyYXNoIGlmIHRoZSBzdHJpbmcgaXNuJ3Qgd3JhcHBlZCBpbiBhIHRhZy5cbiAgICAgICAgICAnZW4tVVMnOiAkKCc8ZGl2PicgKyBkZXNjICsgJzwvZGl2PicpLnRleHQoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgdGFyZ2V0cywgaS5lLiBkcm9wIHpvbmVzLCBhbmQgdGhlIGNvcnJlY3QgcmVzcG9uc2UgcGF0dGVybi5cbiAgZGVmaW5pdGlvbi5jb3JyZWN0UmVzcG9uc2VzUGF0dGVybiA9IFsnJ107XG4gIGRlZmluaXRpb24udGFyZ2V0ID0gW107XG4gIHZhciBmaXJzdENvcnJlY3RQYWlyID0gdHJ1ZTtcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5xdWVzdGlvbi50YXNrLmRyb3Bab25lcy5sZW5ndGg7IGkrKykge1xuICAgIGRlZmluaXRpb24udGFyZ2V0LnB1c2goe1xuICAgICAgJ2lkJzogJycgKyBpLFxuICAgICAgJ2Rlc2NyaXB0aW9uJzoge1xuICAgICAgICAvLyBSZW1vdmUgdGFncywgbXVzdCB3cmFwIGluIGRpdiB0YWcgYmVjYXVzZSBqUXVlcnkgMS45IHdpbGwgY3Jhc2ggaWYgdGhlIHN0cmluZyBpc24ndCB3cmFwcGVkIGluIGEgdGFnLlxuICAgICAgICAnZW4tVVMnOiAkKCc8ZGl2PicgKyB0aGlzLm9wdGlvbnMucXVlc3Rpb24udGFzay5kcm9wWm9uZXNbaV0ubGFiZWwgKyAnPC9kaXY+JykudGV4dCgpXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5xdWVzdGlvbi50YXNrLmRyb3Bab25lc1tpXS5jb3JyZWN0RWxlbWVudHMpIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5vcHRpb25zLnF1ZXN0aW9uLnRhc2suZHJvcFpvbmVzW2ldLmNvcnJlY3RFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAvKipcbiAgICAgICAgICogTk9URTogVGhlIGVkaXRvciBhbGxvd3MgeW91IHRvIHR1cm4gYSBkcmFnZ2FibGUgdGhhdCB3YXMgY29ycmVjdFxuICAgICAgICAgKiBpbiBhIGRyb3B6b25lIGludG8gYSBub24tZHJhZ2dhYmxlLCBidXQgbGVhdmVzIHRoZSBub24tZHJhZ2dhYmxlXG4gICAgICAgICAqIGFzc29jaWF0ZWQgd2l0aCB0aGUgZHJvcHpvbmUgaWYgaXQgd2FzIHByZXZpb3VzbHkgbWFya2VkIGFzIGNvcnJlY3RcbiAgICAgICAgICogd2l0aGluIHRoYXQgZHJvcHpvbmUuXG4gICAgICAgICAqIEJlY2F1c2Ugb2YgdGhpcyB3ZSBoYXZlIHRvIGNoZWNrIGlmIHRoZSBkcmFnZ2FibGUgdGhhdCBpcyBtYXJrZWRcbiAgICAgICAgICogYXMgY29ycmVjdCB3aXRoaW4gdGhpcyBkcm9wem9uZSBjYW4gYWN0dWFsbHkgYmUgZHJvcHBlZCBvbiB0aGlzXG4gICAgICAgICAqIGRyb3B6b25lIGluIHRoZSBkcmFnZ2FibGUncyBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdGFzayA9IHRoaXMub3B0aW9ucy5xdWVzdGlvbi50YXNrO1xuICAgICAgICBjb25zdCBkcmFnZ2FibGUgPSB0YXNrLmVsZW1lbnRzW3Rhc2suZHJvcFpvbmVzW2ldLmNvcnJlY3RFbGVtZW50c1tqXV07XG4gICAgICAgIGlmICghZHJhZ2dhYmxlIHx8IGRyYWdnYWJsZS5kcm9wWm9uZXMuaW5kZXhPZihpLnRvU3RyaW5nKCkpIDwgMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaXJzdENvcnJlY3RQYWlyKSB7XG4gICAgICAgICAgZGVmaW5pdGlvbi5jb3JyZWN0UmVzcG9uc2VzUGF0dGVyblswXSArPSAnWyxdJztcbiAgICAgICAgfVxuICAgICAgICBkZWZpbml0aW9uLmNvcnJlY3RSZXNwb25zZXNQYXR0ZXJuWzBdICs9IGkgKyAnWy5dJyArIHRhc2suZHJvcFpvbmVzW2ldLmNvcnJlY3RFbGVtZW50c1tqXTtcbiAgICAgICAgZmlyc3RDb3JyZWN0UGFpciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWZpbml0aW9uO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIHJlc3BvbnNlIHBhcnQgdG8gYW4geEFQSSBldmVudFxuICpcbiAqIEBwYXJhbSB7SDVQLlhBUElFdmVudH0geEFQSUV2ZW50XG4gKiAgVGhlIHhBUEkgZXZlbnQgd2Ugd2lsbCBhZGQgYSByZXNwb25zZSB0b1xuICovXG5DLnByb3RvdHlwZS5hZGRSZXNwb25zZVRvWEFQSSA9IGZ1bmN0aW9uKHhBUElFdmVudCkge1xuICB2YXIgbWF4U2NvcmUgPSB0aGlzLmdldE1heFNjb3JlKCk7XG4gIHZhciBzY29yZSA9IHRoaXMuZ2V0U2NvcmUoKTtcbiAgdmFyIHN1Y2Nlc3MgPSBzY29yZSA9PSBtYXhTY29yZSA/IHRydWUgOiBmYWxzZTtcbiAgeEFQSUV2ZW50LnNldFNjb3JlZFJlc3VsdChzY29yZSwgbWF4U2NvcmUsIHRoaXMsIHRydWUsIHN1Y2Nlc3MpO1xuICB4QVBJRXZlbnQuZGF0YS5zdGF0ZW1lbnQucmVzdWx0LnJlc3BvbnNlID0gdGhpcy5nZXRVc2VyWEFQSVJlc3BvbnNlKCk7XG59O1xuXG4vKipcbiAqIEdldCB3aGF0IHRoZSB1c2VyIGhhcyBhbnN3ZXJlZCBlbmNvZGVkIGFzIGFuIHhBUEkgcmVzcG9uc2UgcGF0dGVyblxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30geEFQSSBlbmNvZGVkIHVzZXIgcmVzcG9uc2UgcGF0dGVyblxuICovXG5DLnByb3RvdHlwZS5nZXRVc2VyWEFQSVJlc3BvbnNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYW5zd2VycyA9IHRoaXMuZ2V0VXNlckFuc3dlcnMoKTtcbiAgaWYgKCFhbnN3ZXJzKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGFuc3dlcnNcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIChhbnN3ZXJNYXBwaW5nKSB7XG4gICAgICByZXR1cm4gYW5zd2VyTWFwcGluZy5lbGVtZW50cy5sZW5ndGg7XG4gICAgfSlcbiAgICAubWFwKGZ1bmN0aW9uIChhbnN3ZXJNYXBwaW5nKSB7XG4gICAgICByZXR1cm4gYW5zd2VyTWFwcGluZy5lbGVtZW50c1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJvcFpvbmUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQuZHJvcFpvbmUgKyAnWy5dJyArIGFuc3dlck1hcHBpbmcuaW5kZXg7XG4gICAgICAgIH0pLmpvaW4oJ1ssXScpO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgcmV0dXJuIHBhdHRlcm4gIT09IHVuZGVmaW5lZCAmJiBwYXR0ZXJuICE9PSAnJztcbiAgICB9KS5qb2luKCdbLF0nKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB1c2VyIGFuc3dlcnNcbiAqL1xuQy5wcm90b3R5cGUuZ2V0VXNlckFuc3dlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmRyYWdnYWJsZXMubWFwKGZ1bmN0aW9uIChkcmFnZ2FibGUsIGluZGV4KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIGRyYWdnYWJsZTogZHJhZ2dhYmxlXG4gICAgfTtcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uIChkcmFnZ2FibGVNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGRyYWdnYWJsZU1hcHBpbmcuZHJhZ2dhYmxlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGRyYWdnYWJsZU1hcHBpbmcuZHJhZ2dhYmxlLmVsZW1lbnRzO1xuICB9KS5tYXAoZnVuY3Rpb24gKGRyYWdnYWJsZU1hcHBpbmcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IGRyYWdnYWJsZU1hcHBpbmcuaW5kZXgsXG4gICAgICBlbGVtZW50czogZHJhZ2dhYmxlTWFwcGluZy5kcmFnZ2FibGUuZWxlbWVudHNcbiAgICB9O1xuICB9KTtcbn07XG5cbi8qKlxuICogQXBwZW5kIGZpZWxkIHRvIHdyYXBwZXIuXG4gKi9cbkMucHJvdG90eXBlLmNyZWF0ZVF1ZXN0aW9uQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGk7XG4gIC8vIElmIHJlYXR0YWNoaW5nLCB3ZSBubyBsb25nZXIgc2hvdyBzb2x1dGlvbi4gU28gZm9yZ2V0IHRoYXQgd2VcbiAgLy8gbWlnaHQgaGF2ZSBkb25lIHNvIGJlZm9yZS5cblxuICB0aGlzLiRjb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwiaDVwLWlubmVyXCIgcm9sZT1cImFwcGxpY2F0aW9uXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZHEtaW50cm8tJyArIG51bUluc3RhbmNlcyArICdcIj48L2Rpdj4nKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5xdWVzdGlvbi5zZXR0aW5ncy5iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLiRjb250YWluZXIuY3NzKCdiYWNrZ3JvdW5kSW1hZ2UnLCAndXJsKFwiJyArIEg1UC5nZXRQYXRoKHRoaXMub3B0aW9ucy5xdWVzdGlvbi5zZXR0aW5ncy5iYWNrZ3JvdW5kLnBhdGgsIHRoaXMuaWQpICsgJ1wiKScpO1xuICB9XG5cbiAgdmFyIHRhc2sgPSB0aGlzLm9wdGlvbnMucXVlc3Rpb24udGFzaztcblxuICAvLyBBZGQgZWxlbWVudHMgKHN0YXRpYyBhbmQgZHJhZ2dhYmxlKVxuICBmb3IgKGkgPSAwOyBpIDwgdGFzay5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gdGFzay5lbGVtZW50c1tpXTtcblxuICAgIGlmIChlbGVtZW50LmRyb3Bab25lcyAhPT0gdW5kZWZpbmVkICYmIGVsZW1lbnQuZHJvcFpvbmVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgLy8gQXR0YWNoIGRyYWdnYWJsZSBlbGVtZW50c1xuICAgICAgdGhpcy5kcmFnZ2FibGVzW2ldLmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lciwgdGhpcy5pZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gQWRkIHN0YXRpYyBlbGVtZW50XG4gICAgICB2YXIgJGVsZW1lbnQgPSB0aGlzLmFkZEVsZW1lbnQoZWxlbWVudCwgJ3N0YXRpYycsIGkpO1xuICAgICAgSDVQLm5ld1J1bm5hYmxlKGVsZW1lbnQudHlwZSwgdGhpcy5pZCwgJGVsZW1lbnQpO1xuICAgICAgdmFyIHRpbWVkT3V0T3BhY2l0eSA9IGZ1bmN0aW9uICgkZWwsIGVsKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIERyYWdVdGlscy5zZXRPcGFjaXR5KCRlbCwgJ2JhY2tncm91bmQnLCBlbC5iYWNrZ3JvdW5kT3BhY2l0eSk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfTtcbiAgICAgIHRpbWVkT3V0T3BhY2l0eSgkZWxlbWVudCwgZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQXR0YWNoIGludmlzaWJsZSAncmVzZXQnIGRyb3Agem9uZSBmb3Iga2V5Ym9hcmQgdXNlcnNcbiAgdGhpcy4kbm9Ecm9wWm9uZS5hcHBlbmRUbyh0aGlzLiRjb250YWluZXIpO1xuXG4gIC8vIEF0dGFjaCBkcm9wIHpvbmVzXG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRyb3Bab25lcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuZHJvcFpvbmVzW2ldLmFwcGVuZFRvKHRoaXMuJGNvbnRhaW5lciwgdGhpcy5kcmFnZ2FibGVzKTtcbiAgfVxuICByZXR1cm4gdGhpcy4kY29udGFpbmVyO1xufTtcblxuQy5wcm90b3R5cGUucmVnaXN0ZXJCdXR0b25zID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5vcHRpb25zLmJlaGF2aW91ci5lbmFibGVDaGVja0J1dHRvbikge1xuICAgIC8vIEFkZCBzaG93IHNjb3JlIGJ1dHRvblxuICAgIHRoaXMuYWRkU29sdXRpb25CdXR0b24oKTtcbiAgfVxuXG4gIHRoaXMuYWRkUmV0cnlCdXR0b24oKTtcbn07XG5cbi8qKlxuICogQWRkIHNvbHV0aW9uIGJ1dHRvbiB0byBvdXIgY29udGFpbmVyLlxuICovXG5DLnByb3RvdHlwZS5hZGRTb2x1dGlvbkJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gIHRoaXMuYWRkQnV0dG9uKCdjaGVjay1hbnN3ZXInLCB0aGlzLm9wdGlvbnMuc2NvcmVTaG93LCBmdW5jdGlvbiAoKSB7XG4gICAgdGhhdC5hbnN3ZXJlZCA9IHRydWU7XG4gICAgdGhhdC5zaG93QWxsU29sdXRpb25zKCk7XG4gICAgdGhhdC5zaG93U2NvcmUoKTtcbiAgICB0aGF0LmFkZEV4cGxhbmF0aW9uKCk7XG4gICAgdmFyIHhBUElFdmVudCA9IHRoYXQuY3JlYXRlWEFQSUV2ZW50VGVtcGxhdGUoJ2Fuc3dlcmVkJyk7XG4gICAgdGhhdC5hZGRRdWVzdGlvblRvWEFQSSh4QVBJRXZlbnQpO1xuICAgIHRoYXQuYWRkUmVzcG9uc2VUb1hBUEkoeEFQSUV2ZW50KTtcbiAgICB0aGF0LnRyaWdnZXIoeEFQSUV2ZW50KTtcblxuICAgIC8vIEZvY3VzIHRvcCBvZiB0YXNrIGZvciBiZXR0ZXIgZm9jdXMgYW5kIHJlYWQtc3BlYWtlciBmbG93XG4gICAgdmFyICRuZXh0Rm9jdXMgPSB0aGF0LiRpbnRyb2R1Y3Rpb24gPyB0aGF0LiRpbnRyb2R1Y3Rpb24gOiB0aGF0LiRjb250YWluZXIuY2hpbGRyZW4oKS5maXJzdCgpO1xuICAgICRuZXh0Rm9jdXMuZm9jdXMoKTtcbiAgfSwgdHJ1ZSwge1xuICAgICdhcmlhLWxhYmVsJzogdGhpcy5vcHRpb25zLmExMXlDaGVjayxcbiAgfSwge1xuICAgIGNvbnRlbnREYXRhOiB0aGlzLmNvbnRlbnREYXRhLFxuICAgIHRleHRJZlN1Ym1pdHRpbmc6IHRoaXMub3B0aW9ucy5zdWJtaXQsXG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGQgZXhwbGFuYXRpb24vZmVlZGJhY2sgKHRoZSBwYXJ0IG9uIHRoZSBib3R0b20gcGFydClcbiAqL1xuQy5wcm90b3R5cGUuYWRkRXhwbGFuYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHRhc2sgPSB0aGlzLm9wdGlvbnMucXVlc3Rpb24udGFzaztcblxuICBsZXQgZXhwbGFuYXRpb25zID0gW107XG5cbiAgLy8gR28gdGhyb3VnaCBhbGwgZHJvcHpvbmVzLCBhbmQgZmluZCBhbnN3ZXJzOlxuICB0YXNrLmRyb3Bab25lcy5mb3JFYWNoKChkcm9wWm9uZSwgZHJvcFpvbmVJZCkgPT4ge1xuICAgIGNvbnN0IGZlZWRiYWNrID0ge1xuICAgICAgY29ycmVjdDogZHJvcFpvbmUudGlwc0FuZEZlZWRiYWNrLmZlZWRiYWNrT25Db3JyZWN0LFxuICAgICAgaW5jb3JyZWN0OiBkcm9wWm9uZS50aXBzQW5kRmVlZGJhY2suZmVlZGJhY2tPbkluY29ycmVjdFxuICAgIH07XG4gICAgLy8gRG9uJ3QgcnVuIHRoaXMgY29kZSBpZiBmZWVkYmFjayBpcyBub3QgY29uZmlndXJlZDtcbiAgICBpZiAoZmVlZGJhY2suY29ycmVjdCA9PT0gdW5kZWZpbmVkICYmIGZlZWRiYWNrLmluY29ycmVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW5kZXggZm9yIGNvcnJlY3QgZHJhZ2dhYmxlc1xuICAgIGNvbnN0IGNvcnJlY3RFbGVtZW50cyA9IGRyb3Bab25lLmNvcnJlY3RFbGVtZW50cztcblxuICAgIC8vIEZpbmQgYWxsIGRyYWdhYmxlcyBwbGFjZWQgb24gdGhpcyBkcm9wem9uZTpcbiAgICBsZXQgcGxhY2VkRHJhZ2dhYmxlcyA9IHt9O1xuICAgIHRoaXMuZHJhZ2dhYmxlcy5mb3JFYWNoKGRyYWdnYWJsZSA9PiB7XG4gICAgICBkcmFnZ2FibGUuZWxlbWVudHMuZm9yRWFjaChkeiA9PiB7XG4gICAgICAgIGlmIChkei5kcm9wWm9uZSA9PSBkcm9wWm9uZUlkKSB7XG4gICAgICAgICAgLy8gU2F2ZSByZWZlcmVuY2UgdG8gZHJhZ2dhYmxlLCBhbmQgbWFyayBpdCBhcyBjb3JyZWN0L2luY29ycmVjdFxuICAgICAgICAgIHBsYWNlZERyYWdnYWJsZXNbZHJhZ2dhYmxlLmlkXSA9IHtcbiAgICAgICAgICAgIGluc3RhbmNlOiBkcmFnZ2FibGUsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0RWxlbWVudHMuaW5kZXhPZihcIlwiICsgZHJhZ2dhYmxlLmlkKSAhPT0gLTFcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEdvIHRocm91Z2ggZWFjaCBwbGFjZWQgZHJhZ2dhYmxlXG4gICAgT2JqZWN0LmtleXMocGxhY2VkRHJhZ2dhYmxlcykuZm9yRWFjaChkcmFnZ2FibGVJZCA9PiB7XG4gICAgICBjb25zdCBkcmFnZ2FibGUgPSBwbGFjZWREcmFnZ2FibGVzW2RyYWdnYWJsZUlkXTtcbiAgICAgIGNvbnN0IGRyYWdnYWJsZUxhYmVsID0gRHJhZ1V0aWxzLnN0cmlwKGRyYWdnYWJsZS5pbnN0YW5jZS50eXBlLnBhcmFtcy5hbHQgfHwgZHJhZ2dhYmxlLmluc3RhbmNlLnR5cGUucGFyYW1zLnRleHQpIHx8ICc/JztcbiAgICAgIGNvbnN0IGRyb3Bab25lTGFiZWwgPSBEcmFnVXRpbHMuc3RyaXAoZHJvcFpvbmUubGFiZWwpO1xuXG4gICAgICBpZiAoZHJhZ2dhYmxlLmNvcnJlY3QgJiYgZmVlZGJhY2suY29ycmVjdCkge1xuICAgICAgICBleHBsYW5hdGlvbnMucHVzaCh7XG4gICAgICAgICAgY29ycmVjdDogZHJvcFpvbmVMYWJlbCArICcgKyAnICsgZHJhZ2dhYmxlTGFiZWwsXG4gICAgICAgICAgdGV4dDogZmVlZGJhY2suY29ycmVjdFxuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGUuaW5zdGFuY2Uuc2V0RmVlZGJhY2soZmVlZGJhY2suY29ycmVjdCwgZHJvcFpvbmVJZCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghZHJhZ2dhYmxlLmNvcnJlY3QgJiYgZmVlZGJhY2suaW5jb3JyZWN0KSB7XG4gICAgICAgIGV4cGxhbmF0aW9ucy5wdXNoKHtcbiAgICAgICAgICBjb3JyZWN0OiBkcm9wWm9uZUxhYmVsICsgJyArICcsXG4gICAgICAgICAgd3Jvbmc6IGRyYWdnYWJsZUxhYmVsLFxuICAgICAgICAgIHRleHQ6IGZlZWRiYWNrLmluY29ycmVjdFxuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGUuaW5zdGFuY2Uuc2V0RmVlZGJhY2soZmVlZGJhY2suaW5jb3JyZWN0LCBkcm9wWm9uZUlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKGV4cGxhbmF0aW9ucy5sZW5ndGggIT09IDApIHtcbiAgICB0aGlzLnNldEV4cGxhbmF0aW9uKGV4cGxhbmF0aW9ucywgdGhpcy5vcHRpb25zLmZlZWRiYWNrSGVhZGVyKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBZGQgcmV0cnkgYnV0dG9uIHRvIG91ciBjb250YWluZXIuXG4gKi9cbkMucHJvdG90eXBlLmFkZFJldHJ5QnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgdGhpcy5hZGRCdXR0b24oJ3RyeS1hZ2FpbicsIHRoaXMub3B0aW9ucy50cnlBZ2FpbiwgZnVuY3Rpb24gKCkge1xuICAgIHRoYXQucmVzZXRUYXNrKCk7XG4gICAgdGhhdC5zaG93QnV0dG9uKCdjaGVjay1hbnN3ZXInKTtcbiAgICB0aGF0LmhpZGVCdXR0b24oJ3RyeS1hZ2FpbicpO1xuICB9LCBmYWxzZSwge1xuICAgICdhcmlhLWxhYmVsJzogdGhpcy5vcHRpb25zLmExMXlSZXRyeSxcbiAgfSk7XG59O1xuXG4vKipcbiAqIEFkZCBlbGVtZW50L2Ryb3Agem9uZSB0byB0YXNrLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBDbGFzc1xuICogQHBhcmFtIHtOdW1iZXJ9IGlkXG4gKiBAcmV0dXJucyB7alF1ZXJ5fVxuICovXG5DLnByb3RvdHlwZS5hZGRFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIGlkKSB7XG4gIHJldHVybiAkKCc8ZGl2IGNsYXNzPVwiaDVwLScgKyB0eXBlICsgJ1wiIHN0eWxlPVwibGVmdDonICsgZWxlbWVudC54ICsgJyU7dG9wOicgKyBlbGVtZW50LnkgKyAnJTt3aWR0aDonICsgZWxlbWVudC53aWR0aCArICdlbTtoZWlnaHQ6JyArIGVsZW1lbnQuaGVpZ2h0ICsgJ2VtXCI+PC9kaXY+JykuYXBwZW5kVG8odGhpcy4kY29udGFpbmVyKS5kYXRhKCdpZCcsIGlkKTtcbn07XG5cbi8qKlxuICogU2V0IGNvcnJlY3QgaGVpZ2h0IG9mIGNvbnRhaW5lclxuICovXG5DLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vIE1ha2Ugc3VyZSB3ZSB1c2UgYWxsIHRoZSBoZWlnaHQgd2UgY2FuIGdldC4gTmVlZGVkIHRvIHNjYWxlIHVwLlxuICBpZiAodGhpcy4kY29udGFpbmVyID09PSB1bmRlZmluZWQgfHwgIXRoaXMuJGNvbnRhaW5lci5pcygnOnZpc2libGUnKSkge1xuICAgIC8vIE5vdCB5ZXQgYXR0YWNoZWQgb3IgdmlzaWJsZSDigJMgbm90IHBvc3NpYmxlIHRvIHJlc2l6ZSBjb3JyZWN0bHlcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBVcGRhdGUgYmFja2dyb3VuZCBvcGFjaXR5IGZvciBkcm9wem9uZXMgKGluIGNhc2UgdGhleSB3ZXJlIG5vdCBwcmV2aW91c2x5XG4gIC8vIGFwcGVuZGVkKVxuICBzZWxmLmRyb3Bab25lcy5mb3JFYWNoKGZ1bmN0aW9uIChkcm9wem9uZSkge1xuICAgIGRyb3B6b25lLnVwZGF0ZUJhY2tncm91bmRPcGFjaXR5KCk7XG4gIH0pO1xuXG4gIC8vIENoZWNrIGlmIGRlY3JlYXNpbmcgaWZyYW1lIHNpemVcbiAgdmFyIGRlY3JlYXNlU2l6ZSA9IGUgJiYgZS5kYXRhICYmIGUuZGF0YS5kZWNyZWFzZVNpemU7XG4gIGlmICghZGVjcmVhc2VTaXplKSB7XG4gICAgc2VsZi4kY29udGFpbmVyLnBhcmVudHMoJy5oNXAtc3RhbmRhbG9uZS5oNXAtZHJhZ3F1ZXN0aW9uJykuY3NzKCd3aWR0aCcsICcnKTtcbiAgfVxuXG4gIHZhciBzaXplID0gdGhpcy5vcHRpb25zLnF1ZXN0aW9uLnNldHRpbmdzLnNpemU7XG4gIHZhciByYXRpbyA9IHNpemUud2lkdGggLyBzaXplLmhlaWdodDtcbiAgdmFyIHBhcmVudENvbnRhaW5lciA9IHRoaXMuJGNvbnRhaW5lci5wYXJlbnQoKTtcbiAgLy8gVXNlIHBhcmVudCBjb250YWluZXIgYXMgYmFzaXMgZm9yIHJlc2l6ZS5cbiAgdmFyIHdpZHRoID0gcGFyZW50Q29udGFpbmVyLndpZHRoKCkgLSBwYXJzZUZsb2F0KHBhcmVudENvbnRhaW5lci5jc3MoJ21hcmdpbi1sZWZ0JykpIC0gcGFyc2VGbG9hdChwYXJlbnRDb250YWluZXIuY3NzKCdtYXJnaW4tcmlnaHQnKSk7XG5cbiAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBhcHBseSBzZW1pIGZ1bGwgc2NyZWVuIGZpeC5cbiAgdmFyICRzZW1pRnVsbFNjcmVlbiA9IHNlbGYuJGNvbnRhaW5lci5wYXJlbnRzKCcuaDVwLXN0YW5kYWxvbmUuaDVwLWRyYWdxdWVzdGlvbi5oNXAtc2VtaS1mdWxsc2NyZWVuJyk7XG4gIGlmICgkc2VtaUZ1bGxTY3JlZW4ubGVuZ3RoKSB7XG4gICAgLy8gUmVzZXQgc2VtaSBmdWxsc2NyZWVuIHdpZHRoXG4gICAgJHNlbWlGdWxsU2NyZWVuLmNzcygnd2lkdGgnLCAnJyk7XG5cbiAgICAvLyBEZWNyZWFzZSBpZnJhbWUgc2l6ZVxuICAgIGlmICghZGVjcmVhc2VTaXplKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIuY3NzKCd3aWR0aCcsICcxMHB4Jyk7XG4gICAgICAkc2VtaUZ1bGxTY3JlZW4uY3NzKCd3aWR0aCcsICcnKTtcblxuICAgICAgLy8gVHJpZ2dlciBjaGFuZ2VzXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXNpemUnLCB7ZGVjcmVhc2VTaXplOiB0cnVlfSk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cblxuICAgIC8vIFNldCB3aWR0aCBlcXVhbCB0byBpZnJhbWUgcGFyZW50IHdpZHRoLCBzaW5jZSBpZnJhbWUgY29udGVudCBoYXMgbm90IGJlZW4gdXBkYXRlIHlldC5cbiAgICB2YXIgJGlmcmFtZSA9ICQod2luZG93LmZyYW1lRWxlbWVudCk7XG4gICAgaWYgKCRpZnJhbWUpIHtcbiAgICAgIHZhciAkaWZyYW1lUGFyZW50ID0gJGlmcmFtZS5wYXJlbnQoKTtcbiAgICAgIHdpZHRoID0gJGlmcmFtZVBhcmVudC53aWR0aCgpO1xuICAgICAgJHNlbWlGdWxsU2NyZWVuLmNzcygnd2lkdGgnLCB3aWR0aCArICdweCcpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBoZWlnaHQgPSB3aWR0aCAvIHJhdGlvO1xuXG4gIC8vIFNldCBuYXR1cmFsIHNpemUgaWYgbm8gcGFyZW50IHdpZHRoXG4gIGlmICh3aWR0aCA8PSAwKSB7XG4gICAgd2lkdGggPSBzaXplLndpZHRoO1xuICAgIGhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICB9XG5cbiAgdGhpcy4kY29udGFpbmVyLmNzcyh7XG4gICAgd2lkdGg6IHdpZHRoICsgJ3B4JyxcbiAgICBoZWlnaHQ6IGhlaWdodCArICdweCcsXG4gICAgZm9udFNpemU6ICgxNiAqICh3aWR0aCAvIHNpemUud2lkdGgpKSArICdweCdcbiAgfSk7XG59O1xuXG4vKipcbiAqIERpc2FibGVzIGFsbCBkcmFnZ2FibGVzLlxuICogQHB1YmxpY1xuICovXG5DLnByb3RvdHlwZS5kaXNhYmxlRHJhZ2dhYmxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5kcmFnZ2FibGVzLmZvckVhY2goZnVuY3Rpb24gKGRyYWdnYWJsZSkge1xuICAgIGRyYWdnYWJsZS5kaXNhYmxlKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBFbmFibGVzIGFsbCBkcmFnZ2FibGVzLlxuICogQHB1YmxpY1xuICovXG5DLnByb3RvdHlwZS5lbmFibGVEcmFnZ2FibGVzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmRyYWdnYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAoZHJhZ2dhYmxlKSB7XG4gICAgZHJhZ2dhYmxlLmVuYWJsZSgpO1xuICB9KTtcbn07XG5cbi8qKlxuICogU2hvd3MgdGhlIGNvcnJlY3Qgc29sdXRpb25zIG9uIHRoZSBib3hlcyBhbmQgZGlzYWJsZXMgaW5wdXQgYW5kIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIHNldHRpbmdzLlxuICogQHB1YmxpY1xuICogQHBhcmFtcyB7Qm9vbGVhbn0gc2tpcFZpc3VhbHMgU2tpcCB2aXN1YWwgYW5pbWF0aW9ucy5cbiAqL1xuQy5wcm90b3R5cGUuc2hvd0FsbFNvbHV0aW9ucyA9IGZ1bmN0aW9uIChza2lwVmlzdWFscykge1xuICB0aGlzLnBvaW50cyA9IDA7XG4gIHRoaXMucmF3UG9pbnRzID0gMDtcblxuICAvLyBPbmUgY29ycmVjdCBwb2ludCBmb3IgZWFjaCBcIm5vIHNvbHV0aW9uXCIgZHJvcHpvbmUgaWYgdGhlcmUgYXJlIG5vIHNvbHV0aW9uc1xuICBpZiAodGhpcy5ibGFua0lzQ29ycmVjdCkge1xuICAgIHRoaXMucG9pbnRzID0gMTtcbiAgICB0aGlzLnJhd1BvaW50cyA9IDE7XG4gIH1cblxuICB2YXIgc2NvcmVQb2ludHM7XG4gIGlmICghc2tpcFZpc3VhbHMgJiYgdGhpcy5vcHRpb25zLmJlaGF2aW91ci5zaG93U2NvcmVQb2ludHMgJiYgIXRoaXMub3B0aW9ucy5iZWhhdmlvdXIuc2luZ2xlUG9pbnQgJiYgdGhpcy5vcHRpb25zLmJlaGF2aW91ci5hcHBseVBlbmFsdGllcykge1xuICAgIHNjb3JlUG9pbnRzID0gbmV3IEg1UC5RdWVzdGlvbi5TY29yZVBvaW50cygpO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdnYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHJhZ2dhYmxlID0gdGhpcy5kcmFnZ2FibGVzW2ldO1xuICAgIGlmIChkcmFnZ2FibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy9EaXNhYmxlIGFsbCBkcmFnZ2FibGVzIGluIGNoZWNrIG1vZGUuXG4gICAgaWYgKCFza2lwVmlzdWFscykge1xuICAgICAgZHJhZ2dhYmxlLmRpc2FibGUoKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIG91dCB3aGVyZSB3ZSBhcmUuXG4gICAgdGhpcy5wb2ludHMgKz0gZHJhZ2dhYmxlLnJlc3VsdHMoc2tpcFZpc3VhbHMsIHRoaXMuY29ycmVjdERac1tpXSwgc2NvcmVQb2ludHMpO1xuICAgIHRoaXMucmF3UG9pbnRzICs9IGRyYWdnYWJsZS5yYXdQb2ludHM7XG4gIH1cblxuICBpZiAodGhpcy5wb2ludHMgPCAwKSB7XG4gICAgdGhpcy5wb2ludHMgPSAwO1xuICB9XG4gIGlmICghdGhpcy5hbnN3ZXJlZCAmJiB0aGlzLmJsYW5rSXNDb3JyZWN0KSB7XG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLndlaWdodDtcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmJlaGF2aW91ci5zaW5nbGVQb2ludCkge1xuICAgIHRoaXMucG9pbnRzID0gKHRoaXMucG9pbnRzID09PSB0aGlzLmNhbGN1bGF0ZU1heFNjb3JlKCkgPyAxIDogMCk7XG4gIH1cblxuICBpZiAoIXNraXBWaXN1YWxzKSB7XG4gICAgdGhpcy5oaWRlQnV0dG9uKCdjaGVjay1hbnN3ZXInKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLmVuYWJsZVJldHJ5ICYmICFza2lwVmlzdWFscykge1xuICAgIHRoaXMuc2hvd0J1dHRvbigndHJ5LWFnYWluJyk7XG4gIH1cblxuICBpZiAodGhpcy5oYXNCdXR0b24oJ2NoZWNrLWFuc3dlcicpICYmICh0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLmVuYWJsZVJldHJ5ID09PSBmYWxzZSB8fCB0aGlzLnBvaW50cyA9PT0gdGhpcy5nZXRNYXhTY29yZSgpKSkge1xuICAgIC8vIE1heCBzY29yZSByZWFjaGVkLCBvciB0aGUgdXNlciBjYW5ub3QgdHJ5IGFnYWluLlxuICAgIHRoaXMuaGlkZUJ1dHRvbigndHJ5LWFnYWluJyk7XG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGxheSB0aGUgY29ycmVjdCBzb2x1dGlvbnMsIGhpZGVzIGJ1dHRvbiBhbmQgZGlzYWJsZXMgaW5wdXQuXG4gKiBVc2VkIGluIGNvbnRyYWN0cy5cbiAqIEBwdWJsaWNcbiAqL1xuQy5wcm90b3R5cGUuc2hvd1NvbHV0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zaG93QWxsU29sdXRpb25zKCk7XG4gIHRoaXMuc2hvd1Njb3JlKCk7XG4gIC8vSGlkZSBzb2x1dGlvbiBidXR0b246XG4gIHRoaXMuaGlkZUJ1dHRvbignY2hlY2stYW5zd2VyJyk7XG4gIHRoaXMuaGlkZUJ1dHRvbigndHJ5LWFnYWluJyk7XG5cbiAgLy9EaXNhYmxlIGRyYWdnaW5nIGR1cmluZyBcInNvbHV0aW9uXCIgbW9kZVxuICB0aGlzLmRpc2FibGVEcmFnZ2FibGVzKCk7XG59O1xuXG4vKipcbiAqIFJlc2V0cyB0aGUgdGFzay5cbiAqIFVzZWQgaW4gY29udHJhY3RzLlxuICogQHB1YmxpY1xuICovXG5DLnByb3RvdHlwZS5yZXNldFRhc2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucG9pbnRzID0gMDtcbiAgdGhpcy5yYXdQb2ludHMgPSAwO1xuICB0aGlzLmFuc3dlcmVkID0gZmFsc2U7XG5cbiAgLy8gSWYgRE9NIGxvYWRlZCAtIHJlc2V0IGl0XG4gIGlmICh0aGlzLiRjb250YWluZXIpIHtcbiAgICB0aGlzLmRyb3Bab25lcy5mb3JFYWNoKGZ1bmN0aW9uIChkcm9wem9uZSkge1xuICAgICAgZHJvcHpvbmUucmVzZXQoKTtcbiAgICB9KTtcblxuICAgIC8vIEVuYWJsZXMgRHJhZ2dhYmxlc1xuICAgIHRoaXMuZW5hYmxlRHJhZ2dhYmxlcygpO1xuXG4gICAgLy9SZXNldCBwb3NpdGlvbiBhbmQgZmVlZGJhY2suXG4gICAgdGhpcy5kcmFnZ2FibGVzLmZvckVhY2goZnVuY3Rpb24gKGRyYWdnYWJsZSkge1xuICAgICAgZHJhZ2dhYmxlLnJlc2V0UG9zaXRpb24oKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBSZXNldCBhY3R1YWwgcG9zaXRpb24gdmFsdWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRyYWdnYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRyYWdnYWJsZXNbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuZHJhZ2dhYmxlc1tpXS5lbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZXNbaV0uZWxlbWVudHNbal0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVzW2ldLmVsZW1lbnRzW2pdLmRyb3Bab25lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVzW2ldLmVsZW1lbnRzW2pdLnBvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vU2hvdyBzb2x1dGlvbiBidXR0b25cbiAgdGhpcy5zaG93QnV0dG9uKCdjaGVjay1hbnN3ZXInKTtcbiAgdGhpcy5oaWRlQnV0dG9uKCd0cnktYWdhaW4nKTtcbiAgdGhpcy5yZW1vdmVGZWVkYmFjaygpO1xuICB0aGlzLnNldEV4cGxhbmF0aW9uKCk7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHJlYWwgbWF4IHNjb3JlLlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IE1heCBwb2ludHNcbiAqL1xuQy5wcm90b3R5cGUuY2FsY3VsYXRlTWF4U2NvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYXggPSAwO1xuXG4gIGlmICh0aGlzLmJsYW5rSXNDb3JyZWN0KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgZWxlbWVudHMgPSB0aGlzLm9wdGlvbnMucXVlc3Rpb24udGFzay5lbGVtZW50cztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjb3JyZWN0RHJvcFpvbmVzID0gdGhpcy5jb3JyZWN0RFpzW2ldO1xuXG4gICAgaWYgKGNvcnJlY3REcm9wWm9uZXMgPT09IHVuZGVmaW5lZCB8fCAhY29ycmVjdERyb3Bab25lcy5sZW5ndGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50c1tpXS5tdWx0aXBsZSkge1xuICAgICAgbWF4ICs9IGNvcnJlY3REcm9wWm9uZXMubGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1heCsrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXg7XG59O1xuXG4vKipcbiAqIEdldCBtYXhpbXVtIHNjb3JlLlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IE1heCBwb2ludHNcbiAqL1xuQy5wcm90b3R5cGUuZ2V0TWF4U2NvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAodGhpcy5vcHRpb25zLmJlaGF2aW91ci5zaW5nbGVQb2ludCA/IHRoaXMud2VpZ2h0IDogdGhpcy5jYWxjdWxhdGVNYXhTY29yZSgpKTtcbn07XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjb3JyZWN0IGFuc3dlcnMuXG4gKiBPbmx5IHdvcmtzIHdoaWxlIHNob3dpbmcgc29sdXRpb24uXG4gKlxuICogQHJldHVybnMge051bWJlcn0gUG9pbnRzXG4gKi9cbkMucHJvdG90eXBlLmdldFNjb3JlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNob3dBbGxTb2x1dGlvbnModHJ1ZSk7XG4gIHZhciBhY3R1YWxQb2ludHMgPSAodGhpcy5vcHRpb25zLmJlaGF2aW91ci5hcHBseVBlbmFsdGllcyB8fCB0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLnNpbmdsZVBvaW50KSA/IHRoaXMucG9pbnRzIDogdGhpcy5yYXdQb2ludHM7XG4gIGRlbGV0ZSB0aGlzLnBvaW50cztcbiAgZGVsZXRlIHRoaXMucmF3UG9pbnRzO1xuICByZXR1cm4gYWN0dWFsUG9pbnRzO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYWxsIGhhcyBiZWVuIGFuc3dlcmVkLlxuICpcbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5DLnByb3RvdHlwZS5nZXRBbnN3ZXJHaXZlbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuYW5zd2VyZWQgfHwgdGhpcy5ibGFua0lzQ29ycmVjdDtcbn07XG5cbi8qKlxuICogU2hvd3MgdGhlIHNjb3JlIHRvIHRoZSB1c2VyIHdoZW4gdGhlIHNjb3JlIGJ1dHRvbiBpcyBwcmVzc2VkLlxuICovXG5DLnByb3RvdHlwZS5zaG93U2NvcmUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYXhTY29yZSA9IHRoaXMuY2FsY3VsYXRlTWF4U2NvcmUoKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuc2luZ2xlUG9pbnQpIHtcbiAgICBtYXhTY29yZSA9IDE7XG4gIH1cbiAgdmFyIGFjdHVhbFBvaW50cyA9ICh0aGlzLm9wdGlvbnMuYmVoYXZpb3VyLmFwcGx5UGVuYWx0aWVzIHx8IHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuc2luZ2xlUG9pbnQpID8gdGhpcy5wb2ludHMgOiB0aGlzLnJhd1BvaW50cztcbiAgdmFyIHNjb3JlVGV4dCA9IEg1UC5RdWVzdGlvbi5kZXRlcm1pbmVPdmVyYWxsRmVlZGJhY2sodGhpcy5vcHRpb25zLm92ZXJhbGxGZWVkYmFjaywgYWN0dWFsUG9pbnRzIC8gbWF4U2NvcmUpLnJlcGxhY2UoJ0BzY29yZScsIGFjdHVhbFBvaW50cykucmVwbGFjZSgnQHRvdGFsJywgbWF4U2NvcmUpO1xuICB2YXIgaGVscFRleHQgPSAodGhpcy5vcHRpb25zLmJlaGF2aW91ci5lbmFibGVTY29yZUV4cGxhbmF0aW9uICYmIHRoaXMub3B0aW9ucy5iZWhhdmlvdXIuYXBwbHlQZW5hbHRpZXMpID8gdGhpcy5vcHRpb25zLnNjb3JlRXhwbGFuYXRpb24gOiBmYWxzZTtcbiAgdGhpcy5zZXRGZWVkYmFjayhzY29yZVRleHQsIGFjdHVhbFBvaW50cywgbWF4U2NvcmUsIHRoaXMub3B0aW9ucy5zY29yZUJhckxhYmVsLCBoZWxwVGV4dCwgdW5kZWZpbmVkLCB0aGlzLm9wdGlvbnMuc2NvcmVFeHBsYW5hdGlvbkJ1dHRvbkxhYmVsKTtcbn07XG5cbi8qKlxuICogUGFja3MgaW5mbyBhYm91dCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFzayBpbnRvIGEgb2JqZWN0IGZvclxuICogc2VyaWFsaXphdGlvbi5cbiAqXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5DLnByb3RvdHlwZS5nZXRDdXJyZW50U3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHthbnN3ZXJzOiBbXX07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kcmFnZ2FibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRyYWdnYWJsZSA9IHRoaXMuZHJhZ2dhYmxlc1tpXTtcbiAgICBpZiAoZHJhZ2dhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBkcmFnZ2FibGVBbnN3ZXJzID0gW107XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBkcmFnZ2FibGUuZWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZHJhZ2dhYmxlLmVsZW1lbnRzW2pdO1xuICAgICAgaWYgKGVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LmRyb3Bab25lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0b3JlIHBvc2l0aW9uIGFuZCBkcm9wIHpvbmUuXG4gICAgICBkcmFnZ2FibGVBbnN3ZXJzLnB1c2goe1xuICAgICAgICB4OiBlbGVtZW50LnBvc2l0aW9uID8gTnVtYmVyKGVsZW1lbnQucG9zaXRpb24ubGVmdC5yZXBsYWNlKCclJywgJycpKSA6IG51bGwsXG4gICAgICAgIHk6IGVsZW1lbnQucG9zaXRpb24gPyBOdW1iZXIoZWxlbWVudC5wb3NpdGlvbi50b3AucmVwbGFjZSgnJScsICcnKSkgOiBudWxsLFxuICAgICAgICBkejogZWxlbWVudC5kcm9wWm9uZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGRyYWdnYWJsZUFuc3dlcnMubGVuZ3RoKSB7XG4gICAgICAvLyBBZGQgYW5zd2VycyB0byBzdGF0ZSBvYmplY3QgZm9yIHN0b3JhZ2VcbiAgICAgIHN0YXRlLmFuc3dlcnNbaV0gPSBkcmFnZ2FibGVBbnN3ZXJzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbkMucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBINVAuY3JlYXRlVGl0bGUoKHRoaXMuY29udGVudERhdGEgJiYgdGhpcy5jb250ZW50RGF0YS5tZXRhZGF0YSAmJiB0aGlzLmNvbnRlbnREYXRhLm1ldGFkYXRhLnRpdGxlKSA/IHRoaXMuY29udGVudERhdGEubWV0YWRhdGEudGl0bGUgOiAnRHJhZyBhbmQgZHJvcCcpO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGNvbnRyb2xzIHRvIGltcHJvdmUgYTExWS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtEcmFnZ2FibGVbXX0gZHJhZ2dhYmxlc1xuICogQHBhcmFtIHtEcm9wWm9uZVtdfSBkcm9wWm9uZXNcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9Ecm9wem9uZVxuICogQHJldHVybiB7T2JqZWN0PHN0cmluZywgQ29udHJvbHM+fVxuICovXG52YXIgZ2V0Q29udHJvbHMgPSBmdW5jdGlvbiAoZHJhZ2dhYmxlcywgZHJvcFpvbmVzLCBub0Ryb3B6b25lKSB7XG4gIC8vIEluaXRpYWxpemUgY29udHJvbHMgY29tcG9uZW50c1xuICB2YXIgY29udHJvbHMgPSB7XG4gICAgZHJhZzogbmV3IENvbnRyb2xzKFtuZXcgVUlLZXlib2FyZCgpLCBuZXcgTW91c2UoKSwgbmV3IEFyaWFEcmFnKCldKSxcbiAgICBkcm9wOiBuZXcgQ29udHJvbHMoW25ldyBVSUtleWJvYXJkKCksIG5ldyBNb3VzZSgpLCBuZXcgQXJpYURyb3AoKV0pXG4gIH07XG4gIGNvbnRyb2xzLmRyYWcudXNlTmVnYXRpdmVUYWJJbmRleCgpO1xuICBjb250cm9scy5kcm9wLnVzZU5lZ2F0aXZlVGFiSW5kZXgoKTtcblxuICAvLyBLZWVwIHRyYWNrIG9mIGN1cnJlbnQgc2VsZWN0ZWQgZHJhZ2dhYmxlIChzZWxlY3RlZCB2aWEga2V5Ym9hcmQpXG4gIHZhciBzZWxlY3RlZDtcblxuICAvKipcbiAgICogRGUtc2VsZWN0cyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGRyYWdnYWJsZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdmFyIGRlc2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGVjdGVkLmRyYWdnYWJsZS50cmlnZ2VyKCdkcmFnZW5kJyk7XG4gICAgc2VsZWN0ZWQuZWxlbWVudC4kLnJlbW92ZUNsYXNzKCdoNXAtZHJhZ2dhYmxlLWhvdmVyJyk7XG4gICAgRHJhZ1V0aWxzLnNldEVsZW1lbnRPcGFjaXR5KHNlbGVjdGVkLmVsZW1lbnQuJCwgc2VsZWN0ZWQuZHJhZ2dhYmxlLmJhY2tncm91bmRPcGFjaXR5KTtcblxuICAgIGlmIChjb250cm9scy5kcm9wLmVsZW1lbnRzLmluZGV4T2Yobm9Ecm9wem9uZSkgIT09IC0xKSB7XG4gICAgICBjb250cm9scy5kcm9wLnJlbW92ZUVsZW1lbnQobm9Ecm9wem9uZSk7XG4gICAgICBub0Ryb3B6b25lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZHJvcFpvbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZHJvcFpvbmUgPSBkcm9wWm9uZXNbaV07XG5cbiAgICAgIC8vIFJlbW92ZSBoaWdobGlnaHRpbmdcbiAgICAgIGRyb3Bab25lLmRlaGlnaGxpZ2h0KCk7XG5cbiAgICAgIGlmIChjb250cm9scy5kcm9wLmVsZW1lbnRzLmluZGV4T2YoZHJvcFpvbmUuJGRyb3Bab25lWzBdKSAhPT0gLTEpIHtcbiAgICAgICAgY29udHJvbHMuZHJvcC5yZW1vdmVFbGVtZW50KGRyb3Bab25lLiRkcm9wWm9uZVswXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkLmVsZW1lbnQuJC5pcygnOnZpc2libGUnKSkge1xuICAgICAgLy8gUHV0IGZvY3VzIGJhY2sgb24gZWxlbWVudCBhZnRlciBkZXNlbGVjdGluZ1xuICAgICAgc2VsZWN0ZWQuZWxlbWVudC4kLmZvY3VzKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gUHV0IGZvY3VzIG9uIG5leHQgZHJhZ2dhYmxlIGVsZW1lbnRcbiAgICAgIHZhciAkbmV4dCA9IHNlbGVjdGVkLmRyYWdnYWJsZS5lbGVtZW50c1tzZWxlY3RlZC5kcmFnZ2FibGUuZWxlbWVudHMubGVuZ3RoIC0gMV0uJDtcbiAgICAgIGNvbnRyb2xzLmRyYWcuc2V0VGFiYmFibGUoJG5leHRbMF0pO1xuICAgICAgJG5leHQuZm9jdXMoKTtcbiAgICB9XG4gICAgc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLy8gSGFuZGxlIGRyYWdnYWJsZSBzZWxlY3RlZCB0aHJvdWdoIGtleWJvYXJkXG4gIGNvbnRyb2xzLmRyYWcub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnRyb2xzLmRyYWcucmVtb3ZlRWxlbWVudChub0Ryb3B6b25lKTtcbiAgICB2YXIgcmVzdWx0ID0gRHJhZ1V0aWxzLmVsZW1lbnRUb0RyYWdnYWJsZShkcmFnZ2FibGVzLCBldmVudC5lbGVtZW50KTtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIC8vIERlLXNlbGVjdFxuICAgICAgZGVzZWxlY3QoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZWN0ZWQgPSByZXN1bHQ7XG5cbiAgICAvLyBTZWxlY3RcbiAgICBzZWxlY3RlZC5lbGVtZW50LiQuYWRkQ2xhc3MoJ2g1cC1kcmFnZ2FibGUtaG92ZXInKTtcbiAgICBEcmFnVXRpbHMuc2V0RWxlbWVudE9wYWNpdHkoc2VsZWN0ZWQuZWxlbWVudC4kLCBzZWxlY3RlZC5kcmFnZ2FibGUuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgIHNlbGVjdGVkLmRyYWdnYWJsZS50cmlnZ2VyKCdkcmFnc3RhcnQnLCBzZWxlY3RlZC5kcmFnZ2FibGUubXVzdENvcHlFbGVtZW50KHNlbGVjdGVkLmVsZW1lbnQpID8gJ2NvcHknIDogJ21vdmUnKTtcblxuICAgIC8vIEFkZCBzcGVjaWFsIGRyb3Agem9uZSB0byByZXNldFxuICAgIGNvbnRyb2xzLmRyb3AuYWRkRWxlbWVudChub0Ryb3B6b25lKTtcblxuICAgIC8vIFBvc2l0aW9uIGF0IGVsZW1lbnQgcG9zaXRpb25cbiAgICBub0Ryb3B6b25lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIG5vRHJvcHpvbmUuc3R5bGUubGVmdCA9IHNlbGVjdGVkLmRyYWdnYWJsZS54ICsgJyUnO1xuICAgIG5vRHJvcHpvbmUuc3R5bGUudG9wID0gc2VsZWN0ZWQuZHJhZ2dhYmxlLnkgKyAnJSc7XG4gICAgbm9Ecm9wem9uZS5zdHlsZS53aWR0aCA9IHNlbGVjdGVkLmRyYWdnYWJsZS53aWR0aCArICdlbSc7XG4gICAgbm9Ecm9wem9uZS5zdHlsZS5oZWlnaHQgPSBzZWxlY3RlZC5kcmFnZ2FibGUuaGVpZ2h0ICsgJ2VtJztcblxuICAgIC8vIEZpZ3VyZSBvdXQgd2hpY2ggZHJvcCB6b25lcyB3aWxsIGFjY2VwdCB0aGlzIGRyYWdnYWJsZVxuICAgIHZhciAkZmlyc3Q7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkcm9wWm9uZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkcm9wWm9uZSA9IGRyb3Bab25lc1tpXTtcblxuICAgICAgLypcbiAgICAgICAqIERyYWdnYWJsZS5pc0luRHJvcHpvbmUgb25seSBjb21wYXJlcyB0aGUgZHJhZ2dhYmxlIG51bWJlciwgYW5kXG4gICAgICAgKiB3aWxsIGFsc28gcmV0dXJuIHRydWUgaWYgdGhlIGRyYWdnYWJsZSBpcyBub3QgaW4gdGhlIGRyb3B6b25lIGJ1dFxuICAgICAgICogaWYgdGhlcmUgY2FuIGJlIGluZmluaXRlIGluc3RhbmNlcyBvZiB0aGUgZHJhZ2dhYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBlbGVtZW50SW5zdGFuY2VJc0luRHJvcFpvbmUgPSAoXG4gICAgICAgIHNlbGVjdGVkLmRyYWdnYWJsZS5pc0luRHJvcFpvbmUoZHJvcFpvbmUuaWQpICYmXG4gICAgICAgIGV2ZW50LmVsZW1lbnQgIT09IHNlbGVjdGVkLmRyYWdnYWJsZS5lbGVtZW50LiRbMF1cbiAgICAgICk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgZHJvcFpvbmUuYWNjZXB0cyhzZWxlY3RlZC5kcmFnZ2FibGUsIGRyYWdnYWJsZXMpIHx8XG4gICAgICAgIGVsZW1lbnRJbnN0YW5jZUlzSW5Ecm9wWm9uZVxuICAgICAgKSB7XG4gICAgICAgIGRyb3Bab25lLmhpZ2hsaWdodCgpO1xuICAgICAgICBjb250cm9scy5kcm9wLmFkZEVsZW1lbnQoZHJvcFpvbmUuJGRyb3Bab25lWzBdKTtcbiAgICAgICAgaWYgKCEkZmlyc3QgfHwgc2VsZWN0ZWQuZWxlbWVudC5kcm9wWm9uZSA9PT0gZHJvcFpvbmUuaWQpIHtcbiAgICAgICAgICAkZmlyc3QgPSBkcm9wWm9uZS4kZHJvcFpvbmU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCRmaXJzdCkge1xuICAgICAgLy8gRm9jdXMgdGhlIGZpcnN0IGRyb3Agem9uZSBhZnRlciBzZWxlY3RpbmcgYSBkcmFnZ2FibGVcbiAgICAgIGNvbnRyb2xzLmRyb3Auc2V0VGFiYmFibGUoJGZpcnN0WzBdKTtcbiAgICAgICRmaXJzdC5mb2N1cygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnRyb2xzLmRyYWcuYWRkRWxlbWVudChub0Ryb3B6b25lKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEhhbmRsZSBkcm9wem9uZSBzZWxlY3RlZCB0aHJvdWdoIGtleWJvYXJkXG4gIGNvbnRyb2xzLmRyb3Aub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICghc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmVsZW1lbnQgPT09IG5vRHJvcHpvbmUpIHtcbiAgICAgIC8vIFJlc2V0IHBvc2l0aW9uXG5cbiAgICAgIGlmIChzZWxlY3RlZC5lbGVtZW50LmRyb3Bab25lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZWN0ZWQuZWxlbWVudC5yZXNldCgpO1xuICAgICAgfVxuICAgICAgaWYgKHNlbGVjdGVkICE9PSB1bmRlZmluZWQpIHsgLy8gRXF1YWxzIGRyYWdnYWJsZS5tdWx0aXBsZSA9PT0gZmFsc2VcbiAgICAgICAgc2VsZWN0ZWQuZWxlbWVudC4kLmNzcyh7XG4gICAgICAgICAgbGVmdDogc2VsZWN0ZWQuZHJhZ2dhYmxlLnggKyAnJScsXG4gICAgICAgICAgdG9wOiBzZWxlY3RlZC5kcmFnZ2FibGUueSArICclJyxcbiAgICAgICAgICB3aWR0aDogc2VsZWN0ZWQuZHJhZ2dhYmxlLndpZHRoICsgJ2VtJyxcbiAgICAgICAgICBoZWlnaHQ6IHNlbGVjdGVkLmRyYWdnYWJsZS5oZWlnaHQgKyAnZW0nXG4gICAgICAgIH0pO1xuICAgICAgICBzZWxlY3RlZC5kcmFnZ2FibGUudXBkYXRlUGxhY2VtZW50KHNlbGVjdGVkLmVsZW1lbnQpO1xuICAgICAgICBzZWxlY3RlZC5lbGVtZW50LiRbMF0uc2V0QXR0cmlidXRlKCdhcmlhLWdyYWJiZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZHJvcFpvbmUgPSBEcmFnVXRpbHMuZWxlbWVudFRvRHJvcFpvbmUoZHJvcFpvbmVzLCBldmVudC5lbGVtZW50KTtcblxuICAgIHZhciBtdXN0Q29weUVsZW1lbnQgPSBzZWxlY3RlZC5kcmFnZ2FibGUubXVzdENvcHlFbGVtZW50KHNlbGVjdGVkLmVsZW1lbnQpO1xuICAgIGlmIChtdXN0Q29weUVsZW1lbnQpIHtcbiAgICAgIC8vIExlYXZlIGEgbmV3IGVsZW1lbnQgZm9yIG5leHQgZHJhZ1xuICAgICAgc2VsZWN0ZWQuZWxlbWVudC5jbG9uZSgpO1xuICAgIH1cblxuICAgIC8vIEFkZCBkcmFnZ2FibGUgdG8gZHJvcCB6b25lXG4gICAgc2VsZWN0ZWQuZHJhZ2dhYmxlLmFkZFRvRHJvcFpvbmUoc2VsZWN0ZWQuaW5kZXgsIHNlbGVjdGVkLmVsZW1lbnQsIGRyb3Bab25lLmlkKTtcblxuICAgIC8vIFNldCBwb3NpdGlvbiBpbiBjYXNlIERaIGlzIGZ1bGwgKGF1dG8gYWxpZ24gZG9lc24ndCB3b3JrKVxuICAgIHNlbGVjdGVkLmVsZW1lbnQuJC5jc3Moe1xuICAgICAgbGVmdDogZHJvcFpvbmUueCArICclJyxcbiAgICAgIHRvcDogZHJvcFpvbmUueSArICclJyxcbiAgICB9KTtcblxuICAgIGlmIChkcm9wWm9uZS5nZXRJbmRleE9mKHNlbGVjdGVkLmVsZW1lbnQuJCkgPT09IC0xKSB7XG4gICAgICAvLyBBZGQgdG8gYWxpZ25hYmxlc1xuICAgICAgZHJvcFpvbmUuYWxpZ25hYmxlcy5wdXNoKHNlbGVjdGVkLmVsZW1lbnQuJCk7XG4gICAgfVxuXG4gICAgLy8gVHJpZ2dlciBhbGlnbm1lbnRcbiAgICBkcm9wWm9uZS5hdXRvQWxpZ24oKTtcblxuICAgIC8vIFJlc2V0IHNlbGVjdGVkXG4gICAgc2VsZWN0ZWQuZWxlbWVudC4kWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1ncmFiYmVkJywgJ2ZhbHNlJyk7XG4gICAgZGVzZWxlY3QoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbnRyb2xzO1xufTtcblxuSDVQLkRyYWdTaHVmZmxlID0gQztcbiJdLCJuYW1lcyI6WyJEcmFnVXRpbHMiLCJfY2xhc3NDYWxsQ2hlY2siLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsInNldEVsZW1lbnRPcGFjaXR5IiwiJGVsZW1lbnQiLCJvcGFjaXR5Iiwic2V0T3BhY2l0eSIsInByb3BlcnR5IiwidW5kZWZpbmVkIiwiZ2V0UHJvcGVydGllcyIsImJvcmRlclRvcENvbG9yIiwiYm9yZGVyUmlnaHRDb2xvciIsImJvcmRlckJvdHRvbUNvbG9yIiwiYm9yZGVyTGVmdENvbG9yIiwicHJvcGVydGllcyIsIm9yaWdpbmFsIiwiY3NzIiwicHJvcCIsInN0eWxlIiwic2V0QWxwaGFzIiwicHJlZml4IiwiYWxwaGEiLCJjb2xvclN0YXJ0IiwiaW5kZXhPZiIsImNvbG9yRW5kIiwiY2hhbm5lbHMiLCJzdWJzdHJpbmciLCJsZW5ndGgiLCJzcGxpdCIsInBhcnNlRmxvYXQiLCJqb2luIiwiZWxlbWVudFRvRHJhZ2dhYmxlIiwiZHJhZ2dhYmxlcyIsImVsZW1lbnQiLCJpIiwicmVzdWx0IiwiZmluZEVsZW1lbnQiLCJkcmFnZ2FibGUiLCJlbGVtZW50VG9Ecm9wWm9uZSIsImRyb3Bab25lcyIsIiRkcm9wWm9uZSIsImlzIiwicG9zaXRpb25Ub1BlcmNlbnRhZ2UiLCIkY29udGFpbmVyIiwidG9wIiwicGFyc2VJbnQiLCJpbm5lckhlaWdodCIsImxlZnQiLCJpbm5lcldpZHRoIiwiYWRkSG92ZXIiLCJiYWNrZ3JvdW5kT3BhY2l0eSIsImhvdmVyIiwiYWRkQ2xhc3MiLCJwYXJlbnQiLCJoYXNDbGFzcyIsInNldFRpbWVvdXQiLCJyZW1vdmVDbGFzcyIsInN0cmlwIiwiaHRtbCIsInRtcCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRleHRDb250ZW50IiwiaW5uZXJUZXh0IiwiZGVmYXVsdCIsIiQiLCJINVAiLCJqUXVlcnkiLCJzdG9wUHJvcGFnYXRpb24iLCJldmVudCIsIkRyYWdnYWJsZSIsIl9INVAkRXZlbnREaXNwYXRjaGVyIiwiaWQiLCJhbnN3ZXJzIiwibDEwbiIsImRyYWdnYWJsZU51bSIsIl90aGlzIiwiX2NhbGxTdXBlciIsInNlbGYiLCJlbGVtZW50cyIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJ0eXBlIiwibXVsdGlwbGUiLCJhbGxEcm9wem9uZXMiLCJwdXNoIiwiZHJvcFpvbmUiLCJkeiIsInBvc2l0aW9uIiwiX2luaGVyaXRzIiwiYXBwZW5kVG8iLCJjb250ZW50SWQiLCJhdHRhY2hFbGVtZW50IiwiaW5kZXgiLCJleHRlbmQiLCJjbG9uZSIsInJlc2V0IiwidHJpZ2dlciIsInJlbW92ZSIsInRhYmluZGV4Iiwicm9sZSIsInRpdGxlIiwicGFyYW1zIiwib24iLCJyZXZlcnQiLCIkdGhpcyIsImRhdGEiLCJvcmlnaW5hbFBvc2l0aW9uIiwidXBkYXRlUGxhY2VtZW50Iiwic2V0QXR0cmlidXRlIiwic3RhcnQiLCJtdXN0Q29weUVsZW1lbnQiLCJkZXRhY2giLCJlZmZlY3QiLCJzdG9wIiwiYWRkVG9ab25lIiwicmVtb3ZlRGF0YSIsImFkZFRvRHJvcFpvbmUiLCJuZXdSdW5uYWJsZSIsInJlcGxhY2UiLCJwcmVwZW5kVG8iLCJzZXRGZWVkYmFjayIsImZlZWRiYWNrIiwiZHJvcFpvbmVJZCIsImZvckVhY2giLCIkZmVlZGJhY2siLCJoYXNEcm9wWm9uZSIsIiRzdWZmaXgiLCJkcm9wWm9uZUxhYmVsIiwibGFiZWwiLCJsYWJlbEVsZW1lbnQiLCJzdWZmaXgiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwicmVzZXRQb3NpdGlvbiIsImFuaW1hdGUiLCJpc0luRHJvcFpvbmUiLCJkaXNhYmxlIiwiZW5hYmxlIiwicmVzdWx0cyIsInNraXBWaXN1YWxzIiwic29sdXRpb25zIiwic2NvcmVQb2ludHMiLCJqIiwiY29ycmVjdCIsInBvaW50cyIsInJhd1BvaW50cyIsIm1hcmtFbGVtZW50Iiwic3RhdHVzIiwiJGVsZW1lbnRSZXN1bHQiLCJhZGQiLCJnZXRFbGVtZW50IiwiYXBwZW5kIiwiRXZlbnREaXNwYXRjaGVyIiwiRHJvcFpvbmUiLCJjYWxsIiwic2hvd0xhYmVsIiwidGlwIiwidGlwc0FuZEZlZWRiYWNrIiwic2luZ2xlIiwiYXV0b0FsaWduYWJsZSIsImF1dG9BbGlnbiIsImFsaWduYWJsZXMiLCJleHRyYUNsYXNzIiwiY2hpbGRyZW4iLCJkcm9wcGFibGUiLCJhY3RpdmVDbGFzcyIsInRvbGVyYW5jZSIsImFjY2VwdCIsImFjY2VwdHMiLCJkcm9wIiwidWkiLCJnZXRJbmRleE9mIiwiZW5hYmxlZCIsIm92ZXIiLCJvdXQiLCJlbmQiLCJmb2N1cyIsIiR0aXAiLCJhdHRyIiwiYmx1ciIsIkpvdWJlbFVJIiwiY3JlYXRlVGlwIiwidGlwTGFiZWwiLCJ0YWJjb250cm9sIiwidGlwQXZhaWxhYmxlIiwiZHJhZ0VsIiwidXBkYXRlQmFja2dyb3VuZE9wYWNpdHkiLCIkYWxpZ25hYmxlIiwicmVtb3ZlQWxpZ25hYmxlIiwic3BsaWNlIiwiYXV0b0FsaWduVGltZXIiLCJjb250YWluZXJTaXplIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3BhY2luZyIsInNpemUiLCJwb3MiLCJkcm9wWm9uZVNpemUiLCJzcGFjZSIsInNwYWNlTGVmdCIsImN1cnJlbnRSb3dIZWlnaHQiLCJhbGlnbmFibGVTaXplIiwiYWxpZ25FbGVtZW50Iiwic3BhY2VEaWZmWCIsInNwYWNlRGlmZlkiLCJoaWdobGlnaHQiLCJkZWhpZ2hsaWdodCIsIkNvbnRyb2xzIiwiQXJpYURyYWciLCJBcmlhRHJvcCIsIlVJS2V5Ym9hcmQiLCJNb3VzZSIsIm51bUluc3RhbmNlcyIsImRlc29yZGVuYXIiLCJDIiwib3B0aW9ucyIsImNvbnRlbnREYXRhIiwiUXVlc3Rpb24iLCJzY29yZVNob3ciLCJ0cnlBZ2FpbiIsImdyYWJiYWJsZVByZWZpeCIsImdyYWJiYWJsZVN1ZmZpeCIsImRyb3B6b25lUHJlZml4Iiwibm9Ecm9wem9uZSIsImNvcnJlY3RBbnN3ZXIiLCJ3cm9uZ0Fuc3dlciIsImZlZWRiYWNrSGVhZGVyIiwic2NvcmVCYXJMYWJlbCIsInNjb3JlRXhwbGFuYXRpb25CdXR0b25MYWJlbCIsInF1ZXN0aW9uIiwic2V0dGluZ3MiLCJxdWVzdGlvblRpdGxlIiwibWV0YWRhdGEiLCJ0YXNrIiwib3ZlcmFsbEZlZWRiYWNrIiwiYmVoYXZpb3VyIiwiZW5hYmxlUmV0cnkiLCJlbmFibGVDaGVja0J1dHRvbiIsInByZXZlbnRSZXNpemUiLCJzaW5nbGVQb2ludCIsImFwcGx5UGVuYWx0aWVzIiwiZW5hYmxlU2NvcmVFeHBsYW5hdGlvbiIsImRyb3Bab25lSGlnaGxpZ2h0aW5nIiwiYXV0b0FsaWduU3BhY2luZyIsInNob3dTY29yZVBvaW50cyIsInNob3dUaXRsZSIsImExMXlDaGVjayIsImExMXlSZXRyeSIsInN1Ym1pdCIsImFuc3dlcmVkIiwicHJldmlvdXNTdGF0ZSIsImJsYW5rSXNDb3JyZWN0IiwidHJpbSIsIiRub0Ryb3Bab25lIiwiY29udHJvbHMiLCJnZXRDb250cm9scyIsInNldERyb3BFZmZlY3QiLCJkcm9wWm9uZXNXaXRob3V0RWxlbWVudHMiLCJjb3JyZWN0RFpzIiwic2h1ZmZsZVBvcyIsInBvc2ljaW9uIiwic29ydCIsImEiLCJiIiwiTWF0aCIsInJhbmRvbSIsImZpc2hlcllhdGVzU2h1ZmZsZSIsImFycmF5IiwiZmxvb3IiLCJfcmVmIiwic2h1ZmZsZUVsZW0iLCJpbmRpY2UiLCJjb3JyZWN0RWxlbWVudHMiLCJjb3JyZWN0RWxlbWVudCIsIndlaWdodCIsImlzRHJhZ2dhYmxlIiwiZ3JhYmJhYmxlbDEwbiIsImZpbHRlciIsImNvbnNvbGUiLCJsb2ciLCJlamV4IiwiZWpleSIsImhpZ2hsaWdodERyb3Bab25lcyIsImRyYWciLCJhZGRFbGVtZW50IiwicmVtb3ZlRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsImZpcmVzRXZlbnQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRUYWJiYWJsZSIsInRyaWdnZXJYQVBJIiwibnVtRHJvcFpvbmVzV2l0aG91dEVsZW1lbnRzIiwiZHJvcHpvbmVsMTBuIiwiJGFsaWduZWQiLCJyZXNpemUiLCJwYXJlbnRzIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiY29uc3RydWN0b3IiLCJyZWdpc3RlckRvbUVsZW1lbnRzIiwiJGludHJvZHVjdGlvbiIsInNldEludHJvZHVjdGlvbiIsImNsYXNzZXMiLCJzZXRDb250ZW50IiwiY3JlYXRlUXVlc3Rpb25Db250ZW50IiwiY2FuSGFzRnVsbFNjcmVlbiIsImVuYWJsZUZ1bGxTY3JlZW4iLCJ0b2dnbGVGdWxsU2NyZWVuIiwiaXNGdWxsc2NyZWVuIiwiZXhpdEZ1bGxTY3JlZW4iLCJmdWxsU2NyZWVuIiwiJGZ1bGxTY3JlZW5CdXR0b24iLCJsb2NhbGl6ZSIsImZ1bGxzY3JlZW4iLCJjbGljayIsImtleXByZXNzIiwid2hpY2giLCJwcmV2ZW50RGVmYXVsdCIsImV4aXRGdWxsc2NyZWVuIiwicmVnaXN0ZXJCdXR0b25zIiwiZ2V0WEFQSURhdGEiLCJ4QVBJRXZlbnQiLCJjcmVhdGVYQVBJRXZlbnRUZW1wbGF0ZSIsImFkZFF1ZXN0aW9uVG9YQVBJIiwiYWRkUmVzcG9uc2VUb1hBUEkiLCJzdGF0ZW1lbnQiLCJkZWZpbml0aW9uIiwiZ2V0VmVyaWZpZWRTdGF0ZW1lbnRWYWx1ZSIsImdldFhBUElEZWZpbml0aW9uIiwiZGVzY3JpcHRpb24iLCJ0ZXh0IiwiaW50ZXJhY3Rpb25UeXBlIiwic291cmNlIiwiZWwiLCJkZXNjIiwiYWx0IiwiY29ycmVjdFJlc3BvbnNlc1BhdHRlcm4iLCJ0YXJnZXQiLCJmaXJzdENvcnJlY3RQYWlyIiwidG9TdHJpbmciLCJtYXhTY29yZSIsImdldE1heFNjb3JlIiwic2NvcmUiLCJnZXRTY29yZSIsInN1Y2Nlc3MiLCJzZXRTY29yZWRSZXN1bHQiLCJyZXNwb25zZSIsImdldFVzZXJYQVBJUmVzcG9uc2UiLCJnZXRVc2VyQW5zd2VycyIsImFuc3dlck1hcHBpbmciLCJtYXAiLCJwYXR0ZXJuIiwiZHJhZ2dhYmxlTWFwcGluZyIsImdldFBhdGgiLCJwYXRoIiwidGltZWRPdXRPcGFjaXR5IiwiJGVsIiwiYWRkU29sdXRpb25CdXR0b24iLCJhZGRSZXRyeUJ1dHRvbiIsInRoYXQiLCJhZGRCdXR0b24iLCJzaG93QWxsU29sdXRpb25zIiwic2hvd1Njb3JlIiwiYWRkRXhwbGFuYXRpb24iLCIkbmV4dEZvY3VzIiwiZmlyc3QiLCJ0ZXh0SWZTdWJtaXR0aW5nIiwiZXhwbGFuYXRpb25zIiwiZmVlZGJhY2tPbkNvcnJlY3QiLCJpbmNvcnJlY3QiLCJmZWVkYmFja09uSW5jb3JyZWN0IiwicGxhY2VkRHJhZ2dhYmxlcyIsImluc3RhbmNlIiwia2V5cyIsImRyYWdnYWJsZUlkIiwiZHJhZ2dhYmxlTGFiZWwiLCJ3cm9uZyIsInNldEV4cGxhbmF0aW9uIiwicmVzZXRUYXNrIiwic2hvd0J1dHRvbiIsImhpZGVCdXR0b24iLCJlIiwiZHJvcHpvbmUiLCJkZWNyZWFzZVNpemUiLCJyYXRpbyIsInBhcmVudENvbnRhaW5lciIsIiRzZW1pRnVsbFNjcmVlbiIsIiRpZnJhbWUiLCJ3aW5kb3ciLCJmcmFtZUVsZW1lbnQiLCIkaWZyYW1lUGFyZW50IiwiZm9udFNpemUiLCJkaXNhYmxlRHJhZ2dhYmxlcyIsImVuYWJsZURyYWdnYWJsZXMiLCJTY29yZVBvaW50cyIsImNhbGN1bGF0ZU1heFNjb3JlIiwiaGFzQnV0dG9uIiwic2hvd1NvbHV0aW9ucyIsInJlbW92ZUZlZWRiYWNrIiwibWF4IiwiY29ycmVjdERyb3Bab25lcyIsImFjdHVhbFBvaW50cyIsImdldEFuc3dlckdpdmVuIiwic2NvcmVUZXh0IiwiZGV0ZXJtaW5lT3ZlcmFsbEZlZWRiYWNrIiwiaGVscFRleHQiLCJzY29yZUV4cGxhbmF0aW9uIiwiZ2V0Q3VycmVudFN0YXRlIiwic3RhdGUiLCJkcmFnZ2FibGVBbnN3ZXJzIiwiTnVtYmVyIiwiZ2V0VGl0bGUiLCJjcmVhdGVUaXRsZSIsInVzZU5lZ2F0aXZlVGFiSW5kZXgiLCJzZWxlY3RlZCIsImRlc2VsZWN0IiwiZGlzcGxheSIsIiRuZXh0IiwiJGZpcnN0IiwiZWxlbWVudEluc3RhbmNlSXNJbkRyb3Bab25lIiwiRHJhZ1NodWZmbGUiXSwic291cmNlUm9vdCI6IiJ9