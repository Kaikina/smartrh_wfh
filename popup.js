const radios = document.querySelectorAll('input[type=radio]');

function changeHandler(event) {
    const color = event.target.defaultValue;
    chrome.storage.local.set({'wfhColor': color});
}

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', changeHandler);
});

document.getElementsByClassName('title').item(0).textContent = chrome.i18n.getMessage("popupTitle");