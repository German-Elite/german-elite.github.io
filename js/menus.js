/* eslint no-unused-vars:0 no-prototype-builtins:0 */
(function (window, document) {
  'use strict'

  // Enable drop-down menus in Pure
  // Inspired by YUI3 gallery-simple-menu by Julien LeComte
  // [https://github.com/yui/yui3-gallery/blob/master/src/gallery-simple-menujs/simple-menu.js]

  function PureDropdown (dropdownParent) {
    var PREFIX = 'pure-'
    var ACTIVE_CLASS_NAME = PREFIX + 'menu-active'
    var ARIA_ROLE = 'role'
    var ARIA_HIDDEN = 'aria-hidden'
    var MENU_OPEN = 0
    var MENU_CLOSED = 1
    var MENU_ACTIVE_SELECTOR = '.pure-menu-active'
    var MENU_LINK_SELECTOR = '.pure-menu-link'
    var MENU_SELECTOR = '.pure-menu-children'
    var DISMISS_EVENT = (window.hasOwnProperty &&
                window.hasOwnProperty('ontouchstart'))
      ? 'touchstart' : 'mousedown'

    var ARROW_KEYS_ENABLED = true

    var ddm = this // drop down menu

    this._state = MENU_CLOSED

    this.show = function () {
      if (this._state !== MENU_OPEN) {
        this._dropdownParent.classList.add(ACTIVE_CLASS_NAME)
        this._menu.setAttribute(ARIA_HIDDEN, false)
        this._state = MENU_OPEN
      }
    }

    this.hide = function () {
      if (this._state !== MENU_CLOSED) {
        this._dropdownParent.classList.remove(ACTIVE_CLASS_NAME)
        this._menu.setAttribute(ARIA_HIDDEN, true)
        this._link.focus()
        this._state = MENU_CLOSED
      }
    }

    this.toggle = function () {
      this[this._state === MENU_CLOSED ? 'show' : 'hide']()
    }

    this.halt = function (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    this._dropdownParent = dropdownParent
    this._link = this._dropdownParent.querySelector(MENU_LINK_SELECTOR)
    this._menu = this._dropdownParent.querySelector(MENU_SELECTOR)
    this._firstMenuLink = this._menu.querySelector(MENU_LINK_SELECTOR)

    // Set ARIA attributes
    this._link.setAttribute('aria-haspopup', 'true')
    this._menu.setAttribute(ARIA_ROLE, 'menu')
    this._menu.setAttribute('aria-labelledby', this._link.getAttribute('id'))
    this._menu.setAttribute('aria-hidden', 'true');
    [].forEach.call(
      this._menu.querySelectorAll('li'),
      function (el) {
        el.setAttribute(ARIA_ROLE, 'presentation')
      }
    );
    [].forEach.call(
      this._menu.querySelectorAll('a'),
      function (el) {
        el.setAttribute(ARIA_ROLE, 'menuitem')
      }
    )

    // Toggle on click
    this._link.addEventListener('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      ddm.toggle()
    })

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      var currentLink,
        previousSibling,
        nextSibling,
        previousLink,
        nextLink

      // if the menu isn't active, ignore
      if (ddm._state !== MENU_OPEN) {
        return
      }

      // if the menu is the parent of an open, active submenu, ignore
      if (ddm._menu.querySelector(MENU_ACTIVE_SELECTOR)) {
        return
      }

      currentLink = ddm._menu.querySelector(':focus')

      // Dismiss an open menu on ESC
      if (e.keyCode === 27) {
        /* Esc */
        ddm.halt(e)
        ddm.hide()
      } else if (ARROW_KEYS_ENABLED && e.keyCode === 40) { // Go to the next link on down arrow
        /* Down arrow */
        ddm.halt(e)
        // get the nextSibling (an LI) of the current link's LI
        nextSibling = (currentLink) ? currentLink.parentNode.nextSibling : null
        // if the nextSibling is a text node (not an element), go to the next one
        while (nextSibling && nextSibling.nodeType !== 1) {
          nextSibling = nextSibling.nextSibling
        }
        nextLink = (nextSibling) ? nextSibling.querySelector('.pure-menu-link') : null
        // if there is no currently focused link, focus the first one
        if (!currentLink) {
          ddm._menu.querySelector('.pure-menu-link').focus()
        } else if (nextLink) {
          nextLink.focus()
        }
      } else if (ARROW_KEYS_ENABLED && e.keyCode === 38) { // Go to the previous link on up arrow
        /* Up arrow */
        ddm.halt(e)
        // get the currently focused link
        previousSibling = (currentLink) ? currentLink.parentNode.previousSibling : null
        while (previousSibling && previousSibling.nodeType !== 1) {
          previousSibling = previousSibling.previousSibling
        }
        previousLink = (previousSibling) ? previousSibling.querySelector('.pure-menu-link') : null
        // if there is no currently focused link, focus the last link
        if (!currentLink) {
          ddm._menu.querySelector('.pure-menu-item:last-child .pure-menu-link').focus()
        } else if (previousLink) { // else if there is a previous item, go to the previous item
          previousLink.focus()
        }
      }
    })

    // Dismiss an open menu on outside event
    document.addEventListener(DISMISS_EVENT, function (e) {
      var target = e.target
      if (target !== ddm._link && !ddm._menu.contains(target)) {
        ddm.hide()
        ddm._link.blur()
      }
    })
  }

  function initDropdowns () {
    var dropdownParents = document.querySelectorAll('.pure-menu-has-children')
    for (var i = 0; i < dropdownParents.length; i++) {
      var ddm = new PureDropdown(dropdownParents[i])
    }
  }

  initDropdowns()
}(this, this.document))
