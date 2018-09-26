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

const facebookURL = 'https://www.facebook.com/search/people/?q=';
const googleURL = 'http://www.google.com/search?q=';
const linkedinURL = 'https://www.linkedin.com/search/results/all/?keywords=';
const linkedinGlobalFlag = '&origin=GLOBAL_SEARCH_HEADER';
const twitterURL = 'https://twitter.com/search?q=';
const twitterLang = '&src=typd&lang=en';
const instagramURL = 'https://web.stagram.com/search?query=';

chrome.runtime.onInstalled.addListener(function() {

    // Init the Extension to show
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: '.com'},
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
                            case 'facebook': searchFacebook(selectedText); break;
                            case 'google': searchGoogle(selectedText); break;
                            case 'instagram': searchInstagram(selectedText); break;
                            case 'linkedin': searchLinkedin(selectedText); break;
                            case 'twitter': searchTwitter(selectedText); break;
                            default: console.log("no default");  //TODO: Come back here.
                        }
                    }
                }
            }
        })
    }

    // https://www.facebook.com/search/people/?q=test
    function searchFacebook(name) {
        chrome.tabs.create({url: facebookURL + name});
    }

    function searchGoogle(name) {
        chrome.tabs.create({url: googleURL + name});
    }

    // https://web.stagram.com/search?query=daiokaio
    function searchInstagram(name) {
        chrome.tabs.create({url: instagramURL + name});
    }

    // Sample: https://www.linkedin.com/search/results/all/?keywords=phillip&origin=GLOBAL_SEARCH_HEADER
    function searchLinkedin(name) {
        chrome.tabs.create({url: linkedinURL + name + linkedinGlobalFlag});
    }

    // https://twitter.com/search?q=daiokaio&src=typd&lang=en
    function searchTwitter(name) {
        chrome.tabs.create({url: twitterURL + name + twitterLang});
    }

    chrome.contextMenus.create({
        id: "linkedin",
        title: "Search Social Media Sites",
        contexts: ["selection"]
    });

    // Add EventListener for the Right-Clicked contextMenu.
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        openSocialMediaSites(info.selectionText);
    });
});
