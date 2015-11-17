(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();
},{"./SceneApp":5,"./libs/bongiovi.js":7,"dat-gui":2}],2:[function(require,module,exports){
module.exports = require('./vendor/dat.gui')
module.exports.color = require('./vendor/dat.color')
},{"./vendor/dat.color":3,"./vendor/dat.gui":4}],3:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common),
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common);
},{}],4:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = (function () {
  return {
    load: function (url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  }
})();


dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.controllers.Controller = (function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;

  };

  common.extend(

      Controller.prototype,

      /** @lends dat.controllers.Controller.prototype */
      {

        /**
         * Specify that a function fire every time someone changes the value with
         * this Controller.
         *
         * @param {Function} fnc This function will be called whenever the value
         * is modified via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onChange: function(fnc) {
          this.__onChange = fnc;
          return this;
        },

        /**
         * Specify that a function fire every time someone "finishes" changing
         * the value wih this Controller. Useful for values that change
         * incrementally like numbers or strings.
         *
         * @param {Function} fnc This function will be called whenever
         * someone "finishes" changing the value via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onFinishChange: function(fnc) {
          this.__onFinishChange = fnc;
          return this;
        },

        /**
         * Change the value of <code>object[property]</code>
         *
         * @param {Object} newValue The new value of <code>object[property]</code>
         */
        setValue: function(newValue) {
          this.object[this.property] = newValue;
          if (this.__onChange) {
            this.__onChange.call(this, newValue);
          }
          this.updateDisplay();
          return this;
        },

        /**
         * Gets the value of <code>object[property]</code>
         *
         * @returns {Object} The current value of <code>object[property]</code>
         */
        getValue: function() {
          return this.object[this.property];
        },

        /**
         * Refreshes the visual display of a Controller in order to keep sync
         * with the object's current value.
         * @returns {dat.controllers.Controller} this
         */
        updateDisplay: function() {
          return this;
        },

        /**
         * @returns {Boolean} true if the value has deviated from initialValue
         */
        isModified: function() {
          return this.initialValue !== this.getValue()
        }

      }

  );

  return Controller;


})(dat.utils.common);


dat.dom.dom = (function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {
      };

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';

    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }

    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false,
              params.cancelable || true, window, params.clickCount || 1,
              0, //screen X
              0, //screen Y
              clientX, //client X
              clientY, //client Y
              false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false,
              params.cancelable, window,
              params.ctrlKey, params.altKey,
              params.shiftKey, params.metaKey,
              params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false,
              params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) +
          cssValueToPixels(style['border-right-width']) +
          cssValueToPixels(style['padding-left']) +
          cssValueToPixels(style['padding-right']) +
          cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) +
          cssValueToPixels(style['border-bottom-width']) +
          cssValueToPixels(style['padding-top']) +
          cssValueToPixels(style['padding-bottom']) +
          cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function(elem) {
      var offset = {left: 0, top:0};
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function(elem) {
      return elem === document.activeElement && ( elem.type || elem.href );
    }

  };

  return dom;

})(dat.utils.common);


dat.controllers.OptionController = (function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function(value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);

    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);

  };

  OptionController.superclass = Controller;

  common.extend(

      OptionController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          return toReturn;
        },

        updateDisplay: function() {
          this.__select.value = this.getValue();
          return OptionController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return OptionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberController = (function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
      }

    } else {

      this.__impliedStep = this.__step;

    }

    this.__precision = numDecimals(this.__impliedStep);


  };

  NumberController.superclass = Controller;

  common.extend(

      NumberController.prototype,
      Controller.prototype,

      /** @lends dat.controllers.NumberController.prototype */
      {

        setValue: function(v) {

          if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
          } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
          }

          if (this.__step !== undefined && v % this.__step != 0) {
            v = Math.round(v / this.__step) * this.__step;
          }

          return NumberController.superclass.prototype.setValue.call(this, v);

        },

        /**
         * Specify a minimum value for <code>object[property]</code>.
         *
         * @param {Number} minValue The minimum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        min: function(v) {
          this.__min = v;
          return this;
        },

        /**
         * Specify a maximum value for <code>object[property]</code>.
         *
         * @param {Number} maxValue The maximum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        max: function(v) {
          this.__max = v;
          return this;
        },

        /**
         * Specify a step value that dat.controllers.NumberController
         * increments by.
         *
         * @param {Number} stepValue The step value for
         * dat.controllers.NumberController
         * @default if minimum and maximum specified increment is 1% of the
         * difference otherwise stepValue is 1
         * @returns {dat.controllers.NumberController} this
         */
        step: function(v) {
          this.__step = v;
          return this;
        }

      }

  );

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;

})(dat.controllers.Controller,
dat.utils.common);


dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }

    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  NumberControllerBox.superclass = NumberController;

  common.extend(

      NumberControllerBox.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {

          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;

})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    


    dom.bind(this.__background, 'mousedown', onMouseDown);
    
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      
      _this.setValue(
        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
      );

      return false;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);

  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };

  common.extend(

      NumberControllerSlider.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {
          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
          this.__foreground.style.width = pct*100+'%';
          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
        }

      }



  );

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
  
})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.css,
dat.utils.common,
".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


dat.controllers.FunctionController = (function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);


  };

  FunctionController.superclass = Controller;

  common.extend(

      FunctionController.prototype,
      Controller.prototype,
      {
        
        fire: function() {
          if (this.__onChange) {
            this.__onChange.call(this);
          }
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.getValue().call(this.object);
        }
      }

  );

  return FunctionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.BooleanController = (function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');


    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }

  };

  BooleanController.superclass = Controller;

  common.extend(

      BooleanController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.__prev = this.getValue();
          return toReturn;
        },

        updateDisplay: function() {
          
          if (this.getValue() === true) {
            this.__checkbox.setAttribute('checked', 'checked');
            this.__checkbox.checked = true;    
          } else {
              this.__checkbox.checked = false;
          }

          return BooleanController.superclass.prototype.updateDisplay.call(this);

        }


      }

  );

  return BooleanController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common);


dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });


    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;

    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;


    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage =
        SUPPORTS_LOCAL_STORAGE &&
            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

        /** @lends dat.gui.GUI.prototype */
        {

          /**
           * The parent <code>GUI</code>
           * @type dat.gui.GUI
           */
          parent: {
            get: function() {
              return params.parent;
            }
          },

          scrollable: {
            get: function() {
              return params.scrollable;
            }
          },

          /**
           * Handles <code>GUI</code>'s element placement for you
           * @type Boolean
           */
          autoPlace: {
            get: function() {
              return params.autoPlace;
            }
          },

          /**
           * The identifier for a set of saved values
           * @type String
           */
          preset: {

            get: function() {
              if (_this.parent) {
                return _this.getRoot().preset;
              } else {
                return params.load.preset;
              }
            },

            set: function(v) {
              if (_this.parent) {
                _this.getRoot().preset = v;
              } else {
                params.load.preset = v;
              }
              setPresetSelectIndex(this);
              _this.revert();
            }

          },

          /**
           * The width of <code>GUI</code> element
           * @type Number
           */
          width: {
            get: function() {
              return params.width;
            },
            set: function(v) {
              params.width = v;
              setWidth(_this, v);
            }
          },

          /**
           * The name of <code>GUI</code>. Used for folders. i.e
           * a folder's name
           * @type String
           */
          name: {
            get: function() {
              return params.name;
            },
            set: function(v) {
              // TODO Check for collisions among sibling folders
              params.name = v;
              if (title_row_name) {
                title_row_name.innerHTML = params.name;
              }
            }
          },

          /**
           * Whether the <code>GUI</code> is collapsed or not
           * @type Boolean
           */
          closed: {
            get: function() {
              return params.closed;
            },
            set: function(v) {
              params.closed = v;
              if (params.closed) {
                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
              } else {
                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
              }
              // For browsers that aren't going to respect the CSS transition,
              // Lets just check our height against the window height right off
              // the bat.
              this.onResize();

              if (_this.__closeButton) {
                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
              }
            }
          },

          /**
           * Contains all presets
           * @type Object
           */
          load: {
            get: function() {
              return params.load;
            }
          },

          /**
           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
           * <code>remember</code>ing
           * @type Boolean
           */
          useLocalStorage: {

            get: function() {
              return use_local_storage;
            },
            set: function(bool) {
              if (SUPPORTS_LOCAL_STORAGE) {
                use_local_storage = bool;
                if (bool) {
                  dom.bind(window, 'unload', saveToLocalStorage);
                } else {
                  dom.unbind(window, 'unload', saveToLocalStorage);
                }
                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
              }
            }

          }

        });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }

        }

      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function() {

        _this.closed = !_this.closed;


      });


      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }

    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

      }


      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);

    }

    dom.bind(window, 'resize', function() { _this.onResize() });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
    this.onResize();


    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
        var root = _this.getRoot();
        root.width += 1;
        common.defer(function() {
          root.width -= 1;
        });
      }

      if (!params.parent) {
        resetWidth();
      }

  };

  GUI.toggleHide = function() {

    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function(e) {

    if (document.activeElement.type !== 'text' &&
        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }

  }, false);

  common.extend(

      GUI.prototype,

      /** @lends dat.gui.GUI */
      {

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.Controller} The new controller that was added.
         * @instance
         */
        add: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
              }
          );

        },

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.ColorController} The new controller that was added.
         * @instance
         */
        addColor: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                color: true
              }
          );

        },

        /**
         * @param controller
         * @instance
         */
        remove: function(controller) {

          // TODO listening?
          this.__ul.removeChild(controller.__li);
          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
          var _this = this;
          common.defer(function() {
            _this.onResize();
          });

        },

        destroy: function() {

          if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
          }

        },

        /**
         * @param name
         * @returns {dat.gui.GUI} The new folder.
         * @throws {Error} if this GUI already has a folder by the specified
         * name
         * @instance
         */
        addFolder: function(name) {

          // We have to prevent collisions on names in order to have a key
          // by which to remember saved values
          if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' +
                ' name "' + name + '"');
          }

          var new_gui_params = { name: name, parent: this };

          // We need to pass down the autoPlace trait so that we can
          // attach event listeners to open/close folder actions to
          // ensure that a scrollbar appears if the window is too short.
          new_gui_params.autoPlace = this.autoPlace;

          // Do we have saved appearance data for this folder?

          if (this.load && // Anything loaded?
              this.load.folders && // Was my parent a dead-end?
              this.load.folders[name]) { // Did daddy remember me?

            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;

            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];

          }

          var gui = new GUI(new_gui_params);
          this.__folders[name] = gui;

          var li = addRow(this, gui.domElement);
          dom.addClass(li, 'folder');
          return gui;

        },

        open: function() {
          this.closed = false;
        },

        close: function() {
          this.closed = true;
        },

        onResize: function() {

          var root = this.getRoot();

          if (root.scrollable) {

            var top = dom.getOffset(root.__ul).top;
            var h = 0;

            common.each(root.__ul.childNodes, function(node) {
              if (! (root.autoPlace && node === root.__save_row))
                h += dom.getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = 'auto';
            }

          }

          if (root.__resize_handle) {
            common.defer(function() {
              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
          }

          if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
          }

        },

        /**
         * Mark objects for saving. The order of these objects cannot change as
         * the GUI grows. When remembering new objects, append them to the end
         * of the list.
         *
         * @param {Object...} objects
         * @throws {Error} if not called on a top level GUI.
         * @instance
         */
        remember: function() {

          if (common.isUndefined(SAVE_DIALOGUE)) {
            SAVE_DIALOGUE = new CenteredDiv();
            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
          }

          if (this.parent) {
            throw new Error("You can only call remember on a top level GUI.");
          }

          var _this = this;

          common.each(Array.prototype.slice.call(arguments), function(object) {
            if (_this.__rememberedObjects.length == 0) {
              addSaveMenu(_this);
            }
            if (_this.__rememberedObjects.indexOf(object) == -1) {
              _this.__rememberedObjects.push(object);
            }
          });

          if (this.autoPlace) {
            // Set save row width
            setWidth(this, this.width);
          }

        },

        /**
         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
         * @instance
         */
        getRoot: function() {
          var gui = this;
          while (gui.parent) {
            gui = gui.parent;
          }
          return gui;
        },

        /**
         * @returns {Object} a JSON object representing the current state of
         * this GUI as well as its remembered properties.
         * @instance
         */
        getSaveObject: function() {

          var toReturn = this.load;

          toReturn.closed = this.closed;

          // Am I remembering any values?
          if (this.__rememberedObjects.length > 0) {

            toReturn.preset = this.preset;

            if (!toReturn.remembered) {
              toReturn.remembered = {};
            }

            toReturn.remembered[this.preset] = getCurrentPreset(this);

          }

          toReturn.folders = {};
          common.each(this.__folders, function(element, key) {
            toReturn.folders[key] = element.getSaveObject();
          });

          return toReturn;

        },

        save: function() {

          if (!this.load.remembered) {
            this.load.remembered = {};
          }

          this.load.remembered[this.preset] = getCurrentPreset(this);
          markPresetModified(this, false);

        },

        saveAs: function(presetName) {

          if (!this.load.remembered) {

            // Retain default values upon first save
            this.load.remembered = {};
            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

          }

          this.load.remembered[presetName] = getCurrentPreset(this);
          this.preset = presetName;
          addPresetOption(this, presetName, true);

        },

        revert: function(gui) {

          common.each(this.__controllers, function(controller) {
            // Make revert work on Default.
            if (!this.getRoot().load.remembered) {
              controller.setValue(controller.initialValue);
            } else {
              recallSavedValue(gui || this.getRoot(), controller);
            }
          }, this);

          common.each(this.__folders, function(folder) {
            folder.revert(folder);
          });

          if (!gui) {
            markPresetModified(this.getRoot(), false);
          }


        },

        listen: function(controller) {

          var init = this.__listening.length == 0;
          this.__listening.push(controller);
          if (init) updateDisplays(this.__listening);

        }

      }

  );

  function add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);

    } else {

      var factoryArgs = [object,property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);

    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;

  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function(options) {

        if (arguments.length > 1) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [common.toArray(arguments)]
              }
          );

        }

        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [options]
              }
          );

        }

      },

      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property,
          { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        }
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

      var r = function(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [controller.__min, controller.__max, controller.__step]
              });

        }

        return returned;

      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation(); // Prevents double-toggle
      })

    }
    else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });

    }
    else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();

    }

    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);

  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map =
          root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] =
            controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];

        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

        } else {

          // Nada.

          return;

        }


        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

          // Did we remember this particular property?
            preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);

        }

      }

    }

  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;

  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });

    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function() {


      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;

    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });

    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function() {
      gui.save();
    });

    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function() {
      gui.revert();
    });

//    div.appendChild(button2);

  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
//      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;

    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;

    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);

    }

  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function(val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map =
          gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;

    });

    return toReturn;

  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
