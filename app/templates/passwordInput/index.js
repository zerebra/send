const html = require('choo/html');
const MAX_LENGTH = 32;

module.exports = function(file, state, emit) {
  const loading = state.settingPassword;
  const pwd = file.hasPassword;
  const formClass = pwd
    ? 'passwordInput'
    : 'passwordInput passwordInput--hidden';
  const inputClass = loading || pwd ? 'input' : 'input input--noBtn';
  let btnClass = 'inputBtn inputBtn--hidden';
  if (loading) {
    btnClass = 'inputBtn inputBtn--loading';
  } else if (pwd) {
    btnClass = 'inputBtn';
  }

  const action = pwd
    ? state.translate('changePasswordButton')
    : state.translate('addPasswordButton');
  return html`
  <div>
    <form
      class="${formClass}"
      onsubmit=${setPassword}
      data-no-csrf>
      <input id="password-input"
        ${loading ? 'disabled' : ''}
        class="${inputClass}"
        maxlength="${MAX_LENGTH}"
        autocomplete="off"
        type="password"
        oninput=${inputChanged}
        placeholder="${
          pwd
            ? passwordPlaceholder(file.password)
            : state.translate('unlockInputPlaceholder')
        }">
      <input type="submit"
        id="password-btn"
        ${loading ? 'disabled' : ''}
        class="${btnClass}"
        value="${loading ? '' : action}">
    </form>
    <label
      class="passwordInput__msg"
      for="password-input">${message(
        loading,
        pwd,
        state.translate('passwordIsSet')
      )}</label>
  </div>`;

  function inputChanged() {
    const resetInput = document.getElementById('password-input');
    const resetBtn = document.getElementById('password-btn');
    const pwdmsg = document.querySelector('.passwordInput__msg');
    const length = resetInput.value.length;

    if (length === MAX_LENGTH) {
      pwdmsg.textContent = state.translate('maxPasswordLength', {
        length: MAX_LENGTH
      });
    } else {
      pwdmsg.textContent = '';
    }
    if (length > 0) {
      resetBtn.classList.remove('inputBtn--hidden');
      resetInput.classList.remove('input--noBtn');
    } else {
      resetBtn.classList.add('inputBtn--hidden');
      resetInput.classList.add('input--noBtn');
    }
  }

  function setPassword(event) {
    event.preventDefault();
    const password = document.getElementById('password-input').value;
    if (password.length > 0) {
      emit('password', { password, file });
    }
    return false;
  }
};

function passwordPlaceholder(password) {
  return password ? password.replace(/./g, '●') : '●●●●●●●●●●●●';
}

function message(loading, pwd, deflt) {
  if (loading || !pwd) {
    return '';
  }
  return deflt;
}
