function savePreferences(pref) {
    browser.storage.local.set({handler: pref});
}

function loadPreferences() {
    pref = browser.storage.local.get('handler');
    pref.then((result) => {updateUi(result);}, (error) => {displayError();});
}

function updateUi(result) {
    pref = result.handler;
    if(pref == 1) {
        document.getElementById('status').innerHTML = 'Status: Using dumpor.com';
    } else if(pref == 2) {
        document.getElementById('status').innerHTML = 'Status: Using picuki.com';
    } else {
        document.getElementById('status').innerHTML = 'Status: Disabled';
    }
}

function displayError() {
    document.getElementById('status').innerHTML = 'Status: Error resolving handler';
}

function setDumpor() {
    savePreferences(1);
    loadPreferences();
}

function setPicuki() {
    savePreferences(2);
    loadPreferences();
}

function setDisabled() {
    savePreferences(3);
    loadPreferences();
}

document.addEventListener('DOMContentLoaded', loadPreferences);
document.getElementById('dumpor').addEventListener('click', setDumpor);
document.getElementById('picuki').addEventListener('click', setPicuki);
document.getElementById('disabled').addEventListener('click', setDisabled);