//    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {


    if (controllerArray.length != 0) {

      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });

    }

    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });

  }

  return GUI;

})(dat.utils.css,
"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

      return function(object, property) {

        var initialValue = object[property];

        // Providing options?
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
          return new OptionController(object, property, arguments[2]);
        }

        // Providing a map?

        if (common.isNumber(initialValue)) {

          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

            // Has min and max.
            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

          } else {

            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

          }

        }

        if (common.isString(initialValue)) {
          return new StringController(object, property);
        }

        if (common.isFunction(initialValue)) {
          return new FunctionController(object, property, '');
        }

        if (common.isBoolean(initialValue)) {
          return new BooleanController(object, property);
        }

      }

    })(dat.controllers.OptionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.StringController = (function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  StringController.superclass = Controller;

  common.extend(

      StringController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return StringController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return StringController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common),
dat.controllers.FunctionController,
dat.controllers.BooleanController,
dat.utils.common),
dat.controllers.Controller,
dat.controllers.BooleanController,
dat.controllers.FunctionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.OptionController,
dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

  var ColorController = function(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function(e) {

      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function(e) {
          dom.removeClass(_this.__selector, 'drag');
        });

    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
//      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;
      else if (v < 0) v = 0;

      if (s > 1) s = 1;
      else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;

    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;
      else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;

    }

  };

  ColorController.superclass = Controller;

  common.extend(

      ColorController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {

          var i = interpret(this.getValue());

          if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            common.each(Color.COMPONENTS, function(component) {
              if (!common.isUndefined(i[component]) &&
                  !common.isUndefined(this.__color.__state[component]) &&
                  i[component] !== this.__color.__state[component]) {
                mismatch = true;
                return {}; // break
              }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
              common.extend(this.__color.__state, i);
            }

          }

          common.extend(this.__temp.__state, this.__color.__state);

          this.__temp.a = 1;

          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
          var _flip = 255 - flip;

          common.extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
          });

          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

          this.__temp.s = 1;
          this.__temp.v = 1;

          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

          common.extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
          });

        }

      }

  );
  
  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
  
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
    });
  }
  
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
  }


  return ColorController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret,
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common),
dat.color.interpret,
dat.utils.common),
dat.utils.requestAnimationFrame = (function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
})(),
dat.dom.CenteredDiv = (function (dom, common) {


  var CenteredDiv = function() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });


    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });


  };

  CenteredDiv.prototype.show = function() {

    var _this = this;
    


    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
//    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });

  };

  CenteredDiv.prototype.hide = function() {

    var _this = this;

    var hide = function() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
//    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';

  };

  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  
  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;

})(dat.dom.dom,
dat.utils.common),
dat.dom.dom,
dat.utils.common);
},{}],5:[function(require,module,exports){
// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vSphere = new ViewSphere();
};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	// this._vDotPlane.render();

	this._vSphere.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;
},{"./ViewSphere":6}],6:[function(require,module,exports){
// ViewSphere.js

var GL = bongiovi.GL;
var gl;


// var vertices = [[0,52.573111,85.065081],[0,-52.573111,85.065081],[85.065081,0,52.573111],[85.065081,0,-52.573111],[0,52.573111,-85.065081],[0,-52.573111,-85.065081],[-85.065081,0,-52.573111],[-85.065081,0,52.573111],[52.573111,85.065081,0],[-52.573111,85.065081,0],[-52.573111,-85.065081,0],[52.573111,-85.065081,0],[20.177411,97.943209,0],[-20.177411,97.943209,0],[20.177411,73.002557,65.295472],[40.354821,85.472883,32.647736],[-20.177411,73.002557,65.295472],[-40.354821,85.472883,32.647736],[85.472883,32.647736,40.354821],[73.002557,65.295472,20.177411],[32.647736,40.354821,85.472883],[65.295472,20.177411,73.002557],[85.472883,32.647736,-40.354821],[73.002557,65.295472,-20.177411],[97.943209,0,20.177411],[97.943209,0,-20.177411],[20.177411,73.002557,-65.295472],[40.354821,85.472883,-32.647736],[65.295472,20.177411,-73.002557],[32.647736,40.354821,-85.472883],[-20.177411,73.002557,-65.295472],[-40.354821,85.472883,-32.647736],[-85.472883,32.647736,-40.354821],[-73.002557,65.295472,-20.177411],[-32.647736,40.354821,-85.472883],[-65.295472,20.177411,-73.002557],[-85.472883,32.647736,40.354821],[-73.002557,65.295472,20.177411],[-97.943209,0,-20.177411],[-97.943209,0,20.177411],[-32.647736,40.354821,85.472883],[-65.295472,20.177411,73.002557],[-20.177411,-97.943209,0],[20.177411,-97.943209,0],[-20.177411,-73.002557,65.295472],[-40.354821,-85.472883,32.647736],[20.177411,-73.002557,65.295472],[40.354821,-85.472883,32.647736],[85.472883,-32.647736,40.354821],[73.002557,-65.295472,20.177411],[32.647736,-40.354821,85.472883],[65.295472,-20.177411,73.002557],[85.472883,-32.647736,-40.354821],[73.002557,-65.295472,-20.177411],[65.295472,-20.177411,-73.002557],[32.647736,-40.354821,-85.472883],[20.177411,-73.002557,-65.295472],[40.354821,-85.472883,-32.647736],[-20.177411,-73.002557,-65.295472],[-40.354821,-85.472883,-32.647736],[-32.647736,-40.354821,-85.472883],[-65.295472,-20.177411,-73.002557],[-85.472883,-32.647736,-40.354821],[-73.002557,-65.295472,-20.177411],[-85.472883,-32.647736,40.354821],[-73.002557,-65.295472,20.177411],[-32.647736,-40.354821,85.472883],[-65.295472,-20.177411,73.002557],[0,20.177411,97.943209],[0,-20.177411,97.943209],[0,20.177411,-97.943209],[0,-20.177411,-97.943209],[0,93.417236,35.682209],[57.735027,57.735027,57.735027],[93.417236,35.682209,0],[57.735027,57.735027,-57.735027],[0,93.417236,-35.682209],[-57.735027,57.735027,-57.735027],[-93.417236,35.682209,0],[-57.735027,57.735027,57.735027],[0,-93.417236,35.682209],[57.735027,-57.735027,57.735027],[93.417236,-35.682209,0],[57.735027,-57.735027,-57.735027],[0,-93.417236,-35.682209],[-57.735027,-57.735027,-57.735027],[-93.417236,-35.682209,0],[-57.735027,-57.735027,57.735027],[-35.682209,0,93.417236],[35.682209,0,93.417236],[35.682209,0,-93.417236],[-35.682209,0,-93.417236]];
var vertices = [[-50.365704,86.072121,7.408507],[-45.787003,88.901917,0.000014],[-52.573112,85.065079,0.000014],[-43.052994,89.925140,7.740149],[-38.095371,92.459412,0.000015],[-47.619213,86.573349,15.409916],[-34.783413,93.410233,8.040121],[-29.524181,95.542259,0.000016],[-39.752472,90.339180,16.080229],[-44.286270,86.418777,23.885578],[-25.615879,96.307381,8.289488],[-20.177410,97.943207,0.000016],[-30.901699,93.633904,16.666683],[-35.862232,89.974777,24.868435],[-40.354820,85.472878,32.647751],[-15.702784,98.395607,8.469229],[-10.246352,99.473679,0.000016],[-21.170338,96.220978,17.127178],[-26.462921,92.949974,25.690760],[-31.405569,88.690742,33.876865],[-35.862232,83.642181,41.447380],[-5.292584,99.491982,8.563598],[0.000000,100.000000,0.000016],[-10.767687,97.880096,17.422499],[-16.245985,95.105644,26.286572],[-21.535374,91.225296,34.844982],[-26.462921,86.407982,42.817921],[-30.901699,80.901688,50.000011],[5.292584,99.491982,8.563598],[10.246352,99.473679,0.000016],[0.000000,98.452507,17.524385],[-5.479992,96.241287,26.600454],[-10.959984,92.854462,35.467266],[-16.245985,88.411934,43.810940],[-21.170338,83.136986,51.381504],[-25.615879,77.309593,58.026321],[15.702784,98.395607,8.469229],[20.177410,97.943207,0.000016],[10.767687,97.880096,17.422499],[5.479992,96.241287,26.600454],[0.000000,93.417229,35.682224],[-5.479992,89.467644,44.334080],[-10.767687,84.570503,52.267464],[-15.702784,78.985886,59.284504],[-20.177410,73.002548,65.295486],[25.615879,96.307381,8.289488],[29.524181,95.542259,0.000016],[21.170338,96.220978,17.127178],[16.245985,95.105644,26.286572],[10.959984,92.854462,35.467266],[5.479992,89.467644,44.334080],[0.000000,85.065071,52.573128],[-5.292584,79.865990,59.945080],[-10.246352,74.143295,66.315796],[-14.762090,68.171822,71.656700],[34.783413,93.410233,8.040121],[38.095371,92.459412,0.000015],[30.901699,93.633904,16.666683],[26.462921,92.949974,25.690760],[21.535374,91.225296,34.844982],[16.245985,88.411934,43.810940],[10.767687,84.570503,52.267464],[5.292584,79.865990,59.945080],[0.000000,74.535591,66.666679],[-4.969059,68.841835,72.360962],[-9.523843,63.029106,77.049515],[43.052994,89.925140,7.740149],[45.787003,88.901917,0.000014],[39.752472,90.339180,16.080229],[35.862232,89.974777,24.868435],[31.405569,88.690742,33.876865],[26.462921,86.407982,42.817921],[21.170338,83.136986,51.381504],[15.702784,78.985886,59.284504],[10.246352,74.143295,66.315796],[4.969059,68.841835,72.360962],[0.000000,63.316914,77.401344],[-4.578700,57.774185,81.493431],[50.365704,86.072121,7.408507],[52.573112,85.065079,0.000014],[47.619213,86.573349,15.409916],[44.286270,86.418777,23.885578],[40.354820,85.472878,32.647751],[35.862232,83.642181,41.447380],[30.901699,80.901688,50.000011],[25.615879,77.309593,58.026321],[20.177410,73.002548,65.295486],[14.762090,68.171822,71.656700],[9.523843,63.029106,77.049515],[4.578700,57.774185,81.493431],[0.000000,52.573097,85.065086],[57.774197,81.493423,4.578713],[55.576790,82.185005,12.523812],[63.029118,77.049507,9.523855],[60.801743,77.330017,17.978237],[68.171837,71.656693,14.762101],[52.761639,82.299072,21.049286],[65.853828,71.438950,23.659012],[73.002556,65.295471,20.177422],[57.868935,76.967224,26.967247],[49.274883,81.685303,29.991608],[70.516685,64.518745,29.406271],[77.309601,58.026306,25.615889],[62.738834,70.530228,33.004925],[54.175251,75.822815,36.275925],[45.109043,80.221527,39.111126],[74.573410,56.674068,35.026512],[80.901695,49.999996,30.901707],[67.148026,63.035126,38.957867],[58.778526,68.819092,42.532551],[49.725540,73.802811,45.612663],[40.319088,77.844398,48.110500],[77.844406,48.110481,40.319096],[83.642189,41.447357,35.862240],[70.887566,54.641575,44.601021],[62.867210,60.774033,48.520416],[54.000397,66.254021,51.907238],[44.601013,70.887558,54.641594],[35.026505,74.573402,56.674084],[80.221535,39.111107,45.109051],[85.472885,32.647728,40.354824],[73.802818,45.612644,49.725548],[66.254028,51.907219,54.000404],[57.735027,57.735020,57.735035],[48.520405,62.867199,60.774052],[38.957855,67.148018,63.035145],[29.406260,70.516678,64.518768],[81.685310,29.991587,49.274887],[86.418785,23.885557,44.286274],[75.822823,36.275906,54.175259],[68.819099,42.532528,58.778534],[60.774040,48.520393,62.867218],[51.907227,54.000385,66.254036],[42.532539,58.778515,68.819107],[33.004913,62.738823,70.530243],[23.659000,65.853813,71.438965],[82.299072,21.049263,52.761642],[86.573349,15.409894,47.619217],[76.967232,26.967224,57.868938],[70.530235,33.004902,62.738838],[63.035133,38.957844,67.148033],[54.641582,44.601002,70.887573],[45.612652,49.725529,73.802826],[36.275913,54.175240,75.822830],[26.967234,57.868923,76.967239],[17.978224,60.801731,77.330025],[82.185005,12.523790,55.576794],[86.072121,7.408485,50.365704],[77.330017,17.978214,60.801746],[71.438957,23.658989,65.853836],[64.518753,29.406248,70.516693],[56.674072,35.026493,74.573418],[48.110489,40.319077,77.844414],[39.111115,45.109032,80.221542],[29.991594,49.274872,81.685318],[21.049273,52.761623,82.299080],[12.523799,55.576775,82.185013],[81.493423,4.578691,57.774197],[85.065079,-0.000009,52.573112],[77.049507,9.523832,63.029118],[71.656693,14.762078,68.171837],[65.295471,20.177399,73.002556],[58.026310,25.615866,77.309608],[50.000000,30.901686,80.901703],[41.447365,35.862217,83.642197],[32.647736,40.354805,85.472893],[23.885565,44.286255,86.418793],[15.409902,47.619198,86.573357],[7.408493,50.365688,86.072128],[57.774197,81.493423,-4.578687],[63.316925,77.401337,0.000013],[63.029118,77.049507,-9.523830],[68.841850,72.360954,-4.969047],[68.171837,71.656693,-14.762078],[68.841850,72.360954,4.969071],[74.143303,66.315781,-10.246342],[73.002556,65.295471,-20.177399],[74.535599,66.666664,0.000011],[74.143303,66.315781,10.246363],[78.985893,59.284496,-15.702774],[77.309601,58.026314,-25.615870],[79.865997,59.945068,-5.292574],[79.865997,59.945068,5.292593],[78.985893,59.284489,15.702793],[83.136993,51.381493,-21.170330],[80.901695,50.000004,-30.901691],[84.570511,52.267448,-10.767678],[85.065079,52.573112,0.000009],[84.570511,52.267448,10.767695],[83.136993,51.381485,21.170345],[86.407990,42.817909,-26.462914],[83.642189,41.447372,-35.862225],[88.411942,43.810928,-16.245977],[89.467651,44.334064,-5.479985],[89.467651,44.334064,5.479999],[88.411942,43.810921,16.245993],[86.407990,42.817902,26.462929],[88.690750,33.876854,-31.405563],[85.472885,32.647743,-40.354816],[91.225304,34.844971,-21.535368],[92.854469,35.467251,-10.959978],[93.417236,35.682209,0.000006],[92.854469,35.467251,10.959990],[91.225304,34.844963,21.535379],[88.690750,33.876846,31.405575],[89.974785,24.868425,-35.862228],[86.418785,23.885572,-44.286266],[92.949982,25.690748,-26.462917],[95.105652,26.286558,-16.245981],[96.241295,26.600439,-5.479988],[96.241295,26.600439,5.479996],[95.105652,26.286554,16.245989],[92.949982,25.690741,26.462925],[89.974785,24.868414,35.862236],[90.339180,16.080219,-39.752468],[86.573349,15.409909,-47.619209],[93.633904,16.666674,-30.901697],[96.220978,17.127167,-21.170336],[97.880096,17.422485,-10.767684],[98.452507,17.524370,0.000003],[97.880096,17.422482,10.767690],[96.220978,17.127159,21.170340],[93.633904,16.666662,30.901701],[90.339180,16.080208,39.752476],[89.925140,7.740141,-43.052994],[86.072121,7.408501,-50.365704],[93.410233,8.040112,-34.783413],[96.307381,8.289476,-25.615877],[98.395607,8.469215,-15.702783],[99.491982,8.563582,-5.292583],[99.491982,8.563581,5.292585],[98.395607,8.469210,15.702785],[96.307381,8.289469,25.615881],[93.410233,8.040100,34.783413],[89.925140,7.740127,43.052994],[88.901917,0.000007,-45.787003],[85.065079,0.000009,-52.573112],[92.459412,0.000006,-38.095371],[95.542259,0.000005,-29.524181],[97.943207,0.000003,-20.177410],[99.473679,0.000002,-10.246352],[100.000000,0.000000,0.000000],[99.473679,-0.000002,10.246352],[97.943207,-0.000003,20.177410],[95.542259,-0.000005,29.524181],[92.459412,-0.000006,38.095371],[88.901917,-0.000007,45.787003],[50.365704,86.072121,-7.408479],[55.576790,82.185005,-12.523786],[47.619213,86.573349,-15.409887],[52.761639,82.299072,-21.049259],[44.286270,86.418793,-23.885551],[60.801743,77.330017,-17.978210],[49.274883,81.685318,-29.991581],[40.354820,85.472893,-32.647720],[57.868935,76.967239,-26.967220],[65.853828,71.438965,-23.658989],[45.109043,80.221542,-39.111103],[35.862232,83.642197,-41.447350],[54.175251,75.822830,-36.275902],[62.738834,70.530243,-33.004902],[70.516685,64.518761,-29.406248],[40.319088,77.844414,-48.110477],[30.901699,80.901703,-49.999989],[49.725540,73.802826,-45.612640],[58.778526,68.819107,-42.532528],[67.148026,63.035141,-38.957844],[74.573410,56.674076,-35.026497],[35.026505,74.573418,-56.674061],[25.615879,77.309608,-58.026299],[44.601013,70.887573,-54.641571],[54.000397,66.254036,-51.907215],[62.867210,60.774048,-48.520393],[70.887566,54.641590,-44.601006],[77.844406,48.110497,-40.319080],[29.406260,70.516693,-64.518738],[20.177410,73.002563,-65.295456],[38.957855,67.148033,-63.035122],[48.520405,62.867222,-60.774029],[57.735027,57.735035,-57.735020],[66.254028,51.907234,-54.000389],[73.802818,45.612659,-49.725533],[80.221535,39.111122,-45.109035],[23.659000,65.853844,-71.438950],[14.762090,68.171852,-71.656685],[33.004913,62.738846,-70.530228],[42.532539,58.778538,-68.819092],[51.907227,54.000408,-66.254021],[60.774040,48.520416,-62.867203],[68.819099,42.532551,-58.778519],[75.822823,36.275921,-54.175243],[81.685310,29.991602,-49.274879],[17.978224,60.801754,-77.330009],[9.523843,63.029129,-77.049500],[26.967234,57.868946,-76.967224],[36.275913,54.175262,-75.822815],[45.612652,49.725552,-73.802811],[54.641582,44.601025,-70.887558],[63.035133,38.957867,-67.148018],[70.530235,33.004925,-62.738831],[76.967232,26.967243,-57.868931],[82.299072,21.049282,-52.761635],[12.523799,55.576805,-82.184998],[4.578700,57.774208,-81.493416],[21.049273,52.761654,-82.299065],[29.991594,49.274895,-81.685303],[39.111115,45.109055,-80.221527],[48.110489,40.319099,-77.844398],[56.674072,35.026516,-74.573402],[64.518753,29.406271,-70.516678],[71.438957,23.659012,-65.853821],[77.330017,17.978233,-60.801739],[82.185005,12.523808,-55.576786],[7.408493,50.365719,-86.072113],[0.000000,52.573128,-85.065071],[15.409902,47.619228,-86.573341],[23.885565,44.286285,-86.418777],[32.647736,40.354836,-85.472878],[41.447365,35.862247,-83.642181],[50.000000,30.901712,-80.901688],[58.026310,25.615892,-77.309593],[65.295471,20.177422,-73.002556],[71.656693,14.762101,-68.171837],[77.049507,9.523853,-63.029118],[81.493423,4.578710,-57.774197],[43.052994,89.925140,-7.740119],[34.783413,93.410233,-8.040091],[39.752472,90.339180,-16.080198],[25.615879,96.307381,-8.289457],[30.901699,93.633904,-16.666653],[35.862232,89.974792,-24.868404],[15.702784,98.395607,-8.469196],[21.170338,96.220978,-17.127148],[26.462921,92.949989,-25.690729],[31.405569,88.690758,-33.876835],[5.292584,99.491982,-8.563565],[10.767687,97.880096,-17.422468],[16.245985,95.105659,-26.286541],[21.535374,91.225311,-34.844952],[26.462921,86.407997,-42.817890],[-5.292584,99.491982,-8.563565],[0.000000,98.452507,-17.524355],[5.479992,96.241302,-26.600424],[10.959984,92.854477,-35.467236],[16.245985,88.411949,-43.810909],[21.170338,83.137001,-51.381474],[-15.702784,98.395607,-8.469196],[-10.767687,97.880096,-17.422468],[-5.479992,96.241302,-26.600424],[0.000000,93.417244,-35.682194],[5.479992,89.467659,-44.334049],[10.767687,84.570518,-52.267433],[15.702784,78.985901,-59.284481],[-25.615879,96.307381,-8.289457],[-21.170338,96.220978,-17.127148],[-16.245985,95.105659,-26.286541],[-10.959984,92.854477,-35.467236],[-5.479992,89.467659,-44.334049],[0.000000,85.065086,-52.573097],[5.292584,79.866005,-59.945057],[10.246352,74.143311,-66.315765],[-34.783413,93.410233,-8.040091],[-30.901699,93.633904,-16.666653],[-26.462921,92.949989,-25.690729],[-21.535374,91.225311,-34.844952],[-16.245985,88.411949,-43.810909],[-10.767687,84.570518,-52.267433],[-5.292584,79.866005,-59.945057],[0.000000,74.535606,-66.666649],[4.969059,68.841866,-72.360947],[-43.052994,89.925140,-7.740119],[-39.752472,90.339180,-16.080198],[-35.862232,89.974792,-24.868404],[-31.405569,88.690758,-33.876835],[-26.462921,86.407997,-42.817890],[-21.170338,83.137001,-51.381474],[-15.702784,78.985901,-59.284481],[-10.246352,74.143311,-66.315765],[-4.969059,68.841866,-72.360947],[0.000000,63.316936,-77.401329],[-50.365704,86.072121,-7.408479],[-47.619213,86.573349,-15.409887],[-44.286270,86.418793,-23.885551],[-40.354820,85.472893,-32.647720],[-35.862232,83.642197,-41.447350],[-30.901699,80.901703,-49.999989],[-25.615879,77.309608,-58.026299],[-20.177410,73.002563,-65.295456],[-14.762090,68.171852,-71.656685],[-9.523843,63.029129,-77.049500],[-4.578700,57.774208,-81.493416],[-7.408493,50.365719,-86.072113],[-12.523799,55.576805,-82.184998],[-15.409902,47.619228,-86.573341],[-17.978224,60.801754,-77.330009],[-21.049273,52.761654,-82.299065],[-23.885565,44.286285,-86.418777],[-23.659000,65.853844,-71.438950],[-26.967234,57.868946,-76.967224],[-29.991594,49.274895,-81.685303],[-32.647736,40.354836,-85.472878],[-29.406260,70.516693,-64.518738],[-33.004913,62.738846,-70.530228],[-36.275913,54.175262,-75.822815],[-39.111115,45.109055,-80.221527],[-41.447365,35.862247,-83.642181],[-35.026505,74.573418,-56.674061],[-38.957855,67.148033,-63.035122],[-42.532539,58.778538,-68.819092],[-45.612652,49.725552,-73.802811],[-48.110489,40.319099,-77.844398],[-50.000000,30.901712,-80.901688],[-40.319088,77.844414,-48.110477],[-44.601013,70.887573,-54.641571],[-48.520405,62.867222,-60.774029],[-51.907227,54.000408,-66.254021],[-54.641582,44.601025,-70.887558],[-56.674072,35.026516,-74.573402],[-58.026310,25.615892,-77.309593],[-45.109043,80.221542,-39.111103],[-49.725540,73.802826,-45.612640],[-54.000397,66.254036,-51.907215],[-57.735027,57.735035,-57.735020],[-60.774040,48.520416,-62.867203],[-63.035133,38.957867,-67.148018],[-64.518753,29.406271,-70.516678],[-65.295471,20.177422,-73.002556],[-49.274883,81.685318,-29.991581],[-54.175251,75.822830,-36.275902],[-58.778526,68.819107,-42.532528],[-62.867210,60.774048,-48.520393],[-66.254028,51.907234,-54.000389],[-68.819099,42.532551,-58.778519],[-70.530235,33.004925,-62.738831],[-71.438957,23.659012,-65.853821],[-71.656693,14.762101,-68.171837],[-52.761639,82.299072,-21.049259],[-57.868935,76.967239,-26.967220],[-62.738834,70.530243,-33.004902],[-67.148026,63.035141,-38.957844],[-70.887566,54.641590,-44.601006],[-73.802818,45.612659,-49.725533],[-75.822823,36.275921,-54.175243],[-76.967232,26.967243,-57.868931],[-77.330017,17.978233,-60.801739],[-77.049507,9.523853,-63.029118],[-55.576790,82.185005,-12.523786],[-60.801743,77.330017,-17.978210],[-65.853828,71.438965,-23.658989],[-70.516685,64.518761,-29.406248],[-74.573410,56.674076,-35.026497],[-77.844406,48.110497,-40.319080],[-80.221535,39.111122,-45.109035],[-81.685310,29.991602,-49.274879],[-82.299072,21.049282,-52.761635],[-82.185005,12.523808,-55.576786],[-81.493423,4.578710,-57.774197],[-57.774197,81.493423,-4.578687],[-63.029118,77.049507,-9.523830],[-68.171837,71.656693,-14.762078],[-73.002556,65.295471,-20.177399],[-77.309601,58.026314,-25.615870],[-80.901695,50.000004,-30.901691],[-83.642189,41.447372,-35.862225],[-85.472885,32.647743,-40.354816],[-86.418785,23.885572,-44.286266],[-86.573349,15.409909,-47.619209],[-86.072121,7.408501,-50.365704],[-85.065079,0.000009,-52.573112],[-88.901917,0.000007,-45.787003],[-89.925140,7.740141,-43.052994],[-92.459412,0.000006,-38.095371],[-90.339180,16.080219,-39.752468],[-93.410233,8.040112,-34.783413],[-95.542259,0.000005,-29.524181],[-89.974785,24.868425,-35.862228],[-93.633904,16.666674,-30.901697],[-96.307381,8.289476,-25.615877],[-97.943207,0.000003,-20.177410],[-88.690750,33.876854,-31.405563],[-92.949982,25.690748,-26.462917],[-96.220978,17.127167,-21.170336],[-98.395607,8.469215,-15.702783],[-99.473679,0.000002,-10.246352],[-86.407990,42.817909,-26.462914],[-91.225304,34.844971,-21.535368],[-95.105652,26.286558,-16.245981],[-97.880096,17.422485,-10.767684],[-99.491982,8.563582,-5.292583],[-100.000000,0.000000,0.000000],[-83.136993,51.381493,-21.170330],[-88.411942,43.810928,-16.245977],[-92.854469,35.467251,-10.959978],[-96.241295,26.600439,-5.479988],[-98.452507,17.524370,0.000003],[-99.491982,8.563581,5.292585],[-99.473679,-0.000002,10.246352],[-78.985893,59.284496,-15.702774],[-84.570511,52.267448,-10.767678],[-89.467651,44.334064,-5.479985],[-93.417236,35.682209,0.000006],[-96.241295,26.600439,5.479996],[-97.880096,17.422482,10.767690],[-98.395607,8.469210,15.702785],[-97.943207,-0.000003,20.177410],[-74.143303,66.315781,-10.246342],[-79.865997,59.945068,-5.292574],[-85.065079,52.573112,0.000009],[-89.467651,44.334064,5.479999],[-92.854469,35.467251,10.959990],[-95.105652,26.286554,16.245989],[-96.220978,17.127159,21.170340],[-96.307381,8.289469,25.615881],[-95.542259,-0.000005,29.524181],[-68.841850,72.360954,-4.969047],[-74.535599,66.666664,0.000011],[-79.865997,59.945068,5.292593],[-84.570511,52.267448,10.767695],[-88.411942,43.810921,16.245993],[-91.225304,34.844963,21.535379],[-92.949982,25.690741,26.462925],[-93.633904,16.666662,30.901701],[-93.410233,8.040100,34.783413],[-92.459412,-0.000006,38.095371],[-63.316925,77.401337,0.000013],[-68.841850,72.360954,4.969071],[-74.143303,66.315781,10.246363],[-78.985893,59.284489,15.702793],[-83.136993,51.381485,21.170345],[-86.407990,42.817902,26.462929],[-88.690750,33.876846,31.405575],[-89.974785,24.868414,35.862236],[-90.339180,16.080208,39.752476],[-89.925140,7.740127,43.052994],[-88.901917,-0.000007,45.787003],[-57.774197,81.493423,4.578713],[-63.029118,77.049507,9.523855],[-68.171837,71.656693,14.762101],[-73.002556,65.295471,20.177422],[-77.309601,58.026306,25.615889],[-80.901695,49.999996,30.901707],[-83.642189,41.447357,35.862240],[-85.472885,32.647728,40.354824],[-86.418785,23.885557,44.286274],[-86.573349,15.409894,47.619217],[-86.072121,7.408485,50.365704],[-85.065079,-0.000009,52.573112],[-55.576790,82.185005,12.523812],[-52.761639,82.299072,21.049286],[-60.801743,77.330017,17.978237],[-49.274883,81.685303,29.991608],[-57.868935,76.967224,26.967247],[-65.853828,71.438950,23.659012],[-45.109043,80.221527,39.111126],[-54.175251,75.822815,36.275925],[-62.738834,70.530228,33.004925],[-70.516685,64.518745,29.406271],[-40.319088,77.844398,48.110500],[-49.725540,73.802811,45.612663],[-58.778526,68.819092,42.532551],[-67.148026,63.035126,38.957867],[-74.573410,56.674068,35.026512],[-35.026505,74.573402,56.674084],[-44.601013,70.887558,54.641594],[-54.000397,66.254021,51.907238],[-62.867210,60.774033,48.520416],[-70.887566,54.641575,44.601021],[-77.844406,48.110481,40.319096],[-29.406260,70.516678,64.518768],[-38.957855,67.148018,63.035145],[-48.520405,62.867199,60.774052],[-57.735027,57.735020,57.735035],[-66.254028,51.907219,54.000404],[-73.802818,45.612644,49.725548],[-80.221535,39.111107,45.109051],[-23.659000,65.853813,71.438965],[-33.004913,62.738823,70.530243],[-42.532539,58.778515,68.819107],[-51.907227,54.000385,66.254036],[-60.774040,48.520393,62.867218],[-68.819099,42.532528,58.778534],[-75.822823,36.275906,54.175259],[-81.685310,29.991587,49.274887],[-17.978224,60.801731,77.330025],[-26.967234,57.868923,76.967239],[-36.275913,54.175240,75.822830],[-45.612652,49.725529,73.802826],[-54.641582,44.601002,70.887573],[-63.035133,38.957844,67.148033],[-70.530235,33.004902,62.738838],[-76.967232,26.967224,57.868938],[-82.299072,21.049263,52.761642],[-12.523799,55.576775,82.185013],[-21.049273,52.761623,82.299080],[-29.991594,49.274872,81.685318],[-39.111115,45.109032,80.221542],[-48.110489,40.319077,77.844414],[-56.674072,35.026493,74.573418],[-64.518753,29.406248,70.516693],[-71.438957,23.658989,65.853836],[-77.330017,17.978214,60.801746],[-82.185005,12.523790,55.576794],[-7.408493,50.365688,86.072128],[-15.409902,47.619198,86.573357],[-23.885565,44.286255,86.418793],[-32.647736,40.354805,85.472893],[-41.447365,35.862217,83.642197],[-50.000000,30.901686,80.901703],[-58.026310,25.615866,77.309608],[-65.295471,20.177399,73.002556],[-71.656693,14.762078,68.171837],[-77.049507,9.523832,63.029118],[-81.493423,4.578691,57.774197],[50.365704,-86.072121,7.408479],[45.787003,-88.901917,-0.000014],[52.573112,-85.065079,-0.000014],[43.052994,-89.925140,7.740119],[38.095371,-92.459412,-0.000015],[47.619213,-86.573349,15.409887],[34.783413,-93.410233,8.040091],[29.524181,-95.542259,-0.000016],[39.752472,-90.339180,16.080198],[44.286270,-86.418793,23.885551],[25.615879,-96.307381,8.289457],[20.177410,-97.943207,-0.000016],[30.901699,-93.633904,16.666653],[35.862232,-89.974792,24.868404],[40.354820,-85.472893,32.647720],[15.702784,-98.395607,8.469196],[10.246352,-99.473679,-0.000016],[21.170338,-96.220978,17.127148],[26.462921,-92.949989,25.690729],[31.405569,-88.690758,33.876835],[35.862232,-83.642197,41.447350],[5.292584,-99.491982,8.563565],[0.000000,-100.000000,-0.000016],[10.767687,-97.880096,17.422468],[16.245985,-95.105659,26.286541],[21.535374,-91.225311,34.844952],[26.462921,-86.407997,42.817890],[30.901699,-80.901703,49.999989],[-5.292584,-99.491982,8.563565],[-10.246352,-99.473679,-0.000016],[0.000000,-98.452507,17.524355],[5.479992,-96.241302,26.600424],[10.959984,-92.854477,35.467236],[16.245985,-88.411949,43.810909],[21.170338,-83.137001,51.381474],[25.615879,-77.309608,58.026299],[-15.702784,-98.395607,8.469196],[-20.177410,-97.943207,-0.000016],[-10.767687,-97.880096,17.422468],[-5.479992,-96.241302,26.600424],[0.000000,-93.417244,35.682194],[5.479992,-89.467659,44.334049],[10.767687,-84.570518,52.267433],[15.702784,-78.985901,59.284481],[20.177410,-73.002563,65.295456],[-25.615879,-96.307381,8.289457],[-29.524181,-95.542259,-0.000016],[-21.170338,-96.220978,17.127148],[-16.245985,-95.105659,26.286541],[-10.959984,-92.854477,35.467236],[-5.479992,-89.467659,44.334049],[0.000000,-85.065086,52.573097],[5.292584,-79.866005,59.945057],[10.246352,-74.143311,66.315765],[14.762090,-68.171852,71.656685],[-34.783413,-93.410233,8.040091],[-38.095371,-92.459412,-0.000015],[-30.901699,-93.633904,16.666653],[-26.462921,-92.949989,25.690729],[-21.535374,-91.225311,34.844952],[-16.245985,-88.411949,43.810909],[-10.767687,-84.570518,52.267433],[-5.292584,-79.866005,59.945057],[0.000000,-74.535606,66.666649],[4.969059,-68.841866,72.360947],[9.523843,-63.029129,77.049500],[-43.052994,-89.925140,7.740119],[-45.787003,-88.901917,-0.000014],[-39.752472,-90.339180,16.080198],[-35.862232,-89.974792,24.868404],[-31.405569,-88.690758,33.876835],[-26.462921,-86.407997,42.817890],[-21.170338,-83.137001,51.381474],[-15.702784,-78.985901,59.284481],[-10.246352,-74.143311,66.315765],[-4.969059,-68.841866,72.360947],[0.000000,-63.316936,77.401329],[4.578700,-57.774208,81.493416],[-50.365704,-86.072121,7.408479],[-52.573112,-85.065079,-0.000014],[-47.619213,-86.573349,15.409887],[-44.286270,-86.418793,23.885551],[-40.354820,-85.472893,32.647720],[-35.862232,-83.642197,41.447350],[-30.901699,-80.901703,49.999989],[-25.615879,-77.309608,58.026299],[-20.177410,-73.002563,65.295456],[-14.762090,-68.171852,71.656685],[-9.523843,-63.029129,77.049500],[-4.578700,-57.774208,81.493416],[0.000000,-52.573128,85.065071],[81.493423,-4.578710,57.774197],[86.072121,-7.408501,50.365704],[82.185005,-12.523808,55.576786],[86.573349,-15.409909,47.619209],[77.049507,-9.523853,63.029118],[82.299072,-21.049282,52.761635],[86.418785,-23.885572,44.286266],[77.330017,-17.978233,60.801739],[71.656693,-14.762101,68.171837],[81.685310,-29.991602,49.274879],[85.472885,-32.647743,40.354816],[76.967232,-26.967243,57.868931],[71.438957,-23.659012,65.853821],[65.295471,-20.177422,73.002556],[80.221535,-39.111122,45.109035],[83.642189,-41.447372,35.862225],[75.822823,-36.275921,54.175243],[70.530235,-33.004925,62.738831],[64.518753,-29.406271,70.516678],[58.026310,-25.615892,77.309593],[77.844406,-48.110497,40.319080],[80.901695,-50.000004,30.901691],[73.802818,-45.612659,49.725533],[68.819099,-42.532551,58.778519],[63.035133,-38.957867,67.148018],[56.674072,-35.026516,74.573402],[50.000000,-30.901712,80.901688],[74.573410,-56.674076,35.026497],[77.309601,-58.026314,25.615870],[70.887566,-54.641590,44.601006],[66.254028,-51.907234,54.000389],[60.774040,-48.520416,62.867203],[54.641582,-44.601025,70.887558],[48.110489,-40.319099,77.844398],[41.447365,-35.862247,83.642181],[70.516685,-64.518761,29.406248],[73.002556,-65.295471,20.177399],[67.148026,-63.035141,38.957844],[62.867210,-60.774048,48.520393],[57.735027,-57.735035,57.735020],[51.907227,-54.000408,66.254021],[45.612652,-49.725552,73.802811],[39.111115,-45.109055,80.221527],[32.647736,-40.354836,85.472878],[65.853828,-71.438965,23.658989],[68.171837,-71.656693,14.762078],[62.738834,-70.530243,33.004902],[58.778526,-68.819107,42.532528],[54.000397,-66.254036,51.907215],[48.520405,-62.867222,60.774029],[42.532539,-58.778538,68.819092],[36.275913,-54.175262,75.822815],[29.991594,-49.274895,81.685303],[23.885565,-44.286285,86.418777],[60.801743,-77.330017,17.978210],[63.029118,-77.049507,9.523830],[57.868935,-76.967239,26.967220],[54.175251,-75.822830,36.275902],[49.725540,-73.802826,45.612640],[44.601013,-70.887573,54.641571],[38.957855,-67.148033,63.035122],[33.004913,-62.738846,70.530228],[26.967234,-57.868946,76.967224],[21.049273,-52.761654,82.299065],[15.409902,-47.619228,86.573341],[55.576790,-82.185005,12.523786],[57.774197,-81.493423,4.578687],[52.761639,-82.299072,21.049259],[49.274883,-81.685318,29.991581],[45.109043,-80.221542,39.111103],[40.319088,-77.844414,48.110477],[35.026505,-74.573418,56.674061],[29.406260,-70.516693,64.518738],[23.659000,-65.853844,71.438950],[17.978224,-60.801754,77.330009],[12.523799,-55.576805,82.184998],[7.408493,-50.365719,86.072113],[89.925140,-7.740141,43.052994],[93.410233,-8.040112,34.783413],[90.339180,-16.080219,39.752468],[96.307381,-8.289476,25.615877],[93.633904,-16.666674,30.901697],[89.974785,-24.868425,35.862228],[98.395607,-8.469215,15.702783],[96.220978,-17.127167,21.170336],[92.949982,-25.690748,26.462917],[88.690750,-33.876854,31.405563],[99.491982,-8.563582,5.292583],[97.880096,-17.422485,10.767684],[95.105652,-26.286558,16.245981],[91.225304,-34.844971,21.535368],[86.407990,-42.817909,26.462914],[99.491982,-8.563581,-5.292585],[98.452507,-17.524370,-0.000003],[96.241295,-26.600439,5.479988],[92.854469,-35.467251,10.959978],[88.411942,-43.810928,16.245977],[83.136993,-51.381493,21.170330],[98.395607,-8.469210,-15.702785],[97.880096,-17.422482,-10.767690],[96.241295,-26.600439,-5.479996],[93.417236,-35.682209,-0.000006],[89.467651,-44.334064,5.479985],[84.570511,-52.267448,10.767678],[78.985893,-59.284496,15.702774],[96.307381,-8.289469,-25.615881],[96.220978,-17.127159,-21.170340],[95.105652,-26.286554,-16.245989],[92.854469,-35.467251,-10.959990],[89.467651,-44.334064,-5.479999],[85.065079,-52.573112,-0.000009],[79.865997,-59.945068,5.292574],[74.143303,-66.315781,10.246342],[93.410233,-8.040100,-34.783413],[93.633904,-16.666662,-30.901701],[92.949982,-25.690741,-26.462925],[91.225304,-34.844963,-21.535379],[88.411942,-43.810921,-16.245993],[84.570511,-52.267448,-10.767695],[79.865997,-59.945068,-5.292593],[74.535599,-66.666664,-0.000011],[68.841850,-72.360954,4.969047],[89.925140,-7.740127,-43.052994],[90.339180,-16.080208,-39.752476],[89.974785,-24.868414,-35.862236],[88.690750,-33.876846,-31.405575],[86.407990,-42.817902,-26.462929],[83.136993,-51.381485,-21.170345],[78.985893,-59.284489,-15.702793],[74.143303,-66.315781,-10.246363],[68.841850,-72.360954,-4.969071],[63.316925,-77.401337,-0.000013],[86.072121,-7.408485,-50.365704],[86.573349,-15.409894,-47.619217],[86.418785,-23.885557,-44.286274],[85.472885,-32.647728,-40.354824],[83.642189,-41.447357,-35.862240],[80.901695,-49.999996,-30.901707],[77.309601,-58.026306,-25.615889],[73.002556,-65.295471,-20.177422],[68.171837,-71.656693,-14.762101],[63.029118,-77.049507,-9.523855],[57.774197,-81.493423,-4.578713],[81.493423,-4.578691,-57.774197],[82.185005,-12.523790,-55.576794],[77.049507,-9.523832,-63.029118],[77.330017,-17.978214,-60.801746],[71.656693,-14.762078,-68.171837],[82.299072,-21.049263,-52.761642],[71.438957,-23.658989,-65.853836],[65.295471,-20.177399,-73.002556],[76.967232,-26.967224,-57.868938],[81.685310,-29.991587,-49.274887],[64.518753,-29.406248,-70.516693],[58.026310,-25.615866,-77.309608],[70.530235,-33.004902,-62.738838],[75.822823,-36.275906,-54.175259],[80.221535,-39.111107,-45.109051],[56.674072,-35.026493,-74.573418],[50.000000,-30.901686,-80.901703],[63.035133,-38.957844,-67.148033],[68.819099,-42.532528,-58.778534],[73.802818,-45.612644,-49.725548],[77.844406,-48.110481,-40.319096],[48.110489,-40.319077,-77.844414],[41.447365,-35.862217,-83.642197],[54.641582,-44.601002,-70.887573],[60.774040,-48.520393,-62.867218],[66.254028,-51.907219,-54.000404],[70.887566,-54.641575,-44.601021],[74.573410,-56.674068,-35.026512],[39.111115,-45.109032,-80.221542],[32.647736,-40.354805,-85.472893],[45.612652,-49.725529,-73.802826],[51.907227,-54.000385,-66.254036],[57.735027,-57.735020,-57.735035],[62.867210,-60.774033,-48.520416],[67.148026,-63.035126,-38.957867],[70.516685,-64.518745,-29.406271],[29.991594,-49.274872,-81.685318],[23.885565,-44.286255,-86.418793],[36.275913,-54.175240,-75.822830],[42.532539,-58.778515,-68.819107],[48.520405,-62.867199,-60.774052],[54.000397,-66.254021,-51.907238],[58.778526,-68.819092,-42.532551],[62.738834,-70.530228,-33.004925],[65.853828,-71.438950,-23.659012],[21.049273,-52.761623,-82.299080],[15.409902,-47.619198,-86.573357],[26.967234,-57.868923,-76.967239],[33.004913,-62.738823,-70.530243],[38.957855,-67.148018,-63.035145],[44.601013,-70.887558,-54.641594],[49.725540,-73.802811,-45.612663],[54.175251,-75.822815,-36.275925],[57.868935,-76.967224,-26.967247],[60.801743,-77.330017,-17.978237],[12.523799,-55.576775,-82.185013],[7.408493,-50.365688,-86.072128],[17.978224,-60.801731,-77.330025],[23.659000,-65.853813,-71.438965],[29.406260,-70.516678,-64.518768],[35.026505,-74.573402,-56.674084],[40.319088,-77.844398,-48.110500],[45.109043,-80.221527,-39.111126],[49.274883,-81.685303,-29.991608],[52.761639,-82.299072,-21.049286],[55.576790,-82.185005,-12.523812],[4.578700,-57.774185,-81.493431],[0.000000,-52.573097,-85.065086],[9.523843,-63.029106,-77.049515],[14.762090,-68.171822,-71.656700],[20.177410,-73.002548,-65.295486],[25.615879,-77.309593,-58.026321],[30.901699,-80.901688,-50.000011],[35.862232,-83.642181,-41.447380],[40.354820,-85.472878,-32.647751],[44.286270,-86.418777,-23.885578],[47.619213,-86.573349,-15.409916],[50.365704,-86.072121,-7.408507],[-4.578700,-57.774185,-81.493431],[0.000000,-63.316914,-77.401344],[-9.523843,-63.029106,-77.049515],[-4.969059,-68.841835,-72.360962],[-14.762090,-68.171822,-71.656700],[4.969059,-68.841835,-72.360962],[-10.246352,-74.143295,-66.315796],[-20.177410,-73.002548,-65.295486],[0.000000,-74.535591,-66.666679],[10.246352,-74.143295,-66.315796],[-15.702784,-78.985886,-59.284504],[-25.615879,-77.309593,-58.026321],[-5.292584,-79.865990,-59.945080],[5.292584,-79.865990,-59.945080],[15.702784,-78.985886,-59.284504],[-21.170338,-83.136986,-51.381504],[-30.901699,-80.901688,-50.000011],[-10.767687,-84.570503,-52.267464],[0.000000,-85.065071,-52.573128],[10.767687,-84.570503,-52.267464],[21.170338,-83.136986,-51.381504],[-26.462921,-86.407982,-42.817921],[-35.862232,-83.642181,-41.447380],[-16.245985,-88.411934,-43.810940],[-5.479992,-89.467644,-44.334080],[5.479992,-89.467644,-44.334080],[16.245985,-88.411934,-43.810940],[26.462921,-86.407982,-42.817921],[-31.405569,-88.690742,-33.876865],[-40.354820,-85.472878,-32.647751],[-21.535374,-91.225296,-34.844982],[-10.959984,-92.854462,-35.467266],[0.000000,-93.417229,-35.682224],[10.959984,-92.854462,-35.467266],[21.535374,-91.225296,-34.844982],[31.405569,-88.690742,-33.876865],[-35.862232,-89.974777,-24.868435],[-44.286270,-86.418777,-23.885578],[-26.462921,-92.949974,-25.690760],[-16.245985,-95.105644,-26.286572],[-5.479992,-96.241287,-26.600454],[5.479992,-96.241287,-26.600454],[16.245985,-95.105644,-26.286572],[26.462921,-92.949974,-25.690760],[35.862232,-89.974777,-24.868435],[-39.752472,-90.339180,-16.080229],[-47.619213,-86.573349,-15.409916],[-30.901699,-93.633904,-16.666683],[-21.170338,-96.220978,-17.127178],[-10.767687,-97.880096,-17.422499],[0.000000,-98.452507,-17.524385],[10.767687,-97.880096,-17.422499],[21.170338,-96.220978,-17.127178],[30.901699,-93.633904,-16.666683],[39.752472,-90.339180,-16.080229],[-43.052994,-89.925140,-7.740149],[-50.365704,-86.072121,-7.408507],[-34.783413,-93.410233,-8.040121],[-25.615879,-96.307381,-8.289488],[-15.702784,-98.395607,-8.469229],[-5.292584,-99.491982,-8.563598],[5.292584,-99.491982,-8.563598],[15.702784,-98.395607,-8.469229],[25.615879,-96.307381,-8.289488],[34.783413,-93.410233,-8.040121],[43.052994,-89.925140,-7.740149],[-7.408493,-50.365688,-86.072128],[-12.523799,-55.576775,-82.185013],[-15.409902,-47.619198,-86.573357],[-21.049273,-52.761623,-82.299080],[-23.885565,-44.286255,-86.418793],[-17.978224,-60.801731,-77.330025],[-29.991594,-49.274872,-81.685318],[-32.647736,-40.354805,-85.472893],[-26.967234,-57.868923,-76.967239],[-23.659000,-65.853813,-71.438965],[-39.111115,-45.109032,-80.221542],[-41.447365,-35.862217,-83.642197],[-36.275913,-54.175240,-75.822830],[-33.004913,-62.738823,-70.530243],[-29.406260,-70.516678,-64.518768],[-48.110489,-40.319077,-77.844414],[-50.000000,-30.901686,-80.901703],[-45.612652,-49.725529,-73.802826],[-42.532539,-58.778515,-68.819107],[-38.957855,-67.148018,-63.035145],[-35.026505,-74.573402,-56.674084],[-56.674072,-35.026493,-74.573418],[-58.026310,-25.615866,-77.309608],[-54.641582,-44.601002,-70.887573],[-51.907227,-54.000385,-66.254036],[-48.520405,-62.867199,-60.774052],[-44.601013,-70.887558,-54.641594],[-40.319088,-77.844398,-48.110500],[-64.518753,-29.406248,-70.516693],[-65.295471,-20.177399,-73.002556],[-63.035133,-38.957844,-67.148033],[-60.774040,-48.520393,-62.867218],[-57.735027,-57.735020,-57.735035],[-54.000397,-66.254021,-51.907238],[-49.725540,-73.802811,-45.612663],[-45.109043,-80.221527,-39.111126],[-71.438957,-23.658989,-65.853836],[-71.656693,-14.762078,-68.171837],[-70.530235,-33.004902,-62.738838],[-68.819099,-42.532528,-58.778534],[-66.254028,-51.907219,-54.000404],[-62.867210,-60.774033,-48.520416],[-58.778526,-68.819092,-42.532551],[-54.175251,-75.822815,-36.275925],[-49.274883,-81.685303,-29.991608],[-77.330017,-17.978214,-60.801746],[-77.049507,-9.523832,-63.029118],[-76.967232,-26.967224,-57.868938],[-75.822823,-36.275906,-54.175259],[-73.802818,-45.612644,-49.725548],[-70.887566,-54.641575,-44.601021],[-67.148026,-63.035126,-38.957867],[-62.738834,-70.530228,-33.004925],[-57.868935,-76.967224,-26.967247],[-52.761639,-82.299072,-21.049286],[-82.185005,-12.523790,-55.576794],[-81.493423,-4.578691,-57.774197],[-82.299072,-21.049263,-52.761642],[-81.685310,-29.991587,-49.274887],[-80.221535,-39.111107,-45.109051],[-77.844406,-48.110481,-40.319096],[-74.573410,-56.674068,-35.026512],[-70.516685,-64.518745,-29.406271],[-65.853828,-71.438950,-23.659012],[-60.801743,-77.330017,-17.978237],[-55.576790,-82.185005,-12.523812],[-86.072121,-7.408485,-50.365704],[-86.573349,-15.409894,-47.619217],[-86.418785,-23.885557,-44.286274],[-85.472885,-32.647728,-40.354824],[-83.642189,-41.447357,-35.862240],[-80.901695,-49.999996,-30.901707],[-77.309601,-58.026306,-25.615889],[-73.002556,-65.295471,-20.177422],[-68.171837,-71.656693,-14.762101],[-63.029118,-77.049507,-9.523855],[-57.774197,-81.493423,-4.578713],[-89.925140,-7.740127,-43.052994],[-93.410233,-8.040100,-34.783413],[-90.339180,-16.080208,-39.752476],[-96.307381,-8.289469,-25.615881],[-93.633904,-16.666662,-30.901701],[-89.974785,-24.868414,-35.862236],[-98.395607,-8.469210,-15.702785],[-96.220978,-17.127159,-21.170340],[-92.949982,-25.690741,-26.462925],[-88.690750,-33.876846,-31.405575],[-99.491982,-8.563581,-5.292585],[-97.880096,-17.422482,-10.767690],[-95.105652,-26.286554,-16.245989],[-91.225304,-34.844963,-21.535379],[-86.407990,-42.817902,-26.462929],[-99.491982,-8.563582,5.292583],[-98.452507,-17.524370,-0.000003],[-96.241295,-26.600439,-5.479996],[-92.854469,-35.467251,-10.959990],[-88.411942,-43.810921,-16.245993],[-83.136993,-51.381485,-21.170345],[-98.395607,-8.469215,15.702783],[-97.880096,-17.422485,10.767684],[-96.241295,-26.600439,5.479988],[-93.417236,-35.682209,-0.000006],[-89.467651,-44.334064,-5.479999],[-84.570511,-52.267448,-10.767695],[-78.985893,-59.284489,-15.702793],[-96.307381,-8.289476,25.615877],[-96.220978,-17.127167,21.170336],[-95.105652,-26.286558,16.245981],[-92.854469,-35.467251,10.959978],[-89.467651,-44.334064,5.479985],[-85.065079,-52.573112,-0.000009],[-79.865997,-59.945068,-5.292593],[-74.143303,-66.315781,-10.246363],[-93.410233,-8.040112,34.783413],[-93.633904,-16.666674,30.901697],[-92.949982,-25.690748,26.462917],[-91.225304,-34.844971,21.535368],[-88.411942,-43.810928,16.245977],[-84.570511,-52.267448,10.767678],[-79.865997,-59.945068,5.292574],[-74.535599,-66.666664,-0.000011],[-68.841850,-72.360954,-4.969071],[-89.925140,-7.740141,43.052994],[-90.339180,-16.080219,39.752468],[-89.974785,-24.868425,35.862228],[-88.690750,-33.876854,31.405563],[-86.407990,-42.817909,26.462914],[-83.136993,-51.381493,21.170330],[-78.985893,-59.284496,15.702774],[-74.143303,-66.315781,10.246342],[-68.841850,-72.360954,4.969047],[-63.316925,-77.401337,-0.000013],[-86.072121,-7.408501,50.365704],[-86.573349,-15.409909,47.619209],[-86.418785,-23.885572,44.286266],[-85.472885,-32.647743,40.354816],[-83.642189,-41.447372,35.862225],[-80.901695,-50.000004,30.901691],[-77.309601,-58.026314,25.615870],[-73.002556,-65.295471,20.177399],[-68.171837,-71.656693,14.762078],[-63.029118,-77.049507,9.523830],[-57.774197,-81.493423,4.578687],[-81.493423,-4.578710,57.774197],[-82.185005,-12.523808,55.576786],[-77.049507,-9.523853,63.029118],[-77.330017,-17.978233,60.801739],[-71.656693,-14.762101,68.171837],[-82.299072,-21.049282,52.761635],[-71.438957,-23.659012,65.853821],[-65.295471,-20.177422,73.002556],[-76.967232,-26.967243,57.868931],[-81.685310,-29.991602,49.274879],[-64.518753,-29.406271,70.516678],[-58.026310,-25.615892,77.309593],[-70.530235,-33.004925,62.738831],[-75.822823,-36.275921,54.175243],[-80.221535,-39.111122,45.109035],[-56.674072,-35.026516,74.573402],[-50.000000,-30.901712,80.901688],[-63.035133,-38.957867,67.148018],[-68.819099,-42.532551,58.778519],[-73.802818,-45.612659,49.725533],[-77.844406,-48.110497,40.319080],[-48.110489,-40.319099,77.844398],[-41.447365,-35.862247,83.642181],[-54.641582,-44.601025,70.887558],[-60.774040,-48.520416,62.867203],[-66.254028,-51.907234,54.000389],[-70.887566,-54.641590,44.601006],[-74.573410,-56.674076,35.026497],[-39.111115,-45.109055,80.221527],[-32.647736,-40.354836,85.472878],[-45.612652,-49.725552,73.802811],[-51.907227,-54.000408,66.254021],[-57.735027,-57.735035,57.735020],[-62.867210,-60.774048,48.520393],[-67.148026,-63.035141,38.957844],[-70.516685,-64.518761,29.406248],[-29.991594,-49.274895,81.685303],[-23.885565,-44.286285,86.418777],[-36.275913,-54.175262,75.822815],[-42.532539,-58.778538,68.819092],[-48.520405,-62.867222,60.774029],[-54.000397,-66.254036,51.907215],[-58.778526,-68.819107,42.532528],[-62.738834,-70.530243,33.004902],[-65.853828,-71.438965,23.658989],[-21.049273,-52.761654,82.299065],[-15.409902,-47.619228,86.573341],[-26.967234,-57.868946,76.967224],[-33.004913,-62.738846,70.530228],[-38.957855,-67.148033,63.035122],[-44.601013,-70.887573,54.641571],[-49.725540,-73.802826,45.612640],[-54.175251,-75.822830,36.275902],[-57.868935,-76.967239,26.967220],[-60.801743,-77.330017,17.978210],[-12.523799,-55.576805,82.184998],[-7.408493,-50.365719,86.072113],[-17.978224,-60.801754,77.330009],[-23.659000,-65.853844,71.438950],[-29.406260,-70.516693,64.518738],[-35.026505,-74.573418,56.674061],[-40.319088,-77.844414,48.110477],[-45.109043,-80.221542,39.111103],[-49.274883,-81.685318,29.991581],[-52.761639,-82.299072,21.049259],[-55.576790,-82.185005,12.523786],[0.000000,-45.787018,88.901909],[-7.740134,-43.053009,89.925133],[0.000000,-38.095387,92.459404],[-16.080214,-39.752487,90.339172],[-8.040106,-34.783428,93.410225],[0.000000,-29.524197,95.542252],[-24.868420,-35.862247,89.974777],[-16.666668,-30.901714,93.633896],[-8.289473,-25.615894,96.307373],[0.000000,-20.177425,97.943207],[-33.876850,-31.405584,88.690742],[-25.690744,-26.462936,92.949974],[-17.127163,-21.170353,96.220978],[-8.469213,-15.702800,98.395607],[0.000000,-10.246368,99.473679],[-42.817905,-26.462934,86.407982],[-34.844967,-21.535389,91.225304],[-26.286556,-16.246000,95.105652],[-17.422483,-10.767703,97.880096],[-8.563581,-5.292600,99.491982],[0.000000,-0.000016,100.000000],[-51.381489,-21.170351,83.136993],[-43.810925,-16.246000,88.411942],[-35.467251,-10.959999,92.854469],[-26.600439,-5.480008,96.241295],[-17.524370,-0.000016,98.452507],[-8.563581,5.292568,99.491982],[0.000000,10.246336,99.473679],[-59.284492,-15.702796,78.985893],[-52.267448,-10.767700,84.570511],[-44.334064,-5.480007,89.467651],[-35.682209,-0.000015,93.417236],[-26.600439,5.479976,96.241295],[-17.422483,10.767671,97.880096],[-8.469213,15.702767,98.395607],[0.000000,20.177395,97.943207],[-66.315781,-10.246365,74.143303],[-59.945068,-5.292597,79.865997],[-52.573112,-0.000014,85.065079],[-44.334064,5.479977,89.467651],[-35.467251,10.959969,92.854469],[-26.286556,16.245970,95.105652],[-17.127163,21.170322,96.220978],[-8.289473,25.615864,96.307388],[0.000000,29.524166,95.542267],[-72.360954,-4.969070,68.841850],[-66.666664,-0.000012,74.535599],[-59.945068,5.292571,79.865997],[-52.267448,10.767673,84.570511],[-43.810925,16.245970,88.411942],[-34.844967,21.535358,91.225304],[-25.690744,26.462906,92.949989],[-16.666668,30.901684,93.633911],[-8.040106,34.783398,93.410240],[0.000000,38.095356,92.459419],[-77.401337,-0.000010,63.316925],[-72.360954,4.969048,68.841850],[-66.315781,10.246340,74.143303],[-59.284492,15.702771,78.985893],[-51.381489,21.170324,83.136993],[-42.817905,26.462908,86.407997],[-33.876850,31.405554,88.690758],[-24.868420,35.862217,89.974792],[-16.080214,39.752457,90.339188],[-7.740134,43.052979,89.925148],[0.000000,45.786987,88.901924],[77.401337,-0.000010,63.316925],[72.360954,-4.969070,68.841850],[72.360954,4.969048,68.841850],[66.315781,-10.246365,74.143303],[66.666664,-0.000012,74.535599],[66.315781,10.246340,74.143303],[59.284492,-15.702796,78.985893],[59.945068,-5.292597,79.865997],[59.945068,5.292571,79.865997],[59.284492,15.702771,78.985893],[51.381489,-21.170351,83.136993],[52.267448,-10.767700,84.570511],[52.573112,-0.000014,85.065079],[52.267448,10.767673,84.570511],[51.381489,21.170324,83.136993],[42.817905,-26.462934,86.407982],[43.810925,-16.246000,88.411942],[44.334064,-5.480007,89.467651],[44.334064,5.479977,89.467651],[43.810925,16.245970,88.411942],[42.817905,26.462908,86.407997],[33.876850,-31.405584,88.690742],[34.844967,-21.535389,91.225304],[35.467251,-10.959999,92.854469],[35.682209,-0.000015,93.417236],[35.467251,10.959969,92.854469],[34.844967,21.535358,91.225304],[33.876850,31.405554,88.690758],[24.868420,-35.862247,89.974777],[25.690744,-26.462936,92.949974],[26.286556,-16.246000,95.105652],[26.600439,-5.480008,96.241295],[26.600439,5.479976,96.241295],[26.286556,16.245970,95.105652],[25.690744,26.462906,92.949989],[24.868420,35.862217,89.974792],[16.080214,-39.752487,90.339172],[16.666668,-30.901714,93.633896],[17.127163,-21.170353,96.220978],[17.422483,-10.767703,97.880096],[17.524370,-0.000016,98.452507],[17.422483,10.767671,97.880096],[17.127163,21.170322,96.220978],[16.666668,30.901684,93.633911],[16.080214,39.752457,90.339188],[7.740134,-43.053009,89.925133],[8.040106,-34.783428,93.410225],[8.289473,-25.615894,96.307373],[8.469213,-15.702800,98.395607],[8.563581,-5.292600,99.491982],[8.563581,5.292568,99.491982],[8.469213,15.702767,98.395607],[8.289473,25.615864,96.307388],[8.040106,34.783398,93.410240],[7.740134,43.052979,89.925148],[0.000000,45.787018,-88.901909],[7.740134,43.053009,-89.925133],[0.000000,38.095387,-92.459404],[8.040106,34.783428,-93.410225],[0.000000,29.524197,-95.542252],[16.080214,39.752487,-90.339172],[8.289473,25.615894,-96.307373],[0.000000,20.177425,-97.943207],[16.666668,30.901714,-93.633896],[24.868420,35.862247,-89.974777],[8.469213,15.702800,-98.395607],[0.000000,10.246368,-99.473679],[17.127163,21.170353,-96.220978],[25.690744,26.462936,-92.949974],[33.876850,31.405584,-88.690742],[8.563581,5.292600,-99.491982],[0.000000,0.000016,-100.000000],[17.422483,10.767703,-97.880096],[26.286556,16.246000,-95.105652],[34.844967,21.535389,-91.225304],[42.817905,26.462934,-86.407982],[8.563581,-5.292568,-99.491982],[0.000000,-10.246336,-99.473679],[17.524370,0.000016,-98.452507],[26.600439,5.480008,-96.241295],[35.467251,10.959999,-92.854469],[43.810925,16.246000,-88.411942],[51.381489,21.170351,-83.136993],[8.469213,-15.702767,-98.395607],[0.000000,-20.177395,-97.943207],[17.422483,-10.767671,-97.880096],[26.600439,-5.479976,-96.241295],[35.682209,0.000015,-93.417236],[44.334064,5.480007,-89.467651],[52.267448,10.767700,-84.570511],[59.284492,15.702796,-78.985893],[8.289473,-25.615864,-96.307388],[0.000000,-29.524166,-95.542267],[17.127163,-21.170322,-96.220978],[26.286556,-16.245970,-95.105652],[35.467251,-10.959969,-92.854469],[44.334064,-5.479977,-89.467651],[52.573112,0.000014,-85.065079],[59.945068,5.292597,-79.865997],[66.315781,10.246365,-74.143303],[8.040106,-34.783398,-93.410240],[0.000000,-38.095356,-92.459419],[16.666668,-30.901684,-93.633911],[25.690744,-26.462906,-92.949989],[34.844967,-21.535358,-91.225304],[43.810925,-16.245970,-88.411942],[52.267448,-10.767673,-84.570511],[59.945068,-5.292571,-79.865997],[66.666664,0.000012,-74.535599],[72.360954,4.969070,-68.841850],[7.740134,-43.052979,-89.925148],[0.000000,-45.786987,-88.901924],[16.080214,-39.752457,-90.339188],[24.868420,-35.862217,-89.974792],[33.876850,-31.405554,-88.690758],[42.817905,-26.462908,-86.407997],[51.381489,-21.170324,-83.136993],[59.284492,-15.702771,-78.985893],[66.315781,-10.246340,-74.143303],[72.360954,-4.969048,-68.841850],[77.401337,0.000010,-63.316925],[-7.740134,43.053009,-89.925133],[-16.080214,39.752487,-90.339172],[-8.040106,34.783428,-93.410225],[-24.868420,35.862247,-89.974777],[-16.666668,30.901714,-93.633896],[-8.289473,25.615894,-96.307373],[-33.876850,31.405584,-88.690742],[-25.690744,26.462936,-92.949974],[-17.127163,21.170353,-96.220978],[-8.469213,15.702800,-98.395607],[-42.817905,26.462934,-86.407982],[-34.844967,21.535389,-91.225304],[-26.286556,16.246000,-95.105652],[-17.422483,10.767703,-97.880096],[-8.563581,5.292600,-99.491982],[-51.381489,21.170351,-83.136993],[-43.810925,16.246000,-88.411942],[-35.467251,10.959999,-92.854469],[-26.600439,5.480008,-96.241295],[-17.524370,0.000016,-98.452507],[-8.563581,-5.292568,-99.491982],[-59.284492,15.702796,-78.985893],[-52.267448,10.767700,-84.570511],[-44.334064,5.480007,-89.467651],[-35.682209,0.000015,-93.417236],[-26.600439,-5.479976,-96.241295],[-17.422483,-10.767671,-97.880096],[-8.469213,-15.702767,-98.395607],[-66.315781,10.246365,-74.143303],[-59.945068,5.292597,-79.865997],[-52.573112,0.000014,-85.065079],[-44.334064,-5.479977,-89.467651],[-35.467251,-10.959969,-92.854469],[-26.286556,-16.245970,-95.105652],[-17.127163,-21.170322,-96.220978],[-8.289473,-25.615864,-96.307388],[-72.360954,4.969070,-68.841850],[-66.666664,0.000012,-74.535599],[-59.945068,-5.292571,-79.865997],[-52.267448,-10.767673,-84.570511],[-43.810925,-16.245970,-88.411942],[-34.844967,-21.535358,-91.225304],[-25.690744,-26.462906,-92.949989],[-16.666668,-30.901684,-93.633911],[-8.040106,-34.783398,-93.410240],[-77.401337,0.000010,-63.316925],[-72.360954,-4.969048,-68.841850],[-66.315781,-10.246340,-74.143303],[-59.284492,-15.702771,-78.985893],[-51.381489,-21.170324,-83.136993],[-42.817905,-26.462908,-86.407997],[-33.876850,-31.405554,-88.690758],[-24.868420,-35.862217,-89.974792],[-16.080214,-39.752457,-90.339188],[-7.740134,-43.052979,-89.925148]];
var faces = [[1,2,3],[4,5,2],[2,1,4],[6,4,1],[7,8,5],[5,4,7],[9,7,4],[4,6,9],[10,9,6],[11,12,8],[8,7,11],[13,11,7],[7,9,13],[14,13,9],[9,10,14],[15,14,10],[16,17,12],[12,11,16],[18,16,11],[11,13,18],[19,18,13],[13,14,19],[20,19,14],[14,15,20],[21,20,15],[22,23,17],[17,16,22],[24,22,16],[16,18,24],[25,24,18],[18,19,25],[26,25,19],[19,20,26],[27,26,20],[20,21,27],[28,27,21],[29,30,23],[23,22,29],[31,29,22],[22,24,31],[32,31,24],[24,25,32],[33,32,25],[25,26,33],[34,33,26],[26,27,34],[35,34,27],[27,28,35],[36,35,28],[37,38,30],[30,29,37],[39,37,29],[29,31,39],[40,39,31],[31,32,40],[41,40,32],[32,33,41],[42,41,33],[33,34,42],[43,42,34],[34,35,43],[44,43,35],[35,36,44],[45,44,36],[46,47,38],[38,37,46],[48,46,37],[37,39,48],[49,48,39],[39,40,49],[50,49,40],[40,41,50],[51,50,41],[41,42,51],[52,51,42],[42,43,52],[53,52,43],[43,44,53],[54,53,44],[44,45,54],[55,54,45],[56,57,47],[47,46,56],[58,56,46],[46,48,58],[59,58,48],[48,49,59],[60,59,49],[49,50,60],[61,60,50],[50,51,61],[62,61,51],[51,52,62],[63,62,52],[52,53,63],[64,63,53],[53,54,64],[65,64,54],[54,55,65],[66,65,55],[67,68,57],[57,56,67],[69,67,56],[56,58,69],[70,69,58],[58,59,70],[71,70,59],[59,60,71],[72,71,60],[60,61,72],[73,72,61],[61,62,73],[74,73,62],[62,63,74],[75,74,63],[63,64,75],[76,75,64],[64,65,76],[77,76,65],[65,66,77],[78,77,66],[79,80,68],[68,67,79],[81,79,67],[67,69,81],[82,81,69],[69,70,82],[83,82,70],[70,71,83],[84,83,71],[71,72,84],[85,84,72],[72,73,85],[86,85,73],[73,74,86],[87,86,74],[74,75,87],[88,87,75],[75,76,88],[89,88,76],[76,77,89],[90,89,77],[77,78,90],[91,90,78],[79,92,80],[93,94,92],[92,79,93],[81,93,79],[95,96,94],[94,93,95],[97,95,93],[93,81,97],[82,97,81],[98,99,96],[96,95,98],[100,98,95],[95,97,100],[101,100,97],[97,82,101],[83,101,82],[102,103,99],[99,98,102],[104,102,98],[98,100,104],[105,104,100],[100,101,105],[106,105,101],[101,83,106],[84,106,83],[107,108,103],[103,102,107],[109,107,102],[102,104,109],[110,109,104],[104,105,110],[111,110,105],[105,106,111],[112,111,106],[106,84,112],[85,112,84],[113,114,108],[108,107,113],[115,113,107],[107,109,115],[116,115,109],[109,110,116],[117,116,110],[110,111,117],[118,117,111],[111,112,118],[119,118,112],[112,85,119],[86,119,85],[120,121,114],[114,113,120],[122,120,113],[113,115,122],[123,122,115],[115,116,123],[124,123,116],[116,117,124],[125,124,117],[117,118,125],[126,125,118],[118,119,126],[127,126,119],[119,86,127],[87,127,86],[128,129,121],[121,120,128],[130,128,120],[120,122,130],[131,130,122],[122,123,131],[132,131,123],[123,124,132],[133,132,124],[124,125,133],[134,133,125],[125,126,134],[135,134,126],[126,127,135],[136,135,127],[127,87,136],[88,136,87],[137,138,129],[129,128,137],[139,137,128],[128,130,139],[140,139,130],[130,131,140],[141,140,131],[131,132,141],[142,141,132],[132,133,142],[143,142,133],[133,134,143],[144,143,134],[134,135,144],[145,144,135],[135,136,145],[146,145,136],[136,88,146],[89,146,88],[147,148,138],[138,137,147],[149,147,137],[137,139,149],[150,149,139],[139,140,150],[151,150,140],[140,141,151],[152,151,141],[141,142,152],[153,152,142],[142,143,153],[154,153,143],[143,144,154],[155,154,144],[144,145,155],[156,155,145],[145,146,156],[157,156,146],[146,89,157],[90,157,89],[158,159,148],[148,147,158],[160,158,147],[147,149,160],[161,160,149],[149,150,161],[162,161,150],[150,151,162],[163,162,151],[151,152,163],[164,163,152],[152,153,164],[165,164,153],[153,154,165],[166,165,154],[154,155,166],[167,166,155],[155,156,167],[168,167,156],[156,157,168],[169,168,157],[157,90,169],[91,169,90],[92,170,80],[171,172,170],[170,92,171],[94,171,92],[173,174,172],[172,171,173],[175,173,171],[171,94,175],[96,175,94],[176,177,174],[174,173,176],[178,176,173],[173,175,178],[179,178,175],[175,96,179],[99,179,96],[180,181,177],[177,176,180],[182,180,176],[176,178,182],[183,182,178],[178,179,183],[184,183,179],[179,99,184],[103,184,99],[185,186,181],[181,180,185],[187,185,180],[180,182,187],[188,187,182],[182,183,188],[189,188,183],[183,184,189],[190,189,184],[184,103,190],[108,190,103],[191,192,186],[186,185,191],[193,191,185],[185,187,193],[194,193,187],[187,188,194],[195,194,188],[188,189,195],[196,195,189],[189,190,196],[197,196,190],[190,108,197],[114,197,108],[198,199,192],[192,191,198],[200,198,191],[191,193,200],[201,200,193],[193,194,201],[202,201,194],[194,195,202],[203,202,195],[195,196,203],[204,203,196],[196,197,204],[205,204,197],[197,114,205],[121,205,114],[206,207,199],[199,198,206],[208,206,198],[198,200,208],[209,208,200],[200,201,209],[210,209,201],[201,202,210],[211,210,202],[202,203,211],[212,211,203],[203,204,212],[213,212,204],[204,205,213],[214,213,205],[205,121,214],[129,214,121],[215,216,207],[207,206,215],[217,215,206],[206,208,217],[218,217,208],[208,209,218],[219,218,209],[209,210,219],[220,219,210],[210,211,220],[221,220,211],[211,212,221],[222,221,212],[212,213,222],[223,222,213],[213,214,223],[224,223,214],[214,129,224],[138,224,129],[225,226,216],[216,215,225],[227,225,215],[215,217,227],[228,227,217],[217,218,228],[229,228,218],[218,219,229],[230,229,219],[219,220,230],[231,230,220],[220,221,231],[232,231,221],[221,222,232],[233,232,222],[222,223,233],[234,233,223],[223,224,234],[235,234,224],[224,138,235],[148,235,138],[236,237,226],[226,225,236],[238,236,225],[225,227,238],[239,238,227],[227,228,239],[240,239,228],[228,229,240],[241,240,229],[229,230,241],[242,241,230],[230,231,242],[243,242,231],[231,232,243],[244,243,232],[232,233,244],[245,244,233],[233,234,245],[246,245,234],[234,235,246],[247,246,235],[235,148,247],[159,247,148],[170,248,80],[249,250,248],[248,170,249],[172,249,170],[251,252,250],[250,249,251],[253,251,249],[249,172,253],[174,253,172],[254,255,252],[252,251,254],[256,254,251],[251,253,256],[257,256,253],[253,174,257],[177,257,174],[258,259,255],[255,254,258],[260,258,254],[254,256,260],[261,260,256],[256,257,261],[262,261,257],[257,177,262],[181,262,177],[263,264,259],[259,258,263],[265,263,258],[258,260,265],[266,265,260],[260,261,266],[267,266,261],[261,262,267],[268,267,262],[262,181,268],[186,268,181],[269,270,264],[264,263,269],[271,269,263],[263,265,271],[272,271,265],[265,266,272],[273,272,266],[266,267,273],[274,273,267],[267,268,274],[275,274,268],[268,186,275],[192,275,186],[276,277,270],[270,269,276],[278,276,269],[269,271,278],[279,278,271],[271,272,279],[280,279,272],[272,273,280],[281,280,273],[273,274,281],[282,281,274],[274,275,282],[283,282,275],[275,192,283],[199,283,192],[284,285,277],[277,276,284],[286,284,276],[276,278,286],[287,286,278],[278,279,287],[288,287,279],[279,280,288],[289,288,280],[280,281,289],[290,289,281],[281,282,290],[291,290,282],[282,283,291],[292,291,283],[283,199,292],[207,292,199],[293,294,285],[285,284,293],[295,293,284],[284,286,295],[296,295,286],[286,287,296],[297,296,287],[287,288,297],[298,297,288],[288,289,298],[299,298,289],[289,290,299],[300,299,290],[290,291,300],[301,300,291],[291,292,301],[302,301,292],[292,207,302],[216,302,207],[303,304,294],[294,293,303],[305,303,293],[293,295,305],[306,305,295],[295,296,306],[307,306,296],[296,297,307],[308,307,297],[297,298,308],[309,308,298],[298,299,309],[310,309,299],[299,300,310],[311,310,300],[300,301,311],[312,311,301],[301,302,312],[313,312,302],[302,216,313],[226,313,216],[314,315,304],[304,303,314],[316,314,303],[303,305,316],[317,316,305],[305,306,317],[318,317,306],[306,307,318],[319,318,307],[307,308,319],[320,319,308],[308,309,320],[321,320,309],[309,310,321],[322,321,310],[310,311,322],[323,322,311],[311,312,323],[324,323,312],[312,313,324],[325,324,313],[313,226,325],[237,325,226],[248,68,80],[326,57,68],[68,248,326],[250,326,248],[327,47,57],[57,326,327],[328,327,326],[326,250,328],[252,328,250],[329,38,47],[47,327,329],[330,329,327],[327,328,330],[331,330,328],[328,252,331],[255,331,252],[332,30,38],[38,329,332],[333,332,329],[329,330,333],[334,333,330],[330,331,334],[335,334,331],[331,255,335],[259,335,255],[336,23,30],[30,332,336],[337,336,332],[332,333,337],[338,337,333],[333,334,338],[339,338,334],[334,335,339],[340,339,335],[335,259,340],[264,340,259],[341,17,23],[23,336,341],[342,341,336],[336,337,342],[343,342,337],[337,338,343],[344,343,338],[338,339,344],[345,344,339],[339,340,345],[346,345,340],[340,264,346],[270,346,264],[347,12,17],[17,341,347],[348,347,341],[341,342,348],[349,348,342],[342,343,349],[350,349,343],[343,344,350],[351,350,344],[344,345,351],[352,351,345],[345,346,352],[353,352,346],[346,270,353],[277,353,270],[354,8,12],[12,347,354],[355,354,347],[347,348,355],[356,355,348],[348,349,356],[357,356,349],[349,350,357],[358,357,350],[350,351,358],[359,358,351],[351,352,359],[360,359,352],[352,353,360],[361,360,353],[353,277,361],[285,361,277],[362,5,8],[8,354,362],[363,362,354],[354,355,363],[364,363,355],[355,356,364],[365,364,356],[356,357,365],[366,365,357],[357,358,366],[367,366,358],[358,359,367],[368,367,359],[359,360,368],[369,368,360],[360,361,369],[370,369,361],[361,285,370],[294,370,285],[371,2,5],[5,362,371],[372,371,362],[362,363,372],[373,372,363],[363,364,373],[374,373,364],[364,365,374],[375,374,365],[365,366,375],[376,375,366],[366,367,376],[377,376,367],[367,368,377],[378,377,368],[368,369,378],[379,378,369],[369,370,379],[380,379,370],[370,294,380],[304,380,294],[381,3,2],[2,371,381],[382,381,371],[371,372,382],[383,382,372],[372,373,383],[384,383,373],[373,374,384],[385,384,374],[374,375,385],[386,385,375],[375,376,386],[387,386,376],[376,377,387],[388,387,377],[377,378,388],[389,388,378],[378,379,389],[390,389,379],[379,380,390],[391,390,380],[380,304,391],[315,391,304],[392,391,315],[393,390,391],[391,392,393],[394,393,392],[395,389,390],[390,393,395],[396,395,393],[393,394,396],[397,396,394],[398,388,389],[389,395,398],[399,398,395],[395,396,399],[400,399,396],[396,397,400],[401,400,397],[402,387,388],[388,398,402],[403,402,398],[398,399,403],[404,403,399],[399,400,404],[405,404,400],[400,401,405],[406,405,401],[407,386,387],[387,402,407],[408,407,402],[402,403,408],[409,408,403],[403,404,409],[410,409,404],[404,405,410],[411,410,405],[405,406,411],[412,411,406],[413,385,386],[386,407,413],[414,413,407],[407,408,414],[415,414,408],[408,409,415],[416,415,409],[409,410,416],[417,416,410],[410,411,417],[418,417,411],[411,412,418],[419,418,412],[420,384,385],[385,413,420],[421,420,413],[413,414,421],[422,421,414],[414,415,422],[423,422,415],[415,416,423],[424,423,416],[416,417,424],[425,424,417],[417,418,425],[426,425,418],[418,419,426],[427,426,419],[428,383,384],[384,420,428],[429,428,420],[420,421,429],[430,429,421],[421,422,430],[431,430,422],[422,423,431],[432,431,423],[423,424,432],[433,432,424],[424,425,433],[434,433,425],[425,426,434],[435,434,426],[426,427,435],[436,435,427],[437,382,383],[383,428,437],[438,437,428],[428,429,438],[439,438,429],[429,430,439],[440,439,430],[430,431,440],[441,440,431],[431,432,441],[442,441,432],[432,433,442],[443,442,433],[433,434,443],[444,443,434],[434,435,444],[445,444,435],[435,436,445],[446,445,436],[447,381,382],[382,437,447],[448,447,437],[437,438,448],[449,448,438],[438,439,449],[450,449,439],[439,440,450],[451,450,440],[440,441,451],[452,451,441],[441,442,452],[453,452,442],[442,443,453],[454,453,443],[443,444,454],[455,454,444],[444,445,455],[456,455,445],[445,446,456],[457,456,446],[458,3,381],[381,447,458],[459,458,447],[447,448,459],[460,459,448],[448,449,460],[461,460,449],[449,450,461],[462,461,450],[450,451,462],[463,462,451],[451,452,463],[464,463,452],[452,453,464],[465,464,453],[453,454,465],[466,465,454],[454,455,466],[467,466,455],[455,456,467],[468,467,456],[456,457,468],[469,468,457],[470,468,469],[471,467,468],[468,470,471],[472,471,470],[473,466,467],[467,471,473],[474,473,471],[471,472,474],[475,474,472],[476,465,466],[466,473,476],[477,476,473],[473,474,477],[478,477,474],[474,475,478],[479,478,475],[480,464,465],[465,476,480],[481,480,476],[476,477,481],[482,481,477],[477,478,482],[483,482,478],[478,479,483],[484,483,479],[485,463,464],[464,480,485],[486,485,480],[480,481,486],[487,486,481],[481,482,487],[488,487,482],[482,483,488],[489,488,483],[483,484,489],[490,489,484],[491,462,463],[463,485,491],[492,491,485],[485,486,492],[493,492,486],[486,487,493],[494,493,487],[487,488,494],[495,494,488],[488,489,495],[496,495,489],[489,490,496],[497,496,490],[498,461,462],[462,491,498],[499,498,491],[491,492,499],[500,499,492],[492,493,500],[501,500,493],[493,494,501],[502,501,494],[494,495,502],[503,502,495],[495,496,503],[504,503,496],[496,497,504],[505,504,497],[506,460,461],[461,498,506],[507,506,498],[498,499,507],[508,507,499],[499,500,508],[509,508,500],[500,501,509],[510,509,501],[501,502,510],[511,510,502],[502,503,511],[512,511,503],[503,504,512],[513,512,504],[504,505,513],[514,513,505],[515,459,460],[460,506,515],[516,515,506],[506,507,516],[517,516,507],[507,508,517],[518,517,508],[508,509,518],[519,518,509],[509,510,519],[520,519,510],[510,511,520],[521,520,511],[511,512,521],[522,521,512],[512,513,522],[523,522,513],[513,514,523],[524,523,514],[525,458,459],[459,515,525],[526,525,515],[515,516,526],[527,526,516],[516,517,527],[528,527,517],[517,518,528],[529,528,518],[518,519,529],[530,529,519],[519,520,530],[531,530,520],[520,521,531],[532,531,521],[521,522,532],[533,532,522],[522,523,533],[534,533,523],[523,524,534],[535,534,524],[536,3,458],[458,525,536],[537,536,525],[525,526,537],[538,537,526],[526,527,538],[539,538,527],[527,528,539],[540,539,528],[528,529,540],[541,540,529],[529,530,541],[542,541,530],[530,531,542],[543,542,531],[531,532,543],[544,543,532],[532,533,544],[545,544,533],[533,534,545],[546,545,534],[534,535,546],[547,546,535],[536,1,3],[548,6,1],[1,536,548],[537,548,536],[549,10,6],[6,548,549],[550,549,548],[548,537,550],[538,550,537],[551,15,10],[10,549,551],[552,551,549],[549,550,552],[553,552,550],[550,538,553],[539,553,538],[554,21,15],[15,551,554],[555,554,551],[551,552,555],[556,555,552],[552,553,556],[557,556,553],[553,539,557],[540,557,539],[558,28,21],[21,554,558],[559,558,554],[554,555,559],[560,559,555],[555,556,560],[561,560,556],[556,557,561],[562,561,557],[557,540,562],[541,562,540],[563,36,28],[28,558,563],[564,563,558],[558,559,564],[565,564,559],[559,560,565],[566,565,560],[560,561,566],[567,566,561],[561,562,567],[568,567,562],[562,541,568],[542,568,541],[569,45,36],[36,563,569],[570,569,563],[563,564,570],[571,570,564],[564,565,571],[572,571,565],[565,566,572],[573,572,566],[566,567,573],[574,573,567],[567,568,574],[575,574,568],[568,542,575],[543,575,542],[576,55,45],[45,569,576],[577,576,569],[569,570,577],[578,577,570],[570,571,578],[579,578,571],[571,572,579],[580,579,572],[572,573,580],[581,580,573],[573,574,581],[582,581,574],[574,575,582],[583,582,575],[575,543,583],[544,583,543],[584,66,55],[55,576,584],[585,584,576],[576,577,585],[586,585,577],[577,578,586],[587,586,578],[578,579,587],[588,587,579],[579,580,588],[589,588,580],[580,581,589],[590,589,581],[581,582,590],[591,590,582],[582,583,591],[592,591,583],[583,544,592],[545,592,544],[593,78,66],[66,584,593],[594,593,584],[584,585,594],[595,594,585],[585,586,595],[596,595,586],[586,587,596],[597,596,587],[587,588,597],[598,597,588],[588,589,598],[599,598,589],[589,590,599],[600,599,590],[590,591,600],[601,600,591],[591,592,601],[602,601,592],[592,545,602],[546,602,545],[603,91,78],[78,593,603],[604,603,593],[593,594,604],[605,604,594],[594,595,605],[606,605,595],[595,596,606],[607,606,596],[596,597,607],[608,607,597],[597,598,608],[609,608,598],[598,599,609],[610,609,599],[599,600,610],[611,610,600],[600,601,611],[612,611,601],[601,602,612],[613,612,602],[602,546,613],[547,613,546],[614,615,616],[617,618,615],[615,614,617],[619,617,614],[620,621,618],[618,617,620],[622,620,617],[617,619,622],[623,622,619],[624,625,621],[621,620,624],[626,624,620],[620,622,626],[627,626,622],[622,623,627],[628,627,623],[629,630,625],[625,624,629],[631,629,624],[624,626,631],[632,631,626],[626,627,632],[633,632,627],[627,628,633],[634,633,628],[635,636,630],[630,629,635],[637,635,629],[629,631,637],[638,637,631],[631,632,638],[639,638,632],[632,633,639],[640,639,633],[633,634,640],[641,640,634],[642,643,636],[636,635,642],[644,642,635],[635,637,644],[645,644,637],[637,638,645],[646,645,638],[638,639,646],[647,646,639],[639,640,647],[648,647,640],[640,641,648],[649,648,641],[650,651,643],[643,642,650],[652,650,642],[642,644,652],[653,652,644],[644,645,653],[654,653,645],[645,646,654],[655,654,646],[646,647,655],[656,655,647],[647,648,656],[657,656,648],[648,649,657],[658,657,649],[659,660,651],[651,650,659],[661,659,650],[650,652,661],[662,661,652],[652,653,662],[663,662,653],[653,654,663],[664,663,654],[654,655,664],[665,664,655],[655,656,665],[666,665,656],[656,657,666],[667,666,657],[657,658,667],[668,667,658],[669,670,660],[660,659,669],[671,669,659],[659,661,671],[672,671,661],[661,662,672],[673,672,662],[662,663,673],[674,673,663],[663,664,674],[675,674,664],[664,665,675],[676,675,665],[665,666,676],[677,676,666],[666,667,677],[678,677,667],[667,668,678],[679,678,668],[680,681,670],[670,669,680],[682,680,669],[669,671,682],[683,682,671],[671,672,683],[684,683,672],[672,673,684],[685,684,673],[673,674,685],[686,685,674],[674,675,686],[687,686,675],[675,676,687],[688,687,676],[676,677,688],[689,688,677],[677,678,689],[690,689,678],[678,679,690],[691,690,679],[692,693,681],[681,680,692],[694,692,680],[680,682,694],[695,694,682],[682,683,695],[696,695,683],[683,684,696],[697,696,684],[684,685,697],[698,697,685],[685,686,698],[699,698,686],[686,687,699],[700,699,687],[687,688,700],[701,700,688],[688,689,701],[702,701,689],[689,690,702],[703,702,690],[690,691,703],[704,703,691],[705,706,159],[707,708,706],[706,705,707],[709,707,705],[710,711,708],[708,707,710],[712,710,707],[707,709,712],[713,712,709],[714,715,711],[711,710,714],[716,714,710],[710,712,716],[717,716,712],[712,713,717],[718,717,713],[719,720,715],[715,714,719],[721,719,714],[714,716,721],[722,721,716],[716,717,722],[723,722,717],[717,718,723],[724,723,718],[725,726,720],[720,719,725],[727,725,719],[719,721,727],[728,727,721],[721,722,728],[729,728,722],[722,723,729],[730,729,723],[723,724,730],[731,730,724],[732,733,726],[726,725,732],[734,732,725],[725,727,734],[735,734,727],[727,728,735],[736,735,728],[728,729,736],[737,736,729],[729,730,737],[738,737,730],[730,731,738],[739,738,731],[740,741,733],[733,732,740],[742,740,732],[732,734,742],[743,742,734],[734,735,743],[744,743,735],[735,736,744],[745,744,736],[736,737,745],[746,745,737],[737,738,746],[747,746,738],[738,739,747],[748,747,739],[749,750,741],[741,740,749],[751,749,740],[740,742,751],[752,751,742],[742,743,752],[753,752,743],[743,744,753],[754,753,744],[744,745,754],[755,754,745],[745,746,755],[756,755,746],[746,747,756],[757,756,747],[747,748,757],[758,757,748],[759,760,750],[750,749,759],[761,759,749],[749,751,761],[762,761,751],[751,752,762],[763,762,752],[752,753,763],[764,763,753],[753,754,764],[765,764,754],[754,755,765],[766,765,755],[755,756,766],[767,766,756],[756,757,767],[768,767,757],[757,758,768],[769,768,758],[770,771,760],[760,759,770],[772,770,759],[759,761,772],[773,772,761],[761,762,773],[774,773,762],[762,763,774],[775,774,763],[763,764,775],[776,775,764],[764,765,776],[777,776,765],[765,766,777],[778,777,766],[766,767,778],[779,778,767],[767,768,779],[780,779,768],[768,769,780],[781,780,769],[614,616,771],[771,770,614],[619,614,770],[770,772,619],[623,619,772],[772,773,623],[628,623,773],[773,774,628],[634,628,774],[774,775,634],[641,634,775],[775,776,641],[649,641,776],[776,777,649],[658,649,777],[777,778,658],[668,658,778],[778,779,668],[679,668,779],[779,780,679],[691,679,780],[780,781,691],[704,691,781],[706,247,159],[782,246,247],[247,706,782],[708,782,706],[783,245,246],[246,782,783],[784,783,782],[782,708,784],[711,784,708],[785,244,245],[245,783,785],[786,785,783],[783,784,786],[787,786,784],[784,711,787],[715,787,711],[788,243,244],[244,785,788],[789,788,785],[785,786,789],[790,789,786],[786,787,790],[791,790,787],[787,715,791],[720,791,715],[792,242,243],[243,788,792],[793,792,788],[788,789,793],[794,793,789],[789,790,794],[795,794,790],[790,791,795],[796,795,791],[791,720,796],[726,796,720],[797,241,242],[242,792,797],[798,797,792],[792,793,798],[799,798,793],[793,794,799],[800,799,794],[794,795,800],[801,800,795],[795,796,801],[802,801,796],[796,726,802],[733,802,726],[803,240,241],[241,797,803],[804,803,797],[797,798,804],[805,804,798],[798,799,805],[806,805,799],[799,800,806],[807,806,800],[800,801,807],[808,807,801],[801,802,808],[809,808,802],[802,733,809],[741,809,733],[810,239,240],[240,803,810],[811,810,803],[803,804,811],[812,811,804],[804,805,812],[813,812,805],[805,806,813],[814,813,806],[806,807,814],[815,814,807],[807,808,815],[816,815,808],[808,809,816],[817,816,809],[809,741,817],[750,817,741],[818,238,239],[239,810,818],[819,818,810],[810,811,819],[820,819,811],[811,812,820],[821,820,812],[812,813,821],[822,821,813],[813,814,822],[823,822,814],[814,815,823],[824,823,815],[815,816,824],[825,824,816],[816,817,825],[826,825,817],[817,750,826],[760,826,750],[827,236,238],[238,818,827],[828,827,818],[818,819,828],[829,828,819],[819,820,829],[830,829,820],[820,821,830],[831,830,821],[821,822,831],[832,831,822],[822,823,832],[833,832,823],[823,824,833],[834,833,824],[824,825,834],[835,834,825],[825,826,835],[836,835,826],[826,760,836],[771,836,760],[837,237,236],[236,827,837],[838,837,827],[827,828,838],[839,838,828],[828,829,839],[840,839,829],[829,830,840],[841,840,830],[830,831,841],[842,841,831],[831,832,842],[843,842,832],[832,833,843],[844,843,833],[833,834,844],[845,844,834],[834,835,845],[846,845,835],[835,836,846],[847,846,836],[836,771,847],[616,847,771],[837,848,237],[849,850,848],[848,837,849],[838,849,837],[851,852,850],[850,849,851],[853,851,849],[849,838,853],[839,853,838],[854,855,852],[852,851,854],[856,854,851],[851,853,856],[857,856,853],[853,839,857],[840,857,839],[858,859,855],[855,854,858],[860,858,854],[854,856,860],[861,860,856],[856,857,861],[862,861,857],[857,840,862],[841,862,840],[863,864,859],[859,858,863],[865,863,858],[858,860,865],[866,865,860],[860,861,866],[867,866,861],[861,862,867],[868,867,862],[862,841,868],[842,868,841],[869,870,864],[864,863,869],[871,869,863],[863,865,871],[872,871,865],[865,866,872],[873,872,866],[866,867,873],[874,873,867],[867,868,874],[875,874,868],[868,842,875],[843,875,842],[876,877,870],[870,869,876],[878,876,869],[869,871,878],[879,878,871],[871,872,879],[880,879,872],[872,873,880],[881,880,873],[873,874,881],[882,881,874],[874,875,882],[883,882,875],[875,843,883],[844,883,843],[884,885,877],[877,876,884],[886,884,876],[876,878,886],[887,886,878],[878,879,887],[888,887,879],[879,880,888],[889,888,880],[880,881,889],[890,889,881],[881,882,890],[891,890,882],[882,883,891],[892,891,883],[883,844,892],[845,892,844],[893,894,885],[885,884,893],[895,893,884],[884,886,895],[896,895,886],[886,887,896],[897,896,887],[887,888,897],[898,897,888],[888,889,898],[899,898,889],[889,890,899],[900,899,890],[890,891,900],[901,900,891],[891,892,901],[902,901,892],[892,845,902],[846,902,845],[903,904,894],[894,893,903],[905,903,893],[893,895,905],[906,905,895],[895,896,906],[907,906,896],[896,897,907],[908,907,897],[897,898,908],[909,908,898],[898,899,909],[910,909,899],[899,900,910],[911,910,900],[900,901,911],[912,911,901],[901,902,912],[913,912,902],[902,846,913],[847,913,846],[914,915,904],[904,903,914],[916,914,903],[903,905,916],[917,916,905],[905,906,917],[918,917,906],[906,907,918],[919,918,907],[907,908,919],[920,919,908],[908,909,920],[921,920,909],[909,910,921],[922,921,910],[910,911,922],[923,922,911],[911,912,923],[924,923,912],[912,913,924],[925,924,913],[913,847,925],[616,925,847],[914,926,915],[927,928,926],[926,914,927],[916,927,914],[929,930,928],[928,927,929],[931,929,927],[927,916,931],[917,931,916],[932,933,930],[930,929,932],[934,932,929],[929,931,934],[935,934,931],[931,917,935],[918,935,917],[936,937,933],[933,932,936],[938,936,932],[932,934,938],[939,938,934],[934,935,939],[940,939,935],[935,918,940],[919,940,918],[941,942,937],[937,936,941],[943,941,936],[936,938,943],[944,943,938],[938,939,944],[945,944,939],[939,940,945],[946,945,940],[940,919,946],[920,946,919],[947,948,942],[942,941,947],[949,947,941],[941,943,949],[950,949,943],[943,944,950],[951,950,944],[944,945,951],[952,951,945],[945,946,952],[953,952,946],[946,920,953],[921,953,920],[954,955,948],[948,947,954],[956,954,947],[947,949,956],[957,956,949],[949,950,957],[958,957,950],[950,951,958],[959,958,951],[951,952,959],[960,959,952],[952,953,960],[961,960,953],[953,921,961],[922,961,921],[962,963,955],[955,954,962],[964,962,954],[954,956,964],[965,964,956],[956,957,965],[966,965,957],[957,958,966],[967,966,958],[958,959,967],[968,967,959],[959,960,968],[969,968,960],[960,961,969],[970,969,961],[961,922,970],[923,970,922],[971,972,963],[963,962,971],[973,971,962],[962,964,973],[974,973,964],[964,965,974],[975,974,965],[965,966,975],[976,975,966],[966,967,976],[977,976,967],[967,968,977],[978,977,968],[968,969,978],[979,978,969],[969,970,979],[980,979,970],[970,923,980],[924,980,923],[981,982,972],[972,971,981],[983,981,971],[971,973,983],[984,983,973],[973,974,984],[985,984,974],[974,975,985],[986,985,975],[975,976,986],[987,986,976],[976,977,987],[988,987,977],[977,978,988],[989,988,978],[978,979,989],[990,989,979],[979,980,990],[991,990,980],[980,924,991],[925,991,924],[681,693,982],[982,981,681],[670,681,981],[981,983,670],[660,670,983],[983,984,660],[651,660,984],[984,985,651],[643,651,985],[985,986,643],[636,643,986],[986,987,636],[630,636,987],[987,988,630],[625,630,988],[988,989,625],[621,625,989],[989,990,621],[618,621,990],[990,991,618],[615,618,991],[991,925,615],[616,615,925],[926,992,915],[993,994,992],[992,926,993],[928,993,926],[995,996,994],[994,993,995],[997,995,993],[993,928,997],[930,997,928],[998,999,996],[996,995,998],[1000,998,995],[995,997,1000],[1001,1000,997],[997,930,1001],[933,1001,930],[1002,1003,999],[999,998,1002],[1004,1002,998],[998,1000,1004],[1005,1004,1000],[1000,1001,1005],[1006,1005,1001],[1001,933,1006],[937,1006,933],[1007,1008,1003],[1003,1002,1007],[1009,1007,1002],[1002,1004,1009],[1010,1009,1004],[1004,1005,1010],[1011,1010,1005],[1005,1006,1011],[1012,1011,1006],[1006,937,1012],[942,1012,937],[1013,1014,1008],[1008,1007,1013],[1015,1013,1007],[1007,1009,1015],[1016,1015,1009],[1009,1010,1016],[1017,1016,1010],[1010,1011,1017],[1018,1017,1011],[1011,1012,1018],[1019,1018,1012],[1012,942,1019],[948,1019,942],[1020,1021,1014],[1014,1013,1020],[1022,1020,1013],[1013,1015,1022],[1023,1022,1015],[1015,1016,1023],[1024,1023,1016],[1016,1017,1024],[1025,1024,1017],[1017,1018,1025],[1026,1025,1018],[1018,1019,1026],[1027,1026,1019],[1019,948,1027],[955,1027,948],[1028,1029,1021],[1021,1020,1028],[1030,1028,1020],[1020,1022,1030],[1031,1030,1022],[1022,1023,1031],[1032,1031,1023],[1023,1024,1032],[1033,1032,1024],[1024,1025,1033],[1034,1033,1025],[1025,1026,1034],[1035,1034,1026],[1026,1027,1035],[1036,1035,1027],[1027,955,1036],[963,1036,955],[1037,1038,1029],[1029,1028,1037],[1039,1037,1028],[1028,1030,1039],[1040,1039,1030],[1030,1031,1040],[1041,1040,1031],[1031,1032,1041],[1042,1041,1032],[1032,1033,1042],[1043,1042,1033],[1033,1034,1043],[1044,1043,1034],[1034,1035,1044],[1045,1044,1035],[1035,1036,1045],[1046,1045,1036],[1036,963,1046],[972,1046,963],[1047,1048,1038],[1038,1037,1047],[1049,1047,1037],[1037,1039,1049],[1050,1049,1039],[1039,1040,1050],[1051,1050,1040],[1040,1041,1051],[1052,1051,1041],[1041,1042,1052],[1053,1052,1042],[1042,1043,1053],[1054,1053,1043],[1043,1044,1054],[1055,1054,1044],[1044,1045,1055],[1056,1055,1045],[1045,1046,1056],[1057,1056,1046],[1046,972,1057],[982,1057,972],[1058,469,1048],[1048,1047,1058],[1059,1058,1047],[1047,1049,1059],[1060,1059,1049],[1049,1050,1060],[1061,1060,1050],[1050,1051,1061],[1062,1061,1051],[1051,1052,1062],[1063,1062,1052],[1052,1053,1063],[1064,1063,1053],[1053,1054,1064],[1065,1064,1054],[1054,1055,1065],[1066,1065,1055],[1055,1056,1066],[1067,1066,1056],[1056,1057,1067],[1068,1067,1057],[1057,982,1068],[693,1068,982],[1058,470,469],[1069,472,470],[470,1058,1069],[1059,1069,1058],[1070,475,472],[472,1069,1070],[1071,1070,1069],[1069,1059,1071],[1060,1071,1059],[1072,479,475],[475,1070,1072],[1073,1072,1070],[1070,1071,1073],[1074,1073,1071],[1071,1060,1074],[1061,1074,1060],[1075,484,479],[479,1072,1075],[1076,1075,1072],[1072,1073,1076],[1077,1076,1073],[1073,1074,1077],[1078,1077,1074],[1074,1061,1078],[1062,1078,1061],[1079,490,484],[484,1075,1079],[1080,1079,1075],[1075,1076,1080],[1081,1080,1076],[1076,1077,1081],[1082,1081,1077],[1077,1078,1082],[1083,1082,1078],[1078,1062,1083],[1063,1083,1062],[1084,497,490],[490,1079,1084],[1085,1084,1079],[1079,1080,1085],[1086,1085,1080],[1080,1081,1086],[1087,1086,1081],[1081,1082,1087],[1088,1087,1082],[1082,1083,1088],[1089,1088,1083],[1083,1063,1089],[1064,1089,1063],[1090,505,497],[497,1084,1090],[1091,1090,1084],[1084,1085,1091],[1092,1091,1085],[1085,1086,1092],[1093,1092,1086],[1086,1087,1093],[1094,1093,1087],[1087,1088,1094],[1095,1094,1088],[1088,1089,1095],[1096,1095,1089],[1089,1064,1096],[1065,1096,1064],[1097,514,505],[505,1090,1097],[1098,1097,1090],[1090,1091,1098],[1099,1098,1091],[1091,1092,1099],[1100,1099,1092],[1092,1093,1100],[1101,1100,1093],[1093,1094,1101],[1102,1101,1094],[1094,1095,1102],[1103,1102,1095],[1095,1096,1103],[1104,1103,1096],[1096,1065,1104],[1066,1104,1065],[1105,524,514],[514,1097,1105],[1106,1105,1097],[1097,1098,1106],[1107,1106,1098],[1098,1099,1107],[1108,1107,1099],[1099,1100,1108],[1109,1108,1100],[1100,1101,1109],[1110,1109,1101],[1101,1102,1110],[1111,1110,1102],[1102,1103,1111],[1112,1111,1103],[1103,1104,1112],[1113,1112,1104],[1104,1066,1113],[1067,1113,1066],[1114,535,524],[524,1105,1114],[1115,1114,1105],[1105,1106,1115],[1116,1115,1106],[1106,1107,1116],[1117,1116,1107],[1107,1108,1117],[1118,1117,1108],[1108,1109,1118],[1119,1118,1109],[1109,1110,1119],[1120,1119,1110],[1110,1111,1120],[1121,1120,1111],[1111,1112,1121],[1122,1121,1112],[1112,1113,1122],[1123,1122,1113],[1113,1067,1123],[1068,1123,1067],[1124,547,535],[535,1114,1124],[1125,1124,1114],[1114,1115,1125],[1126,1125,1115],[1115,1116,1126],[1127,1126,1116],[1116,1117,1127],[1128,1127,1117],[1117,1118,1128],[1129,1128,1118],[1118,1119,1129],[1130,1129,1119],[1119,1120,1130],[1131,1130,1120],[1120,1121,1131],[1132,1131,1121],[1121,1122,1132],[1133,1132,1122],[1122,1123,1133],[1134,1133,1123],[1123,1068,1134],[693,1134,1068],[1124,1135,547],[1136,1137,1135],[1135,1124,1136],[1125,1136,1124],[1138,1139,1137],[1137,1136,1138],[1140,1138,1136],[1136,1125,1140],[1126,1140,1125],[1141,1142,1139],[1139,1138,1141],[1143,1141,1138],[1138,1140,1143],[1144,1143,1140],[1140,1126,1144],[1127,1144,1126],[1145,1146,1142],[1142,1141,1145],[1147,1145,1141],[1141,1143,1147],[1148,1147,1143],[1143,1144,1148],[1149,1148,1144],[1144,1127,1149],[1128,1149,1127],[1150,1151,1146],[1146,1145,1150],[1152,1150,1145],[1145,1147,1152],[1153,1152,1147],[1147,1148,1153],[1154,1153,1148],[1148,1149,1154],[1155,1154,1149],[1149,1128,1155],[1129,1155,1128],[1156,1157,1151],[1151,1150,1156],[1158,1156,1150],[1150,1152,1158],[1159,1158,1152],[1152,1153,1159],[1160,1159,1153],[1153,1154,1160],[1161,1160,1154],[1154,1155,1161],[1162,1161,1155],[1155,1129,1162],[1130,1162,1129],[1163,1164,1157],[1157,1156,1163],[1165,1163,1156],[1156,1158,1165],[1166,1165,1158],[1158,1159,1166],[1167,1166,1159],[1159,1160,1167],[1168,1167,1160],[1160,1161,1168],[1169,1168,1161],[1161,1162,1169],[1170,1169,1162],[1162,1130,1170],[1131,1170,1130],[1171,1172,1164],[1164,1163,1171],[1173,1171,1163],[1163,1165,1173],[1174,1173,1165],[1165,1166,1174],[1175,1174,1166],[1166,1167,1175],[1176,1175,1167],[1167,1168,1176],[1177,1176,1168],[1168,1169,1177],[1178,1177,1169],[1169,1170,1178],[1179,1178,1170],[1170,1131,1179],[1132,1179,1131],[1180,1181,1172],[1172,1171,1180],[1182,1180,1171],[1171,1173,1182],[1183,1182,1173],[1173,1174,1183],[1184,1183,1174],[1174,1175,1184],[1185,1184,1175],[1175,1176,1185],[1186,1185,1176],[1176,1177,1186],[1187,1186,1177],[1177,1178,1187],[1188,1187,1178],[1178,1179,1188],[1189,1188,1179],[1179,1132,1189],[1133,1189,1132],[1190,1191,1181],[1181,1180,1190],[1192,1190,1180],[1180,1182,1192],[1193,1192,1182],[1182,1183,1193],[1194,1193,1183],[1183,1184,1194],[1195,1194,1184],[1184,1185,1195],[1196,1195,1185],[1185,1186,1196],[1197,1196,1186],[1186,1187,1197],[1198,1197,1187],[1187,1188,1198],[1199,1198,1188],[1188,1189,1199],[1200,1199,1189],[1189,1133,1200],[1134,1200,1133],[703,704,1191],[1191,1190,703],[702,703,1190],[1190,1192,702],[701,702,1192],[1192,1193,701],[700,701,1193],[1193,1194,700],[699,700,1194],[1194,1195,699],[698,699,1195],[1195,1196,698],[697,698,1196],[1196,1197,697],[696,697,1197],[1197,1198,696],[695,696,1198],[1198,1199,695],[694,695,1199],[1199,1200,694],[692,694,1200],[1200,1134,692],[693,692,1134],[1201,1191,704],[1202,1181,1191],[1191,1201,1202],[1203,1202,1201],[1204,1172,1181],[1181,1202,1204],[1205,1204,1202],[1202,1203,1205],[1206,1205,1203],[1207,1164,1172],[1172,1204,1207],[1208,1207,1204],[1204,1205,1208],[1209,1208,1205],[1205,1206,1209],[1210,1209,1206],[1211,1157,1164],[1164,1207,1211],[1212,1211,1207],[1207,1208,1212],[1213,1212,1208],[1208,1209,1213],[1214,1213,1209],[1209,1210,1214],[1215,1214,1210],[1216,1151,1157],[1157,1211,1216],[1217,1216,1211],[1211,1212,1217],[1218,1217,1212],[1212,1213,1218],[1219,1218,1213],[1213,1214,1219],[1220,1219,1214],[1214,1215,1220],[1221,1220,1215],[1222,1146,1151],[1151,1216,1222],[1223,1222,1216],[1216,1217,1223],[1224,1223,1217],[1217,1218,1224],[1225,1224,1218],[1218,1219,1225],[1226,1225,1219],[1219,1220,1226],[1227,1226,1220],[1220,1221,1227],[1228,1227,1221],[1229,1142,1146],[1146,1222,1229],[1230,1229,1222],[1222,1223,1230],[1231,1230,1223],[1223,1224,1231],[1232,1231,1224],[1224,1225,1232],[1233,1232,1225],[1225,1226,1233],[1234,1233,1226],[1226,1227,1234],[1235,1234,1227],[1227,1228,1235],[1236,1235,1228],[1237,1139,1142],[1142,1229,1237],[1238,1237,1229],[1229,1230,1238],[1239,1238,1230],[1230,1231,1239],[1240,1239,1231],[1231,1232,1240],[1241,1240,1232],[1232,1233,1241],[1242,1241,1233],[1233,1234,1242],[1243,1242,1234],[1234,1235,1243],[1244,1243,1235],[1235,1236,1244],[1245,1244,1236],[1246,1137,1139],[1139,1237,1246],[1247,1246,1237],[1237,1238,1247],[1248,1247,1238],[1238,1239,1248],[1249,1248,1239],[1239,1240,1249],[1250,1249,1240],[1240,1241,1250],[1251,1250,1241],[1241,1242,1251],[1252,1251,1242],[1242,1243,1252],[1253,1252,1243],[1243,1244,1253],[1254,1253,1244],[1244,1245,1254],[1255,1254,1245],[1256,1135,1137],[1137,1246,1256],[1257,1256,1246],[1246,1247,1257],[1258,1257,1247],[1247,1248,1258],[1259,1258,1248],[1248,1249,1259],[1260,1259,1249],[1249,1250,1260],[1261,1260,1250],[1250,1251,1261],[1262,1261,1251],[1251,1252,1262],[1263,1262,1252],[1252,1253,1263],[1264,1263,1253],[1253,1254,1264],[1265,1264,1254],[1254,1255,1265],[1266,1265,1255],[613,547,1135],[1135,1256,613],[612,613,1256],[1256,1257,612],[611,612,1257],[1257,1258,611],[610,611,1258],[1258,1259,610],[609,610,1259],[1259,1260,609],[608,609,1260],[1260,1261,608],[607,608,1261],[1261,1262,607],[606,607,1262],[1262,1263,606],[605,606,1263],[1263,1264,605],[604,605,1264],[1264,1265,604],[603,604,1265],[1265,1266,603],[91,603,1266],[158,705,159],[1267,709,705],[705,158,1267],[160,1267,158],[1268,713,709],[709,1267,1268],[1269,1268,1267],[1267,160,1269],[161,1269,160],[1270,718,713],[713,1268,1270],[1271,1270,1268],[1268,1269,1271],[1272,1271,1269],[1269,161,1272],[162,1272,161],[1273,724,718],[718,1270,1273],[1274,1273,1270],[1270,1271,1274],[1275,1274,1271],[1271,1272,1275],[1276,1275,1272],[1272,162,1276],[163,1276,162],[1277,731,724],[724,1273,1277],[1278,1277,1273],[1273,1274,1278],[1279,1278,1274],[1274,1275,1279],[1280,1279,1275],[1275,1276,1280],[1281,1280,1276],[1276,163,1281],[164,1281,163],[1282,739,731],[731,1277,1282],[1283,1282,1277],[1277,1278,1283],[1284,1283,1278],[1278,1279,1284],[1285,1284,1279],[1279,1280,1285],[1286,1285,1280],[1280,1281,1286],[1287,1286,1281],[1281,164,1287],[165,1287,164],[1288,748,739],[739,1282,1288],[1289,1288,1282],[1282,1283,1289],[1290,1289,1283],[1283,1284,1290],[1291,1290,1284],[1284,1285,1291],[1292,1291,1285],[1285,1286,1292],[1293,1292,1286],[1286,1287,1293],[1294,1293,1287],[1287,165,1294],[166,1294,165],[1295,758,748],[748,1288,1295],[1296,1295,1288],[1288,1289,1296],[1297,1296,1289],[1289,1290,1297],[1298,1297,1290],[1290,1291,1298],[1299,1298,1291],[1291,1292,1299],[1300,1299,1292],[1292,1293,1300],[1301,1300,1293],[1293,1294,1301],[1302,1301,1294],[1294,166,1302],[167,1302,166],[1303,769,758],[758,1295,1303],[1304,1303,1295],[1295,1296,1304],[1305,1304,1296],[1296,1297,1305],[1306,1305,1297],[1297,1298,1306],[1307,1306,1298],[1298,1299,1307],[1308,1307,1299],[1299,1300,1308],[1309,1308,1300],[1300,1301,1309],[1310,1309,1301],[1301,1302,1310],[1311,1310,1302],[1302,167,1311],[168,1311,167],[1312,781,769],[769,1303,1312],[1313,1312,1303],[1303,1304,1313],[1314,1313,1304],[1304,1305,1314],[1315,1314,1305],[1305,1306,1315],[1316,1315,1306],[1306,1307,1316],[1317,1316,1307],[1307,1308,1317],[1318,1317,1308],[1308,1309,1318],[1319,1318,1309],[1309,1310,1319],[1320,1319,1310],[1310,1311,1320],[1321,1320,1311],[1311,168,1321],[169,1321,168],[1201,704,781],[781,1312,1201],[1203,1201,1312],[1312,1313,1203],[1206,1203,1313],[1313,1314,1206],[1210,1206,1314],[1314,1315,1210],[1215,1210,1315],[1315,1316,1215],[1221,1215,1316],[1316,1317,1221],[1228,1221,1317],[1317,1318,1228],[1236,1228,1318],[1318,1319,1236],[1245,1236,1319],[1319,1320,1245],[1255,1245,1320],[1320,1321,1255],[1266,1255,1321],[1321,169,1266],[91,1266,169],[314,1322,315],[1323,1324,1322],[1322,314,1323],[316,1323,314],[1325,1326,1324],[1324,1323,1325],[1327,1325,1323],[1323,316,1327],[317,1327,316],[1328,1329,1326],[1326,1325,1328],[1330,1328,1325],[1325,1327,1330],[1331,1330,1327],[1327,317,1331],[318,1331,317],[1332,1333,1329],[1329,1328,1332],[1334,1332,1328],[1328,1330,1334],[1335,1334,1330],[1330,1331,1335],[1336,1335,1331],[1331,318,1336],[319,1336,318],[1337,1338,1333],[1333,1332,1337],[1339,1337,1332],[1332,1334,1339],[1340,1339,1334],[1334,1335,1340],[1341,1340,1335],[1335,1336,1341],[1342,1341,1336],[1336,319,1342],[320,1342,319],[1343,1344,1338],[1338,1337,1343],[1345,1343,1337],[1337,1339,1345],[1346,1345,1339],[1339,1340,1346],[1347,1346,1340],[1340,1341,1347],[1348,1347,1341],[1341,1342,1348],[1349,1348,1342],[1342,320,1349],[321,1349,320],[1350,1351,1344],[1344,1343,1350],[1352,1350,1343],[1343,1345,1352],[1353,1352,1345],[1345,1346,1353],[1354,1353,1346],[1346,1347,1354],[1355,1354,1347],[1347,1348,1355],[1356,1355,1348],[1348,1349,1356],[1357,1356,1349],[1349,321,1357],[322,1357,321],[1358,1359,1351],[1351,1350,1358],[1360,1358,1350],[1350,1352,1360],[1361,1360,1352],[1352,1353,1361],[1362,1361,1353],[1353,1354,1362],[1363,1362,1354],[1354,1355,1363],[1364,1363,1355],[1355,1356,1364],[1365,1364,1356],[1356,1357,1365],[1366,1365,1357],[1357,322,1366],[323,1366,322],[1367,1368,1359],[1359,1358,1367],[1369,1367,1358],[1358,1360,1369],[1370,1369,1360],[1360,1361,1370],[1371,1370,1361],[1361,1362,1371],[1372,1371,1362],[1362,1363,1372],[1373,1372,1363],[1363,1364,1373],[1374,1373,1364],[1364,1365,1374],[1375,1374,1365],[1365,1366,1375],[1376,1375,1366],[1366,323,1376],[324,1376,323],[1377,1378,1368],[1368,1367,1377],[1379,1377,1367],[1367,1369,1379],[1380,1379,1369],[1369,1370,1380],[1381,1380,1370],[1370,1371,1381],[1382,1381,1371],[1371,1372,1382],[1383,1382,1372],[1372,1373,1383],[1384,1383,1373],[1373,1374,1384],[1385,1384,1374],[1374,1375,1385],[1386,1385,1375],[1375,1376,1386],[1387,1386,1376],[1376,324,1387],[325,1387,324],[904,915,1378],[1378,1377,904],[894,904,1377],[1377,1379,894],[885,894,1379],[1379,1380,885],[877,885,1380],[1380,1381,877],[870,877,1381],[1381,1382,870],[864,870,1382],[1382,1383,864],[859,864,1383],[1383,1384,859],[855,859,1384],[1384,1385,855],[852,855,1385],[1385,1386,852],[850,852,1386],[1386,1387,850],[848,850,1387],[1387,325,848],[237,848,325],[1322,392,315],[1388,394,392],[392,1322,1388],[1324,1388,1322],[1389,397,394],[394,1388,1389],[1390,1389,1388],[1388,1324,1390],[1326,1390,1324],[1391,401,397],[397,1389,1391],[1392,1391,1389],[1389,1390,1392],[1393,1392,1390],[1390,1326,1393],[1329,1393,1326],[1394,406,401],[401,1391,1394],[1395,1394,1391],[1391,1392,1395],[1396,1395,1392],[1392,1393,1396],[1397,1396,1393],[1393,1329,1397],[1333,1397,1329],[1398,412,406],[406,1394,1398],[1399,1398,1394],[1394,1395,1399],[1400,1399,1395],[1395,1396,1400],[1401,1400,1396],[1396,1397,1401],[1402,1401,1397],[1397,1333,1402],[1338,1402,1333],[1403,419,412],[412,1398,1403],[1404,1403,1398],[1398,1399,1404],[1405,1404,1399],[1399,1400,1405],[1406,1405,1400],[1400,1401,1406],[1407,1406,1401],[1401,1402,1407],[1408,1407,1402],[1402,1338,1408],[1344,1408,1338],[1409,427,419],[419,1403,1409],[1410,1409,1403],[1403,1404,1410],[1411,1410,1404],[1404,1405,1411],[1412,1411,1405],[1405,1406,1412],[1413,1412,1406],[1406,1407,1413],[1414,1413,1407],[1407,1408,1414],[1415,1414,1408],[1408,1344,1415],[1351,1415,1344],[1416,436,427],[427,1409,1416],[1417,1416,1409],[1409,1410,1417],[1418,1417,1410],[1410,1411,1418],[1419,1418,1411],[1411,1412,1419],[1420,1419,1412],[1412,1413,1420],[1421,1420,1413],[1413,1414,1421],[1422,1421,1414],[1414,1415,1422],[1423,1422,1415],[1415,1351,1423],[1359,1423,1351],[1424,446,436],[436,1416,1424],[1425,1424,1416],[1416,1417,1425],[1426,1425,1417],[1417,1418,1426],[1427,1426,1418],[1418,1419,1427],[1428,1427,1419],[1419,1420,1428],[1429,1428,1420],[1420,1421,1429],[1430,1429,1421],[1421,1422,1430],[1431,1430,1422],[1422,1423,1431],[1432,1431,1423],[1423,1359,1432],[1368,1432,1359],[1433,457,446],[446,1424,1433],[1434,1433,1424],[1424,1425,1434],[1435,1434,1425],[1425,1426,1435],[1436,1435,1426],[1426,1427,1436],[1437,1436,1427],[1427,1428,1437],[1438,1437,1428],[1428,1429,1438],[1439,1438,1429],[1429,1430,1439],[1440,1439,1430],[1430,1431,1440],[1441,1440,1431],[1431,1432,1441],[1442,1441,1432],[1432,1368,1442],[1378,1442,1368],[1048,469,457],[457,1433,1048],[1038,1048,1433],[1433,1434,1038],[1029,1038,1434],[1434,1435,1029],[1021,1029,1435],[1435,1436,1021],[1014,1021,1436],[1436,1437,1014],[1008,1014,1437],[1437,1438,1008],[1003,1008,1438],[1438,1439,1003],[999,1003,1439],[1439,1440,999],[996,999,1440],[1440,1441,996],[994,996,1441],[1441,1442,994],[992,994,1442],[1442,1378,992],[915,992,1378]];

function ViewSphere() {
	this.time = Math.random() * 0xFFFF;
	bongiovi.View.call(this, "#define GLSLIFY 1\n\n// sphere.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec3 aCenter;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat3 normalMatrix;\nuniform float time;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nvec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }\n\nfloat snoise(vec3 v){\n\tconst vec2 C = vec2(1.00/6.00, 1.00/3.00) ;\n\tconst vec4 D = vec4(0.00, 0.50, 1.00, 2.00);\n\t\n\tvec3 i = floor(v + dot(v, C.yyy) );\n\tvec3 x0 = v - i + dot(i, C.xxx) ;\n\t\n\tvec3 g = step(x0.yzx, x0.xyz);\n\tvec3 l = 1.00 - g;\n\tvec3 i1 = min( g.xyz, l.zxy );\n\tvec3 i2 = max( g.xyz, l.zxy );\n\t\n\tvec3 x1 = x0 - i1 + 1.00 * C.xxx;\n\tvec3 x2 = x0 - i2 + 2.00 * C.xxx;\n\tvec3 x3 = x0 - 1. + 3.00 * C.xxx;\n\t\n\ti = mod(i, 289.00 );\n\tvec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));\n\t\n\tfloat n_ = 1.00/7.00;\n\tvec3 ns = n_ * D.wyz - D.xzx;\n\t\n\tvec4 j = p - 49.00 * floor(p * ns.z *ns.z);\n\t\n\tvec4 x_ = floor(j * ns.z);\n\tvec4 y_ = floor(j - 7.00 * x_ );\n\t\n\tvec4 x = x_ *ns.x + ns.yyyy;\n\tvec4 y = y_ *ns.x + ns.yyyy;\n\tvec4 h = 1.00 - abs(x) - abs(y);\n\t\n\tvec4 b0 = vec4( x.xy, y.xy );\n\tvec4 b1 = vec4( x.zw, y.zw );\n\t\n\tvec4 s0 = floor(b0)*2.00 + 1.00;\n\tvec4 s1 = floor(b1)*2.00 + 1.00;\n\tvec4 sh = -step(h, vec4(0.00));\n\t\n\tvec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n\tvec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\t\n\tvec3 p0 = vec3(a0.xy,h.x);\n\tvec3 p1 = vec3(a0.zw,h.y);\n\tvec3 p2 = vec3(a1.xy,h.z);\n\tvec3 p3 = vec3(a1.zw,h.w);\n\t\n\tvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n\tp0 *= norm.x;\n\tp1 *= norm.y;\n\tp2 *= norm.z;\n\tp3 *= norm.w;\n\t\n\tvec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);\n\tm = m * m;\n\treturn 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );\n}\n\nfloat snoise(float x, float y, float z){\n\treturn snoise(vec3(x, y, z));\n}\n\nconst float posOffset = .005;\n\nvoid main(void) {\n\tvec3 relativePos = aVertexPosition - aCenter;\n\tfloat offset = snoise(aCenter*posOffset+time) * .5 + .5;\n\toffset = smoothstep(0.0, .5, offset);\n\tvec3 center = aCenter * (1.0 - offset*.1);\n\n\tvec3 pos = center + relativePos*mix(offset, 1.0, .5);\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    vVertex = pos;\n    vNormal = normalMatrix*(aNormal);\n}", "#define GLSLIFY 1\n\n// sphere.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\n\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nconst float fade = .92;\nconst float ambient = .2;\n\nconst vec3 lightPos0 = vec3(200.0);\nconst vec3 lightColor0 = vec3(1.0, 1.0, fade);\nconst float lightWeight0 = .65;\n\nconst vec3 lightPos1 = vec3(-200.0, -200.0, 400.0);\nconst vec3 lightColor1 = vec3(fade, fade, 1.0);\nconst float lightWeight1 = .5;\n\n\nvec3 diffuse(vec3 light, vec3 normal, vec3 color, float weight) {\n\tfloat lambert = max(dot(normalize(light), normal), 0.0);\n\treturn color * lambert * weight;\n}\n\n\nvoid main(void) {\n\tvec3 diff0 = diffuse(lightPos0, vNormal, lightColor0, lightWeight0);\n\tvec3 diff1 = diffuse(lightPos1, vNormal, lightColor1, lightWeight1);\n\n\tvec3 color = ambient + diff0 + diff1;\n    gl_FragColor = vec4(color , 1.0);\n}");
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var centers = [];
	var normals = [];
	var count = 0;


	function getNormal(p0, p1, p2) {
		var pp0 = vec3.clone(p0);
		var pp1 = vec3.clone(p1);
		var pp2 = vec3.clone(p2);
		var v0 = vec3.create();
		var v1 = vec3.create();
		var n = vec3.create();
		vec3.sub(v0, pp1, pp0);
		vec3.sub(v1, pp2, pp0);

		vec3.cross(n, v0, v1);
		vec3.normalize(n, n);

		return n;
	}

	function getCenter(p0, p1, p2) {
		var x = (p0[0] + p1[0] + p2[0])/3;
		var y = (p0[1] + p1[1] + p2[1])/3;
		var z = (p0[2] + p1[2] + p2[2])/3;

		return [x, y, z];
	}

	function addFace(p0, p1, p2, c) {
		// var c = getCenter(p0, p1, p2);
		var n = getNormal(p0, p1, p2);

		positions.push(p0);
		positions.push(p1);
		positions.push(p2);

		centers.push(c);
		centers.push(c);
		centers.push(c);

		normals.push(n);
		normals.push(n);
		normals.push(n);

		coords.push([0, 0]);
		coords.push([0, 0]);
		coords.push([0, 0]);

		indices.push(count*3);
		indices.push(count*3+1);
		indices.push(count*3+2);

		count ++;
	}

	function getInnerPoint(c) {
		var s = .8;
		return [c[0]*s, c[1]*s, c[2]*s];
	}


	function addPyramid(p0, p1, p2) {
		var c = getCenter(p0, p1, p2);

		addFace(p0, p1, p2, c);
		addFace(getInnerPoint(c), p1, p0, c);
		addFace(getInnerPoint(c), p2, p1, c);
		addFace(getInnerPoint(c), p0, p2, c);
	}

	for(var i=0; i<faces.length; i++) {
		var f = faces[i];
		var i0 = f[0]-1;
		var i1 = f[1]-1;
		var i2 = f[2]-1;

		var p0 = vertices[i0];
		var p1 = vertices[i1];
		var p2 = vertices[i2];

		addPyramid(p0, p1, p2);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(centers, 'aCenter', 3);
	this.mesh.bufferData(normals, 'aNormal', 3);
};

p.render = function(texture) {
	this.time += .003;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	if(texture) {
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);	
	}
	
	GL.draw(this.mesh);
};

module.exports = ViewSphere;
},{}],7:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bongiovi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var GLTools = _dereq_("./bongiovi/GLTools");

