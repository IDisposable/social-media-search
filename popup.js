// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let socialMediaKeys = {
    "google": true,
    "linkedin": true,
    "facebook": true,
    "instagram": true,
    "twitter": true
};

// Wait until the DOM is fully loaded, then we can init everything.
window.addEventListener('DOMContentLoaded', initializeStoredValues);

// Get stored values.
function initializeStoredValues() {
    // Get the stored information
    chrome.storage.sync.get(['mediaKeys'], function(data) {
        if(Object.keys(data).length !== 0) {
            let mediaKeys = data.mediaKeys;
            for(let key in mediaKeys) {
                if(mediaKeys.hasOwnProperty(key)) {
                    setKey(key, mediaKeys[key]);
                }
            }
        }
    });

    // Strange Extension bug. Needs it.
    setTimeout(() => {
        document.querySelector('#reset-button').addEventListener('click', resetMediaValues);
        document.querySelector('#apply-button').addEventListener('click', applyMediaValues);
    }, 500);
}

function setKey(mediaKey, value) {
    let labelID = mediaKey + "-label";
    if(!value) {
        document.querySelector('#' + labelID).MaterialSwitch.off();
    } else {
        document.querySelector('#' + labelID).MaterialSwitch.on();
    }
}

// The user has pressed the apply button, let's save the values of the
// The switches to storage.
function applyMediaValues() {
    // Set the values
    for(let key in socialMediaKeys) {
        if(socialMediaKeys.hasOwnProperty(key)) {
            let labelID = key + "-label";
            socialMediaKeys[key] = document.querySelector('#' + labelID).MaterialSwitch.inputElement_.checked;
        }
    }
    chrome.storage.sync.set({['mediaKeys']: socialMediaKeys}, function() {
        console.log('Successfully saved media key values.');
    });
}

function resetMediaValues() {
    for(let key in socialMediaKeys) {
        if(socialMediaKeys.hasOwnProperty(key)) {
            socialMediaKeys[key] = true;
            setKey(key, true);
        }
    }
    chrome.storage.sync.set({['mediaKeys']: socialMediaKeys}, function() {
        console.log('Successfully saved media key values.');
    });
}