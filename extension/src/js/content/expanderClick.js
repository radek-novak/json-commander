var lastKvovIdGiven = 0 ;


function collapse(elements) {
  // console.log('elements', elements) ;

  var el, i, blockInner, count ;

  for (i = elements.length - 1; i >= 0; i--) {
    el = elements[i] ;
    el.classList.add('collapsed') ;

    // (CSS hides the contents and shows an ellipsis.)

    // Add a count of the number of child properties/items (if not already done for this item)
      if (!el.id) {
        el.id = 'kvov' + (++lastKvovIdGiven) ;

        // Find the blockInner
          blockInner = el.firstElementChild ;
          while ( blockInner && !blockInner.classList.contains('blockInner') ) {
            blockInner = blockInner.nextElementSibling ;
          }
          if (!blockInner)
            continue ;

        // See how many children in the blockInner
          count = blockInner.children.length ;

        // Generate comment text eg "4 items"
          var comment = count + (count===1 ? ' item' : ' items') ;
        // Add CSS that targets it
          // jfStyleEl.insertAdjacentHTML(
          //   'beforeend',
          //   '\n#kvov'+lastKvovIdGiven+'.collapsed:after{color: #aaa; content:" // '+comment+'"}'
          // ) ;
      }
  }
}
function expand(elements) {
  for (var i = elements.length - 1; i >= 0; i--)
    elements[i].classList.remove('collapsed') ;
}

function expanderClick(ev) {
  // console.log('click', ev) ;

  if (ev.which === 1) {
    var elem = ev.target ;

    if (elem.className === 'e') {
      // It's a click on an expander.

      ev.preventDefault() ;

      var parent = elem.parentNode,
          div = document.getElementById('orig'),
          prevBodyHeight = document.body.offsetHeight,
          scrollTop = document.body.scrollTop,
          parentSiblings
      ;

      // Expand or collapse
        if (parent.classList.contains('collapsed')) {
          // EXPAND
            // if (modKey(ev))
            //   expand(parent.parentNode.children) ;
            // else
              expand([parent]) ;
        }
        else {
          // COLLAPSE
            // if (modKey(ev))
            //   collapse(parent.parentNode.children) ;
            // else
              collapse([parent]) ;
        }

      // Restore scrollTop somehow
        // Clear current extra margin, if any
          div.style.marginBottom = 0 ;

        // No need to worry if all content fits in viewport
          if (document.body.offsetHeight < window.innerHeight) {
            // console.log('document.body.offsetHeight < window.innerHeight; no need to adjust height') ;
            return ;
          }

        // And no need to worry if scrollTop still the same
          if (document.body.scrollTop === scrollTop) {
            // console.log('document.body.scrollTop === scrollTop; no need to adjust height') ;
            return ;
          }

        // console.log('Scrolltop HAS changed. document.body.scrollTop is now '+document.body.scrollTop+'; was '+scrollTop) ;

        // The body has got a bit shorter.
        // We need to increase the body height by a bit (by increasing the bottom margin on the jfContent div). The amount to increase it is whatever is the difference between our previous scrollTop and our new one.

        // Work out how much more our target scrollTop is than this.
          var difference = scrollTop - document.body.scrollTop  + 8 ; // it always loses 8px; don't know why

        // Add this difference to the bottom margin
          //var currentMarginBottom = parseInt(div.style.marginBottom) || 0 ;
          div.style.marginBottom = difference + 'px' ;

        // Now change the scrollTop back to what it was
          document.body.scrollTop = scrollTop ;

      return ;
    }
  }
}

export default expanderClick