var bongiovi = {
	GL:GLTools,
	GLTools:GLTools,
	Scheduler:_dereq_("./bongiovi/Scheduler"),
	SimpleImageLoader:_dereq_("./bongiovi/SimpleImageLoader"),
	EaseNumber:_dereq_("./bongiovi/EaseNumber"),
	QuatRotation:_dereq_("./bongiovi/QuatRotation"),
	Scene:_dereq_("./bongiovi/Scene"),
	Camera:_dereq_("./bongiovi/Camera"),
	SimpleCamera:_dereq_("./bongiovi/SimpleCamera"),
	CameraOrtho:_dereq_("./bongiovi/CameraOrtho"),
	CameraPerspective:_dereq_("./bongiovi/CameraPerspective"),
	Mesh:_dereq_("./bongiovi/Mesh"),
	Face:_dereq_("./bongiovi/Face"),
	GLShader:_dereq_("./bongiovi/GLShader"),
	GLTexture:_dereq_("./bongiovi/GLTexture"),
	GLCubeTexture:_dereq_("./bongiovi/GLCubeTexture"),
	ShaderLibs:_dereq_("./bongiovi/ShaderLibs"),
	View:_dereq_("./bongiovi/View"),
	ViewCopy:_dereq_("./bongiovi/ViewCopy"),
	ViewAxis:_dereq_("./bongiovi/ViewAxis"),
	ViewDotPlane:_dereq_("./bongiovi/ViewDotPlanes"),
	MeshUtils:_dereq_("./bongiovi/MeshUtils"),
	FrameBuffer:_dereq_("./bongiovi/FrameBuffer"),
	EventDispatcher:_dereq_("./bongiovi/EventDispatcher"),
	ObjLoader:_dereq_("./bongiovi/ObjLoader"),
	glm:_dereq_("gl-matrix")
};

