// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let facebookChecked = false;
let googleChecked = false;
let instagramChecked= true;
let linkedinChecked = false;
let twitterChecked = false;

window.addEventListener('load', initializeStoredValues);

// Get stored values.
function initializeStoredValues() {
    let x = $('#facebook-checkbox');
    console.log(x.uncheck());

    x.removeAttr('checked');
    console.log(x.attr('checked'));
}

function checkChange() {
    alert("We have a change");
    console.log('We have a change');
}
