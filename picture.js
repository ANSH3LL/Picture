//smihub
const smihub = 'https://smihub.com/';
const postPrefixS = 'https://smihub.com/c/';
const profilePrefixS = 'https://smihub.com/v/';
//picuki
const picuki = 'https://www.picuki.com/';
const postPrefixP = 'https://www.picuki.com/media/';
const profilePrefixP = 'https://www.picuki.com/profile/';
//regex
const postRegex = /(?<!^https\:\/\/www\.google\.com\/imgres\?imgurl.*)(?:https?\:\/\/)?(?:www\.)?(instagram\.com|instagr\.am|next\=)(?:\/p|\/reel)\/([a-zA-Z._0-9-]+)/i;
const profileRegex = /(?<!^https\:\/\/www\.google\.com\/imgres\?imgurl.*)(?:https?\:\/\/)?(?:www\.)?(?<!help\.|api\.|business\.|about\.|lookaside\.)(instagram\.com|instagr\.am|next\=)\/(?!accounts|explore|developer|reel)([a-zA-Z._0-9]{3,})/i;

var filter = {urls: ["*://*.instagram.com/*"]};

function getUsername(igurl) {
    url = decodeURIComponent(igurl);
    return url.match(profileRegex)[2];
}

function getMediaId(igurl) {
    mediaId = BigInt(0);
    url = decodeURIComponent(igurl);
    shortcode = url.match(postRegex)[2].split('');
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    shortcode.forEach((letter) => {
        mediaId = BigInt((mediaId * 64n)) + BigInt(alphabet.indexOf(letter));
    });
    if(document.igRequestHandler == 1) {
        return mediaId.toString().split('').reverse().join('');
    } else if(document.igRequestHandler == 2) {
        return mediaId.toString().split('').join('');
    } else {
        return '';
    }
}

function setPrefix(result) {
    prefix = result.handler;
    if(prefix == 1 || prefix == 2) {
        document.igRequestHandler = prefix;
        if(!browser.webRequest.onBeforeRequest.hasListener(igRedirect)) {
            browser.webRequest.onBeforeRequest.addListener(igRedirect, filter, ['blocking']);
        }
    } else if(browser.webRequest.onBeforeRequest.hasListener(igRedirect)) {
        browser.webRequest.onBeforeRequest.removeListener(igRedirect);
    }
}

function loadPreferences(changes, areaName) {
    pref = browser.storage.local.get('handler');
    pref.then((result) => {setPrefix(result);}, (error) => {});
}

function igRedirect(details) {
    if(document.igRequestHandler == 1) {
        redirectTo = smihub;
        postPrefix = postPrefixS;
        profilePrefix = profilePrefixS;
    } else if(document.igRequestHandler == 2) {
        redirectTo = picuki;
        postPrefix = postPrefixP;
        profilePrefix = profilePrefixP;
    }
    //
    if(postRegex.test(decodeURIComponent(details.url))) {
        url = postPrefix + getMediaId(details.url);
    } else if(profileRegex.test(decodeURIComponent(details.url))) {
        url = profilePrefix + getUsername(details.url);
    } else {
        return {redirectUrl: redirectTo};
    }
    return {redirectUrl: url};
}

loadPreferences('dummy', 'dummy');
browser.storage.onChanged.addListener(loadPreferences);