module.exports = bongiovi;
},{"./bongiovi/Camera":3,"./bongiovi/CameraOrtho":4,"./bongiovi/CameraPerspective":5,"./bongiovi/EaseNumber":6,"./bongiovi/EventDispatcher":7,"./bongiovi/Face":8,"./bongiovi/FrameBuffer":9,"./bongiovi/GLCubeTexture":10,"./bongiovi/GLShader":11,"./bongiovi/GLTexture":12,"./bongiovi/GLTools":13,"./bongiovi/Mesh":14,"./bongiovi/MeshUtils":15,"./bongiovi/ObjLoader":16,"./bongiovi/QuatRotation":17,"./bongiovi/Scene":18,"./bongiovi/Scheduler":19,"./bongiovi/ShaderLibs":20,"./bongiovi/SimpleCamera":21,"./bongiovi/SimpleImageLoader":22,"./bongiovi/View":23,"./bongiovi/ViewAxis":24,"./bongiovi/ViewCopy":25,"./bongiovi/ViewDotPlanes":26,"gl-matrix":2}],2:[function(_dereq_,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.1
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/*
* Rotate a 3D vector around the x-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/*
* Rotate a 3D vector around the y-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/*
* Rotate a 3D vector around the z-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bongiovi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var GLTools = _dereq_("./bongiovi/GLTools");

var bongiovi = {
	GL:GLTools,
	GLTools:GLTools,
	Scheduler:_dereq_("./bongiovi/Scheduler"),
	SimpleImageLoader:_dereq_("./bongiovi/SimpleImageLoader"),
	EaseNumber:_dereq_("./bongiovi/EaseNumber"),
	QuatRotation:_dereq_("./bongiovi/QuatRotation"),
	Scene:_dereq_("./bongiovi/Scene"),
	Camera:_dereq_("./bongiovi/Camera"),
	SimpleCamera:_dereq_("./bongiovi/SimpleCamera"),
	CameraOrtho:_dereq_("./bongiovi/CameraOrtho"),
	CameraPerspective:_dereq_("./bongiovi/CameraPerspective"),
	Mesh:_dereq_("./bongiovi/Mesh"),
	Face:_dereq_("./bongiovi/Face"),
	GLShader:_dereq_("./bongiovi/GLShader"),
	GLTexture:_dereq_("./bongiovi/GLTexture"),
	GLCubeTexture:_dereq_("./bongiovi/GLCubeTexture"),
	ShaderLibs:_dereq_("./bongiovi/ShaderLibs"),
	View:_dereq_("./bongiovi/View"),
	ViewCopy:_dereq_("./bongiovi/ViewCopy"),
	ViewAxis:_dereq_("./bongiovi/ViewAxis"),
	ViewDotPlane:_dereq_("./bongiovi/ViewDotPlanes"),
	MeshUtils:_dereq_("./bongiovi/MeshUtils"),
	FrameBuffer:_dereq_("./bongiovi/FrameBuffer"),
	EventDispatcher:_dereq_("./bongiovi/EventDispatcher"),
	ObjLoader:_dereq_("./bongiovi/ObjLoader"),
	glm:_dereq_("gl-matrix")
};

module.exports = bongiovi;
},{"./bongiovi/Camera":3,"./bongiovi/CameraOrtho":4,"./bongiovi/CameraPerspective":5,"./bongiovi/EaseNumber":6,"./bongiovi/EventDispatcher":7,"./bongiovi/Face":8,"./bongiovi/FrameBuffer":9,"./bongiovi/GLCubeTexture":10,"./bongiovi/GLShader":11,"./bongiovi/GLTexture":12,"./bongiovi/GLTools":13,"./bongiovi/Mesh":14,"./bongiovi/MeshUtils":15,"./bongiovi/ObjLoader":16,"./bongiovi/QuatRotation":17,"./bongiovi/Scene":18,"./bongiovi/Scheduler":19,"./bongiovi/ShaderLibs":20,"./bongiovi/SimpleCamera":21,"./bongiovi/SimpleImageLoader":22,"./bongiovi/View":23,"./bongiovi/ViewAxis":24,"./bongiovi/ViewCopy":25,"./bongiovi/ViewDotPlanes":26,"gl-matrix":2}],2:[function(_dereq_,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.1
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/*
* Rotate a 3D vector around the x-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/*
* Rotate a 3D vector around the y-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/*
* Rotate a 3D vector around the z-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

},{}],3:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Camera = function() {
	this.matrix = glm.mat4.create();
	glm.mat4.identity(this.matrix);

	this.position = glm.vec3.create();
};

var p = Camera.prototype;

p.lookAt = function(aEye, aCenter, aUp) {
	glm.vec3.copy(this.position, aEye);
	glm.mat4.identity(this.matrix);
	glm.mat4.lookAt(this.matrix, aEye, aCenter, aUp);
};

p.getMatrix = function() {
	return this.matrix;
};

module.exports = Camera;
},{"gl-matrix":2}],4:[function(_dereq_,module,exports){
// CameraOrtho.js

"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");


var CameraOrtho = function() {
	Camera.call(this);

	var eye            = glm.vec3.clone([0, 0, 500]  );
	var center         = glm.vec3.create( );
	var up             = glm.vec3.clone( [0,-1,0] );
	this.lookAt(eye, center, up);

	this.projection = glm.mat4.create();
};

var p = CameraOrtho.prototype = new Camera();


p.setBoundary = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
	glm.mat4.ortho(this.projection, left, right, top, bottom, 0, 10000);
};


p.ortho = p.setBoundary;

p.getMatrix = function() {
	return this.matrix;
};


p.resize = function() {
	glm.mat4.ortho(this.projection, this.left, this.right, this.top, this.bottom, 0, 10000);
};


module.exports = CameraOrtho;
},{"./Camera":3,"gl-matrix":2}],5:[function(_dereq_,module,exports){
// CameraPerspective.js
"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");

var CameraPerspective = function() {
	Camera.call(this);

	this.projection = glm.mat4.create();
	this.mtxFinal = glm.mat4.create();
};

var p = CameraPerspective.prototype = new Camera();

p.setPerspective = function(aFov, aAspectRatio, aNear, aFar) {
	this._fov = aFov;
	this._near = aNear;
	this._far = aFar;
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, aFov, aAspectRatio, aNear, aFar);
};

p.getMatrix = function() {
	// mat4.multiply(this.mtxFinal, this.projection, this.matrix);
	return this.matrix;
};

p.resize = function(aAspectRatio) {
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, this._fov, aAspectRatio, this._near, this._far);
};

p.__defineGetter__("near", function() {
	return this._near;
});

p.__defineGetter__("far", function() {
	return this._far;
});

module.exports = CameraPerspective;
},{"./Camera":3,"gl-matrix":2}],6:[function(_dereq_,module,exports){
// EaseNumber.js

"use strict";

var Scheduler = _dereq_("./Scheduler");

function EaseNumber(mValue, mEasing) {
	this._easing = mEasing || 0.1;
	this._value = mValue;
	this._targetValue = mValue;

	Scheduler.addEF(this, this._update);
}

var p = EaseNumber.prototype;


p._update = function() {
	this._checkLimit();
	this._value += (this._targetValue - this._value) * this._easing;	
};


p.setTo = function(mValue) {
	this._targetValue = this._value = mValue;
};


p.add = function(mAdd) {
	this._targetValue += mAdd;
};

p.limit = function(mMin, mMax) {
	this._min = mMin;
	this._max = mMax;

	this._checkLimit();
};

p.setEasing = function(mValue) {
	this._easing = mValue;
};

p._checkLimit = function() {
	if(this._min !== undefined && this._targetValue < this._min) {
		this._targetValue = this._min;
	} 

	if(this._max !== undefined && this._targetValue > this._max) {
		this._targetValue = this._max;
	} 
};


p.__defineGetter__("value", function() {
	return this._value;
});


p.__defineGetter__("targetValue", function() {
	return this._targetValue;
});


p.__defineSetter__("value", function(mValue) {
	this._targetValue = mValue;
});


module.exports = EaseNumber;
},{"./Scheduler":19}],7:[function(_dereq_,module,exports){
// EventDispatcher.js

"use strict";

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent("CustomEvent");
	newTestCustomEvent = null;
} catch(e){
	supportsCustomEvents = false;
}

function EventDispatcher() {
	this._eventListeners = null;
}


var p = EventDispatcher.prototype;


p.addEventListener = function(aEventType, aFunction) {

	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	if(!this._eventListeners[aEventType]){
		this._eventListeners[aEventType] = [];
	}
	this._eventListeners[aEventType].push(aFunction);
	
	return this;
};

p.removeEventListener = function(aEventType, aFunction) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var currentArray = this._eventListeners[aEventType];
	
	if (typeof(currentArray) === "undefined") {
		// console.warn("EventDispatcher :: removeEventListener :: Tried to remove an event handler (for " + aEventType +") that doesn't exist");
		return this;
	}
	
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++){
		if(currentArray[i] === aFunction){
			currentArray.splice(i, 1);
			i--;
			currentArrayLength--;
		}
	}
	return this;
};

p.dispatchEvent = function(aEvent) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var eventType = aEvent.type;
	
	try {
		if(aEvent.target === null) {
			aEvent.target = this;
		}
		aEvent.currentTarget = this;
	}
	catch(theError) {
		var newEvent = {"type" : eventType, "detail" : aEvent.detail, "dispatcher" : this };
		return this.dispatchEvent(newEvent);
	}
	
	var currentEventListeners = this._eventListeners[eventType];
	if(currentEventListeners !== null && currentEventListeners !== undefined) {
		var currentArray = this._copyArray(currentEventListeners);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++){
			var currentFunction = currentArray[i];
			currentFunction.call(this, aEvent);
		}
	}
	return this;
};

p.dispatchCustomEvent = function(aEventType, aDetail) {
	var newEvent;
	if (supportsCustomEvents){
		newEvent = document.createEvent("CustomEvent");
		newEvent.dispatcher = this;
		newEvent.initCustomEvent(aEventType, false, false, aDetail);
	}
	else {
		newEvent = {"type" : aEventType, "detail" : aDetail, "dispatcher" : this };
	}
	return this.dispatchEvent(newEvent);
};

p._destroy = function() {
	if(this._eventListeners !== null) {
		for(var objectName in this._eventListeners) {
			if(this._eventListeners.hasOwnProperty(objectName)) {
				var currentArray = this._eventListeners[objectName];
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					currentArray[i] = null;
				}
				delete this._eventListeners[objectName];	
			}
		}
		this._eventListeners = null;
	}
};

p._copyArray = function(aArray) {
	var currentArray = new Array(aArray.length);
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		currentArray[i] = aArray[i];
	}
	return currentArray;
};

module.exports = EventDispatcher;
},{}],8:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Face = function(mA, mB, mC) {
	this._vertexA = mA;
	this._vertexB = mB;
	this._vertexC = mC;

	this._init();
};

var p = Face.prototype;


p._init = function() {
	var BA = glm.vec3.create();
	var CA = glm.vec3.create();
	glm.vec3.sub(BA, this._vertexB, this._vertexA);
	glm.vec3.sub(CA, this._vertexC, this._vertexA);

	this._faceNormal = glm.vec3.create();
	glm.vec3.cross(this._faceNormal, BA, CA);
	glm.vec3.normalize(this._faceNormal, this._faceNormal);
};


p.contains = function(mVertex) {
	return ( equal(mVertex, this._vertexA) || equal(mVertex, this._vertexB) || equal(mVertex, this._vertexC) );
};


p.__defineGetter__("faceNormal", function() {
	return this._faceNormal;
});

var equal = function(mV0, mV1) {
	return ( (mV0[0] === mV1[0]) && (mV0[1] === mV1[1]) && (mV0[2] === mV1[2]) );
};

module.exports = Face;
},{"gl-matrix":2}],9:[function(_dereq_,module,exports){
"use strict";

var gl, GL = _dereq_("./GLTools");
var GLTexture = _dereq_("./GLTexture");
var isPowerOfTwo = function(x) {	
	return (x !== 0) && !(x & (x - 1));	
};

var FrameBuffer = function(width, height, options) {
	gl = GL.gl;
	options        = options || {};
	this.width     = width;
	this.height    = height;
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR;
	this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
	this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;

	if(!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
		this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
			this.minFilter = gl.LINEAR;
		}
	} 

	this._init();
};

var p = FrameBuffer.prototype;

p._init = function() {
	this.texture            = gl.createTexture();
	
	this.glTexture			= new GLTexture(this.texture, true);
	
	this.frameBuffer        = gl.createFramebuffer();		
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	this.frameBuffer.width  = this.width;
	this.frameBuffer.height = this.height;

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	if(GL.depthTextureExt) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	}
	
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// if(this.magFilter == gl.NEAREST && this.minFilter == gl.NEAREST) {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	// 	console.debug("Both Nearest", this.floatTextureExt);
	// } else {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	// }

	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	if(GL.depthTextureExt === null) {
		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
		// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);	
		// if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	 //      throw new Error('Rendering to this texture is not supported (incomplete framebuffer)');
	 //    }

	 	// gl.renderbufferStorage( gl.RENDERBUFFER, gl.RGBA4, this.frameBuffer.width, this.frameBuffer.height );
	} else {
		this.depthTexture       = gl.createTexture();
		this.glDepthTexture		= new GLTexture(this.depthTexture, true);

		gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};


p.bind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};


p.unbind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
};


p.getTexture = function() {
	return this.glTexture;
};


p.getDepthTexture = function() {
	return this.glDepthTexture;
};


p.destroy = function() {
	gl.deleteFramebuffer(this.frameBuffer);

	this.glTexture.destroy();
	if(this.glDepthTexture) {
		this.glDepthTexture.destroy();
	}
};

module.exports = FrameBuffer;
},{"./GLTexture":12,"./GLTools":13}],10:[function(_dereq_,module,exports){
"use strict";

var gl;
var GL = _dereq_("./GLTools");

var GLCubeTexture = function(sources, options) {
	// [posx, negx, posy, negy, posz, negz]
	options = options || {};
	gl = GL.gl;
	this.texture = gl.createTexture();
	
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
	this.wrapS     = options.wrapS || gl.CLAMP_TO_EDGE;
	this.wrapT     = options.wrapT || gl.CLAMP_TO_EDGE;

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
	var targets = [
		gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
		gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
		gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
	];

	for (var j = 0; j < 6; j++) {
	    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sources[j]);
	    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
	    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
	}
	gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

var p = GLCubeTexture.prototype;


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);	
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLCubeTexture;
},{"./GLTools":13}],11:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var gl;
var ShaderLibs = _dereq_("./ShaderLibs");

var addLineNumbers = function ( string ) {
	var lines = string.split( '\n' );
	for ( var i = 0; i < lines.length; i ++ ) {
		lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];
	}
	return lines.join( '\n' );
};

var GLShader = function(aVertexShaderId, aFragmentShaderId) {
	gl              	 = GL.gl;
	this.idVertex        = aVertexShaderId;
	this.idFragment      = aFragmentShaderId;
	this.parameters      = [];
	this.uniformValues   = {};
	
	this.uniformTextures = [];
	
	this.vertexShader    = undefined;
	this.fragmentShader  = undefined;
	this._isReady        = false;
	this._loadedCount    = 0;

	if(aVertexShaderId === undefined || aVertexShaderId === null ) {
		this.createVertexShaderProgram(ShaderLibs.getShader("copyVert"));
	}

	if(aFragmentShaderId === undefined || aVertexShaderId === null ) {
		this.createFragmentShaderProgram(ShaderLibs.getShader("copyFrag"));
	}

	this.init();
};


var p = GLShader.prototype;

p.init = function() {
	if(this.idVertex && this.idVertex.indexOf("main(void)") > -1) {
		this.createVertexShaderProgram(this.idVertex);
	} else {
		this.getShader(this.idVertex, true);	
	}
	
	if(this.idFragment && this.idFragment.indexOf("main(void)") > -1) {
		this.createFragmentShaderProgram(this.idFragment);
	} else {
		this.getShader(this.idFragment, false);	
	}
};

p.getShader = function(aId, aIsVertexShader) {
	if(!aId) {return;}
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var that = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState === 4) {
			if(aIsVertexShader) {
				that.createVertexShaderProgram(e.target.responseText);
			} else {
				that.createFragmentShaderProgram(e.target.responseText);
			}
		}
	};
	req.open("GET", aId, true);
	req.send(null);
};

p.createVertexShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Vertex Shader : ", this.idVertex, ":", gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.vertexShader = shader;
	
	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};


p.createFragmentShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Fragment Shader: ", this.idFragment, ":" , gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.fragmentShader = shader;

	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};

p.attachShaderProgram = function() {
	this._isReady = true;
	this.shaderProgram = gl.createProgram();
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);
};

p.bind = function() {
	if(!this._isReady) {return;}
	gl.useProgram(this.shaderProgram);

	if(this.shaderProgram.pMatrixUniform === undefined) {	this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");}
	if(this.shaderProgram.mvMatrixUniform === undefined) {	this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");}
	if(this.shaderProgram.normalMatrixUniform === undefined) {	this.shaderProgram.normalMatrixUniform = gl.getUniformLocation(this.shaderProgram, "normalMatrix");}

	GL.setShader(this);
	GL.setShaderProgram(this.shaderProgram);

	this.uniformTextures = [];
};

p.isReady = function() {	return this._isReady;	};


p.clearUniforms = function() {
	this.parameters    = [];
	this.uniformValues = {};
};

p.uniform = function(aName, aType, aValue) {
	if(!this._isReady) {return;}

	if(aType === "texture") {aType = "uniform1i";}

	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name === aName) {
			oUniform.value = aValue;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.shaderProgram[aName] = gl.getUniformLocation(this.shaderProgram, aName);
		this.parameters.push({name : aName, type: aType, value: aValue, uniformLoc: this.shaderProgram[aName]});
	} else {
		this.shaderProgram[aName] = oUniform.uniformLoc;
	}


	if(aType.indexOf("Matrix") === -1) {
		if(!hasUniform) {
			var isArray = Array.isArray(aValue);
			if(isArray) {
				this.uniformValues[aName] = aValue.concat();
			} else {
				this.uniformValues[aName] = aValue;	
			}
			gl[aType](this.shaderProgram[aName], aValue);
		} else {
			// if(aName == 'position') console.log('Has uniform', this.checkUniform(aName, aType, aValue));
			if(this.checkUniform(aName, aType, aValue)) {
				gl[aType](this.shaderProgram[aName], aValue);
				// console.debug('Set uniform', aName, aType, aValue);
			}
		}
	} else {
		gl[aType](this.shaderProgram[aName], false, aValue);
		if(!hasUniform) {
			gl[aType](this.shaderProgram[aName], false, aValue);
			this.uniformValues[aName] = aValue;
			// console.debug('Set uniform', aName, aType, aValue);
		}
	}

	if(aType === "uniform1i") {
		// Texture
		this.uniformTextures[aValue] = this.shaderProgram[aName];
	}
};

p.checkUniform = function(aName, aType, aValue) {
	var isArray = Array.isArray(aValue);

	if(!this.uniformValues[aName]) {
		this.uniformValues[aName] = aValue;
		return true;
	}

	if(aType === "uniform1i") {
		this.uniformValues[aName] = aValue;
		return true;
	}

	var uniformValue = this.uniformValues[aName];
	var hasChanged = false;

	if(isArray) {
		for(var i=0; i<uniformValue.length; i++) {
			if(uniformValue[i] !== aValue[i]) {
				hasChanged = true;
				break;
			}
		}	
	} else {
		hasChanged = uniformValue !== aValue;
	}
	
	
	if(hasChanged) {
		if(isArray) {
			this.uniformValues[aName] = aValue.concat();
		} else {
			this.uniformValues[aName] = aValue;	
		}
		
	}

	return hasChanged;
};


p.unbind = function() {

};


p.destroy = function() {
	gl.detachShader(this.shaderProgram, this.vertexShader);
	gl.detachShader(this.shaderProgram, this.fragmentShader);
	gl.deleteShader(this.vertexShader);
	gl.deleteShader(this.fragmentShader);
	gl.deleteProgram(this.shaderProgram);
};

module.exports = GLShader;
},{"./GLTools":13,"./ShaderLibs":20}],12:[function(_dereq_,module,exports){
// GLTexture.js
"use strict";

var gl;
var GL = _dereq_("./GLTools");
var _isPowerOfTwo = function(x) {	
	var check = (x !== 0) && (!(x & (x - 1)));
	return check;
};
var isPowerOfTwo = function(obj) {	
	var w = obj.width || obj.videoWidth;
	var h = obj.height || obj.videoHeight;

	if(!w || !h) {return false;}

	return _isPowerOfTwo(w) && _isPowerOfTwo(h);
};

var GLTexture = function(source, isTexture, options) {
	isTexture = isTexture || false;
	options = options || {};
	gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this._source   = source;
		this.texture   = gl.createTexture();
		this._isVideo  = (source.tagName === "VIDEO");
		this.magFilter = options.magFilter || gl.LINEAR;
		this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
		
		this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
		this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;
		var width      = source.width || source.videoWidth;

		if(width) {
			if(!isPowerOfTwo(source)) {
				this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
				if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
					this.minFilter = gl.LINEAR;
				}
			} 	
		} else {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
			if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
		
		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
};

var p = GLTexture.prototype;


p.updateTexture = function(source) {
	if(source){ this._source = source; }
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.activeTexture(gl.TEXTURE0 + index);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLTexture;
},{"./GLTools":13}],13:[function(_dereq_,module,exports){
// GLTools.js
"use strict";

var glm = _dereq_("gl-matrix");

function GLTools() {
	this.aspectRatio   = 1;
	this.fieldOfView   = 45;
	this.zNear         = 5;
	this.zFar          = 3000;

	this.canvas        = null;
	this.gl            = null;

	this.shader        = null;
	this.shaderProgram = null;
}

var p = GLTools.prototype;

p.init = function(mCanvas, mWidth, mHeight, parameters) {
	if(this.canvas === null) {
		this.canvas      = mCanvas || document.createElement("canvas");
	}
	var params       = parameters || {};
	params.antialias = true;

	this.gl          = this.canvas.getContext("webgl", params) || this.canvas.getContext("experimental-webgl", params);
	console.log('GL TOOLS : ', this.gl);
	
	
	if(mWidth !== undefined && mHeight !== undefined) {
		this.setSize(mWidth, mHeight);
	} else {
		this.setSize(window.innerWidth, window.innerHeight);	
	}

	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.enable(this.gl.BLEND);
	this.gl.clearColor( 0, 0, 0, 1 );
	this.gl.clearDepth( 1 );

	this.matrix                 = glm.mat4.create();
	glm.mat4.identity(this.matrix);
	this.normalMatrix           = glm.mat3.create();
	this.depthTextureExt        = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	this.floatTextureExt        = this.gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
	this.floatTextureLinearExt  = this.gl.getExtension("OES_texture_float_linear"); // Or browser-appropriate prefix
	this.standardDerivativesExt = this.gl.getExtension("OES_standard_derivatives"); // Or browser-appropriate prefix

	this.enabledVertexAttribute = [];
	this.enableAlphaBlending();
	this._viewport = [0, 0, this.width, this.height];
};


p.getGL = function() {	return this.gl;	};

p.setShader = function(aShader) {
	this.shader = aShader;
};

p.setShaderProgram = function(aShaderProgram) {
	this.shaderProgram = aShaderProgram;
};

p.setViewport = function(aX, aY, aW, aH) {
	var hasChanged = false;
	if(aX!==this._viewport[0]) {hasChanged = true;}
	if(aY!==this._viewport[1]) {hasChanged = true;}
	if(aW!==this._viewport[2]) {hasChanged = true;}
	if(aH!==this._viewport[3]) {hasChanged = true;}

	if(hasChanged) {
		this.gl.viewport(aX, aY, aW, aH);
		this._viewport = [aX, aY, aW, aH];
	}
};

p.setMatrices = function(aCamera) {
	this.camera = aCamera;	
};

p.rotate = function(aRotation) {
	glm.mat4.copy(this.matrix, aRotation);

	glm.mat4.multiply(this.matrix, this.camera.getMatrix(), this.matrix);
	glm.mat3.fromMat4(this.normalMatrix, this.matrix);
	glm.mat3.invert(this.normalMatrix, this.normalMatrix);
	glm.mat3.transpose(this.normalMatrix, this.normalMatrix);
};


//	BLEND MODES
p.enableAlphaBlending = function() {
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	
};

p.enableAdditiveBlending = function() {
	this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
};

//	CLEAR CANVAS
p.clear = function(r, g, b, a) {
	this.gl.clearColor( r, g, b, a );
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

//	DRAWING ELEMENTS
p.draw = function(aMesh) {
	if(!this.shaderProgram) {
		console.warn("Shader program not ready yet");
		return;
	}

	if(!this.shaderProgram.pMatrixValue) {
		this.shaderProgram.pMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
		glm.mat4.copy(this.shaderProgram.pMatrixValue, this.camera.projection || this.camera.getMatrix());
	} else {
		var pMatrix = this.camera.projection || this.camera.getMatrix();
		if(glm.mat4.str(this.shaderProgram.pMatrixValue) !== glm.mat4.str(pMatrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
			glm.mat4.copy(this.shaderProgram.pMatrixValue, pMatrix);
		}
	}

	if(!this.shaderProgram.mvMatrixValue) {
		this.shaderProgram.mvMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
		glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
	} else {
		if(glm.mat4.str(this.shaderProgram.mvMatrixValue) !== glm.mat4.str(this.matrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
			glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
		}
	}

	if(!this.shaderProgram.normalMatrixValue) {
		this.shaderProgram.normalMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix );
		glm.mat3.copy(this.shaderProgram.normalMatrixValue, this.normalMatrix);
	} else {
		if(glm.mat3.str(this.shaderProgram.normalMatrixValue) !== glm.mat3.str(this.normalMatrix)) {
			this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix );
			glm.mat3.copy(this.shaderProgram.normalMatrixValue, this.normalMatrix);
		}
	}



	// 	VERTEX POSITIONS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(this.gl, this.shaderProgram, "aVertexPosition");
	this.gl.vertexAttribPointer(vertexPositionAttribute, aMesh.vBufferPos.itemSize, this.gl.FLOAT, false, 0, 0);
	if(this.enabledVertexAttribute.indexOf(vertexPositionAttribute) === -1) {
		this.gl.enableVertexAttribArray(vertexPositionAttribute);	
		this.enabledVertexAttribute.push(vertexPositionAttribute);
	}
	

	//	TEXTURE COORDS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferUV);
	var textureCoordAttribute = getAttribLoc(this.gl, this.shaderProgram, "aTextureCoord");
	this.gl.vertexAttribPointer(textureCoordAttribute, aMesh.vBufferUV.itemSize, this.gl.FLOAT, false, 0, 0);
	
	if(this.enabledVertexAttribute.indexOf(textureCoordAttribute) === -1) {
		this.gl.enableVertexAttribArray(textureCoordAttribute);
		this.enabledVertexAttribute.push(textureCoordAttribute);
	}

	//	INDICES
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, aMesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<aMesh.extraAttributes.length; i++) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(this.gl, this.shaderProgram, aMesh.extraAttributes[i].name);
		this.gl.vertexAttribPointer(attrPosition, aMesh.extraAttributes[i].itemSize, this.gl.FLOAT, false, 0, 0);
		// this.gl.enableVertexAttribArray(attrPosition);	
		if(this.enabledVertexAttribute.indexOf(attrPosition) === -1) {
			this.gl.enableVertexAttribArray(attrPosition);
			this.enabledVertexAttribute.push(attrPosition);
		}	
	}

	//	DRAWING
	if(aMesh.drawType === this.gl.POINTS ) {
		this.gl.drawArrays(aMesh.drawType, 0, aMesh.vertexSize);	
	} else {
		this.gl.drawElements(aMesh.drawType, aMesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
	}


	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc === undefined) {	shaderProgram.cacheAttribLoc = {};	}
		if(shaderProgram.cacheAttribLoc[name] === undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}

};

//	CANVAS RESIZING
p.setSize = function(mWidth, mHeight) {
	this._width = mWidth;
	this._height = mHeight;

	this.canvas.width      = this._width;
	this.canvas.height     = this._height;
	this.gl.viewportWidth  = this._width;
	this.gl.viewportHeight = this._height;

	this.gl.viewport(0, 0, this._width, this._height);
	this.aspectRatio       = this._width / this._height;
};


p.__defineGetter__("width", function() {
	return this._width;
});

p.__defineGetter__("height", function() {
	return this._height;
});

p.__defineGetter__("viewport", function() {
	return this._viewport;
});

var instance = null;

GLTools.getInstance = function() {
	if(instance === null) {
		instance = new GLTools();
	}
	return instance;
};


module.exports = GLTools.getInstance();
},{"gl-matrix":2}],14:[function(_dereq_,module,exports){
"use strict";

var Face = _dereq_("./Face");
var GL = _dereq_("./GLTools");
var glm = _dereq_("gl-matrix");

var Mesh = function(aVertexSize, aIndexSize, aDrawType) {

	this.gl = GL.gl;
	this.vertexSize = aVertexSize;
	this.indexSize = aIndexSize;
	this.drawType = aDrawType;
	this.extraAttributes = [];
	
	this.vBufferPos = undefined;
	this._floatArrayVertex = undefined;

	this._init();
};

var p = Mesh.prototype;

p._init = function() {

};

p.bufferVertex = function(aArrayVertices, isDynamic) {
	var vertices = [];
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	this._vertices = [];

	for(var i=0; i<aArrayVertices.length; i++) {
		for(var j=0; j<aArrayVertices[i].length; j++) {
			vertices.push(aArrayVertices[i][j]);
		}
		this._vertices.push(glm.vec3.clone(aArrayVertices[i]));
	}

	if(this.vBufferPos === undefined) {
		this.vBufferPos = this.gl.createBuffer();
	}
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex === undefined) {
		this._floatArrayVertex = new Float32Array(vertices);
	} else {
		if(aArrayVertices.length !== this._floatArrayVertex.length) {
			this._floatArrayVertex = new Float32Array(vertices);
		} else {
			for(var k=0; k<aArrayVertices.length; k++) {
				this._floatArrayVertex[k] = aArrayVertices[k];
			}
		}
	}

	this.gl.bufferData(this.gl.ARRAY_BUFFER, this._floatArrayVertex, drawType);
	this.vBufferPos.itemSize = 3;
};

p.bufferTexCoords = function(aArrayTexCoords) {
	var coords = [];

	for(var i=0; i<aArrayTexCoords.length; i++) {
		for(var j=0; j<aArrayTexCoords[i].length; j++) {
			coords.push(aArrayTexCoords[i][j]);
		}
	}

	this.vBufferUV = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coords), this.gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};

p.bufferData = function(aData, aName, aItemSize, isDynamic) {
	var index = -1;
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	var i=0;

	for(i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name === aName) {
			this.extraAttributes[i].data = aData;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(i=0; i<aData.length; i++) {
		for(var j=0; j<aData[i].length; j++) {
			bufferData.push(aData[i][j]);
		}
	}

	var buffer, floatArray;
	if(index === -1) {
		buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = new Float32Array(bufferData);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
		this.extraAttributes.push({name:aName, data:aData, itemSize: aItemSize, buffer:buffer, floatArray:floatArray});
	} else {
		buffer = this.extraAttributes[index].buffer;
		// console.debug("Buffer exist", buffer);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = this.extraAttributes[index].floatArray;
		for(i=0; i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
	}

};

p.bufferIndices = function(aArrayIndices) {
	this._indices = aArrayIndices;
	this.iBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aArrayIndices), this.gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aArrayIndices.length;
};


p.computeNormals = function() {
	if(this.drawType !== this.gl.TRIANGLES) {return;}

	if(this._faces === undefined) {	this._generateFaces();	}
	console.log("Start computing");

	var time = new Date().getTime();
	var j=0;

	this._normals = [];
	for(var i=0; i<this._vertices.length; i++) {
		var normal = glm.vec3.create();
		var faceCount = 0;
		for(j=0; j<this._faces.length; j++) {
			if(this._faces[j].contains(this._vertices[i])) {
				glm.vec3.add(normal, normal, this._faces[j].faceNormal);
				faceCount ++;
			}
		}

		glm.vec3.normalize(normal, normal);
		this._normals.push(normal);
	}

	this.bufferData(this._normals, "aNormal", 3);

	var totalTime = new Date().getTime() - time;
	console.log("Total Time : ", totalTime);
};


p.computeTangent = function() {
	
};


p._generateFaces = function() {
	this._faces = [];

	for(var i=0; i<this._indices.length; i+=3) {
		var p0 = this._vertices[this._indices[i+0]];
		var p1 = this._vertices[this._indices[i+1]];
		var p2 = this._vertices[this._indices[i+2]];

		this._faces.push(new Face(p0, p1, p2));
	}
};

module.exports = Mesh;
},{"./Face":8,"./GLTools":13,"gl-matrix":2}],15:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var MeshUtils = {};

MeshUtils.createPlane = function(width, height, numSegments, withNormals, axis) {
	axis          = axis === undefined ? "xy" : axis;
	withNormals   = withNormals === undefined ? false : withNormals;
	var positions = [];
	var coords    = [];
	var indices   = [];
	var normals   = [];

	var gapX  = width/numSegments;
	var gapY  = height/numSegments;
	var gapUV = 1/numSegments;
	var index = 0;
	var sx    = -width * 0.5;
	var sy    = -height * 0.5;

	for(var i=0; i<numSegments; i++) {
		for (var j=0; j<numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;

			if(axis === 'xz') {
				positions.push([tx, 		0, 	ty+gapY	]);
				positions.push([tx+gapX, 	0, 	ty+gapY	]);
				positions.push([tx+gapX, 	0, 	ty	]);
				positions.push([tx, 		0, 	ty	]);	

				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
			} else if(axis === 'yz') {
				positions.push([0, tx, 		ty]);
				positions.push([0, tx+gapX, ty]);
				positions.push([0, tx+gapX, ty+gapY]);
				positions.push([0, tx, 		ty+gapY]);	

				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
			} else {
				positions.push([tx, 		ty, 	0]);
				positions.push([tx+gapX, 	ty, 	0]);
				positions.push([tx+gapX, 	ty+gapY, 	0]);
				positions.push([tx, 		ty+gapY, 	0]);	

				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
			} 

			var u = i/numSegments;
			var v = j/numSegments;
			coords.push([u, v]);
			coords.push([u+gapUV, v]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u, v+gapUV]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createSphere = function(size, numSegments, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;
	var positions = [];
	var coords    = [];
	var indices   = [];
	var normals   = [];
	var index     = 0;
	var gapUV     = 1/numSegments;

	var getPosition = function(i, j, isNormal) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		isNormal = isNormal === undefined ? false : isNormal;
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			if(withNormals) {
				normals.push(getPosition(i, j, true));
				normals.push(getPosition(i+1, j, true));
				normals.push(getPosition(i+1, j+1, true));
				normals.push(getPosition(i, j+1, true));	
			}
			

			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	console.log('With normals :', withNormals);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createCube = function(w,h,d, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;
	h = h || w;
	d = d || w;

	var x = w/2;
	var y = h/2;
	var z = d/2;

	var positions = [];
	var coords    = [];
	var indices   = []; 
	var normals   = []; 
	var count     = 0;


	// BACK
	positions.push([-x,  y, -z]);
	positions.push([ x,  y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([-x, -y, -z]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ x,  y, -z]);
	positions.push([ x,  y,  z]);
	positions.push([ x, -y,  z]);
	positions.push([ x, -y, -z]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([ x,  y,  z]);
	positions.push([-x,  y,  z]);
	positions.push([-x, -y,  z]);
	positions.push([ x, -y,  z]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	// LEFT
	positions.push([-x,  y,  z]);
	positions.push([-x,  y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y,  z]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([-x,  y,  z]);
	positions.push([ x,  y,  z]);
	positions.push([ x,  y, -z]);
	positions.push([-x,  y, -z]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([-x, -y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([ x, -y,  z]);
	positions.push([-x, -y,  z]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createSkyBox = function(size, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;

	var positions = [];
	var coords    = [];
	var indices   = []; 
	var normals   = []; 
	var count     = 0;

	// BACK
	positions.push([ size,  size, -size]);
	positions.push([-size,  size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([ size, -size, -size]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ size, -size, -size]);
	positions.push([ size, -size,  size]);
	positions.push([ size,  size,  size]);
	positions.push([ size,  size, -size]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([-size,  size,  size]);
	positions.push([ size,  size,  size]);
	positions.push([ size, -size,  size]);
	positions.push([-size, -size,  size]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// LEFT
	positions.push([-size, -size,  size]);
	positions.push([-size, -size, -size]);
	positions.push([-size,  size, -size]);
	positions.push([-size,  size,  size]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([ size,  size,  size]);
	positions.push([-size,  size,  size]);
	positions.push([-size,  size, -size]);
	positions.push([ size,  size, -size]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([ size, -size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, -size,  size]);
	positions.push([ size, -size,  size]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

module.exports = MeshUtils;
},{"./GLTools":13,"./Mesh":14}],16:[function(_dereq_,module,exports){
// ObjLoader.js

"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var gl;


function ObjLoader() {
	this._clearAll();
}


var p = ObjLoader.prototype;

p._clearAll = function() {
	this._callback      = null;
	this._callbackError = null;
	this._mesh          = [];	
	this._drawingType 	= "";
};

p.load = function(url, callback, callbackError, ignoreNormals, drawingType) {
	this._clearAll();
	if(!gl) {	gl = GL.gl;	}
	this._drawingType = drawingType === undefined ? gl.TRIANGLES : drawingType;
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._callback = callback;
	this._callbackError = callbackError;

	var request = new XMLHttpRequest();
	request.onreadystatechange = this._onXHTPState.bind(this);
	request.open("GET", url, true);
	request.send();
};

p._onXHTPState = function(e) {
	if(e.target.readyState === 4) {
		this._parseObj(e.target.response);
	}
};


p.parse = function(objStr, callback, callbackError, ignoreNormals, drawingType) {
	this._clearAll();
	this._drawingType = drawingType === undefined ? gl.TRIANGLES : drawingType;
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._parseObj(objStr);
};


p._parseObj = function(objStr) {
	var lines = objStr.split('\n');

	var positions    = [];
	var coords       = [];
	var finalNormals = [];
	var vertices     = [];
	var normals      = [];
	var uvs          = [];
	var indices      = [];
	var count        = 0;
	var result;

	// v float float float
	var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vn float float float
	var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vt float float
	var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// f vertex vertex vertex ...
	var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

	// f vertex/uv vertex/uv vertex/uv ...
	var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

	// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
	var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

	// f vertex//normal vertex//normal vertex//normal ... 
	var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;


	function parseVertexIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
	}

	function parseNormalIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
	}

	function parseUVIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
	}


	function addVertex(a, b ,c) {
		positions.push([vertices[a], vertices[a+1], vertices[a+2]]);
		positions.push([vertices[b], vertices[b+1], vertices[b+2]]);
		positions.push([vertices[c], vertices[c+1], vertices[c+2]]);

		indices.push(count * 3 + 0);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 2);

		count ++;
	}


	function addUV(a, b, c) {
		coords.push([uvs[a], uvs[a+1]]);
		coords.push([uvs[b], uvs[b+1]]);
		coords.push([uvs[c], uvs[c+1]]);
	}


	function addNormal(a, b, c) {
		finalNormals.push([normals[a], normals[a+1], normals[a+2]]);
		finalNormals.push([normals[b], normals[b+1], normals[b+2]]);
		finalNormals.push([normals[c], normals[c+1], normals[c+2]]);
	}

	function addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {
		var ia = parseVertexIndex( a );
		var ib = parseVertexIndex( b );
		var ic = parseVertexIndex( c );
		var id;

		if ( d === undefined ) {

			addVertex( ia, ib, ic );

		} else {

			id = parseVertexIndex( d );

			addVertex( ia, ib, id );
			addVertex( ib, ic, id );

		}


		if ( ua !== undefined ) {

			ia = parseUVIndex( ua );
			ib = parseUVIndex( ub );
			ic = parseUVIndex( uc );

			if ( d === undefined ) {

				addUV( ia, ib, ic );

			} else {

				id = parseUVIndex( ud );

				addUV( ia, ib, id );
				addUV( ib, ic, id );

			}

		}

		if ( na !== undefined ) {

			ia = parseNormalIndex( na );
			ib = parseNormalIndex( nb );
			ic = parseNormalIndex( nc );

			if ( d === undefined ) {

				addNormal( ia, ib, ic );

			} else {

				id = parseNormalIndex( nd );

				addNormal( ia, ib, id );
				addNormal( ib, ic, id );

			}

		}
	}


	for ( var i = 0; i < lines.length; i ++ ) {
		var line = lines[ i ];
		line = line.trim();

		if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

			continue;

		} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

			vertices.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

			normals.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

			uvs.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] )
			);

		} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

			addFace(
				result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
			);

		} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
				result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
				result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
			);

		} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				undefined, undefined, undefined, undefined,
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} 
	}

	this._generateMeshes({	
		positions:positions,
		coords:coords,
		normals:finalNormals,
		indices:indices
	});
	
};


p._generateMeshes = function(o) {
	gl = GL.gl;

	var mesh = new Mesh(o.positions.length, o.indices.length, this._drawingType);
	mesh.bufferVertex(o.positions);
	mesh.bufferTexCoords(o.coords);
	mesh.bufferIndices(o.indices);
	if(!this._ignoreNormals) {
		mesh.bufferData(o.normals, "aNormal", 3);
	}

	if(this._callback) {
		this._callback(mesh, o);
	}
};

// var loader = new ObjLoader();

module.exports = ObjLoader;
},{"./GLTools":13,"./Mesh":14}],17:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

function QuatRotation(mListenerTarget) {
	if(mListenerTarget === undefined) {	mListenerTarget = document;	}
	this._isRotateZ     = 0;
	this.matrix         = glm.mat4.create();
	this.m              = glm.mat4.create();
	this._vZaxis        = glm.vec3.clone([0, 0, 0]);
	this._zAxis         = glm.vec3.clone([0, 0, -1]);
	this.preMouse       = {x:0, y:0};
	this.mouse          = {x:0, y:0};
	this._isMouseDown   = false;
	this._rotation      = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation   = glm.quat.clone([0, 0, 0, 0]);
	this._rotateZMargin = 0;
	this.diffX          = 0;
	this.diffY          = 0;
	this._currDiffX     = 0;
	this._currDiffY     = 0;
	this._offset        = 0.004;
	this._easing        = 0.1;
	this._slerp			= -1;
	this._isLocked 		= false;

	var that = this;
	mListenerTarget.addEventListener("mousedown", function(aEvent) { that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("touchstart", function(aEvent) {	that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("mouseup", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("touchend", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("mousemove", function(aEvent) { that._onMouseMove(aEvent); });
	mListenerTarget.addEventListener("touchmove", function(aEvent) { that._onMouseMove(aEvent); });
}


var p = QuatRotation.prototype;

p.inverseControl = function(value) {
	if(value === undefined) {	
		this._isInvert = true;	
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {	
		this._isLocked = true;	
	} else {	
		this._isLocked = value;	
	}
};

p.getMousePos = function(aEvent) {
	var mouseX, mouseY;

	if(aEvent.changedTouches !== undefined) {
		mouseX = aEvent.changedTouches[0].pageX;
		mouseY = aEvent.changedTouches[0].pageY;
	} else {
		mouseX = aEvent.clientX;
		mouseY = aEvent.clientY;
	}
	
	return {x:mouseX, y:mouseY};
};

p._onMouseDown = function(aEvent) {
	if(this._isLocked) {return;}
	if(this._isMouseDown) {return;}

	var mouse = this.getMousePos(aEvent);
	var tempRotation = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation = tempRotation;

	this._isMouseDown = true;
	this._isRotateZ = 0;
	this.preMouse = {x:mouse.x, y:mouse.y};

	if(mouse.y < this._rotateZMargin || mouse.y > (window.innerHeight - this._rotateZMargin) ) {	this._isRotateZ = 1;	}
	else if(mouse.x < this._rotateZMargin || mouse.x > (window.innerWidth - this._rotateZMargin) ) {	this._isRotateZ = 2;	}

	this._currDiffX = this.diffX = 0;
	this._currDiffY = this.diffY = 0;
};

p._onMouseMove = function(aEvent) {
	if(this._isLocked) {return;}
	if(aEvent.touches) {aEvent.preventDefault();}
	this.mouse = this.getMousePos(aEvent);
};

p._onMouseUp = function() {
	if(this._isLocked) {return;}
	if(!this._isMouseDown) {return;}
	this._isMouseDown = false;
};

p.setCameraPos = function(mQuat, speed) {
	speed             = speed || this._easing;
	this._easing      = speed;
	if(this._slerp > 0) {return;}
	
	var tempRotation  = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation    = glm.quat.clone(tempRotation);
	this._currDiffX   = this.diffX = 0;
	this._currDiffY   = this.diffY = 0;
	
	this._isMouseDown = false;
	this._isRotateZ   = 0;
	
	this._targetQuat  = glm.quat.clone(mQuat);
	this._slerp       = 1;
};

p.resetQuat = function() {
	this._rotation    = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation = glm.quat.clone([0, 0, 0, 0]);
	this._targetQuat  = undefined;
	this._slerp       = -1;
};

p.update = function() {
	glm.mat4.identity(this.m);

	if(this._targetQuat === undefined) { 
		glm.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
		this._updateRotation(this.tempRotation);
	} else {
		this._slerp += (0 - this._slerp) * 0.1;

		if(this._slerp < 0.001) {
			// quat.set(this._targetQuat, this._rotation);
			glm.quat.set(this._rotation, this._targetQuat[0], this._targetQuat[1], this._targetQuat[2], this._targetQuat[3]);
			this._targetQuat = undefined;
			this._slerp = -1;
		} else {
			glm.quat.set(this.tempRotation, 0, 0, 0, 0);
			glm.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
		}
	}

	glm.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

	glm.mat4.fromQuat(this.matrix, this.tempRotation);
};

p._updateRotation = function(aTempRotation) {
	if(this._isMouseDown && !this._isLocked) {
		this.diffX = -(this.mouse.x - this.preMouse.x);
		this.diffY = (this.mouse.y - this.preMouse.y);

		if(this._isInvert) {
			this.diffX = -this.diffX;
			this.diffY = -this.diffY;
		}
	}
	
	this._currDiffX += (this.diffX - this._currDiffX) * this._easing;
	this._currDiffY += (this.diffY - this._currDiffY) * this._easing;

	var angle, _quat;

	if(this._isRotateZ > 0) {
		if(this._isRotateZ === 1) {
			angle = -this._currDiffX * this._offset; 
			angle *= (this.preMouse.y < this._rotateZMargin) ? -1 : 1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		} else {
			angle = -this._currDiffY * this._offset; 
			angle *= (this.preMouse.x < this._rotateZMargin) ? 1 : -1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		}
	} else {
		var v = glm.vec3.clone([this._currDiffX, this._currDiffY, 0]);
		var axis = glm.vec3.create();
		glm.vec3.cross(axis, v, this._zAxis);
		glm.vec3.normalize(axis, axis);
		angle = glm.vec3.length(v) * this._offset;
		_quat = glm.quat.clone( [Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle) ] );
		glm.quat.multiply(aTempRotation, _quat, aTempRotation);
	}

};


module.exports = QuatRotation;
},{"gl-matrix":2}],18:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var QuatRotation = _dereq_("./QuatRotation");
var CameraOrtho = _dereq_("./CameraOrtho");
var SimpleCamera = _dereq_("./SimpleCamera");
var glm = _dereq_("gl-matrix");

var Scene = function() {
	if(GL.canvas === null) {return;}
	this.gl = GL.gl;
	this._children = [];
	this._init();
};

var p = Scene.prototype;

p._init = function() {
	this.camera = new SimpleCamera(GL.canvas);
	this.camera.setPerspective(45*Math.PI/180, GL.aspectRatio, 5, 3000);
	this.camera.lockRotation();

	var eye                = glm.vec3.clone([0, 0, 500]  );
	var center             = glm.vec3.create( );
	var up                 = glm.vec3.clone( [0,-1,0] );
	this.camera.lookAt(eye, center, up);
	
	this.sceneRotation     = new QuatRotation(GL.canvas);
	this.rotationFront     = glm.mat4.create();
	glm.mat4.identity(this.rotationFront);
	
	this.cameraOrtho       = new CameraOrtho();
	this.cameraOrthoScreen = new CameraOrtho();
	this.cameraOtho        = this.cameraOrtho;

	this.cameraOrtho.lookAt(eye, center, up);
	this.cameraOrtho.ortho( 1, -1, 1, -1);

	this.cameraOrthoScreen.lookAt(eye, center, up);
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);

	// In SuperClass should call following functions.
	this._initTextures();
	this._initViews();

	window.addEventListener("resize", this._onResize.bind(this));
};

p._initTextures = function() {
	// console.log("Should be overwritten by SuperClass");
};

p._initViews = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.loop = function() {
	this.update();
	this.render();
};

p.update = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.sceneRotation.update();
	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera );
	GL.rotate(this.sceneRotation.matrix);

};

p.resize = function() {
	// if(this.camera.resize) {
	// 	this.camera.resize(GL.aspectRatio);
	// }
};

p.render = function() {

};

p._onResize = function() {
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);
};

module.exports = Scene;
},{"./CameraOrtho":4,"./GLTools":13,"./QuatRotation":17,"./SimpleCamera":21,"gl-matrix":2}],19:[function(_dereq_,module,exports){
// Scheduler.js

"use strict";

if(window.requestAnimFrame === undefined) {
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
		};
	})();
}

function Scheduler() {
	this.FRAMERATE = 60;
	this._delayTasks = [];
	this._nextTasks = [];
	this._deferTasks = [];
	this._highTasks = [];
	this._usurpTask = [];
	this._enterframeTasks = [];
	this._idTable = 0;

	window.requestAnimFrame( this._loop.bind(this) );
}

var p = Scheduler.prototype;

p._loop = function() {
	window.requestAnimFrame( this._loop.bind(this) );
	this._process();
};


p._process = function() {
	var i = 0,
		task, interval, current;
	for ( i=0; i<this._enterframeTasks.length; i++) {
		task = this._enterframeTasks[i];
		if(task !== null && task !== undefined) {
			task.func.apply(task.scope, task.params);
		}
	}
	
	while ( this._highTasks.length > 0) {
		task = this._highTasks.pop();
		task.func.apply(task.scope, task.params);
	}
	

	var startTime = new Date().getTime();

	for ( i=0; i<this._delayTasks.length; i++) {
		task = this._delayTasks[i];
		if(startTime-task.time > task.delay) {
			task.func.apply(task.scope, task.params);
			this._delayTasks.splice(i, 1);
		}
	}

	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._deferTasks.length > 0) {
		task = this._deferTasks.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			this._deferTasks.unshift(task);
			break;
		}
	}


	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._usurpTask.length > 0) {
		task = this._usurpTask.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			// this._usurpTask.unshift(task);
			break;
		}
	}



	this._highTasks = this._highTasks.concat(this._nextTasks);
	this._nextTasks = [];
	this._usurpTask = [];
};


p.addEF = function(scope, func, params) {
	params = params || [];
	var id = this._idTable;
	this._enterframeTasks[id] = {scope:scope, func:func, params:params};
	this._idTable ++;
	return id;
};


p.removeEF = function(id) {
	if(this._enterframeTasks[id] !== undefined) {
		this._enterframeTasks[id] = null;
	}
	return -1;
};


p.delay = function(scope, func, params, delay) {
	var time = new Date().getTime();
	var t = {scope:scope, func:func, params:params, delay:delay, time:time};
	this._delayTasks.push(t);
};


p.defer = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._deferTasks.push(t);
};


p.next = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._nextTasks.push(t);
};


p.usurp = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._usurpTask.push(t);
};


var instance = null;

Scheduler.getInstance = function() {
	if(instance === null) {
		instance = new Scheduler();
	}
	return instance;
};

module.exports = Scheduler.getInstance();
},{}],20:[function(_dereq_,module,exports){
"use strict";


var ShaderLibs = function() { };

ShaderLibs.shaders = {};

ShaderLibs.shaders.copyVert = "#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
ShaderLibs.shaders.copyNormalVert = "#define GLSLIFY 1\n\n// copyWithNormals.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nvoid main(void) {\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n\tvNormal       = aNormal;\n\tvVertex \t  = aVertexPosition;\n}";

ShaderLibs.shaders.generalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
ShaderLibs.shaders.generalNormalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition;\n\tpos           *= scale;\n\tpos           += position;\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvNormal       = aNormal;\n\tvVertex       = pos;\n}";
ShaderLibs.shaders.generalWithNormalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition;\n\tpos           *= scale;\n\tpos           += position;\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvNormal       = aNormal;\n\tvVertex       = pos;\n}";

ShaderLibs.shaders.copyFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}\n";


ShaderLibs.shaders.alphaFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}";

ShaderLibs.shaders.simpleColorFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}";

ShaderLibs.shaders.depthFrag = "#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n\treturn (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}";

ShaderLibs.shaders.simpleCopyLighting = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform sampler2D texture;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 L        = normalize(lightPosition-vVertex);\n\tfloat lambert = max(dot(vNormal, L), .0);\n\tvec3 light    = ambient + lightColor * lambert * lightWeight;\n\tvec4 color \t  = texture2D(texture, vTextureCoord);\n\tcolor.rgb \t  *= light;\n\t\n\tgl_FragColor  = color;\n}";
ShaderLibs.shaders.simpleColorLighting = "#define GLSLIFY 1\n\n// simpleColorLighting.frag\n\n#define SHADER_NAME SIMPLE_COLOR_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform vec3 color;\nuniform float opacity;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 L        = normalize(lightPosition-vVertex);\n\tfloat lambert = max(dot(vNormal, L), .0);\n\tvec3 light    = ambient + lightColor * lambert * lightWeight;\n\t\n\tgl_FragColor  = vec4(color * light, opacity);\n}";



ShaderLibs.getShader = function(mId) {
	return this.shaders[mId];
};

ShaderLibs.get = ShaderLibs.getShader;
module.exports = ShaderLibs;
},{}],21:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");
var CameraPerspective = _dereq_("./CameraPerspective");
var EaseNumber = _dereq_("./EaseNumber");

var SimpleCamera = function(mListenerTarget) {
	this._listenerTarget = mListenerTarget || window;
	CameraPerspective.call(this);
	// this._isLocked = false;
	this._init();
};

var p = SimpleCamera.prototype = new CameraPerspective();
var s = CameraPerspective.prototype;

p._init = function() {
	this.radius          = new EaseNumber(500);
	this.position[2]     = this.radius.value;
	this.center          = glm.vec3.create( );
	this.up              = glm.vec3.clone( [0,-1,0] );
	this.lookAt(this.position, this.center, this.up);
	this._mouse          = {};
	this._preMouse       = {};
	this._isMouseDown    = false;
	
	this._rx             = new EaseNumber(0);
	this._rx.limit(-Math.PI/2, Math.PI/2);
	this._ry             = new EaseNumber(0);
	this._preRX          = 0;
	this._preRY          = 0;
	// this._isLocked       = false;
	this._isLockZoom 	 = false;
	this._isLockRotation = false;
	this._isInvert       = false;

	this._listenerTarget.addEventListener("mousewheel", this._onWheel.bind(this));
	this._listenerTarget.addEventListener("DOMMouseScroll", this._onWheel.bind(this));

	this._listenerTarget.addEventListener("mousedown", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("touchstart", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("mousemove", this._onMouseMove.bind(this));
	this._listenerTarget.addEventListener("touchmove", this._onMouseMove.bind(this));
	window.addEventListener("mouseup", this._onMouseUp.bind(this));
	window.addEventListener("touchend", this._onMouseUp.bind(this));
};

p.inverseControl = function(value) {
	if(value === undefined) {
		this._isInvert = true;
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {
		// this._isLocked = true;
		this._isLockZoom = true;
		this._isLockRotation = true;
	} else {
		this._isLockZoom = value;
		this._isLockRotation = value;
	}
};

p.lockRotation = function(value) {
	if(value === undefined) {
		this._isLockRotation = true;
	} else {
		this._isLockRotation = value;
	}
};

p.lockZoom = function(value) {
	this._isLockZoom = value === undefined ? true : value;
};

p._onMouseDown = function(mEvent) {
	if(this._isLockRotation) {return;}
	this._isMouseDown = true;
	getMouse(mEvent, this._mouse);
	getMouse(mEvent, this._preMouse);
	this._preRX = this._rx.targetValue;
	this._preRY = this._ry.targetValue;
};


p._onMouseMove = function(mEvent) {
	if(this._isLockRotation) {return;}
	getMouse(mEvent, this._mouse);
	if(mEvent.touches) {mEvent.preventDefault();}
	if(this._isMouseDown) {
		var diffX = this._mouse.x - this._preMouse.x;
		if(this._isInvert) {diffX *= -1;}
		this._ry.value = this._preRY - diffX * 0.01;

		var diffY = this._mouse.y - this._preMouse.y;
		if(this._isInvert) {diffY *= -1;}
		this._rx.value = this._preRX - diffY * 0.01;

		// if(this._rx.targetValue > Math.PI * 0.5) {this._rx.targetValue = Math;	}
	}
};


p._onMouseUp = function() {
	if(this._isLockRotation) {return;}
	this._isMouseDown = false;
	// getMouse(mEvent, this._mouse);
};


p._onWheel = function(aEvent) {
	if(this._isLockZoom) {	return;	}
	var w = aEvent.wheelDelta;
	var d = aEvent.detail;
	var value = 0;
	if (d){
		if (w) {
			value = w/d/40*d>0?1:-1; // Opera
		} else {
			value = -d/3;              // Firefox;         TODO: do not /3 for OS X
		}
	} else {
		value = w/120; 
	}

	// this._targetRadius -= value * 5;
	this.radius.add( -value * 5);
	
};


p.getMatrix = function() {
	this._updateCameraPosition();
	this.lookAt(this.position, this.center, this.up);
	return s.getMatrix.call(this);
};


p._updateCameraPosition = function() {
	this.position[2] 	= this.radius.value;

	this.position[1] = Math.sin(this._rx.value) * this.radius.value;
	var tr = Math.cos(this._rx.value) * this.radius.value;
	this.position[0] = Math.cos(this._ry.value + Math.PI*0.5) * tr;
	this.position[2] = Math.sin(this._ry.value + Math.PI*0.5) * tr;
};


var getMouse = function(mEvent, mTarget) {
	var o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};


p.__defineGetter__("rx", function() {
	return this._rx.targetValue;
});
 
p.__defineSetter__("rx", function(mValue) {
	this._rx.value = mValue;
});

p.__defineGetter__("ry", function() {
	return this._ry.targetValue;
});
 
p.__defineSetter__("ry", function(mValue) {
	this._ry.value = mValue;
});

module.exports = SimpleCamera;
},{"./CameraPerspective":5,"./EaseNumber":6,"gl-matrix":2}],22:[function(_dereq_,module,exports){
"use strict";

var SimpleImageLoader = function() {
	this._imgs             = {};
	this._loadedCount      = 0;
	this._toLoadCount      = 0;
	this._scope            = undefined;
	this._callback         = undefined;
	this._callbackProgress = undefined;
};

var p = SimpleImageLoader.prototype;


p.load = function(imgs, scope, callback, progressCallback) {
	this._imgs = {};
	this._loadedCount = 0;
	this._toLoadCount = imgs.length;
	this._scope = scope;
	this._callback = callback;
	this._callbackProgress = progressCallback;

	this._imgLoadedBind = this._onImageLoaded.bind(this);

	for ( var i=0; i<imgs.length ; i++) {
		var img         = new Image();
		img.onload      = this._imgLoadedBind;
		var path        = imgs[i];
		var tmp         = path.split("/");
		var ref         = tmp[tmp.length-1].split(".")[0];
		this._imgs[ref] = img;
		img.src         = path;
	}
};


p._onImageLoaded = function() {
	this._loadedCount++;

	if(this._loadedCount === this._toLoadCount) {
		this._callback.call(this._scope, this._imgs);
	} else {
		var p = this._loadedCount / this._toLoadCount;
		if(this._callbackProgress) {
			this._callbackProgress.call(this._scope, p);
		}
	}
};

module.exports = SimpleImageLoader;
},{}],23:[function(_dereq_,module,exports){
// View.js
"use strict";

var GLShader = _dereq_("./GLShader");

var View = function(aPathVert, aPathFrag) {
	this.shader = new GLShader(aPathVert, aPathFrag);
	this._init();
};

var p = View.prototype;

p._init = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.render = function() {
	// console.log("Should be overwritten by SuperClass");
};

module.exports = View;


},{"./GLShader":11}],24:[function(_dereq_,module,exports){
// ViewAxis.js

"use strict";
var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var Mesh = _dereq_("./Mesh");

var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewAxis = function(lineWidth, mFragShader) {
	this.lineWidth = lineWidth === undefined ? 2.0 : lineWidth;
	var fs = mFragShader === undefined ? fragShader : mFragShader;
	View.call(this, vertShader, fs);
};

var p = ViewAxis.prototype = new View();

p._init = function() {
	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);

	var positions = [];
	var colors = [];
	var coords = [];
	var indices = [0, 1, 2, 3, 4, 5];
	var r = 9999;

	positions.push([-r,  0,  0]);
	positions.push([ r,  0,  0]);
	positions.push([ 0, -r,  0]);
	positions.push([ 0,  r,  0]);
	positions.push([ 0,  0, -r]);
	positions.push([ 0,  0,  r]);


	colors.push([1, 0, 0]);
	colors.push([1, 0, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 0, 1]);
	colors.push([0, 0, 1]);


	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);


	this.mesh = new Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aColor", 3, false);
};

p.render = function() {
	if(!this.shader.isReady()) {return;}

	this.shader.bind();
	GL.gl.lineWidth(this.lineWidth);
	GL.draw(this.mesh);
	GL.gl.lineWidth(1.0);
};

module.exports = ViewAxis;

},{"./GLTools":13,"./Mesh":14,"./View":23}],25:[function(_dereq_,module,exports){
"use strict";

var View = _dereq_("./View");
var GL = _dereq_("./GLTools");
var MeshUtils = _dereq_("./MeshUtils");

var ViewCopy = function(aPathVert, aPathFrag) {
	View.call(this, aPathVert, aPathFrag);
};

var p = ViewCopy.prototype = new View();

p._init = function() {
	if(!GL.gl) { return;	}
	this.mesh = MeshUtils.createPlane(2, 2, 1);
};

p.render = function(aTexture) {
	if(!this.shader.isReady()) {return;}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	// console.log('Render', aTexture);
	aTexture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewCopy;

},{"./GLTools":13,"./MeshUtils":15,"./View":23}],26:[function(_dereq_,module,exports){
// ViewDotPlanes.js

"use strict";

var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var ShaderLibs = _dereq_("./ShaderLibs");
var Mesh = _dereq_("./Mesh");

// var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
// var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewDotPlanes = function(color, fragShader) {
	var grey = 0.75;
	this.color = color === undefined ? [grey, grey, grey] : color;
	var fs = fragShader === undefined ? ShaderLibs.get("simpleColorFrag") : fragShader;
	View.call(this, null, fs);
};

var p = ViewDotPlanes.prototype = new View();

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;


	var numDots = 100;
	var size = 3000;
	var gap = size / numDots;
	var i, j;


	for(i=-size/2; i<size; i+=gap) {
		for(j=-size/2; j<size; j+=gap) {
			positions.push([i, j, 0]);
			coords.push([0, 0]);
			indices.push(index);
			index++;

			positions.push([i, 0, j]);
			coords.push([0, 0]);
			indices.push(index);
			index++;
		}
	}

	this.mesh = new Mesh(positions.length, indices.length, GL.gl.DOTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDotPlanes;

},{"./GLTools":13,"./Mesh":14,"./ShaderLibs":20,"./View":23}]},{},[1])(1)
});

;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

},{}],3:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Camera = function() {
	this.matrix = glm.mat4.create();
	glm.mat4.identity(this.matrix);

	this.position = glm.vec3.create();
};

var p = Camera.prototype;

p.lookAt = function(aEye, aCenter, aUp) {
	glm.vec3.copy(this.position, aEye);
	glm.mat4.identity(this.matrix);
	glm.mat4.lookAt(this.matrix, aEye, aCenter, aUp);
};

p.getMatrix = function() {
	return this.matrix;
};

module.exports = Camera;
},{"gl-matrix":2}],4:[function(_dereq_,module,exports){
// CameraOrtho.js

"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");


var CameraOrtho = function() {
	Camera.call(this);

	var eye            = glm.vec3.clone([0, 0, 500]  );
	var center         = glm.vec3.create( );
	var up             = glm.vec3.clone( [0,-1,0] );
	this.lookAt(eye, center, up);

	this.projection = glm.mat4.create();
};

var p = CameraOrtho.prototype = new Camera();


p.setBoundary = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
	glm.mat4.ortho(this.projection, left, right, top, bottom, 0, 10000);
};


p.ortho = p.setBoundary;

p.getMatrix = function() {
	return this.matrix;
};


p.resize = function() {
	glm.mat4.ortho(this.projection, this.left, this.right, this.top, this.bottom, 0, 10000);
};


module.exports = CameraOrtho;
},{"./Camera":3,"gl-matrix":2}],5:[function(_dereq_,module,exports){
// CameraPerspective.js
"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");

var CameraPerspective = function() {
	Camera.call(this);

	this.projection = glm.mat4.create();
	this.mtxFinal = glm.mat4.create();
};

var p = CameraPerspective.prototype = new Camera();

p.setPerspective = function(aFov, aAspectRatio, aNear, aFar) {
	this._fov = aFov;
	this._near = aNear;
	this._far = aFar;
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, aFov, aAspectRatio, aNear, aFar);
};

p.getMatrix = function() {
	// mat4.multiply(this.mtxFinal, this.projection, this.matrix);
	return this.matrix;
};

p.resize = function(aAspectRatio) {
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, this._fov, aAspectRatio, this._near, this._far);
};

p.__defineGetter__("near", function() {
	return this._near;
});

p.__defineGetter__("far", function() {
	return this._far;
});

module.exports = CameraPerspective;
},{"./Camera":3,"gl-matrix":2}],6:[function(_dereq_,module,exports){
// EaseNumber.js

"use strict";

var Scheduler = _dereq_("./Scheduler");

function EaseNumber(mValue, mEasing) {
	this._easing = mEasing || 0.1;
	this._value = mValue;
	this._targetValue = mValue;

	Scheduler.addEF(this, this._update);
}

var p = EaseNumber.prototype;


p._update = function() {
	this._checkLimit();
	this._value += (this._targetValue - this._value) * this._easing;	
};


p.setTo = function(mValue) {
	this._targetValue = this._value = mValue;
};


p.add = function(mAdd) {
	this._targetValue += mAdd;
};

p.limit = function(mMin, mMax) {
	this._min = mMin;
	this._max = mMax;

	this._checkLimit();
};

p.setEasing = function(mValue) {
	this._easing = mValue;
};

p._checkLimit = function() {
	if(this._min !== undefined && this._targetValue < this._min) {
		this._targetValue = this._min;
	} 

	if(this._max !== undefined && this._targetValue > this._max) {
		this._targetValue = this._max;
	} 
};


p.__defineGetter__("value", function() {
	return this._value;
});


p.__defineGetter__("targetValue", function() {
	return this._targetValue;
});


p.__defineSetter__("value", function(mValue) {
	this._targetValue = mValue;
});


module.exports = EaseNumber;
},{"./Scheduler":19}],7:[function(_dereq_,module,exports){
// EventDispatcher.js

"use strict";

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent("CustomEvent");
	newTestCustomEvent = null;
} catch(e){
	supportsCustomEvents = false;
}

function EventDispatcher() {
	this._eventListeners = null;
}


var p = EventDispatcher.prototype;


p.addEventListener = function(aEventType, aFunction) {

	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	if(!this._eventListeners[aEventType]){
		this._eventListeners[aEventType] = [];
	}
	this._eventListeners[aEventType].push(aFunction);
	
	return this;
};

p.removeEventListener = function(aEventType, aFunction) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var currentArray = this._eventListeners[aEventType];
	
	if (typeof(currentArray) === "undefined") {
		// console.warn("EventDispatcher :: removeEventListener :: Tried to remove an event handler (for " + aEventType +") that doesn't exist");
		return this;
	}
	
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++){
		if(currentArray[i] === aFunction){
			currentArray.splice(i, 1);
			i--;
			currentArrayLength--;
		}
	}
	return this;
};

p.dispatchEvent = function(aEvent) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var eventType = aEvent.type;
	
	try {
		if(aEvent.target === null) {
			aEvent.target = this;
		}
		aEvent.currentTarget = this;
	}
	catch(theError) {
		var newEvent = {"type" : eventType, "detail" : aEvent.detail, "dispatcher" : this };
		return this.dispatchEvent(newEvent);
	}
	
	var currentEventListeners = this._eventListeners[eventType];
	if(currentEventListeners !== null && currentEventListeners !== undefined) {
		var currentArray = this._copyArray(currentEventListeners);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++){
			var currentFunction = currentArray[i];
			currentFunction.call(this, aEvent);
		}
	}
	return this;
};

p.dispatchCustomEvent = function(aEventType, aDetail) {
	var newEvent;
	if (supportsCustomEvents){
		newEvent = document.createEvent("CustomEvent");
		newEvent.dispatcher = this;
		newEvent.initCustomEvent(aEventType, false, false, aDetail);
	}
	else {
		newEvent = {"type" : aEventType, "detail" : aDetail, "dispatcher" : this };
	}
	return this.dispatchEvent(newEvent);
};

p._destroy = function() {
	if(this._eventListeners !== null) {
		for(var objectName in this._eventListeners) {
			if(this._eventListeners.hasOwnProperty(objectName)) {
				var currentArray = this._eventListeners[objectName];
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					currentArray[i] = null;
				}
				delete this._eventListeners[objectName];	
			}
		}
		this._eventListeners = null;
	}
};

p._copyArray = function(aArray) {
	var currentArray = new Array(aArray.length);
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		currentArray[i] = aArray[i];
	}
	return currentArray;
};

module.exports = EventDispatcher;
},{}],8:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Face = function(mA, mB, mC) {
	this._vertexA = mA;
	this._vertexB = mB;
	this._vertexC = mC;

	this._init();
};

var p = Face.prototype;


p._init = function() {
	var BA = glm.vec3.create();
	var CA = glm.vec3.create();
	glm.vec3.sub(BA, this._vertexB, this._vertexA);
	glm.vec3.sub(CA, this._vertexC, this._vertexA);

	this._faceNormal = glm.vec3.create();
	glm.vec3.cross(this._faceNormal, BA, CA);
	glm.vec3.normalize(this._faceNormal, this._faceNormal);
};


p.contains = function(mVertex) {
	return ( equal(mVertex, this._vertexA) || equal(mVertex, this._vertexB) || equal(mVertex, this._vertexC) );
};


p.__defineGetter__("faceNormal", function() {
	return this._faceNormal;
});

var equal = function(mV0, mV1) {
	return ( (mV0[0] === mV1[0]) && (mV0[1] === mV1[1]) && (mV0[2] === mV1[2]) );
};

module.exports = Face;
},{"gl-matrix":2}],9:[function(_dereq_,module,exports){
"use strict";

var gl, GL = _dereq_("./GLTools");
var GLTexture = _dereq_("./GLTexture");
var isPowerOfTwo = function(x) {	
	return (x !== 0) && !(x & (x - 1));	
};

var FrameBuffer = function(width, height, options) {
	gl = GL.gl;
	options        = options || {};
	this.width     = width;
	this.height    = height;
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR;
	this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
	this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;

	if(!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
		this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
			this.minFilter = gl.LINEAR;
		}
	} 

	this._init();
};

var p = FrameBuffer.prototype;

p._init = function() {
	this.texture            = gl.createTexture();
	
	this.glTexture			= new GLTexture(this.texture, true);
	
	this.frameBuffer        = gl.createFramebuffer();		
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	this.frameBuffer.width  = this.width;
	this.frameBuffer.height = this.height;

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	if(GL.depthTextureExt) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	}
	
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// if(this.magFilter == gl.NEAREST && this.minFilter == gl.NEAREST) {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	// 	console.debug("Both Nearest", this.floatTextureExt);
	// } else {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	// }

	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	if(GL.depthTextureExt === null) {
		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
		// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);	
		// if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	 //      throw new Error('Rendering to this texture is not supported (incomplete framebuffer)');
	 //    }

	 	// gl.renderbufferStorage( gl.RENDERBUFFER, gl.RGBA4, this.frameBuffer.width, this.frameBuffer.height );
	} else {
		this.depthTexture       = gl.createTexture();
		this.glDepthTexture		= new GLTexture(this.depthTexture, true);

		gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};


p.bind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};


p.unbind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
};


p.getTexture = function() {
	return this.glTexture;
};


p.getDepthTexture = function() {
	return this.glDepthTexture;
};


p.destroy = function() {
	gl.deleteFramebuffer(this.frameBuffer);

	this.glTexture.destroy();
	if(this.glDepthTexture) {
		this.glDepthTexture.destroy();
	}
};

module.exports = FrameBuffer;
},{"./GLTexture":12,"./GLTools":13}],10:[function(_dereq_,module,exports){
"use strict";

var gl;
var GL = _dereq_("./GLTools");

var GLCubeTexture = function(sources, options) {
	// [posx, negx, posy, negy, posz, negz]
	options = options || {};
	gl = GL.gl;
	this.texture = gl.createTexture();
	
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
	this.wrapS     = options.wrapS || gl.CLAMP_TO_EDGE;
	this.wrapT     = options.wrapT || gl.CLAMP_TO_EDGE;

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
	var targets = [
		gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
		gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
		gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
	];

	for (var j = 0; j < 6; j++) {
	    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sources[j]);
	    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
	    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
	}
	gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

var p = GLCubeTexture.prototype;


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);	
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLCubeTexture;
},{"./GLTools":13}],11:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var gl;
var ShaderLibs = _dereq_("./ShaderLibs");

var addLineNumbers = function ( string ) {
	var lines = string.split( '\n' );
	for ( var i = 0; i < lines.length; i ++ ) {
		lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];
	}
	return lines.join( '\n' );
};

var GLShader = function(aVertexShaderId, aFragmentShaderId) {
	gl              	 = GL.gl;
	this.idVertex        = aVertexShaderId;
	this.idFragment      = aFragmentShaderId;
	this.parameters      = [];
	this.uniformValues   = {};
	
	this.uniformTextures = [];
	
	this.vertexShader    = undefined;
	this.fragmentShader  = undefined;
	this._isReady        = false;
	this._loadedCount    = 0;

	if(aVertexShaderId === undefined || aVertexShaderId === null ) {
		this.createVertexShaderProgram(ShaderLibs.getShader("copyVert"));
	}

	if(aFragmentShaderId === undefined || aVertexShaderId === null ) {
		this.createFragmentShaderProgram(ShaderLibs.getShader("copyFrag"));
	}

	this.init();
};


var p = GLShader.prototype;

p.init = function() {
	if(this.idVertex && this.idVertex.indexOf("main(void)") > -1) {
		this.createVertexShaderProgram(this.idVertex);
	} else {
		this.getShader(this.idVertex, true);	
	}
	
	if(this.idFragment && this.idFragment.indexOf("main(void)") > -1) {
		this.createFragmentShaderProgram(this.idFragment);
	} else {
		this.getShader(this.idFragment, false);	
	}
};

p.getShader = function(aId, aIsVertexShader) {
	if(!aId) {return;}
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var that = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState === 4) {
			if(aIsVertexShader) {
				that.createVertexShaderProgram(e.target.responseText);
			} else {
				that.createFragmentShaderProgram(e.target.responseText);
			}
		}
	};
	req.open("GET", aId, true);
	req.send(null);
};

p.createVertexShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Vertex Shader : ", this.idVertex, ":", gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.vertexShader = shader;
	
	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};


p.createFragmentShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Fragment Shader: ", this.idFragment, ":" , gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.fragmentShader = shader;

	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};

p.attachShaderProgram = function() {
	this._isReady = true;
	this.shaderProgram = gl.createProgram();
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);
};

p.bind = function() {
	if(!this._isReady) {return;}
	gl.useProgram(this.shaderProgram);

	if(this.shaderProgram.pMatrixUniform === undefined) {	this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");}
	if(this.shaderProgram.mvMatrixUniform === undefined) {	this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");}
	if(this.shaderProgram.normalMatrixUniform === undefined) {	this.shaderProgram.normalMatrixUniform = gl.getUniformLocation(this.shaderProgram, "normalMatrix");}

	GL.setShader(this);
	GL.setShaderProgram(this.shaderProgram);

	this.uniformTextures = [];
};

p.isReady = function() {	return this._isReady;	};


p.clearUniforms = function() {
	this.parameters    = [];
	this.uniformValues = {};
};

p.uniform = function(aName, aType, aValue) {
	if(!this._isReady) {return;}

	if(aType === "texture") {aType = "uniform1i";}

	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name === aName) {
			oUniform.value = aValue;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.shaderProgram[aName] = gl.getUniformLocation(this.shaderProgram, aName);
		this.parameters.push({name : aName, type: aType, value: aValue, uniformLoc: this.shaderProgram[aName]});
	} else {
		this.shaderProgram[aName] = oUniform.uniformLoc;
	}


	if(aType.indexOf("Matrix") === -1) {
		if(!hasUniform) {
			var isArray = Array.isArray(aValue);
			if(isArray) {
				this.uniformValues[aName] = aValue.concat();
			} else {
				this.uniformValues[aName] = aValue;	
			}
			gl[aType](this.shaderProgram[aName], aValue);
		} else {
			// if(aName == 'position') console.log('Has uniform', this.checkUniform(aName, aType, aValue));
			if(this.checkUniform(aName, aType, aValue)) {
				gl[aType](this.shaderProgram[aName], aValue);
				// console.debug('Set uniform', aName, aType, aValue);
			}
		}
	} else {
		gl[aType](this.shaderProgram[aName], false, aValue);
		if(!hasUniform) {
			gl[aType](this.shaderProgram[aName], false, aValue);
			this.uniformValues[aName] = aValue;
			// console.debug('Set uniform', aName, aType, aValue);
		}
	}

	if(aType === "uniform1i") {
		// Texture
		this.uniformTextures[aValue] = this.shaderProgram[aName];
	}
};

p.checkUniform = function(aName, aType, aValue) {
	var isArray = Array.isArray(aValue);

	if(!this.uniformValues[aName]) {
		this.uniformValues[aName] = aValue;
		return true;
	}

	if(aType === "uniform1i") {
		this.uniformValues[aName] = aValue;
		return true;
	}

	var uniformValue = this.uniformValues[aName];
	var hasChanged = false;

	if(isArray) {
		for(var i=0; i<uniformValue.length; i++) {
			if(uniformValue[i] !== aValue[i]) {
				hasChanged = true;
				break;
			}
		}	
	} else {
		hasChanged = uniformValue !== aValue;
	}
	
	
	if(hasChanged) {
		if(isArray) {
			this.uniformValues[aName] = aValue.concat();
		} else {
			this.uniformValues[aName] = aValue;	
		}
		
	}

	return hasChanged;
};


p.unbind = function() {

};


p.destroy = function() {
	gl.detachShader(this.shaderProgram, this.vertexShader);
	gl.detachShader(this.shaderProgram, this.fragmentShader);
	gl.deleteShader(this.vertexShader);
	gl.deleteShader(this.fragmentShader);
	gl.deleteProgram(this.shaderProgram);
};

module.exports = GLShader;
},{"./GLTools":13,"./ShaderLibs":20}],12:[function(_dereq_,module,exports){
// GLTexture.js
"use strict";

var gl;
var GL = _dereq_("./GLTools");
var _isPowerOfTwo = function(x) {	
	var check = (x !== 0) && (!(x & (x - 1)));
	return check;
};
var isPowerOfTwo = function(obj) {	
	var w = obj.width || obj.videoWidth;
	var h = obj.height || obj.videoHeight;

	if(!w || !h) {return false;}

	return _isPowerOfTwo(w) && _isPowerOfTwo(h);
};

var GLTexture = function(source, isTexture, options) {
	isTexture = isTexture || false;
	options = options || {};
	gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this._source   = source;
		this.texture   = gl.createTexture();
		this._isVideo  = (source.tagName === "VIDEO");
		this.magFilter = options.magFilter || gl.LINEAR;
		this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
		
		this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
		this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;
		var width      = source.width || source.videoWidth;

		if(width) {
			if(!isPowerOfTwo(source)) {
				this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
				if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
					this.minFilter = gl.LINEAR;
				}
			} 	
		} else {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
			if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
		
		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
};

var p = GLTexture.prototype;


p.updateTexture = function(source) {
	if(source){ this._source = source; }
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.activeTexture(gl.TEXTURE0 + index);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLTexture;
},{"./GLTools":13}],13:[function(_dereq_,module,exports){
// GLTools.js
"use strict";

var glm = _dereq_("gl-matrix");

function GLTools() {
	this.aspectRatio   = 1;
	this.fieldOfView   = 45;
	this.zNear         = 5;
	this.zFar          = 3000;

	this.canvas        = null;
	this.gl            = null;

	this.shader        = null;
	this.shaderProgram = null;
}

var p = GLTools.prototype;

p.init = function(mCanvas, mWidth, mHeight, parameters) {
	if(this.canvas === null) {
		this.canvas      = mCanvas || document.createElement("canvas");
	}
	var params       = parameters || {};
	params.antialias = true;

	this.gl          = this.canvas.getContext("webgl", params) || this.canvas.getContext("experimental-webgl", params);
	console.log('GL TOOLS : ', this.gl);
	
	
	if(mWidth !== undefined && mHeight !== undefined) {
		this.setSize(mWidth, mHeight);
	} else {
		this.setSize(window.innerWidth, window.innerHeight);	
	}

	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.enable(this.gl.BLEND);
	this.gl.clearColor( 0, 0, 0, 1 );
	this.gl.clearDepth( 1 );

	this.matrix                 = glm.mat4.create();
	glm.mat4.identity(this.matrix);
	this.normalMatrix           = glm.mat3.create();
	this.depthTextureExt        = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	this.floatTextureExt        = this.gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
	this.floatTextureLinearExt  = this.gl.getExtension("OES_texture_float_linear"); // Or browser-appropriate prefix
	this.standardDerivativesExt = this.gl.getExtension("OES_standard_derivatives"); // Or browser-appropriate prefix

	this.enabledVertexAttribute = [];
	this.enableAlphaBlending();
	this._viewport = [0, 0, this.width, this.height];
};


p.getGL = function() {	return this.gl;	};

p.setShader = function(aShader) {
	this.shader = aShader;
};

p.setShaderProgram = function(aShaderProgram) {
	this.shaderProgram = aShaderProgram;
};

p.setViewport = function(aX, aY, aW, aH) {
	var hasChanged = false;
	if(aX!==this._viewport[0]) {hasChanged = true;}
	if(aY!==this._viewport[1]) {hasChanged = true;}
	if(aW!==this._viewport[2]) {hasChanged = true;}
	if(aH!==this._viewport[3]) {hasChanged = true;}

	if(hasChanged) {
		this.gl.viewport(aX, aY, aW, aH);
		this._viewport = [aX, aY, aW, aH];
	}
};

p.setMatrices = function(aCamera) {
	this.camera = aCamera;	
};

p.rotate = function(aRotation) {
	glm.mat4.copy(this.matrix, aRotation);

	glm.mat4.multiply(this.matrix, this.camera.getMatrix(), this.matrix);
	glm.mat3.fromMat4(this.normalMatrix, this.matrix);
	glm.mat3.invert(this.normalMatrix, this.normalMatrix);
	glm.mat3.transpose(this.normalMatrix, this.normalMatrix);
};


//	BLEND MODES
p.enableAlphaBlending = function() {
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	
};

p.enableAdditiveBlending = function() {
	this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
};

//	CLEAR CANVAS
p.clear = function(r, g, b, a) {
	this.gl.clearColor( r, g, b, a );
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

//	DRAWING ELEMENTS
p.draw = function(aMesh) {
	if(!this.shaderProgram) {
		console.warn("Shader program not ready yet");
		return;
	}

	if(!this.shaderProgram.pMatrixValue) {
		this.shaderProgram.pMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
		glm.mat4.copy(this.shaderProgram.pMatrixValue, this.camera.projection || this.camera.getMatrix());
	} else {
		var pMatrix = this.camera.projection || this.camera.getMatrix();
		if(glm.mat4.str(this.shaderProgram.pMatrixValue) !== glm.mat4.str(pMatrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
			glm.mat4.copy(this.shaderProgram.pMatrixValue, pMatrix);
		}
	}

	if(!this.shaderProgram.mvMatrixValue) {
		this.shaderProgram.mvMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
		glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
	} else {
		if(glm.mat4.str(this.shaderProgram.mvMatrixValue) !== glm.mat4.str(this.matrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
			glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
		}
	}

	if(!this.shaderProgram.normalMatrixValue) {
		this.shaderProgram.normalMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix );
		glm.mat3.copy(this.shaderProgram.normalMatrixValue, this.normalMatrix);
	} else {
		if(glm.mat3.str(this.shaderProgram.normalMatrixValue) !== glm.mat3.str(this.normalMatrix)) {
			this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform, false, this.normalMatrix );
			glm.mat3.copy(this.shaderProgram.normalMatrixValue, this.normalMatrix);
		}
	}



	// 	VERTEX POSITIONS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(this.gl, this.shaderProgram, "aVertexPosition");
	this.gl.vertexAttribPointer(vertexPositionAttribute, aMesh.vBufferPos.itemSize, this.gl.FLOAT, false, 0, 0);
	if(this.enabledVertexAttribute.indexOf(vertexPositionAttribute) === -1) {
		this.gl.enableVertexAttribArray(vertexPositionAttribute);	
		this.enabledVertexAttribute.push(vertexPositionAttribute);
	}
	

	//	TEXTURE COORDS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferUV);
	var textureCoordAttribute = getAttribLoc(this.gl, this.shaderProgram, "aTextureCoord");
	this.gl.vertexAttribPointer(textureCoordAttribute, aMesh.vBufferUV.itemSize, this.gl.FLOAT, false, 0, 0);
	
	if(this.enabledVertexAttribute.indexOf(textureCoordAttribute) === -1) {
		this.gl.enableVertexAttribArray(textureCoordAttribute);
		this.enabledVertexAttribute.push(textureCoordAttribute);
	}

	//	INDICES
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, aMesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<aMesh.extraAttributes.length; i++) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(this.gl, this.shaderProgram, aMesh.extraAttributes[i].name);
		this.gl.vertexAttribPointer(attrPosition, aMesh.extraAttributes[i].itemSize, this.gl.FLOAT, false, 0, 0);
		// this.gl.enableVertexAttribArray(attrPosition);	
		if(this.enabledVertexAttribute.indexOf(attrPosition) === -1) {
			this.gl.enableVertexAttribArray(attrPosition);
			this.enabledVertexAttribute.push(attrPosition);
		}	
	}

	//	DRAWING
	if(aMesh.drawType === this.gl.POINTS ) {
		this.gl.drawArrays(aMesh.drawType, 0, aMesh.vertexSize);	
	} else {
		this.gl.drawElements(aMesh.drawType, aMesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
	}


	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc === undefined) {	shaderProgram.cacheAttribLoc = {};	}
		if(shaderProgram.cacheAttribLoc[name] === undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}

};

//	CANVAS RESIZING
p.setSize = function(mWidth, mHeight) {
	this._width = mWidth;
	this._height = mHeight;

	this.canvas.width      = this._width;
	this.canvas.height     = this._height;
	this.gl.viewportWidth  = this._width;
	this.gl.viewportHeight = this._height;

	this.gl.viewport(0, 0, this._width, this._height);
	this.aspectRatio       = this._width / this._height;
};


p.__defineGetter__("width", function() {
	return this._width;
});

p.__defineGetter__("height", function() {
	return this._height;
});

p.__defineGetter__("viewport", function() {
	return this._viewport;
});

var instance = null;

GLTools.getInstance = function() {
	if(instance === null) {
		instance = new GLTools();
	}
	return instance;
};


module.exports = GLTools.getInstance();
},{"gl-matrix":2}],14:[function(_dereq_,module,exports){
"use strict";

var Face = _dereq_("./Face");
var GL = _dereq_("./GLTools");
var glm = _dereq_("gl-matrix");

var Mesh = function(aVertexSize, aIndexSize, aDrawType) {

	this.gl = GL.gl;
	this.vertexSize = aVertexSize;
	this.indexSize = aIndexSize;
	this.drawType = aDrawType;
	this.extraAttributes = [];
	
	this.vBufferPos = undefined;
	this._floatArrayVertex = undefined;

	this._init();
};

var p = Mesh.prototype;

p._init = function() {

};

p.bufferVertex = function(aArrayVertices, isDynamic) {
	var vertices = [];
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	this._vertices = [];

	for(var i=0; i<aArrayVertices.length; i++) {
		for(var j=0; j<aArrayVertices[i].length; j++) {
			vertices.push(aArrayVertices[i][j]);
		}
		this._vertices.push(glm.vec3.clone(aArrayVertices[i]));
	}

	if(this.vBufferPos === undefined) {
		this.vBufferPos = this.gl.createBuffer();
	}
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex === undefined) {
		this._floatArrayVertex = new Float32Array(vertices);
	} else {
		if(aArrayVertices.length !== this._floatArrayVertex.length) {
			this._floatArrayVertex = new Float32Array(vertices);
		} else {
			for(var k=0; k<aArrayVertices.length; k++) {
				this._floatArrayVertex[k] = aArrayVertices[k];
			}
		}
	}

	this.gl.bufferData(this.gl.ARRAY_BUFFER, this._floatArrayVertex, drawType);
	this.vBufferPos.itemSize = 3;
};

p.bufferTexCoords = function(aArrayTexCoords) {
	var coords = [];

	for(var i=0; i<aArrayTexCoords.length; i++) {
		for(var j=0; j<aArrayTexCoords[i].length; j++) {
			coords.push(aArrayTexCoords[i][j]);
		}
	}

	this.vBufferUV = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coords), this.gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};

p.bufferData = function(aData, aName, aItemSize, isDynamic) {
	var index = -1;
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	var i=0;

	for(i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name === aName) {
			this.extraAttributes[i].data = aData;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(i=0; i<aData.length; i++) {
		for(var j=0; j<aData[i].length; j++) {
			bufferData.push(aData[i][j]);
		}
	}

	var buffer, floatArray;
	if(index === -1) {
		buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = new Float32Array(bufferData);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
		this.extraAttributes.push({name:aName, data:aData, itemSize: aItemSize, buffer:buffer, floatArray:floatArray});
	} else {
		buffer = this.extraAttributes[index].buffer;
		// console.debug("Buffer exist", buffer);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = this.extraAttributes[index].floatArray;
		for(i=0; i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
	}

};

p.bufferIndices = function(aArrayIndices) {
	this._indices = aArrayIndices;
	this.iBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aArrayIndices), this.gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aArrayIndices.length;
};


p.computeNormals = function() {
	if(this.drawType !== this.gl.TRIANGLES) {return;}

	if(this._faces === undefined) {	this._generateFaces();	}
	console.log("Start computing");

	var time = new Date().getTime();
	var j=0;

	this._normals = [];
	for(var i=0; i<this._vertices.length; i++) {
		var normal = glm.vec3.create();
		var faceCount = 0;
		for(j=0; j<this._faces.length; j++) {
			if(this._faces[j].contains(this._vertices[i])) {
				glm.vec3.add(normal, normal, this._faces[j].faceNormal);
				faceCount ++;
			}
		}

		glm.vec3.normalize(normal, normal);
		this._normals.push(normal);
	}

	this.bufferData(this._normals, "aNormal", 3);

	var totalTime = new Date().getTime() - time;
	console.log("Total Time : ", totalTime);
};


p.computeTangent = function() {
	
};


p._generateFaces = function() {
	this._faces = [];

	for(var i=0; i<this._indices.length; i+=3) {
		var p0 = this._vertices[this._indices[i+0]];
		var p1 = this._vertices[this._indices[i+1]];
		var p2 = this._vertices[this._indices[i+2]];

		this._faces.push(new Face(p0, p1, p2));
	}
};

module.exports = Mesh;
},{"./Face":8,"./GLTools":13,"gl-matrix":2}],15:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var MeshUtils = {};

MeshUtils.createPlane = function(width, height, numSegments, withNormals, axis) {
	axis          = axis === undefined ? "xy" : axis;
	withNormals   = withNormals === undefined ? false : withNormals;
	var positions = [];
	var coords    = [];
	var indices   = [];
	var normals   = [];

	var gapX  = width/numSegments;
	var gapY  = height/numSegments;
	var gapUV = 1/numSegments;
	var index = 0;
	var sx    = -width * 0.5;
	var sy    = -height * 0.5;

	for(var i=0; i<numSegments; i++) {
		for (var j=0; j<numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;

			if(axis === 'xz') {
				positions.push([tx, 		0, 	ty+gapY	]);
				positions.push([tx+gapX, 	0, 	ty+gapY	]);
				positions.push([tx+gapX, 	0, 	ty	]);
				positions.push([tx, 		0, 	ty	]);	

				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
			} else if(axis === 'yz') {
				positions.push([0, tx, 		ty]);
				positions.push([0, tx+gapX, ty]);
				positions.push([0, tx+gapX, ty+gapY]);
				positions.push([0, tx, 		ty+gapY]);	

				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
			} else {
				positions.push([tx, 		ty, 	0]);
				positions.push([tx+gapX, 	ty, 	0]);
				positions.push([tx+gapX, 	ty+gapY, 	0]);
				positions.push([tx, 		ty+gapY, 	0]);	

				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
			} 

			var u = i/numSegments;
			var v = j/numSegments;
			coords.push([u, v]);
			coords.push([u+gapUV, v]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u, v+gapUV]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createSphere = function(size, numSegments, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;
	var positions = [];
	var coords    = [];
	var indices   = [];
	var normals   = [];
	var index     = 0;
	var gapUV     = 1/numSegments;

	var getPosition = function(i, j, isNormal) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		isNormal = isNormal === undefined ? false : isNormal;
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			if(withNormals) {
				normals.push(getPosition(i, j, true));
				normals.push(getPosition(i+1, j, true));
				normals.push(getPosition(i+1, j+1, true));
				normals.push(getPosition(i, j+1, true));	
			}
			

			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	console.log('With normals :', withNormals);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createCube = function(w,h,d, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;
	h = h || w;
	d = d || w;

	var x = w/2;
	var y = h/2;
	var z = d/2;

	var positions = [];
	var coords    = [];
	var indices   = []; 
	var normals   = []; 
	var count     = 0;


	// BACK
	positions.push([-x,  y, -z]);
	positions.push([ x,  y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([-x, -y, -z]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ x,  y, -z]);
	positions.push([ x,  y,  z]);
	positions.push([ x, -y,  z]);
	positions.push([ x, -y, -z]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([ x,  y,  z]);
	positions.push([-x,  y,  z]);
	positions.push([-x, -y,  z]);
	positions.push([ x, -y,  z]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	// LEFT
	positions.push([-x,  y,  z]);
	positions.push([-x,  y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y,  z]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([-x,  y,  z]);
	positions.push([ x,  y,  z]);
	positions.push([ x,  y, -z]);
	positions.push([-x,  y, -z]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([-x, -y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([ x, -y,  z]);
	positions.push([-x, -y,  z]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

MeshUtils.createSkyBox = function(size, withNormals) {
	withNormals   = withNormals === undefined ? false : withNormals;

	var positions = [];
	var coords    = [];
	var indices   = []; 
	var normals   = []; 
	var count     = 0;

	// BACK
	positions.push([ size,  size, -size]);
	positions.push([-size,  size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([ size, -size, -size]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ size, -size, -size]);
	positions.push([ size, -size,  size]);
	positions.push([ size,  size,  size]);
	positions.push([ size,  size, -size]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([-size,  size,  size]);
	positions.push([ size,  size,  size]);
	positions.push([ size, -size,  size]);
	positions.push([-size, -size,  size]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// LEFT
	positions.push([-size, -size,  size]);
	positions.push([-size, -size, -size]);
	positions.push([-size,  size, -size]);
	positions.push([-size,  size,  size]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([ size,  size,  size]);
	positions.push([-size,  size,  size]);
	positions.push([-size,  size, -size]);
	positions.push([ size,  size, -size]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([ size, -size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, -size,  size]);
	positions.push([ size, -size,  size]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	if(withNormals) {
		mesh.bufferData(normals, "aNormal", 3);
	}

	return mesh;
};

module.exports = MeshUtils;
},{"./GLTools":13,"./Mesh":14}],16:[function(_dereq_,module,exports){
// ObjLoader.js

"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var gl;


function ObjLoader() {
	this._clearAll();
}


var p = ObjLoader.prototype;

p._clearAll = function() {
	this._callback      = null;
	this._callbackError = null;
	this._mesh          = [];	
	this._drawingType 	= "";
};

p.load = function(url, callback, callbackError, ignoreNormals, drawingType) {
	this._clearAll();
	if(!gl) {	gl = GL.gl;	}
	this._drawingType = drawingType === undefined ? gl.TRIANGLES : drawingType;
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._callback = callback;
	this._callbackError = callbackError;

	var request = new XMLHttpRequest();
	request.onreadystatechange = this._onXHTPState.bind(this);
	request.open("GET", url, true);
	request.send();
};

p._onXHTPState = function(e) {
	if(e.target.readyState === 4) {
		this._parseObj(e.target.response);
	}
};


p.parse = function(objStr, callback, callbackError, ignoreNormals, drawingType) {
	this._clearAll();
	this._drawingType = drawingType === undefined ? gl.TRIANGLES : drawingType;
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._parseObj(objStr);
};


p._parseObj = function(objStr) {
	var lines = objStr.split('\n');

	var positions    = [];
	var coords       = [];
	var finalNormals = [];
	var vertices     = [];
	var normals      = [];
	var uvs          = [];
	var indices      = [];
	var count        = 0;
	var result;

	// v float float float
	var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vn float float float
	var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vt float float
	var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// f vertex vertex vertex ...
	var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

	// f vertex/uv vertex/uv vertex/uv ...
	var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

	// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
	var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

	// f vertex//normal vertex//normal vertex//normal ... 
	var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;


	function parseVertexIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
	}

	function parseNormalIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
	}

	function parseUVIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
	}


	function addVertex(a, b ,c) {
		positions.push([vertices[a], vertices[a+1], vertices[a+2]]);
		positions.push([vertices[b], vertices[b+1], vertices[b+2]]);
		positions.push([vertices[c], vertices[c+1], vertices[c+2]]);

		indices.push(count * 3 + 0);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 2);

		count ++;
	}


	function addUV(a, b, c) {
		coords.push([uvs[a], uvs[a+1]]);
		coords.push([uvs[b], uvs[b+1]]);
		coords.push([uvs[c], uvs[c+1]]);
	}


	function addNormal(a, b, c) {
		finalNormals.push([normals[a], normals[a+1], normals[a+2]]);
		finalNormals.push([normals[b], normals[b+1], normals[b+2]]);
		finalNormals.push([normals[c], normals[c+1], normals[c+2]]);
	}

	function addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {
		var ia = parseVertexIndex( a );
		var ib = parseVertexIndex( b );
		var ic = parseVertexIndex( c );
		var id;

		if ( d === undefined ) {

			addVertex( ia, ib, ic );

		} else {

			id = parseVertexIndex( d );

			addVertex( ia, ib, id );
			addVertex( ib, ic, id );

		}


		if ( ua !== undefined ) {

			ia = parseUVIndex( ua );
			ib = parseUVIndex( ub );
			ic = parseUVIndex( uc );

			if ( d === undefined ) {

				addUV( ia, ib, ic );

			} else {

				id = parseUVIndex( ud );

				addUV( ia, ib, id );
				addUV( ib, ic, id );

			}

		}

		if ( na !== undefined ) {

			ia = parseNormalIndex( na );
			ib = parseNormalIndex( nb );
			ic = parseNormalIndex( nc );

			if ( d === undefined ) {

				addNormal( ia, ib, ic );

			} else {

				id = parseNormalIndex( nd );

				addNormal( ia, ib, id );
				addNormal( ib, ic, id );

			}

		}
	}


	for ( var i = 0; i < lines.length; i ++ ) {
		var line = lines[ i ];
		line = line.trim();

		if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

			continue;

		} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

			vertices.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

			normals.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

			uvs.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] )
			);

		} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

			addFace(
				result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
			);

		} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
				result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
				result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
			);

		} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				undefined, undefined, undefined, undefined,
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} 
	}

	this._generateMeshes({	
		positions:positions,
		coords:coords,
		normals:finalNormals,
		indices:indices
	});
	
};


p._generateMeshes = function(o) {
	gl = GL.gl;

	var mesh = new Mesh(o.positions.length, o.indices.length, this._drawingType);
	mesh.bufferVertex(o.positions);
	mesh.bufferTexCoords(o.coords);
	mesh.bufferIndices(o.indices);
	if(!this._ignoreNormals) {
		mesh.bufferData(o.normals, "aNormal", 3);
	}

	if(this._callback) {
		this._callback(mesh, o);
	}
};

// var loader = new ObjLoader();

module.exports = ObjLoader;
},{"./GLTools":13,"./Mesh":14}],17:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

function QuatRotation(mListenerTarget) {
	if(mListenerTarget === undefined) {	mListenerTarget = document;	}
	this._isRotateZ     = 0;
	this.matrix         = glm.mat4.create();
	this.m              = glm.mat4.create();
	this._vZaxis        = glm.vec3.clone([0, 0, 0]);
	this._zAxis         = glm.vec3.clone([0, 0, -1]);
	this.preMouse       = {x:0, y:0};
	this.mouse          = {x:0, y:0};
	this._isMouseDown   = false;
	this._rotation      = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation   = glm.quat.clone([0, 0, 0, 0]);
	this._rotateZMargin = 0;
	this.diffX          = 0;
	this.diffY          = 0;
	this._currDiffX     = 0;
	this._currDiffY     = 0;
	this._offset        = 0.004;
	this._easing        = 0.1;
	this._slerp			= -1;
	this._isLocked 		= false;

	var that = this;
	mListenerTarget.addEventListener("mousedown", function(aEvent) { that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("touchstart", function(aEvent) {	that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("mouseup", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("touchend", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("mousemove", function(aEvent) { that._onMouseMove(aEvent); });
	mListenerTarget.addEventListener("touchmove", function(aEvent) { that._onMouseMove(aEvent); });
}


var p = QuatRotation.prototype;

p.inverseControl = function(value) {
	if(value === undefined) {	
		this._isInvert = true;	
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {	
		this._isLocked = true;	
	} else {	
		this._isLocked = value;	
	}
};

p.getMousePos = function(aEvent) {
	var mouseX, mouseY;

	if(aEvent.changedTouches !== undefined) {
		mouseX = aEvent.changedTouches[0].pageX;
		mouseY = aEvent.changedTouches[0].pageY;
	} else {
		mouseX = aEvent.clientX;
		mouseY = aEvent.clientY;
	}
	
	return {x:mouseX, y:mouseY};
};

p._onMouseDown = function(aEvent) {
	if(this._isLocked) {return;}
	if(this._isMouseDown) {return;}

	var mouse = this.getMousePos(aEvent);
	var tempRotation = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation = tempRotation;

	this._isMouseDown = true;
	this._isRotateZ = 0;
	this.preMouse = {x:mouse.x, y:mouse.y};

	if(mouse.y < this._rotateZMargin || mouse.y > (window.innerHeight - this._rotateZMargin) ) {	this._isRotateZ = 1;	}
	else if(mouse.x < this._rotateZMargin || mouse.x > (window.innerWidth - this._rotateZMargin) ) {	this._isRotateZ = 2;	}

	this._currDiffX = this.diffX = 0;
	this._currDiffY = this.diffY = 0;
};

p._onMouseMove = function(aEvent) {
	if(this._isLocked) {return;}
	if(aEvent.touches) {aEvent.preventDefault();}
	this.mouse = this.getMousePos(aEvent);
};

p._onMouseUp = function() {
	if(this._isLocked) {return;}
	if(!this._isMouseDown) {return;}
	this._isMouseDown = false;
};

p.setCameraPos = function(mQuat, speed) {
	speed             = speed || this._easing;
	this._easing      = speed;
	if(this._slerp > 0) {return;}
	
	var tempRotation  = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation    = glm.quat.clone(tempRotation);
	this._currDiffX   = this.diffX = 0;
	this._currDiffY   = this.diffY = 0;
	
	this._isMouseDown = false;
	this._isRotateZ   = 0;
	
	this._targetQuat  = glm.quat.clone(mQuat);
	this._slerp       = 1;
};

p.resetQuat = function() {
	this._rotation    = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation = glm.quat.clone([0, 0, 0, 0]);
	this._targetQuat  = undefined;
	this._slerp       = -1;
};

p.update = function() {
	glm.mat4.identity(this.m);

	if(this._targetQuat === undefined) { 
		glm.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
		this._updateRotation(this.tempRotation);
	} else {
		this._slerp += (0 - this._slerp) * 0.1;

		if(this._slerp < 0.001) {
			// quat.set(this._targetQuat, this._rotation);
			glm.quat.set(this._rotation, this._targetQuat[0], this._targetQuat[1], this._targetQuat[2], this._targetQuat[3]);
			this._targetQuat = undefined;
			this._slerp = -1;
		} else {
			glm.quat.set(this.tempRotation, 0, 0, 0, 0);
			glm.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
		}
	}

	glm.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

	glm.mat4.fromQuat(this.matrix, this.tempRotation);
};

p._updateRotation = function(aTempRotation) {
	if(this._isMouseDown && !this._isLocked) {
		this.diffX = -(this.mouse.x - this.preMouse.x);
		this.diffY = (this.mouse.y - this.preMouse.y);

		if(this._isInvert) {
			this.diffX = -this.diffX;
			this.diffY = -this.diffY;
		}
	}
	
	this._currDiffX += (this.diffX - this._currDiffX) * this._easing;
	this._currDiffY += (this.diffY - this._currDiffY) * this._easing;

	var angle, _quat;

	if(this._isRotateZ > 0) {
		if(this._isRotateZ === 1) {
			angle = -this._currDiffX * this._offset; 
			angle *= (this.preMouse.y < this._rotateZMargin) ? -1 : 1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		} else {
			angle = -this._currDiffY * this._offset; 
			angle *= (this.preMouse.x < this._rotateZMargin) ? 1 : -1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		}
	} else {
		var v = glm.vec3.clone([this._currDiffX, this._currDiffY, 0]);
		var axis = glm.vec3.create();
		glm.vec3.cross(axis, v, this._zAxis);
		glm.vec3.normalize(axis, axis);
		angle = glm.vec3.length(v) * this._offset;
		_quat = glm.quat.clone( [Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle) ] );
		glm.quat.multiply(aTempRotation, _quat, aTempRotation);
	}

};


module.exports = QuatRotation;
},{"gl-matrix":2}],18:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var QuatRotation = _dereq_("./QuatRotation");
var CameraOrtho = _dereq_("./CameraOrtho");
var SimpleCamera = _dereq_("./SimpleCamera");
var glm = _dereq_("gl-matrix");

var Scene = function() {
	if(GL.canvas === null) {return;}
	this.gl = GL.gl;
	this._children = [];
	this._init();
};

var p = Scene.prototype;

p._init = function() {
	this.camera = new SimpleCamera(GL.canvas);
	this.camera.setPerspective(45*Math.PI/180, GL.aspectRatio, 5, 3000);
	this.camera.lockRotation();

	var eye                = glm.vec3.clone([0, 0, 500]  );
	var center             = glm.vec3.create( );
	var up                 = glm.vec3.clone( [0,-1,0] );
	this.camera.lookAt(eye, center, up);
	
	this.sceneRotation     = new QuatRotation(GL.canvas);
	this.rotationFront     = glm.mat4.create();
	glm.mat4.identity(this.rotationFront);
	
	this.cameraOrtho       = new CameraOrtho();
	this.cameraOrthoScreen = new CameraOrtho();
	this.cameraOtho        = this.cameraOrtho;

	this.cameraOrtho.lookAt(eye, center, up);
	this.cameraOrtho.ortho( 1, -1, 1, -1);

	this.cameraOrthoScreen.lookAt(eye, center, up);
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);

	// In SuperClass should call following functions.
	this._initTextures();
	this._initViews();

	window.addEventListener("resize", this._onResize.bind(this));
};

p._initTextures = function() {
	// console.log("Should be overwritten by SuperClass");
};

p._initViews = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.loop = function() {
	this.update();
	this.render();
};

p.update = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.sceneRotation.update();
	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera );
	GL.rotate(this.sceneRotation.matrix);

};

p.resize = function() {
	// if(this.camera.resize) {
	// 	this.camera.resize(GL.aspectRatio);
	// }
};

p.render = function() {

};

p._onResize = function() {
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);
};

module.exports = Scene;
},{"./CameraOrtho":4,"./GLTools":13,"./QuatRotation":17,"./SimpleCamera":21,"gl-matrix":2}],19:[function(_dereq_,module,exports){
// Scheduler.js

"use strict";

if(window.requestAnimFrame === undefined) {
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
		};
	})();
}

function Scheduler() {
	this.FRAMERATE = 60;
	this._delayTasks = [];
	this._nextTasks = [];
	this._deferTasks = [];
	this._highTasks = [];
	this._usurpTask = [];
	this._enterframeTasks = [];
	this._idTable = 0;

	window.requestAnimFrame( this._loop.bind(this) );
}

var p = Scheduler.prototype;

p._loop = function() {
	window.requestAnimFrame( this._loop.bind(this) );
	this._process();
};


p._process = function() {
	var i = 0,
		task, interval, current;
	for ( i=0; i<this._enterframeTasks.length; i++) {
		task = this._enterframeTasks[i];
		if(task !== null && task !== undefined) {
			task.func.apply(task.scope, task.params);
		}
	}
	
	while ( this._highTasks.length > 0) {
		task = this._highTasks.pop();
		task.func.apply(task.scope, task.params);
	}
	

	var startTime = new Date().getTime();

	for ( i=0; i<this._delayTasks.length; i++) {
		task = this._delayTasks[i];
		if(startTime-task.time > task.delay) {
			task.func.apply(task.scope, task.params);
			this._delayTasks.splice(i, 1);
		}
	}

	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._deferTasks.length > 0) {
		task = this._deferTasks.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			this._deferTasks.unshift(task);
			break;
		}
	}


	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._usurpTask.length > 0) {
		task = this._usurpTask.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			// this._usurpTask.unshift(task);
			break;
		}
	}



	this._highTasks = this._highTasks.concat(this._nextTasks);
	this._nextTasks = [];
	this._usurpTask = [];
};


p.addEF = function(scope, func, params) {
	params = params || [];
	var id = this._idTable;
	this._enterframeTasks[id] = {scope:scope, func:func, params:params};
	this._idTable ++;
	return id;
};


p.removeEF = function(id) {
	if(this._enterframeTasks[id] !== undefined) {
		this._enterframeTasks[id] = null;
	}
	return -1;
};


p.delay = function(scope, func, params, delay) {
	var time = new Date().getTime();
	var t = {scope:scope, func:func, params:params, delay:delay, time:time};
	this._delayTasks.push(t);
};


p.defer = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._deferTasks.push(t);
};


p.next = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._nextTasks.push(t);
};


p.usurp = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._usurpTask.push(t);
};


var instance = null;

Scheduler.getInstance = function() {
	if(instance === null) {
		instance = new Scheduler();
	}
	return instance;
};

module.exports = Scheduler.getInstance();
},{}],20:[function(_dereq_,module,exports){
"use strict";


var ShaderLibs = function() { };

ShaderLibs.shaders = {};

ShaderLibs.shaders.copyVert = "#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
ShaderLibs.shaders.copyNormalVert = "#define GLSLIFY 1\n\n// copyWithNormals.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nvoid main(void) {\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n\tvNormal       = aNormal;\n\tvVertex \t  = aVertexPosition;\n}";

ShaderLibs.shaders.generalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
ShaderLibs.shaders.generalNormalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition;\n\tpos           *= scale;\n\tpos           += position;\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvNormal       = aNormal;\n\tvVertex       = pos;\n}";
ShaderLibs.shaders.generalWithNormalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition;\n\tpos           *= scale;\n\tpos           += position;\n\tgl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvNormal       = aNormal;\n\tvVertex       = pos;\n}";

ShaderLibs.shaders.copyFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}\n";


ShaderLibs.shaders.alphaFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}";

ShaderLibs.shaders.simpleColorFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}";

ShaderLibs.shaders.depthFrag = "#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n\treturn (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}";

ShaderLibs.shaders.simpleCopyLighting = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform sampler2D texture;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 L        = normalize(lightPosition-vVertex);\n\tfloat lambert = max(dot(vNormal, L), .0);\n\tvec3 light    = ambient + lightColor * lambert * lightWeight;\n\tvec4 color \t  = texture2D(texture, vTextureCoord);\n\tcolor.rgb \t  *= light;\n\t\n\tgl_FragColor  = color;\n}";
ShaderLibs.shaders.simpleColorLighting = "#define GLSLIFY 1\n\n// simpleColorLighting.frag\n\n#define SHADER_NAME SIMPLE_COLOR_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform vec3 color;\nuniform float opacity;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 L        = normalize(lightPosition-vVertex);\n\tfloat lambert = max(dot(vNormal, L), .0);\n\tvec3 light    = ambient + lightColor * lambert * lightWeight;\n\t\n\tgl_FragColor  = vec4(color * light, opacity);\n}";



ShaderLibs.getShader = function(mId) {
	return this.shaders[mId];
};

ShaderLibs.get = ShaderLibs.getShader;
module.exports = ShaderLibs;
},{}],21:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");
var CameraPerspective = _dereq_("./CameraPerspective");
var EaseNumber = _dereq_("./EaseNumber");

var SimpleCamera = function(mListenerTarget) {
	this._listenerTarget = mListenerTarget || window;
	CameraPerspective.call(this);
	// this._isLocked = false;
	this._init();
};

var p = SimpleCamera.prototype = new CameraPerspective();
var s = CameraPerspective.prototype;

p._init = function() {
	this.radius          = new EaseNumber(500);
	this.position[2]     = this.radius.value;
	this.center          = glm.vec3.create( );
	this.up              = glm.vec3.clone( [0,-1,0] );
	this.lookAt(this.position, this.center, this.up);
	this._mouse          = {};
	this._preMouse       = {};
	this._isMouseDown    = false;
	
	this._rx             = new EaseNumber(0);
	this._rx.limit(-Math.PI/2, Math.PI/2);
	this._ry             = new EaseNumber(0);
	this._preRX          = 0;
	this._preRY          = 0;
	// this._isLocked       = false;
	this._isLockZoom 	 = false;
	this._isLockRotation = false;
	this._isInvert       = false;

	this._listenerTarget.addEventListener("mousewheel", this._onWheel.bind(this));
	this._listenerTarget.addEventListener("DOMMouseScroll", this._onWheel.bind(this));

	this._listenerTarget.addEventListener("mousedown", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("touchstart", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("mousemove", this._onMouseMove.bind(this));
	this._listenerTarget.addEventListener("touchmove", this._onMouseMove.bind(this));
	window.addEventListener("mouseup", this._onMouseUp.bind(this));
	window.addEventListener("touchend", this._onMouseUp.bind(this));
};

p.inverseControl = function(value) {
	if(value === undefined) {
		this._isInvert = true;
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {
		// this._isLocked = true;
		this._isLockZoom = true;
		this._isLockRotation = true;
	} else {
		this._isLockZoom = value;
		this._isLockRotation = value;
	}
};

p.lockRotation = function(value) {
	if(value === undefined) {
		this._isLockRotation = true;
	} else {
		this._isLockRotation = value;
	}
};

p.lockZoom = function(value) {
	this._isLockZoom = value === undefined ? true : value;
};

p._onMouseDown = function(mEvent) {
	if(this._isLockRotation) {return;}
	this._isMouseDown = true;
	getMouse(mEvent, this._mouse);
	getMouse(mEvent, this._preMouse);
	this._preRX = this._rx.targetValue;
	this._preRY = this._ry.targetValue;
};


p._onMouseMove = function(mEvent) {
	if(this._isLockRotation) {return;}
	getMouse(mEvent, this._mouse);
	if(mEvent.touches) {mEvent.preventDefault();}
	if(this._isMouseDown) {
		var diffX = this._mouse.x - this._preMouse.x;
		if(this._isInvert) {diffX *= -1;}
		this._ry.value = this._preRY - diffX * 0.01;

		var diffY = this._mouse.y - this._preMouse.y;
		if(this._isInvert) {diffY *= -1;}
		this._rx.value = this._preRX - diffY * 0.01;

		// if(this._rx.targetValue > Math.PI * 0.5) {this._rx.targetValue = Math;	}
	}
};


p._onMouseUp = function() {
	if(this._isLockRotation) {return;}
	this._isMouseDown = false;
	// getMouse(mEvent, this._mouse);
};


p._onWheel = function(aEvent) {
	if(this._isLockZoom) {	return;	}
	var w = aEvent.wheelDelta;
	var d = aEvent.detail;
	var value = 0;
	if (d){
		if (w) {
			value = w/d/40*d>0?1:-1; // Opera
		} else {
			value = -d/3;              // Firefox;         TODO: do not /3 for OS X
		}
	} else {
		value = w/120; 
	}

	// this._targetRadius -= value * 5;
	this.radius.add( -value * 5);
	
};


p.getMatrix = function() {
	this._updateCameraPosition();
	this.lookAt(this.position, this.center, this.up);
	return s.getMatrix.call(this);
};


p._updateCameraPosition = function() {
	this.position[2] 	= this.radius.value;

	this.position[1] = Math.sin(this._rx.value) * this.radius.value;
	var tr = Math.cos(this._rx.value) * this.radius.value;
	this.position[0] = Math.cos(this._ry.value + Math.PI*0.5) * tr;
	this.position[2] = Math.sin(this._ry.value + Math.PI*0.5) * tr;
};


var getMouse = function(mEvent, mTarget) {
	var o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};


p.__defineGetter__("rx", function() {
	return this._rx.targetValue;
});
 
p.__defineSetter__("rx", function(mValue) {
	this._rx.value = mValue;
});

p.__defineGetter__("ry", function() {
	return this._ry.targetValue;
});
 
p.__defineSetter__("ry", function(mValue) {
	this._ry.value = mValue;
});

module.exports = SimpleCamera;
},{"./CameraPerspective":5,"./EaseNumber":6,"gl-matrix":2}],22:[function(_dereq_,module,exports){
"use strict";

var SimpleImageLoader = function() {
	this._imgs             = {};
	this._loadedCount      = 0;
	this._toLoadCount      = 0;
	this._scope            = undefined;
	this._callback         = undefined;
	this._callbackProgress = undefined;
};

var p = SimpleImageLoader.prototype;


p.load = function(imgs, scope, callback, progressCallback) {
	this._imgs = {};
	this._loadedCount = 0;
	this._toLoadCount = imgs.length;
	this._scope = scope;
	this._callback = callback;
	this._callbackProgress = progressCallback;

	this._imgLoadedBind = this._onImageLoaded.bind(this);

	for ( var i=0; i<imgs.length ; i++) {
		var img         = new Image();
		img.onload      = this._imgLoadedBind;
		var path        = imgs[i];
		var tmp         = path.split("/");
		var ref         = tmp[tmp.length-1].split(".")[0];
		this._imgs[ref] = img;
		img.src         = path;
	}
};


p._onImageLoaded = function() {
	this._loadedCount++;

	if(this._loadedCount === this._toLoadCount) {
		this._callback.call(this._scope, this._imgs);
	} else {
		var p = this._loadedCount / this._toLoadCount;
		if(this._callbackProgress) {
			this._callbackProgress.call(this._scope, p);
		}
	}
};

module.exports = SimpleImageLoader;
},{}],23:[function(_dereq_,module,exports){
// View.js
"use strict";

var GLShader = _dereq_("./GLShader");

var View = function(aPathVert, aPathFrag) {
	this.shader = new GLShader(aPathVert, aPathFrag);
	this._init();
};

var p = View.prototype;

p._init = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.render = function() {
	// console.log("Should be overwritten by SuperClass");
};

module.exports = View;


},{"./GLShader":11}],24:[function(_dereq_,module,exports){
// ViewAxis.js

"use strict";
var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var Mesh = _dereq_("./Mesh");

var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewAxis = function(lineWidth, mFragShader) {
	this.lineWidth = lineWidth === undefined ? 2.0 : lineWidth;
	var fs = mFragShader === undefined ? fragShader : mFragShader;
	View.call(this, vertShader, fs);
};

var p = ViewAxis.prototype = new View();

p._init = function() {
	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);

	var positions = [];
	var colors = [];
	var coords = [];
	var indices = [0, 1, 2, 3, 4, 5];
	var r = 9999;

	positions.push([-r,  0,  0]);
	positions.push([ r,  0,  0]);
	positions.push([ 0, -r,  0]);
	positions.push([ 0,  r,  0]);
	positions.push([ 0,  0, -r]);
	positions.push([ 0,  0,  r]);


	colors.push([1, 0, 0]);
	colors.push([1, 0, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 0, 1]);
	colors.push([0, 0, 1]);


	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);


	this.mesh = new Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aColor", 3, false);
};

p.render = function() {
	if(!this.shader.isReady()) {return;}

	this.shader.bind();
	GL.gl.lineWidth(this.lineWidth);
	GL.draw(this.mesh);
	GL.gl.lineWidth(1.0);
};

module.exports = ViewAxis;

},{"./GLTools":13,"./Mesh":14,"./View":23}],25:[function(_dereq_,module,exports){
"use strict";

var View = _dereq_("./View");
var GL = _dereq_("./GLTools");
var MeshUtils = _dereq_("./MeshUtils");

var ViewCopy = function(aPathVert, aPathFrag) {
	View.call(this, aPathVert, aPathFrag);
};

var p = ViewCopy.prototype = new View();

p._init = function() {
	if(!GL.gl) { return;	}
	this.mesh = MeshUtils.createPlane(2, 2, 1);
};

p.render = function(aTexture) {
	if(!this.shader.isReady()) {return;}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	// console.log('Render', aTexture);
	aTexture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewCopy;

},{"./GLTools":13,"./MeshUtils":15,"./View":23}],26:[function(_dereq_,module,exports){
// ViewDotPlanes.js

"use strict";

var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var ShaderLibs = _dereq_("./ShaderLibs");
var Mesh = _dereq_("./Mesh");

// var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
// var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewDotPlanes = function(color, fragShader) {
	var grey = 0.75;
	this.color = color === undefined ? [grey, grey, grey] : color;
	var fs = fragShader === undefined ? ShaderLibs.get("simpleColorFrag") : fragShader;
	View.call(this, null, fs);
};

var p = ViewDotPlanes.prototype = new View();

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;


	var numDots = 100;
	var size = 3000;
	var gap = size / numDots;
	var i, j;


	for(i=-size/2; i<size; i+=gap) {
		for(j=-size/2; j<size; j+=gap) {
			positions.push([i, j, 0]);
			coords.push([0, 0]);
			indices.push(index);
			index++;

			positions.push([i, 0, j]);
			coords.push([0, 0]);
			indices.push(index);
			index++;
		}
	}

	this.mesh = new Mesh(positions.length, indices.length, GL.gl.DOTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDotPlanes;

},{"./GLTools":13,"./Mesh":14,"./ShaderLibs":20,"./View":23}]},{},[1])(1)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
