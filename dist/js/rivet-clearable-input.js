/*!
 * rivet-clearable-input - @version 0.1.0-alpha
 * (c) 2019, The Trustees of Indiana University | Apache-2.0 License
 * https://github.com/maurercw/rivet-clearable-input
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], function () {
        return factory(root);
      });
    } else if (typeof exports === 'object') {
      module.exports = factory(root);
    } else {
      root.ClearableInput = factory(root);
    }
  })(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined, function (window) {

    /**
       * Creates a new custom event and stores a reference
       * to the element's ID in the custom
       * event's options "detail" property.
       *
       * More here:
       * https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
       *
       */

    var _fireCustomEvent = function (element, eventName) {
      var event = new CustomEvent(eventName, { bubbles: true,
        detail: { name: function () {
            return element.id;
          } } });

      // Dispatch the event
      element.dispatchEvent(event);
    };

    /**
      * Check the provided element for the presence of the provided css class name
      */
    var _hasClass = function (element, classNameToFind) {
      var classes = element.className.split(" ");
      var i = classes.indexOf(classNameToFind);
      return i >= 0;
    };

    /**
      * Adds the classToToggle if not already present on the element if dataToCheck evaluates to true.
      * Removes the classToToggle if present on the element if dataToCheck evaluates to false.
      */
    var _toggleClass = function (dataToCheck, element, classToToggle) {
      var classes = element.className.split(" ");
      var i = classes.indexOf(classToToggle);
      if (dataToCheck) {
        //Add
        if (i == -1) {
          element.className += " " + classToToggle;
        }
      } else {
        //Remove
        if (i >= 0) {
          classes.splice(i, 1);
          element.className = classes.join(" ");
        }
      }
    };

    /**
      * Remove css classes from the element, clear the text, fire the event
      */
    var clearInput = function (element) {
      _toggleClass(false, element, 'x');
      _toggleClass(false, element, 'onX');
      element.value = '';
      _fireCustomEvent(element, 'inputCleared');
    };

    /**
      * Adds all the event listeners to the input element(s)
      */
    var init = function () {
      var objArray = document.querySelectorAll("input.rvt-clearable-input");
      for (var i = 0; i < objArray.length; i++) {
        var obj = objArray[i];
        //Create handler event for when text is added to the input
        obj.addEventListener('input', function (e) {
          _toggleClass(e.target.value, e.target, 'x');
        });

        //Create handler event for when ESC key is pressed to clear the field
        obj.addEventListener('keyup', function (e) {
          if (e.keyCode == 27) {
            clearInput(e.target);
          }
        });

        //Create handler event for moving the mouse over the X so that it can be clicked
        obj.addEventListener('mousemove', function (e) {
          if (_hasClass(e.target, 'x')) {
            var data = e.target.offsetWidth - 28 < e.clientX - e.target.getBoundingClientRect().left;
            _toggleClass(data, e.target, 'onX');
          }
        });

        //Create handler event for when the X is clicked to clear the field
        obj.addEventListener('click', function (ev) {
          if (_hasClass(ev.target, 'onX')) {
            ev.preventDefault();
            clearInput(ev.target);
          }
        });
      }
    };

    /**
     * Return public APIs
     */
    return {
      init: init,
      clearInput: clearInput
    };
  });

})));
//# sourceMappingURL=rivet-clearable-input.js.map
