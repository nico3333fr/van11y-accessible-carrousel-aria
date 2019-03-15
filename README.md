# Van11y Accessible Carrousel using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will transform a simple list of Hx/contents into shiny and accessible carrousel using ARIA.

The demo is here: https://van11y.net/downloads/carrousel/demo/index.html

Website is here: https://van11y.net/accessible-carrousel/

La page existe aussi en français : https://van11y.net/fr/carrousel-accessible/

## How it works

Here is the starting code needed. Add the script, needed CSS, style it as you want, and it is ok.

```html
<div class="js-carrousel relative">
  <div class="js-carrousel__container mod--hidden"
   data-carrousel-btn-previous-img="./left.svg"
   data-carrousel-btn-next-img="./right.svg"
   data-carrousel-btn-previous-text="Show previous content"
   data-carrousel-btn-next-text="Show next content"
   data-carrousel-prefix-class="news"
   data-carrousel-span-text-class="invisible"
   data-carrousel-transition="slide"
   data-carrousel-existing-hx="h3">

    <div class="js-carrousel__content">
      <h3>A first panel</h3>
      <p>Here the content.</p>
    </div><!--
 --><div class="js-carrousel__content">
      <h3>A second panel</h3>
      <p>Here the content.</p>
    </div><!--
 --><div class="js-carrousel__content">
      <h3>A third panel</h3>
      <p>Here the content.</p>
    </div>

  </div>
</div>
```

The plugin will do all the job on the fly:

- Generate all needed `id`s, ARIA attributes and link everything that needs to;
- Create `buttons` next and prev;
- Generate the control list;
- Add classes (namespaced if you have specified), in order to let you styling it as you want;
- Add all listeners, etc.

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on `<div id="newContent">your carrousel source</div>`:

```van11yAccessibleCarrouselAria(document.getElementById('newContent')[, addListeners]);```

<code>addListeners</code> is a facultative boolean (by default set to <code>true</code>) to add carrousel listeners (should be set up only the first time in most of the cases).

## How to use it

You may use npm command: `npm i van11y-accessible-carrousel-aria`.
You may also use bower: `bower install van11y-accessible-carrousel-aria`.

Then, follow the conventions given above. You may also copy/paste styles for carrousel design and styles for transitions.

__Important note__: for accessibility purposes (for VoiceOver), the plugin has to give focus to `hx` (`h2`, `h3`, `h4`, etc.) in tab contents. It is better having `hx` in each content tab.

- If you have some, it is great, you just have to tell the plugin. In the example above, you tell it via `data-carrousel-existing-hx`. And all these subtitles will be used in the `ol` list.
- If you don’t have, nevermind, please tell the plugin which level of `hx` to use with `data-carrousel-hx="hx"`, and it will insert an `hx class="invisible"` for you in each tab panel (you can “visually” hide them if needed with `invisible` class). To specify the titles, use the attribute `data-carrousel-span-text="Panel"` and the plugin will create titles for each tab content: “Panel 1”, “Panel 2”, etc. And all these subtitles will be used in the `ol` list.

__List of all data-attributes__

- `data-carrousel-btn-previous-img`: the address of the image used for “previous” button.
- `data-carrousel-btn-previous-text`: the text of the “previous” button, will be put in the `alt` attribute if there is an image, and in the `title` attribute for the button.
- `data-carrousel-btn-next-img`: the address of the image used for “next” button.
- `data-carrousel-btn-next-text`: the text of the “next” button, will be put in the `alt` attribute if there is an image, and in the `title` attribute for the button.
- `data-carrousel-prefix-class`: all the classes added for styling purpose will be prefixed, to simplify creating carrousel reusable styles.
- `data-carrousel-span-text-class`: in the `ol` list, the text will be wrapped into a `span` with this class. Example, `data-carrousel-span-text-class="yipikai"` will provide `<a … role="tab"><span class="yipikai">A robust base</span></a>`
- `data-carrousel-transition`: the value of this attribute will be added as a class on the carrousel container tag `div class="js-carrousel__container"`. And CSS will do the magic to animate it. See three examples of transitions in the demo (“slide”, “fade” and “none”).
- `data-carrousel-active-slide`: put here the number of the slide you want to display by default for your carrousel.
- `data-carousel-hide-arrows-focus`: will make next/prev buttons not focusable for keyboard users and not visible for speech synthesis.


## How to create different styles?

In this example page, I’ve used `data-carrousel-prefix-class="news"`, so all the generated classes will start with `.news-carrousel`.

