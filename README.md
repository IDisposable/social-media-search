# Social Media Searches

## Introduction
This is a small Chrome Extension that allows users to search Social Media sites from a single action. It is **not** a screen 
scraper. No data is collected, and only extension level preferences are saved. It is meant to save people time when searching by
a person's online _handle_ or email address. However, the extension makes to distinction on the text it searches on. 

### Installation & Building a Pack
- Clone this repo to your favorite folder.
- Go to your Chrome Browser and type: `chrome://extensions`. 
- On the top right corner toggle `Developer Mode` to `on`. 
- For development purposes, you can simply `Load Unpacked`.
- Click `Pack Extension` to build. 
- Browse folder where your build exist
- Chrome will create 2 files:
    - A `.crx` file, which is the packed extension
    - A `.pem` file, which is Signed Certificate

### Adding Packed Extension
This is the easy-peasy part. Simply go back to `chrome://extensions` page:

    - Drag and Drop the `.crx` file. 
    - Confirm extension installation.  
    - Confirm.
    - ???
    - Profit. 


### How to use:
Once installed as an extension you will see a new `icon` on your extensions row on the top right corner of your browser. 
Click on the new icon that appears and you will see a simple list of options that you can toggle. Toggle which social media sites
you want to do a search on, then click `Apply`. 

Your preferences will be saved. If you want all of them, then simply click `Reset`. All of them will be turned back `on` again (which is the default). 

**Note: It uses `Chrome.storage.sync` to save preferences**

Finally, on whatever Website you are viewing, simply `highlight` a word (or words) and `right-click`. 
 - You will see a `Context Menu` that says: `Search Social Media Sites`. 
 
 And by magic, you will immediately see a new tab for each social media site you choose. 
 
 ### Sites
 Currently, only these sites are built into the extension:
 1. Facebook
 2. Google
 3. Instagram
 4. Linkedin
 5. Twitter
 
 ### Special Note:
 For Social Media sites like `Facebook` and `Linkedin`, you MUST be logged-in. Otherwise you will be automatically 
 re-directed to their login page. 
 
 ### Adding more sites:
 Users cannot add more sites through the Options page, or the Popup. 
 
 For Developers: Go to `background.js` and add another social media site at line `7`. 
 ```
 // Here
let socialMediaKeys = {
    "google": true,
    "linkedin": true,
    "facebook": true,
    "instagram": true,
    "twitter": true
};
```

You will also need to add `const` for the site's `URL`. Line `16-22`, like so:
```
const facebookURL = 'https://www.facebook.com/search/people/?q=';
const googleURL = 'http://www.google.com/search?q=';
const linkedinURL = 'https://www.linkedin.com/search/results/all/?keywords=';
const linkedinGlobalFlag = '&origin=GLOBAL_SEARCH_HEADER';
const twitterURL = 'https://twitter.com/search?q=';
const twitterLang = '&src=typd&lang=en';
const instagramURL = 'https://web.stagram.com/search?query=';
```

Also update the `switch` statement on line: `82-88`. 

**Note how some sites require a suffix, make sure you have a the correct path!**

Finally, go to `popup.js` and add the same thing you did on `background.js`. (I know, I know... Bad coding)
Line `7`:
```
let socialMediaKeys = {
    "google": true,
    "linkedin": true,
    "facebook": true,
    "instagram": true,
    "twitter": true
};
```
**MAKE SURE THEY MATCH UP!**