/*
 * ES2015 simple and accessible carrousel system, using ARIA
 * Website: https://van11y.net/accessible-carrousel/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-carrousel-aria/blob/master/LICENSE
 * TODO = LISTENERS, CONTROL TEXTS, STYLER PLUS PROPREMENT
 */
(doc => {

    'use strict';

    const CARROUSEL = 'js-carrousel';
    const CARROUSEL_CONTAINER = 'js-carrousel__container';
    const CARROUSEL_CONTENT = 'js-carrousel__content'

    const CARROUSEL_CONTROL_LIST = 'js-carrousel__control__list';
    const CARROUSEL_CONTROL_LIST_ITEM = 'js-carrousel__control__list__item';
    const CARROUSEL_CONTROL_LIST_LINK = 'js-carrousel__control__list__link';
    const CARROUSEL_CONTROL_LIST_CLASS_SUFFIX = 'carrousel__control__list';
    const CARROUSEL_CONTROL_LIST_ITEM_CLASS_SUFFIX = 'carrousel__control__list__item';
    const CARROUSEL_CONTROL_LIST_LINK_CLASS_SUFFIX = 'carrousel__control__list__link';

    const CARROUSEL_CLASS_SUFFIX = 'carrousel';
    const CARROUSEL_CONTAINER_CLASS_SUFFIX = 'carrousel__container';
    const CARROUSEL_CONTENT_CLASS_SUFFIX = 'carrousel__content';

    const CARROUSEL_CONTAINER_BUTTON = 'js-carrousel__button-container';
    const CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX = 'carrousel__button-container';
    const CARROUSEL_CONTAINER_BUTTON_PREVIOUS_CLASS_SUFFIX = 'carrousel__button__previous';
    const CARROUSEL_CONTAINER_BUTTON_NEXT_CLASS_SUFFIX = 'carrousel__button__next';

    const CARROUSEL_BUTTON_PREVIOUS = 'js-carrousel__button__previous';
    const CARROUSEL_BUTTON_NEXT = 'js-carrousel__button__next';
    const CARROUSEL_BUTTON_CLASS_SUFFIX = 'carrousel__button__button';

    const CARROUSEL_BUTTON_IMG_CLASS_SUFFIX = 'carrousel__button__img';

    const CARROUSEL_CONTENT_ID_PREFIX = 'id_carrousel_content_';

    const CARROUSEL_LINK_ID_PREFIX = 'label_';

    const CARROUSEL_DATA_PREFIX_CLASS = 'data-carrousel-prefix-class';
    const CARROUSEL_DATA_BTN_PREVIOUS_IMG = 'data-carrousel-btn-previous-img';
    const CARROUSEL_DATA_BTN_PREVIOUS_TEXT = 'data-carrousel-btn-previous-text';
    const CARROUSEL_DATA_BTN_NEXT_IMG = 'data-carrousel-btn-next-img';
    const CARROUSEL_DATA_BTN_NEXT_TEXT = 'data-carrousel-btn-next-text';
    const CARROUSEL_DATA_SPAN_TEXT_CLASS = 'data-carrousel-span-text-class';
    const CARROUSEL_DATA_TRANSITION = 'data-carrousel-transition';
    const CARROUSEL_DATA_ACTIVE_SLIDE = 'data-carrousel-active-slide';
    const CARROUSEL_DATA_ELEMENT_NUMBER = 'data-carrousel-control-element-number';
    const CARROUSEL_DATA_EXISTING_HX = 'data-carrousel-existing-hx';
    const CARROUSEL_DATA_HX = 'data-carrousel-hx';
    const CARROUSEL_DATA_SPAN_TEXT = 'data-carrousel-span-text';

    const VISUALLY_HIDDEN_CLASS = 'invisible';

    /*
     * recommended settings by a11y expert
     */
    const ATTR_ROLE = 'role';
    const ATTR_CONTROL = 'aria-controls';
    const ATTR_LABELLEDBY = 'aria-labelledby';
    const ATTR_HIDDEN = 'aria-hidden';
    const ATTR_SELECTED = 'aria-selected';

    const ATTR_TYPE = 'type';
    const ATTR_BUTTON = 'button';
    const ATTR_ALT = 'alt';
    const ATTR_SRC = 'src';
    const ATTR_CLASS = 'class';

    const ATTR_TABLIST = 'tablist';
    const ATTR_TABPANEL = 'tabpanel';
    const ATTR_TAB = 'tab';
    const ATTR_PRESENTATION = 'presentation';

    const findById = id => doc.getElementById(id);

    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
            el.className += ' ' + className; // IE 8+
        }
    }

    /*const removeClass = (el, className) => {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
        }
    }*/

    const hasClass = (el, className) => {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
        }
    }

    const setAttributes = (node, attrs) => {
        Object
            .keys(attrs)
            .forEach((attribute) => {
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
    let searchParent = (el, parentClass) => {
        let found = false;
        let parentElement = el;
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
    }

    /**
     * gets an element el, search if it is child of parent class, returns parent
     * @param  {Node} el
     * @param  {String} parentClass
     * @return {Node} parentElement
     */
    let searchClosestParent = (el, parentClass) => {
        let found = false;
        let parentElement = el.parentNode;
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
    }

    /**
     * Create the template for a control list item
     * @param  {Object} config
     * @return {String}
     */
    const createControlListItem = config => {

        let id = config.id;
        let itemText = config.text;
        let spanClass = config.spanClass;
        let itemClass = config.prefixClass + CARROUSEL_CONTROL_LIST_ITEM_CLASS_SUFFIX;
        let linkClass = config.prefixClass + CARROUSEL_CONTROL_LIST_LINK_CLASS_SUFFIX;
        let controlId = config.controlsId;
        let isSelected = config.selected;
        let tabindexValue = (isSelected ? '0' : '-1');
        let numberElement = config.numberElement;

        return `<li class="${CARROUSEL_CONTROL_LIST_ITEM} ${itemClass}" ${ATTR_ROLE}="${ATTR_PRESENTATION}">
                  <a class="${CARROUSEL_CONTROL_LIST_LINK} ${linkClass}" id="${id}" ${ATTR_ROLE}="${ATTR_TAB}" ${ATTR_CONTROL}="${controlId}" ${ATTR_SELECTED}="${isSelected}" ${CARROUSEL_DATA_ELEMENT_NUMBER}="${numberElement}" tabindex="${tabindexValue}">
                  <span class="${spanClass}">${itemText}</span>
                  </a>
                </li>`;
    };

    const selectCarrouselElement = config => {
        let controlListLinkToActivate = config.controlListLink;
        let panelControledToActivate = config.panelControled;
        let carrouselContainer = config.carrouselContainer;
        let carrousel = carrouselContainer.parentNode;
        let giveFocus = (config.giveFocus ? true : false);

        // unselect current
        let current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));
        let controlListLinkToDisable = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="${current}"]`);
        let panelControledToDisable = findById(controlListLinkToDisable.getAttribute(ATTR_CONTROL));
        setAttributes(controlListLinkToDisable, {
            [ATTR_SELECTED]: 'false',
            'tabindex': '-1'
        });
        setAttributes(panelControledToDisable, {
            [ATTR_HIDDEN]: 'true'
        });

        // select current
        setAttributes(controlListLinkToActivate, {
            [ATTR_SELECTED]: 'true',
            'tabindex': '0'
        });
        setAttributes(panelControledToActivate, {
            [ATTR_HIDDEN]: 'false'
        });
        setAttributes(carrouselContainer, {
            [CARROUSEL_DATA_ACTIVE_SLIDE]: Number(controlListLinkToActivate.getAttribute(CARROUSEL_DATA_ELEMENT_NUMBER))
        });
        if (giveFocus) {
            // avoid bug on VoiceOver
            setTimeout(() => controlListLinkToActivate.focus(), 0);
        }


    }

    /** Find all carrousels inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    const $listCarrousels = (node = doc) => [].slice.call(node.querySelectorAll('.' + CARROUSEL));

    /**
     * Build carrousels for a container
     * @param  {Node} node
     */
    const attach = (node, addListeners = true) => {

        $listCarrousels(node)
            .forEach((carrouselNode) => {

                let iLisible = Math.random().toString(32).slice(2, 12);
                let carrouselContainer = carrouselNode.querySelector('.' + CARROUSEL_CONTAINER);
                let carrouselTransition = carrouselContainer.hasAttribute(CARROUSEL_DATA_TRANSITION) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_TRANSITION) : '';
                let prefixClassName = carrouselContainer.hasAttribute(CARROUSEL_DATA_PREFIX_CLASS) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_PREFIX_CLASS) + '-' : '';

                // hx
                let carrouselExistingHx = carrouselContainer.hasAttribute(CARROUSEL_DATA_EXISTING_HX) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_EXISTING_HX) : '';
                let carrouselHx = carrouselContainer.hasAttribute(CARROUSEL_DATA_HX) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_HX) : 'span';
                let carrouselSpanText = carrouselContainer.hasAttribute(CARROUSEL_DATA_SPAN_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_SPAN_TEXT) + ' ' : '';

                // Class for span in controllers
                let carrouselSpanTextClass = carrouselContainer.hasAttribute(CARROUSEL_DATA_SPAN_TEXT_CLASS) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_SPAN_TEXT_CLASS) : VISUALLY_HIDDEN_CLASS;

                // Next/prev buttons
                let carrouselButtonPreviousText = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_PREVIOUS_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_PREVIOUS_TEXT) : '';
                let carrouselButtonPreviousTextFlat = doc.createElement("SPAN");
                carrouselButtonPreviousTextFlat.innerHTML = carrouselButtonPreviousText;
                carrouselButtonPreviousTextFlat = carrouselButtonPreviousTextFlat.textContent;
                let carrouselButtonPreviousImage = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_PREVIOUS_IMG) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_PREVIOUS_IMG) : '';

                let carrouselButtonNextText = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_NEXT_TEXT) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_NEXT_TEXT) : '';
                let carrouselButtonNextTextFlat = doc.createElement("SPAN");
                carrouselButtonNextTextFlat.innerHTML = carrouselButtonNextText;
                carrouselButtonNextTextFlat = carrouselButtonNextTextFlat.textContent;
                let carrouselButtonNextImage = carrouselContainer.hasAttribute(CARROUSEL_DATA_BTN_NEXT_IMG) === true ? carrouselContainer.getAttribute(CARROUSEL_DATA_BTN_NEXT_IMG) : '';

                // current active panel
                let carrouselActiveSlide = carrouselContainer.hasAttribute(CARROUSEL_DATA_ACTIVE_SLIDE) === true ? Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE)) : 1;

                // carrousel
                addClass(carrouselNode, prefixClassName + CARROUSEL_CLASS_SUFFIX);

                // container
                addClass(carrouselContainer, prefixClassName + CARROUSEL_CONTAINER_CLASS_SUFFIX);
                if (carrouselTransition !== '') {
                    addClass(carrouselContainer, carrouselTransition);
                }

                // create control list
                let carrouselControlList = document.createElement("OL");
                addClass(carrouselControlList, CARROUSEL_CONTROL_LIST);
                addClass(carrouselControlList, prefixClassName + CARROUSEL_CONTROL_LIST_CLASS_SUFFIX);
                setAttributes(carrouselControlList, {
                    [ATTR_ROLE]: ATTR_TABLIST
                });

                // contents
                let $listCarrouselContent = [].slice.call(carrouselContainer.querySelectorAll('.' + CARROUSEL_CONTENT));
                $listCarrouselContent
                    .forEach((carrouselContent, indexCarrouselContent) => {
                        let contentId = `${CARROUSEL_CONTENT_ID_PREFIX}${iLisible}_${indexCarrouselContent}`;
                        let linkId = `${CARROUSEL_LINK_ID_PREFIX}${contentId}`;
                        let isSelected = (carrouselActiveSlide === indexCarrouselContent + 1);
                        let hx;
                        let textHx;

                        addClass(carrouselContent, prefixClassName + CARROUSEL_CONTENT_CLASS_SUFFIX);
                        addClass(carrouselContent, CARROUSEL_CONTENT_CLASS_SUFFIX);

                        setAttributes(carrouselContent, {
                            [ATTR_ROLE]: ATTR_TABPANEL,
                            'id': contentId,
                            [ATTR_HIDDEN]: (isSelected ? 'false' : 'true'),
                            [ATTR_LABELLEDBY]: linkId
                        });

                        if (carrouselExistingHx !== '') {
                            hx = carrouselContent.querySelector(carrouselExistingHx);
                            if (hx) {
                                setAttributes(hx, {
                                    'tabindex': '0'
                                });
                                textHx = hx.textContent;
                            }

                        } else {
                            // text
                            textHx = carrouselSpanText + (indexCarrouselContent + 1);
                            // insert hx
                            let hxToInsert = document.createElement(carrouselHx);
                            setAttributes(hxToInsert, {
                                'tabindex': '0'
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
                    let carrouselButtonContainerBefore = document.createElement("DIV");

                    // container button before
                    addClass(carrouselButtonContainerBefore, CARROUSEL_CONTAINER_BUTTON);
                    addClass(carrouselButtonContainerBefore, prefixClassName + CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX);
                    addClass(carrouselButtonContainerBefore, prefixClassName + CARROUSEL_CONTAINER_BUTTON_PREVIOUS_CLASS_SUFFIX);

                    // button
                    let carrouselButtonBefore = document.createElement("BUTTON");
                    setAttributes(carrouselButtonBefore, {
                        [ATTR_TYPE]: ATTR_BUTTON,
                        'id': CARROUSEL_BUTTON_PREVIOUS + '_' + iLisible,
                        'title': carrouselButtonPreviousText
                    });
                    addClass(carrouselButtonBefore, CARROUSEL_BUTTON_PREVIOUS);
                    addClass(carrouselButtonBefore, prefixClassName + CARROUSEL_BUTTON_CLASS_SUFFIX);

                    carrouselButtonBefore = carrouselButtonContainerBefore.appendChild(carrouselButtonBefore);

                    if (carrouselButtonPreviousImage !== '') {
                        let carrouselButtonImageBefore = document.createElement("IMG");
                        setAttributes(carrouselButtonImageBefore, {
                            [ATTR_SRC]: carrouselButtonPreviousImage,
                            [ATTR_ALT]: carrouselButtonPreviousTextFlat,
                            [ATTR_CLASS]: prefixClassName + CARROUSEL_BUTTON_IMG_CLASS_SUFFIX
                        });
                        carrouselButtonImageBefore = carrouselButtonBefore.appendChild(carrouselButtonImageBefore);
                    } else {
                        carrouselButtonBefore.innerHTML = carrouselButtonPreviousText;
                    }

                    carrouselButtonContainerBefore = carrouselNode.insertBefore(carrouselButtonContainerBefore, carrouselContainer);
                }

                if (carrouselButtonNextText !== '') {
                    let carrouselButtonContainerNext = document.createElement("DIV");

                    // container button before
                    addClass(carrouselButtonContainerNext, CARROUSEL_CONTAINER_BUTTON);
                    addClass(carrouselButtonContainerNext, prefixClassName + CARROUSEL_CONTAINER_BUTTON_CLASS_SUFFIX);
                    addClass(carrouselButtonContainerNext, prefixClassName + CARROUSEL_CONTAINER_BUTTON_NEXT_CLASS_SUFFIX);

                    // button
                    let carrouselButtonNext = document.createElement("BUTTON");
                    setAttributes(carrouselButtonNext, {
                        [ATTR_TYPE]: ATTR_BUTTON,
                        'id': CARROUSEL_BUTTON_NEXT + '_' + iLisible,
                        'title': carrouselButtonNextText
                    });
                    addClass(carrouselButtonNext, CARROUSEL_BUTTON_NEXT);
                    addClass(carrouselButtonNext, prefixClassName + CARROUSEL_BUTTON_CLASS_SUFFIX);

                    carrouselButtonNext = carrouselButtonContainerNext.appendChild(carrouselButtonNext);

                    if (carrouselButtonNextImage !== '') {
                        let carrouselButtonImageNext = document.createElement("IMG");
                        setAttributes(carrouselButtonImageNext, {
                            [ATTR_SRC]: carrouselButtonNextImage,
                            [ATTR_ALT]: carrouselButtonNextTextFlat,
                            [ATTR_CLASS]: prefixClassName + CARROUSEL_BUTTON_IMG_CLASS_SUFFIX
                        });
                        carrouselButtonImageNext = carrouselButtonNext.appendChild(carrouselButtonImageNext);
                    } else {
                        carrouselButtonNext.innerHTML = carrouselButtonNextText;
                    }

                    carrouselNode.appendChild(carrouselButtonContainerNext);
                }

                // set up active
                setAttributes(carrouselContainer, {
                    [CARROUSEL_DATA_ACTIVE_SLIDE]: carrouselActiveSlide
                });

            });


        /* listeners */
        if (addListeners) {
            ['click', 'keydown']
            .forEach(eventName => {

                doc.body
                    .addEventListener(eventName, e => {
                        // click on control list
                        let idControlListLink = searchParent(e.target, CARROUSEL_CONTROL_LIST_LINK);
                        let idPanel = searchParent(e.target, CARROUSEL_CONTENT);
                        let idButtonPrevious = searchParent(e.target, CARROUSEL_BUTTON_PREVIOUS);
                        let idButtonNext = searchParent(e.target, CARROUSEL_BUTTON_NEXT);

                        // click on button control
                        if (idControlListLink !== '' && eventName === 'click') {
                            // select control item, panel and carrousel
                            let controlListLink = findById(idControlListLink);
                            let panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            let carrouselContainer = panelControled.parentNode;

                            selectCarrouselElement({
                                controlListLink: controlListLink,
                                panelControled: panelControled,
                                carrouselContainer: carrouselContainer
                            });

                        }

                        // click on prev
                        if (idButtonPrevious !== '' && eventName === 'click') {
                            let buttonPrevious = findById(idButtonPrevious);
                            let carrousel = buttonPrevious.parentNode.parentNode;
                            let carrouselContainer = carrousel.querySelector('.' + CARROUSEL_CONTAINER);
                            let controlListLink;
                            let panelControled;

                            // find current one
                            let current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

                            if (current > 1) {
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="${current-1}"]`);
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            } else {
                                // take last one
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_ITEM}:last-child > .${CARROUSEL_CONTROL_LIST_LINK}`);
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            }

                            selectCarrouselElement({
                                controlListLink: controlListLink,
                                panelControled: panelControled,
                                carrouselContainer: carrouselContainer
                            });

                        }

                        // click on next
                        if (idButtonNext !== '' && eventName === 'click') {
                            let buttonNext = findById(idButtonNext);
                            let carrousel = buttonNext.parentNode.parentNode;
                            let carrouselContainer = carrousel.querySelector('.' + CARROUSEL_CONTAINER);

                            let current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

                            // find next one to activate
                            let controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="${current+1}"]`);
                            let panelControled;

                            if (controlListLink) {
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            } else {
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="1"]`);
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            }

                            selectCarrouselElement({
                                controlListLink: controlListLink,
                                panelControled: panelControled,
                                carrouselContainer: carrouselContainer
                            });

                        }

                        // Keyboard events on control list
                        if (idControlListLink !== '' && eventName === 'keydown') {
                            let controlListLinkFocused = findById(idControlListLink);
                            let carrousel = searchClosestParent(controlListLinkFocused, CARROUSEL);
                            let carrouselContainer = carrousel.querySelector('.' + CARROUSEL_CONTAINER);
                            let controlListLink;
                            let panelControled;
                            let current;

                            // home = first tab
                            if (e.keyCode === 36) {
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="1"]`);
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            }
                            // strike end on the tab => last tab
                            else if (e.keyCode === 35) {
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_ITEM}:last-child > .${CARROUSEL_CONTROL_LIST_LINK}`);
                                panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                            }
                            // strike up or left on the tab => previous tab
                            else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {
                                // find current one
                                current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

                                if (current > 1) {
                                    controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="${current-1}"]`);
                                    panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                                } else {
                                    // take last one
                                    controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_ITEM}:last-child > .${CARROUSEL_CONTROL_LIST_LINK}`);
                                    panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                                }

                            }
                            // strike down or right in the tab => next tab
                            else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {
                                // find current one
                                current = Number(carrouselContainer.getAttribute(CARROUSEL_DATA_ACTIVE_SLIDE));

                                // find next one to activate
                                controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="${current+1}"]`);

                                if (controlListLink) {
                                    panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                                } else {
                                    controlListLink = carrousel.querySelector(`.${CARROUSEL_CONTROL_LIST_LINK}[${CARROUSEL_DATA_ELEMENT_NUMBER}="1"]`);
                                    panelControled = findById(controlListLink.getAttribute(ATTR_CONTROL));
                                }
                            } else return;

                            selectCarrouselElement({
                                controlListLink: controlListLink,
                                panelControled: panelControled,
                                carrouselContainer: carrouselContainer,
                                giveFocus: true
                            });

                        }

                        // Keyboard events in panels
                        if (idPanel !== '' && eventName === 'keydown') {
                            let panelControled = findById(idPanel);
                            let controlListLinkFocus = findById(panelControled.getAttribute(ATTR_LABELLEDBY));

                            if ((e.keyCode === 37 || e.keyCode === 38) && e.ctrlKey) {
                                // avoid bug on VoiceOver
                                setTimeout(() => controlListLinkFocus.focus(), 0);
                            }

                            /*if (e.keyCode === 33 && e.ctrlKey) {
                            }*/

                        }



                    }, true);


            });

        }

    };




    const onLoad = () => {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    }

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleCarrouselAria = attach;



})(document);
