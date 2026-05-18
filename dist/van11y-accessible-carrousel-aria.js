function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * ES2015 simple and accessible carrousel system, using ARIA
 * Website: https://van11y.net/accessible-carrousel/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-carrousel-aria/blob/master/LICENSE
 * TODO = LISTENERS, CONTROL TEXTS, STYLER PLUS PROPREMENT
 */
(function (doc) {
  'use strict';

  var CARROUSEL = 'js-carrousel';
  var CARROUSEL_CONTAINER = 'js-carrousel__container';
  var CARROUSEL_CONTENT = 'js-carrousel__content';
  var CARROUSEL_CONTROL_LIST = 'js-carrousel__control__list';
  var CARROUSEL_CONTROL_LIST_ITEM = 'js-carrousel__control__list__item';
  var CARROUSEL_CONTROL_LIST_LINK = 'js-carrousel__control__list__link';
  var CARROUSEL_CONTROL_LIST_CLASS_SUFFIX = 'carrousel__control__list';
  var CARROUSEL_CONTROL_LIST_ITEM_CLASS_SUFFIX = 'carrousel__control__list__item';
  var CARROUSEL_CONTROL_LIST_LINK_CLASS_SUFFIX = 'carrousel__control__list__link';
  var CARROUSEL_CLASS_SUFFIX = 'carrousel';
  var CARROUSEL_CONTAINER_CLASS_SUFFIX = 'carrousel__container';
  var CARROUSEL_CONTENT_CLASS_SUFFIX = 'carrousel__content';
  var CARROUSEL_CONTAINER_BUTTON = 'js-carrousel__button-container';
  var CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX = 'carrousel__button-container';
  var CARROUSEL_CONTAINER_BUTTON_PREVIOUS_CLASS_SUFFIX = 'carrousel__button__previous';
  var CARROUSEL_CONTAINER_BUTTON_NEXT_CLASS_SUFFIX = 'carrousel__button__next';
  var CARROUSEL_BUTTON_PREVIOUS = 'js-carrousel__button__previous';
  var CARROUSEL_BUTTON_NEXT = 'js-carrousel__button__next';
  var CARROUSEL_BUTTON_CLASS_SUFFIX = 'carrousel__button__button';
  var CARROUSEL_BUTTON_IMG_CLASS_SUFFIX = 'carrousel__button__img';
  var CARROUSEL_CONTENT_ID_PREFIX = 'id_carrousel_content_';
  var CARROUSEL_LINK_ID_PREFIX = 'label_';
  var CARROUSEL_DATA_PREFIX_CLASS = 'data-carrousel-prefix-class';
  var CARROUSEL_DATA_BTN_PREVIOUS_IMG = 'data-carrousel-btn-previous-img';
  var CARROUSEL_DATA_BTN_PREVIOUS_TEXT = 'data-carrousel-btn-previous-text';
  var CARROUSEL_DATA_BTN_NEXT_IMG = 'data-carrousel-btn-next-img';
  var CARROUSEL_DATA_BTN_NEXT_TEXT = 'data-carrousel-btn-next-text';
  var CARROUSEL_DATA_SPAN_TEXT_CLASS = 'data-carrousel-span-text-class';
  var CARROUSEL_DATA_TRANSITION = 'data-carrousel-transition';
  var CARROUSEL_DATA_ACTIVE_SLIDE = 'data-carrousel-active-slide';
  var CARROUSEL_DATA_ELEMENT_NUMBER = 'data-carrousel-control-element-number';
  var CARROUSEL_DATA_EXISTING_HX = 'data-carrousel-existing-hx';
  var CARROUSEL_DATA_HX = 'data-carrousel-hx';
  var CARROUSEL_DATA_SPAN_TEXT = 'data-carrousel-span-text';
  var CARROUSEL_DATA_HIDE_ARROWS_FOCUS = 'data-carousel-hide-arrows-focus';
  var VISUALLY_HIDDEN_CLASS = 'invisible';

  /*
   * recommended settings by a11y expert
   */
  var ATTR_ROLE = 'role';
  var ATTR_CONTROL = 'aria-controls';
  var ATTR_LABELLEDBY = 'aria-labelledby';
  var ATTR_HIDDEN = 'aria-hidden';
  var ATTR_SELECTED = 'aria-selected';
  var ATTR_TYPE = 'type';
  var ATTR_BUTTON = 'button';
  var ATTR_ALT = 'alt';
  var ATTR_SRC = 'src';
  var ATTR_CLASS = 'class';
  var ATTR_TABLIST = 'tablist';
  var ATTR_TABPANEL = 'tabpanel';
  var ATTR_TAB = 'tab';
  var ATTR_PRESENTATION = 'presentation';
  var findById = function findById(id) {
    return doc.getElementById(id);
  };
  var addClass = function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className); // IE 10+
    } else {
      el.className += ' ' + className; // IE 8+
    }
  };

  /*const removeClass = (el, className) => {
      if (el.classList) {
          el.classList.remove(className); // IE 10+
      } else {
          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
      }
  }*/

  var hasClass = function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className); // IE 10+
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
    }
  };
  var setAttributes = function setAttributes(node, attrs) {
    Object.keys(attrs).forEach(function (attribute) {
      node.setAttribute(attribute, attrs[attribute]);
    });
  };

  /*const triggerEvent = (el, event_type) => {
      if (el.fireEvent) {
          el.fireEvent('on' + event_type);
      } else {
          let evObj = document.createEvent('Events');
          evObj.initEvent(event_type, true, false);
          el.dispatchEvent(evObj);
      }
  }*/

  /* gets an element el, search if it is child of parent class, returns id of the parent */
  var searchParent = function searchParent(el, parentClass) {
    var found = false;
    var parentElement = el;
    while (parentElement && found === false) {
      if (hasClass(parentElement, parentClass) === true) {
        found = true;
      } else {
        parentElement = parentElement.parentNode;
      }
    }
    if (found === true) {
      return parentElement.getAttribute('id');
    } else {
      return '';
    }
  };

  /**
   * gets an element el, search if it is child of parent class, returns parent
   * @param  {Node} el
   * @param  {String} parentClass
   * @return {Node} parentElement
   */
  var searchClosestParent = function searchClosestParent(el, parentClass) {
    var found = false;
    var parentElement = el.parentNode;
    while (parentElement && found === false) {
      if (hasClass(parentElement, parentClass) === true) {
        found = true;
      } else {
        parentElement = parentElement.parentNode;
      }
    }
    if (found === true) {
      return parentElement;
    } else {
      return '';
    }
  };

  /**
   * Create the template for a control list item
   * @param  {Object} config
   * @return {String}
   */
  var createControlListItem = function createControlListItem(config) {
    var id = config.id;
    var itemText = config.text;
    var spanClass = config.spanClass;
    var itemClass = config.prefixClass + CARROUSEL_CONTROL_LIST_ITEM_CLASS_SUFFIX;
    var linkClass = config.prefixClass + CARROUSEL_CONTROL_LIST_LINK_CLASS_SUFFIX;
    var controlId = config.controlsId;
    var isSelected = config.selected;
    var tabindexValue = isSelected ? '0' : '-1';
    var numberElement = config.numberElement;
    return "<li class=\"".concat(CARROUSEL_CONTROL_LIST_ITEM, " ").concat(itemClass, "\" ").concat(ATTR_ROLE, "=\"").concat(ATTR_PRESENTATION, "\"><a class=\"").concat(CARROUSEL_CONTROL_LIST_LINK, " ").concat(linkClass, "\" id=\"").concat(id, "\" ").concat(ATTR_ROLE, "=\"").concat(ATTR_TAB, "\" ").concat(ATTR_CONTROL, "=\"").concat(controlId, "\" ").concat(ATTR_SELECTED, "=\"").concat(isSelected, "\" ").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(numberElement, "\" tabindex=\"").concat(tabindexValue, "\"><span class=\"").concat(spanClass, "\">").concat(itemText, "</span></a></li>");
  };
  var selectCarrouselElement = function selectCarrouselElement(config) {
    var controlListLinkToActivate = config.controlListLink;
    var panelControledToActivate = config.panelControled;
    var carrouselContainer = config.carrouselContainer;
    var carrousel = carrouselContainer.parentNode;
    var giveFocus = config.giveFocus ? true : false;

    // unselect current
    var current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));
    var controlListLinkToDisable = carrousel.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(current, "\"]"));
    var panelControledToDisable = findById(controlListLinkToDisable.getAttribute(ATTR_CONTROL));
    setAttributes(controlListLinkToDisable, _defineProperty(_defineProperty({}, ATTR_SELECTED, 'false'), 'tabindex', '-1'));
    setAttributes(panelControledToDisable, _defineProperty({}, ATTR_HIDDEN, 'true'));

    // select current
    setAttributes(controlListLinkToActivate, _defineProperty(_defineProperty({}, ATTR_SELECTED, 'true'), 'tabindex', '0'));
    setAttributes(panelControledToActivate, _defineProperty({}, ATTR_HIDDEN, 'false'));
    setAttributes(carrouselContainer, _defineProperty({}, CARROUSEL_DATA_ACTIVE_SLIDE, Number(controlListLinkToActivate.getAttribute(CARROUSEL_DATA_ELEMENT_NUMBER))));
    if (giveFocus) {
      // avoid bug on VoiceOver
      setTimeout(function () {
        return controlListLinkToActivate.focus();
      }, 0);
    }
  };

  /** Find all carrousels inside a container
   * @param  {Node} node Default document
   * @return {Array}
   */
  var $listCarrousels = function $listCarrousels() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : doc;
    return [].slice.call(node.querySelectorAll('.' + CARROUSEL));
  };

  /**
   * Build carrousels for a container
   * @param  {Node} node
   */
  var attach = function attach(node) {
    var addListeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    $listCarrousels(node).forEach(function (carrouselNode) {
      var iLisible = Math.random().toString(32).slice(2, 12);
      var carrouselContainer = carrouselNode.querySelector('.' + CARROUSEL_CONTAINER);
      var carrouselTransition = carrouselContainer.hasAttribute(CARROUSEL_DATA_TRANSITION) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_TRANSITION) : '';
      var prefixClassName = carrouselContainer.hasAttribute(CARROUSEL_DATA_PREFIX_CLASS) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_PREFIX_CLASS) + '-' : '';

      // hx
      var carrouselExistingHx = carrouselContainer.hasAttribute(CARROUSEL_DATA_EXISTING_HX) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_EXISTING_HX) : '';
      var carrouselHx = carrouselContainer.hasAttribute(CARROUSEL_DATA_HX) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_HX) : 'span';
      var carrouselSpanText = carrouselContainer.hasAttribute(CARROUSEL_DATA_SPAN_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_SPAN_TEXT) + ' ' : '';

      // Class for span in controllers
      var carrouselSpanTextClass = carrouselContainer.hasAttribute(CARROUSEL_DATA_SPAN_TEXT_CLASS) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_SPAN_TEXT_CLASS) : VISUALLY_HIDDEN_CLASS;

      // hide buttons from focus
      var carrouselHideArrowsFocus = carrouselContainer.hasAttribute(CARROUSEL_DATA_HIDE_ARROWS_FOCUS) === true;

      // Next/prev buttons
      var carrouselButtonPreviousText = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_PREVIOUS_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_PREVIOUS_TEXT) : '';
      var carrouselButtonPreviousTextFlat = doc.createElement("SPAN");
      carrouselButtonPreviousTextFlat.innerHTML = carrouselButtonPreviousText;
      carrouselButtonPreviousTextFlat = carrouselButtonPreviousTextFlat.textContent;
      var carrouselButtonPreviousImage = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_PREVIOUS_IMG) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_PREVIOUS_IMG) : '';
      var carrouselButtonNextText = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_NEXT_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_NEXT_TEXT) : '';
      var carrouselButtonNextTextFlat = doc.createElement("SPAN");
      carrouselButtonNextTextFlat.innerHTML = carrouselButtonNextText;
      carrouselButtonNextTextFlat = carrouselButtonNextTextFlat.textContent;
      var carrouselButtonNextImage = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_NEXT_IMG) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_NEXT_IMG) : '';

      // current active panel
      var carrouselActiveSlide = carrouselContainer.hasAttribute(CARROUSEL_DATA_ACTIVE_SLIDE) === true ? Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE)) : 1;

      // carrousel
      addClass(carrouselNode, prefixClassName + CARROUSEL_CLASS_SUFFIX);

      // container
      addClass(carrouselContainer, prefixClassName + CARROUSEL_CONTAINER_CLASS_SUFFIX);
      if (carrouselTransition !== '') {
        addClass(carrouselContainer, carrouselTransition);
      }

      // create control list
      var carrouselControlList = document.createElement("OL");
      addClass(carrouselControlList, CARROUSEL_CONTROL_LIST);
      addClass(carrouselControlList, prefixClassName + CARROUSEL_CONTROL_LIST_CLASS_SUFFIX);
      setAttributes(carrouselControlList, _defineProperty({}, ATTR_ROLE, ATTR_TABLIST));

      // contents
      var $listCarrouselContent = [].slice.call(carrouselContainer.querySelectorAll('.' + CARROUSEL_CONTENT));
      $listCarrouselContent.forEach(function (carrouselContent, indexCarrouselContent) {
        var contentId = "".concat(CARROUSEL_CONTENT_ID_PREFIX).concat(iLisible, "_").concat(indexCarrouselContent);
        var linkId = "".concat(CARROUSEL_LINK_ID_PREFIX).concat(contentId);
        var isSelected = carrouselActiveSlide === indexCarrouselContent + 1;
        var hx;
        var textHx;
        addClass(carrouselContent, prefixClassName + CARROUSEL_CONTENT_CLASS_SUFFIX);
        addClass(carrouselContent, CARROUSEL_CONTENT_CLASS_SUFFIX);
        setAttributes(carrouselContent, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, ATTR_ROLE, ATTR_TABPANEL), 'id', contentId), ATTR_HIDDEN, isSelected ? 'false' : 'true'), ATTR_LABELLEDBY, linkId));
        if (carrouselExistingHx !== '') {
          hx = carrouselContent.querySelector(carrouselExistingHx);
          if (hx) {
            setAttributes(hx, {
              'tabindex': '-1'
            });
            textHx = hx.textContent;
          }
        } else {
          // text
          textHx = carrouselSpanText + (indexCarrouselContent + 1);
          // insert hx
          var hxToInsert = document.createElement(carrouselHx);
          setAttributes(hxToInsert, {
            'tabindex': '-1'
          });
          hxToInsert.innerHTML = textHx;
          addClass(hxToInsert, VISUALLY_HIDDEN_CLASS);
          hxToInsert = carrouselContent.insertBefore(hxToInsert, carrouselContent.firstChild);
        }

        // add li
        carrouselControlList.innerHTML += createControlListItem({
          id: linkId,
          text: textHx,
          spanClass: carrouselSpanTextClass,
          prefixClass: prefixClassName,
          controlsId: contentId,
          selected: isSelected,
          numberElement: indexCarrouselContent + 1
        });
      });

      // place control list
      carrouselControlList = carrouselNode.insertBefore(carrouselControlList, carrouselContainer);

      // create a button with all attributes
      if (carrouselButtonPreviousText !== '') {
        var carrouselButtonContainerBefore = document.createElement("DIV");

        // container button before
        addClass(carrouselButtonContainerBefore, CARROUSEL_CONTAINER_BUTTON);
        addClass(carrouselButtonContainerBefore, prefixClassName + CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX);
        addClass(carrouselButtonContainerBefore, prefixClassName + CARROUSEL_CONTAINER_BUTTON_PREVIOUS_CLASS_SUFFIX);

        // button
        var carrouselButtonBefore = document.createElement("BUTTON");
        setAttributes(carrouselButtonBefore, _defineProperty(_defineProperty(_defineProperty({}, ATTR_TYPE, ATTR_BUTTON), 'id', CARROUSEL_BUTTON_PREVIOUS + '_' + iLisible), 'title', carrouselButtonPreviousText));
        if (carrouselHideArrowsFocus) {
          setAttributes(carrouselButtonBefore, _defineProperty(_defineProperty({}, ATTR_HIDDEN, true), 'tabindex', '-1'));
        }
        addClass(carrouselButtonBefore, CARROUSEL_BUTTON_PREVIOUS);
        addClass(carrouselButtonBefore, prefixClassName + CARROUSEL_BUTTON_CLASS_SUFFIX);
        carrouselButtonBefore = carrouselButtonContainerBefore.appendChild(carrouselButtonBefore);
        if (carrouselButtonPreviousImage !== '') {
          var carrouselButtonImageBefore = document.createElement("IMG");
          setAttributes(carrouselButtonImageBefore, _defineProperty(_defineProperty(_defineProperty({}, ATTR_SRC, carrouselButtonPreviousImage), ATTR_ALT, carrouselButtonPreviousTextFlat), ATTR_CLASS, prefixClassName + CARROUSEL_BUTTON_IMG_CLASS_SUFFIX));
          carrouselButtonImageBefore = carrouselButtonBefore.appendChild(carrouselButtonImageBefore);
        } else {
          carrouselButtonBefore.innerHTML = carrouselButtonPreviousText;
        }
        carrouselButtonContainerBefore = carrouselNode.insertBefore(carrouselButtonContainerBefore, carrouselContainer);
      }
      if (carrouselButtonNextText !== '') {
        var carrouselButtonContainerNext = document.createElement("DIV");

        // container button before
        addClass(carrouselButtonContainerNext, CARROUSEL_CONTAINER_BUTTON);
        addClass(carrouselButtonContainerNext, prefixClassName + CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX);
        addClass(carrouselButtonContainerNext, prefixClassName + CARROUSEL_CONTAINER_BUTTON_NEXT_CLASS_SUFFIX);

        // button
        var carrouselButtonNext = document.createElement("BUTTON");
        setAttributes(carrouselButtonNext, _defineProperty(_defineProperty(_defineProperty({}, ATTR_TYPE, ATTR_BUTTON), 'id', CARROUSEL_BUTTON_NEXT + '_' + iLisible), 'title', carrouselButtonNextText));
        if (carrouselHideArrowsFocus) {
          setAttributes(carrouselButtonNext, _defineProperty(_defineProperty({}, ATTR_HIDDEN, true), 'tabindex', '-1'));
        }
        addClass(carrouselButtonNext, CARROUSEL_BUTTON_NEXT);
        addClass(carrouselButtonNext, prefixClassName + CARROUSEL_BUTTON_CLASS_SUFFIX);
        carrouselButtonNext = carrouselButtonContainerNext.appendChild(carrouselButtonNext);
        if (carrouselButtonNextImage !== '') {
          var carrouselButtonImageNext = document.createElement("IMG");
          setAttributes(carrouselButtonImageNext, _defineProperty(_defineProperty(_defineProperty({}, ATTR_SRC, carrouselButtonNextImage), ATTR_ALT, carrouselButtonNextTextFlat), ATTR_CLASS, prefixClassName + CARROUSEL_BUTTON_IMG_CLASS_SUFFIX));
          carrouselButtonImageNext = carrouselButtonNext.appendChild(carrouselButtonImageNext);
        } else {
          carrouselButtonNext.innerHTML = carrouselButtonNextText;
        }
        carrouselNode.appendChild(carrouselButtonContainerNext);
      }

      // set up active
      setAttributes(carrouselContainer, _defineProperty({}, CARROUSEL_DATA_ACTIVE_SLIDE, carrouselActiveSlide));
    });

    /* listeners */
    if (addListeners) {
      ['click', 'keydown'].forEach(function (eventName) {
        doc.body.addEventListener(eventName, function (e) {
          // click on control list
          var idControlListLink = searchParent(e.target, CARROUSEL_CONTROL_LIST_LINK);
          var idPanel = searchParent(e.target, CARROUSEL_CONTENT);
          var idButtonPrevious = searchParent(e.target, CARROUSEL_BUTTON_PREVIOUS);
          var idButtonNext = searchParent(e.target, CARROUSEL_BUTTON_NEXT);

          // click on button control
          if (idControlListLink !== '' && eventName === 'click') {
            // select control item, panel and carrousel
            var controlListLink = findById(idControlListLink);
            var panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
            var carrouselContainer = panelControled.parentNode;
            selectCarrouselElement({
              controlListLink: controlListLink,
              panelControled: panelControled,
              carrouselContainer: carrouselContainer
            });
          }

          // click on prev
          if (idButtonPrevious !== '' && eventName === 'click') {
            var buttonPrevious = findById(idButtonPrevious);
            var carrousel = buttonPrevious.parentNode.parentNode;
            var _carrouselContainer = carrousel.querySelector('.' + CARROUSEL_CONTAINER);
            var _controlListLink;
            var _panelControled;

            // find current one
            var current = Number(_carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));
            if (current > 1) {
              _controlListLink = carrousel.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(current - 1, "\"]"));
              _panelControled = findById(_controlListLink.getAttribute(ATTR_CONTROL));
            } else {
              // take last one
              _controlListLink = carrousel.querySelector(".".concat(CARROUSEL_CONTROL_LIST_ITEM, ":last-child > .").concat(CARROUSEL_CONTROL_LIST_LINK));
              _panelControled = findById(_controlListLink.getAttribute(ATTR_CONTROL));
            }
            selectCarrouselElement({
              controlListLink: _controlListLink,
              panelControled: _panelControled,
              carrouselContainer: _carrouselContainer
            });
          }

          // click on next
          if (idButtonNext !== '' && eventName === 'click') {
            var buttonNext = findById(idButtonNext);
            var _carrousel = buttonNext.parentNode.parentNode;
            var _carrouselContainer2 = _carrousel.querySelector('.' + CARROUSEL_CONTAINER);
            var _current = Number(_carrouselContainer2.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

            // find next one to activate
            var _controlListLink2 = _carrousel.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(_current + 1, "\"]"));
            var _panelControled2;
            if (_controlListLink2) {
              _panelControled2 = findById(_controlListLink2.getAttribute(ATTR_CONTROL));
            } else {
              _controlListLink2 = _carrousel.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"1\"]"));
              _panelControled2 = findById(_controlListLink2.getAttribute(ATTR_CONTROL));
            }
            selectCarrouselElement({
              controlListLink: _controlListLink2,
              panelControled: _panelControled2,
              carrouselContainer: _carrouselContainer2
            });
          }

          // Keyboard events on control list
          if (idControlListLink !== '' && eventName === 'keydown') {
            var controlListLinkFocused = findById(idControlListLink);
            var _carrousel2 = searchClosestParent(controlListLinkFocused, CARROUSEL);
            var _carrouselContainer3 = _carrousel2.querySelector('.' + CARROUSEL_CONTAINER);
            var _controlListLink3;
            var _panelControled3;
            var _current2;

            // home = first tab
            if (e.keyCode === 36) {
              _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"1\"]"));
              _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
            }
            // strike end on the tab => last tab
            else if (e.keyCode === 35) {
              _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_ITEM, ":last-child > .").concat(CARROUSEL_CONTROL_LIST_LINK));
              _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
            }
            // strike up or left on the tab => previous tab
            else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {
              // find current one
              _current2 = Number(_carrouselContainer3.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));
              if (_current2 > 1) {
                _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(_current2 - 1, "\"]"));
                _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
              } else {
                // take last one
                _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_ITEM, ":last-child > .").concat(CARROUSEL_CONTROL_LIST_LINK));
                _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
              }
            }
            // strike down or right in the tab => next tab
            else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {
              // find current one
              _current2 = Number(_carrouselContainer3.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

              // find next one to activate
              _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"").concat(_current2 + 1, "\"]"));
              if (_controlListLink3) {
                _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
              } else {
                _controlListLink3 = _carrousel2.querySelector(".".concat(CARROUSEL_CONTROL_LIST_LINK, "[").concat(CARROUSEL_DATA_ELEMENT_NUMBER, "=\"1\"]"));
                _panelControled3 = findById(_controlListLink3.getAttribute(ATTR_CONTROL));
              }
            } else return;
            selectCarrouselElement({
              controlListLink: _controlListLink3,
              panelControled: _panelControled3,
              carrouselContainer: _carrouselContainer3,
              giveFocus: true
            });
          }

          // Keyboard events in panels
          if (idPanel !== '' && eventName === 'keydown') {
            var _panelControled4 = findById(idPanel);
            var controlListLinkFocus = findById(_panelControled4.getAttribute(ATTR_LABELLEDBY));
            if ((e.keyCode === 37 || e.keyCode === 38) && e.ctrlKey) {
              // avoid bug on VoiceOver
              setTimeout(function () {
                return controlListLinkFocus.focus();
              }, 0);
            }

            /*if (e.keyCode === 33 && e.ctrlKey) {
            }*/
          }
        }, true);
      });
    }
  };
  var _onLoad = function onLoad() {
    attach();
    document.removeEventListener('DOMContentLoaded', _onLoad);
  };
  document.addEventListener('DOMContentLoaded', _onLoad);
  window.van11yAccessibleCarrouselAria = attach;
})(document);