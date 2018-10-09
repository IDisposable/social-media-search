// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let socialMediaKeys = {
    "facebook": true,
    "github": true,
    "google": true,
    "instagram": true,
    "keybase": true,
    "linkedin": true,
    "stackoverflow": true,
    "twitter": true
};

// Media Site URLs and their Suffixes
const facebookURL = 'https://www.facebook.com/search/people/?q=';
const googleURL = 'http://www.google.com/search?q=';

const linkedinURL = 'https://www.linkedin.com/search/results/all/?keywords=';
const linkedinGlobalFlag = '&origin=GLOBAL_SEARCH_HEADER';

const twitterURL = 'https://twitter.com/search?q=';
const twitterLang = '&src=typd&lang=en';

const instagramURL = 'https://web.stagram.com/search?query=';

const stackoverflow = 'https://stackoverflow.com/users';
const keybase = 'https://keybase.io/';

const github = 'https://github.com/search?q=';
const githubSuffix = '&type=Users';

chrome.runtime.onInstalled.addListener(function() {
    // Init the Extension to show
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: '.com'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);

        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: '.net'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);

        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: '.io'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);

        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: '.org'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

    // Initialize chrome.storage.
    chrome.storage.sync.get(['mediaKeys'], function(data){
        if(Object.keys(data).length === 0) {
            //Then we need to put the keys in
            chrome.storage.sync.set({['mediaKeys']: socialMediaKeys}, function(){
                console.log('The keys were successfully inserted.');

                // Check to see if the keys are inside:
                chrome.storage.sync.get(['mediaKeys'], function(data){
                    console.log('Keys were retrieved: ', data);
                });
            })
        }
    });
});

// Open Tab logic for each social media site.
function openSocialMediaSites(selectedText) {
    //Get the stored values:
    chrome.storage.sync.get(['mediaKeys'], function(data){
        let mediaKeys = data.mediaKeys;

        for(let key in mediaKeys) {
            if (mediaKeys.hasOwnProperty(key)) {
                if(mediaKeys[key] === true) {
                    // Open URL tab for that key.
                    switch(key){
                        case 'facebook': searchURL(selectedText, facebookURL, ''); break;
                        case 'github': searchURL(selectedText, github, githubSuffix); break;
                        case 'google': searchURL(selectedText, googleURL, ''); break;
                        case 'instagram': searchURL(selectedText, instagramURL, ''); break;
                        case 'keybase': searchURL(selectedText, keybase, ''); break;
                        case 'linkedin': searchURL(selectedText, linkedinURL, linkedinGlobalFlag); break;
                        case 'stackoverflow': searchStackOverflow(selectedText, stackoverflow, ''); break;
                        case 'twitter': searchURL(selectedText, twitterURL, twitterLang); break;
                        default: console.log("Safe Space");
                    }
                }
            }
        }
    })
}

function searchURL(name, address, suffix) {
    chrome.tabs.create({url: address + name + suffix})
}

function searchStackOverflow(name, address) {
    chrome.storage.sync.set({['selectionValue']: name}, function(){
        // Now Create the Tab, and insert the script.
        chrome.tabs.create({url: address}, (tab) => {
            //Logic in here to insert script.
            //stackoverflow input field id: userfilter  && f-input s-filter-input
            chrome.tabs.executeScript(tab.id, {code: `(function(){
                // Since we can't pass in values into here, then we need to retrieve the highlighted text value From Local storage. =)
                chrome.storage.sync.get(['selectionValue'], function(data){
                    var count = 20; 
                    
                    function addTextToUserField(){
                        var inputField = document.getElementsByClassName('f-input s-filter-input')[0];
                        
                        if( inputField ){
                            // Focus on the inputField and set its value. 
                            inputField.focus();
                            inputField.value = data.selectionValue;
                            
                            // Invoke a tab press so it can start searching. 
                            var e = new KeyboardEvent('keydown',{'keyCode':32,'which':32});
                            inputField.dispatchEvent(e);
                        } else {
                            if(count-- > 0 ){
                                //The elements we need don't exist yet, wait a bit to try again.
                                setTimeout(addTextToUserField,250);
                            }
                        }
                    }
                    addTextToUserField();
                });
            })();`});
        })
    });
}

// Create the right-click Menu
chrome.contextMenus.create({
    id: "mediaContextMenu",
    title: "Search Social Media Sites",
    contexts: ["selection"]
});

// Add EventListener for the Right-Clicked contextMenu.
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    openSocialMediaSites(info.selectionText);
});