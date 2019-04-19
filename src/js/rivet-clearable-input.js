var CLEARABLE_ATTR = 'data-clearable';

var CLOSE_ICON = '<span class="rvt-sr-only">Clear input</span>' +
  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">' +
  '<g fill="currentColor">' +
  '<path d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM8,14a6,6,0,1,1,6-6A6,6,0,0,1,8,14Z"/>' +
  '<path d="M10.83,5.17a1,1,0,0,0-1.41,0L8,6.59,6.59,5.17A1,1,0,0,0,5.17,6.59L6.59,8,5.17,9.41a1,1,0,1,0,1.41,1.41L8,9.41l1.41,1.41a1,1,0,0,0,1.41-1.41L9.41,8l1.41-1.41A1,1,0,0,0,10.83,5.17Z"/>' +
  '</g>' +
  '</svg>';

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
  var event = new CustomEvent(eventName, {
    bubbles: true,
    detail: {
      name: function () {
        return element.id;
      }
    }
  });

  // Dispatch the event
  element.dispatchEvent(event);
}

/**
 * Remove css classes from the element, clear the text, hide the button, fire the event
 */
var clearInput = function (element) {
  element.classList.remove("hasData");
  element.value = '';
  element.focus();

  //Hide the button
  var clearButton = createOrFindButton(element);
  clearButton.setAttribute('hidden', '');

  _fireCustomEvent(element, 'inputCleared');
}

/**
 * Event handler for the "close" button
 */
var _handleClick = function (event) {
  var clearButton = event.target;

  if (clearButton.classList.contains("buttonX")) {
    var inputId = clearButton.getAttribute(CLEARABLE_ATTR);
    clearInput(document.getElementById(inputId));
  }
}

/**
 * Event handler for input being entered into the text box
 */
var _handleInput = function (event) {
  var clearableInput = event.target;
  if (clearableInput.classList.contains("rvt-clearable-input")) {
    var clearButton = createOrFindButton(clearableInput);
    //If we have content, show the button, otherwise, hide it
    if (clearableInput.value.length > 0) {
      clearableInput.classList.add("hasData");
      clearButton.removeAttribute('hidden');
    } else {
      clearableInput.classList.remove("hasData");
      clearButton.setAttribute('hidden', '');
    }
  }
}

/**
 * Create a new button, or return the element if it already exists
 */
var createOrFindButton = function (inputElement) {
  var newButtonId = "button_" + inputElement.id;

  //Make sure it doesn't exist already
  var button = document.getElementById(newButtonId);

  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.setAttribute(CLEARABLE_ATTR, inputElement.id);
    button.classList.add("buttonX");
    button.innerHTML = CLOSE_ICON;
    button.id = newButtonId;
    inputElement.parentNode.insertBefore(button, inputElement.nextSibling);
  }

  return button;
}

var destroy = function (context) {
  if (context === undefined) {
    context = document;
  }

  context.removeEventListener('click', _handleClick, false);
  context.removeEventListener('input', _handleInput, false);
}

/**
 * Adds all the event listeners to the input element(s)
 */
var init = function (context) {
  // Optional element to bind the event listeners to
  if (context === undefined) {
    context = document;
  }

  context.addEventListener('click', _handleClick, false);
  context.addEventListener('input', _handleInput, false);
}

/**
 * Export public APIs
 */

export { init, destroy, clearInput };