```css
/* ------------------ example styles ------------------ */
.relative { position: relative; }
.mod--hidden { overflow: hidden; }

.invisible {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.news-carrousel__container {
  white-space: nowrap;
}
.news-carrousel__control__list {
  position: absolute;
  list-style-type: none;
  top: 100%;
  right: 0;
  left: 0;
  margin-top: -0.5em;
  padding-left: 0;
  text-align: center;
}
.news-carrousel__control__list__item {
  display: inline-block;
  margin: 0 .5em;
}
.news-carrousel__control__list__link {
  display: inline-block;
  width: 1em;
  height: 1em;
  background: #fff;
  border: 1px solid #148297;
  border-radius: 1em;
  cursor: pointer;
}

.news-carrousel__button-container {
  position: absolute;
}
.news-carrousel__button__previous {
  top: 50%;
  margin-top: -18px;
  left: 0;
  margin-left: -35px;
}
.news-carrousel__button__next {
  top: 50%;
  margin-top: -18px;
  right: 0;
  margin-right: -35px;
}
.news-carrousel__button__button {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

/* only for minimalist example */
.carrousel__content[aria-hidden=true] {
  display: none;
}
/* ------------------ State rules ------------------ */
.news-carrousel__control__list__link:focus,
.news-carrousel__control__list__link:hover,
.news-carrousel__control__list__link:active,
.news-carrousel__control__list__link[aria-selected=true] {
  background: #148297;
}
.news-carrousel__control__list__link:focus,
.news-carrousel__control__list__link:hover,
.news-carrousel__control__list__link:active {
  outline: 2px dotted #4d287f;
}
```

## How to style transitions (nicely)

Here are 3 examples of transitions:

```css
/* ------------------ transition slide ------------------ */
.slide .carrousel__content {
  display: inline-block;
  vertical-align: top;
  visibility: visible;
  width: 100%;
  position: relative;
  transition: visibility 0s ease, transform .5s ease-in;
  transition-delay: 0;
  white-space: normal;
}

[data-carrousel-active-slide="1"].slide > .carrousel__content {
  transform: translateX(0);
}
[data-carrousel-active-slide="2"].slide > .carrousel__content {
  transform: translateX(-100%);
}
[data-carrousel-active-slide="3"].slide > .carrousel__content {
  transform: translateX(-200%);
}
[data-carrousel-active-slide="4"].slide > .carrousel__content {
  transform: translateX(-300%);
}
[data-carrousel-active-slide="5"].slide > .carrousel__content {
  transform: translateX(-400%);
}
[data-carrousel-active-slide="6"].slide > .carrousel__content {
  transform: translateX(-500%);
}
[data-carrousel-active-slide="7"].slide > .carrousel__content {
  transform: translateX(-600%);
}
[data-carrousel-active-slide="8"].slide > .carrousel__content {
  transform: translateX(-700%);
}
[data-carrousel-active-slide="9"].slide > .carrousel__content {
  transform: translateX(-800%);
}

[data-carrousel-active-slide].slide > [aria-hidden="true"].carrousel__content {
  visibility: hidden;
  transition-delay: .5s, 0s;
}


/* ------------------ transition fade ------------------ */
.fade .carrousel__content {
  -webkit-animation: fadein 1s;
  animation:         fadein 1s;
  white-space: normal;
}
.fade .carrousel__content[aria-hidden=true] {
  -webkit-animation: fadeout 1s;
  animation:         fadeout 1s;
}
.fade .carrousel__content[aria-hidden=true] {
  display: none;
}

@keyframes fadeout {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}



/* ------------------ transition none ------------------ */
.none .carrousel__content {
  white-space: normal;
}
.none .carrousel__content[aria-hidden=true] {
  display: none;
}
```

## Keyboard shortcuts

Keyboard navigation is supported too, here are the shortcuts:

__If you focus on the carrousel “buttons”__ (not next and previous buttons, the control list):

- use <kbd>Up</kbd>/<kbd>Left</kbd> to see previous carrousel tab
- use <kbd>Down</kbd>/<kbd>Right</kbd> to see next carrousel tab
- use <kbd>Home</kbd> to see first carrousel tab (wherever you are in carrousel tab buttons)
- use <kbd>End</kbd> to see last carrousel tab (wherever you are in carrousel tab buttons)

__If you focus in a carrousel content__:

- use <kbd>Ctrl</kbd> <kbd>Up</kbd> to set focus on the carrousel button for the currently displayed carrousel content.


## Bonuses

__Panel opened by default__

You may specify on `js-carrousel__container` the attribute `data-carrousel-active-slide="The number of the panel"`. Example: `data-carrousel-active-slide="2"` will display the second panel by default. In the carrousel demo, the third example shows it.

