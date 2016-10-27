import jsonpath from 'jsonpath'

import {
  MESSAGE,
  SEND_JSON_STRING,
  PORTNAME,
  FORMATTED,
  NOT_JSON,
  FORMATTING,
  ERROR_JSONPATH
} from './constants'

import jsonObjToHTML, {
  removeComments,
  firstJSONCharIndex
} from './background/createHtml'

let validJsonText = null
let jsonpFunctionName = null


chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== PORTNAME) {
    console.error('JSON Formatter error - unknown port name '+port.name, port)
    return
  }
  console.log('json commander onconnect');

  port.onMessage.addListener(function(msg) {
    if (msg.type === SEND_JSON_STRING) {
      var obj,
      text = msg.text ;
      var parsedText;

      // Strip any leading garbage, such as a 'while(1);'
        var strippedText = text.substring( firstJSONCharIndex(text) ) ;

      try {
        parsedText = JSON.parse(strippedText)
        try {
          if (msg.inputJsonPath && msg.inputJsonPath.length > 0)
            obj = jsonpath.query(parsedText, msg.inputJsonPath);
          else
            obj = JSON.parse(strippedText)
        } catch (jsonpathError) {
          console.error(jsonpathError)
          port.postMessage({
            type: ERROR_JSONPATH,
            errorText: `"${msg.inputJsonPath}" isn't a valid jsonpath`
          })
          return
        }
        // console.log(obj)
        // obj = JSON.parse(strippedText);
        validJsonText = JSON.stringify(obj)
      }
      catch (e) {
        // Not JSON; could be JSONP though.
        // Try stripping 'padding' (if any), and try parsing it again
        console.error('error when parsing', e)
          text = text.trim() ;
          // Find where the first paren is (and exit if none)
            var indexOfParen ;
            if ( ! (indexOfParen = text.indexOf('(') ) ) {
              port.postMessage({
                type: NOT_JSON,
                msg: 'no opening parenthesis'
              })
              port.disconnect() ;
              return ;
            }

          // Get the substring up to the first "(", with any comments/whitespace stripped out
            var firstBit = removeComments( text.substring(0,indexOfParen) ).trim() ;
            if ( ! firstBit.match(/^[a-zA-Z_$][\.\[\]'"0-9a-zA-Z_$]*$/) ) {
              // The 'firstBit' is NOT a valid function identifier.
              port.postMessage({
                type: NOT_JSON,
                msg: 'first bit not a valid function name'
              })
              // port.disconnect() ;
              return ;
            }

          // Find last parenthesis (exit if none)
            var indexOfLastParen ;
            if ( ! (indexOfLastParen = text.lastIndexOf(')') ) ) {
              port.postMessage({
                type: NOT_JSON,
                msg: 'no closing paren'
              })
              port.disconnect() ;
              return ;
            }

          // Check that what's after the last parenthesis is just whitespace, comments, and possibly a semicolon (exit if anything else)
            var lastBit = removeComments(text.substring(indexOfLastParen+1)).trim() ;
            if ( lastBit !== "" && lastBit !== ';' ) {
              port.postMessage({
                type: NOT_JSON,
                msg: 'last closing paren followed by invalid characters'
              })
              port.disconnect() ;
              return ;
            }

          // So, it looks like a valid JS function call, but we don't know whether it's JSON inside the parentheses...
          // Check if the 'argument' is actually JSON (and record the parsed result)
            text = text.substring(indexOfParen+1, indexOfLastParen) ;
            try {
              obj = JSON.parse(text) ;
              validJsonText = text ;
              // validJsonText = jsonpath.query(obj, '$.aa.*') ;
            }
            catch (e2) {
              // Just some other text that happens to be in a function call.
              // Respond as not JSON, and exit
                port.postMessage({
                  type: NOT_JSON,
                  msg: 'looks like a function call, but the parameter is not valid JSON'
                })
                return ;
            }

        jsonpFunctionName = firstBit ;
      }

      // If still running, we now have obj, which is valid JSON.

      // Ensure it's not a number or string (technically valid JSON, but no point prettifying it)
        if (typeof obj !== 'object' && typeof obj !== 'array') {
          port.postMessage({
            type: NOT_JSON,
            msg: 'technically JSON but not an object or array'
          })
          port.disconnect() ;
          return ;
        }

      // And send it the message to confirm that we're now formatting (so it can show a spinner)
        // port.postMessage(['FORMATTING' /*, JSON.stringify(localStorage)*/]) ;
        port.postMessage({type: FORMATTING})

      // Do formatting
        var html = jsonObjToHTML(obj, jsonpFunctionName) ;

      // Post the HTML string to the content script
        // port.postMessage([FORMATTED, html, validJsonText]) ;
        port.postMessage({
          type: FORMATTED,
          html,
          validJsonText
        })

      // Disconnect
        // port.disconnect() ;
    }
  })
})
