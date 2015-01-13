define([
    '../../../../element',
    'lodash-amd/modern/collections/contains'
  ], function (
    element,
    contains
  ) {

  /**
   * Chrome and Firefox: All elements need to contain either text or a `<br>` to
   * remain selectable. (Unless they have a width and height explicitly set with
   * CSS(?), as per: http://jsbin.com/gulob/2/edit?html,css,js,output)
   */

  'use strict';

  // http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
  var html5VoidElements = ['AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'];
  var html5InlineElements = ['B', 'BIG', 'I', 'SMALL', 'TT', 'ABBR', 'ACRONYM', 'CITE', 'CODE', 'DFN', 'EM', 'KBD', 'STRONG', 'SAMP', 'VAR', 'A', 'BDO', 'BR',
    'IMG', 'MAP', 'OBJECT', 'Q', 'SCRIPT', 'SPAN', 'SUB', 'SUP', 'BUTTON', 'INPUT', 'LABEL', 'SELECT', 'TEXTAREA'];

  function parentHasNoTextContent(element, node) {
    if (element.isCaretPositionNode(node)) {
      return true;
    } else {
      return node.parentNode.textContent.trim() === '';
    }
  }


  function traverse(element, parentNode) {
    // Instead of TreeWalker, which gets confused when the BR is added to the dom,
    // we recursively traverse the tree to look for an empty node that can have childNodes

    var node = parentNode.firstElementChild;

    function isEmpty(node) {

      if ((node.children.length === 0 && element.isBlockElement(node))
        || (node.children.length === 1 && element.isSelectionMarkerNode(node.children[0]))) {
         return true;
      }

      // Do not insert BR in empty non block elements with parent containing text
      if (!element.isBlockElement(node) && node.children.length === 0) {
        return parentHasNoTextContent(element, node);
      }

      return false;
    }

    while (node) {
      if (!element.isSelectionMarkerNode(node)) {
        // Find any node that contains no child *elements*, or just contains
        // whitespace, and is not self-closing
        if (isEmpty(node) &&
          node.textContent.trim() === '' &&
          !contains(html5VoidElements, node.nodeName)) {
            if (contains(html5InlineElements, node.nodeName)) {
              if (node.textContent.length > 0) {
                node.parentNode.replaceChild(document.createTextNode(' '), node);
              } else {
                node.parentNode.removeChild(node);
              }
            } else {
              selectableEnforcerTag = document.createElement('br');
              selectableEnforcerTag.classList.add('scribe-ensure-selectable');
              node.appendChild(selectableEnforcerTag);
            }
          } else if (node.children.length > 0) {
          traverse(element, node);
        }
      }
      node = node.nextElementSibling;
    }
  }

  return function () {
    return function (scribe) {

      scribe.registerHTMLFormatter('normalize', function (html) {
        var bin = document.createElement('div');
        bin.innerHTML = html;

        traverse(scribe.element, bin);

        return bin.innerHTML;
      });

    };
  };

});
