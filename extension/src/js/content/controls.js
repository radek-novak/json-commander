const css = require('../../styles')

const template = `
  <aside class="controls">
    <div class="controls__raw-switch">
      <div class="col-50">
        <input type="radio" name="switcher" value="raw" id="controls__raw" />
        <label for="controls__raw">raw</label>
      </div class="col-50">
      <div class="col-50">
        <input type="radio" name="switcher" value="formatted" id="controls__formatted" checked />
        <label for="controls__formatted">formatted</label>
      </div class="col-50">
    </div>
    <form id="controls__form">
      <input
        id="controls__input"
        class="controls__input"
        name="jsonpath"
        value=""
        placeholder="jsonpath"
        autofocus
      />
      <i class="controls__error"></i>
      <button class="controls__submit">submit</button>
    </form>

  </aside>
  <div id="orig"></div>
  <style>
  ${css}
  </style>
`

const controls = () => {
  document.body.insertAdjacentHTML( 'afterbegin', template)


  return {
    form: document.getElementById('controls__form'),
    input: document.getElementById('controls__input'),
    inside: document.getElementById('orig'),
    switcherRaw: document.getElementById('controls__raw'),
    switcherFormatted: document.getElementById('controls__formatted'),
    errorMsg: document.querySelector('.controls__error')
  }
}

export default controls
