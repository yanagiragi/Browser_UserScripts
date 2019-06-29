// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      1.6
// @description  Enhanced download of wnacg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @author       Toudaimori
// @match        https://*.wnacg.org/photos-index-aid-*.html
// @match        https://*.wnacg.com/photos-index-aid-*.html
// @grant 	     GM.xmlHttpRequest
// @grant 	     GM_Download
// ==/UserScript==

(function() {
    'use strict';
  
    /*
    * GM_download() polyfill
    *
    * A polyfill to make your userscript supports GM_download().
    *
    * Inspired by:
    *   https://tampermonkey.net/documentation.php?ext=dhdg#GM_download
    *
    * Supported:
    *   onabort
    *
    * Not supported:
    *   saveAs
    *
    * Contributor(s):
    *   ccloli (original author)
    *   Jan Biniok (the blacklist and whitelist from Tampermonkey)
    *   janekptacijarabaci
    *
    */

    // *****************************************************************************

    const API = {
        "name": {
        "basic": "GM_download",
        "fully": "GM_download()",
        },
        "nameInternal": {
        "basic": "GM.xmlHttpRequest",
        "fully": "GM.xmlHttpRequest()",
        },
    };

    // *****************************************************************************

    // User settings.

    const LOCALE = {
        "_default": "en-US",
        "_enforce": null,
        "cs": {
        "error": {
            "download": {
            "error": API.name.fully
                + ":%1",
            "failed": API.name.fully
                + " se nezdařilo.%1",
            "noUrl": API.name.fully
                + ": url nenalezeno.%1",
            "onabortIsNotFunction": API.name.fully
                + ": details.onabort není funkce!",
            "onerrorIsNotFunction": API.name.fully
                + ": details.onerror není funkce!",
            "onloadIsNotFunction": API.name.fully
                + ": details.onload není funkce!",
            "onprogressIsNotFunction": API.name.fully
                + ": details.onprogress není funkce!",
            "ontimeoutIsNotFunction": API.name.fully
                + ": details.ontimeout není funkce!",
            "xmlhttpRequest": {
                "require": API.nameInternal.fully
                    + ' - typeof: "%1".'
                    + "\n"
                    + 'Nastavte "@grant '
                    + API.nameInternal.basic
                    + '" v "metadata block".',
            },
            },
        },
        "file": {
            "name": "soubor",
            // It should be on the whitelist.
            "extension": "bin",
        },
        },
        "en-US": {
        "error": {
            "download": {
            "error": API.name.fully
                + ":%1",
            "failed": API.name.fully
                + " failed:%1",
            "noUrl": API.name.fully
                + ": url not found.%1",
            "onabortIsNotFunction": API.name.fully
                + ": details.onabort is not a function!",
            "onerrorIsNotFunction": API.name.fully
                + ": details.onerror is not a function!",
            "onloadIsNotFunction": API.name.fully
                + ": details.onload is not a function!",
            "onprogressIsNotFunction": API.name.fully
                + ": details.onprogress is not a function!",
            "ontimeoutIsNotFunction": API.name.fully
                + ": details.ontimeout is not a function!",
            "xmlhttpRequest": {
                "require": API.nameInternal.fully
                    + ' - typeof: "%1".'
                    + "\n"
                    + 'Set "@grant '
                    + API.nameInternal.basic
                    + '" at "metadata block".',
            },
            },
        },
        "file": {
            "name": "filename",
            // It should be on the whitelist.
            "extension": "bin",
        },
        },
    };

    const NAME_EXTENSION_BLACKLIST = false;

    const NAME_EXTENSION = {
        "blacklist": [
        "bat",
        "com",
        "crx",
        "exe",
        "scr",
        "sh",
        ],
        "blacklistRegexp": [
        ],
        "whitelist": [
        "7z",
        "avi",
        "bin",
        "divx",
        // "flv",
        "gif",
        "ico",
        "idx",
        "iso",
        "jpe",
        "jpeg",
        "mkv",
        "mp3",
        "mp4",
        "mpe",
        "mpeg",
        "png",
        "rar",
        "srt",
        "sub",
        "txt",
        "wav",
        "webm",
        "zip",
        ],
        "whitelistRegexp": [
        "r(ar|[0-9]{2,2})",
        ],
    };

    // *****************************************************************************

    var _language = ((LOCALE._enforce) ? LOCALE._enforce
        : (navigator.language ? navigator.language
        : LOCALE._default));
    _language = (_language in LOCALE) ? _language : LOCALE._default;

    const _LOCALE = {
        "result": {
        "error": {
            "download": {
            "error": LOCALE[_language].error.download.error,
            "failed": LOCALE[_language].error.download.failed,
            "noUrl": LOCALE[_language].error.download.noUrl,
            "onabortIsNotFunction":
                LOCALE[_language].error.download.onabortIsNotFunction,
            "onerrorIsNotFunction":
                LOCALE[_language].error.download.onerrorIsNotFunction,
            "onloadIsNotFunction":
                LOCALE[_language].error.download.onloadIsNotFunction,
            "onprogressIsNotFunction":
                LOCALE[_language].error.download.onprogressIsNotFunction,
            "ontimeoutIsNotFunction":
                LOCALE[_language].error.download.ontimeoutIsNotFunction,
            "xmlhttpRequest": {
                "require": LOCALE[_language].error.download.xmlhttpRequest.require,
            },
            },
        },
        "file": {
            "name": LOCALE[_language].file.name,
            "extension": LOCALE[_language].file.extension,
        },
        },
    };

    const _RESULT = {
        "error": {
        "BLACKLISTED": "blacklisted",
        "NOT_SUCCEEDED": "not_succeeded",
        "NOT_WHITELISTED": "not_whitelisted",
        },
    };

    // *****************************************************************************

    if (typeof GM_download != "function") {
        if (typeof GM.xmlHttpRequest != "function") {
        throw new Error(
            _LOCALE.result.error.download.xmlhttpRequest.require
            .replace("%1", typeof GM.xmlHttpRequest));
        }

        console.log('Detect no GM_download! Use Polyfill instead!')

        var GM_download = function(aDetailsOrUrl, aName) {
            let _functionEmpty = function () {};

            var message = "";

            var details = {
                "url": null,
                "name": _LOCALE.result.file.name + "." + _LOCALE.result.file.extension,
                "onabort": _functionEmpty,
                "onerror": _functionEmpty,
                "onload": _functionEmpty,
                "onprogress": _functionEmpty,
                "ontimeout": _functionEmpty,
            };

            var _details = {};

            if (aDetailsOrUrl) {
                if (typeof aDetailsOrUrl == "object") {
                for (let i in aDetailsOrUrl) {
                    _details[i] = aDetailsOrUrl[i];
                }
                } else if (typeof aDetailsOrUrl == "string") {
                details.url = aDetailsOrUrl;
                }
            }

            if (_details.url && (typeof _details.url == "string")) {
                details.url = _details.url;
            }
            if (_details.name && (typeof _details.name == "string")) {
                details.name = _details.name;
            }
            if (_details.onabort) {
                details.onabort = _details.onabort;
            }
            if (_details.onerror) {
                details.onerror = _details.onerror;
            }
            if (_details.onload) {
                details.onload = _details.onload;
            }
            if (_details.onprogress) {
                details.onprogress = _details.onprogress;
            }
            if (_details.ontimeout) {
                details.ontimeout = _details.ontimeout;
            }

            for (let i in _details) {
                if (!(i in details)) {
                details[i] = _details[i];
                }
            }

            if (details.url == null) {
                message = "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                message = _LOCALE.result.error.download.noUrl
                    .replace("%1", message);
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }

            if (typeof details.onabort != "function") {
                message = _LOCALE.result.error.download.onabortIsNotFunction; 
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }
            if (typeof details.onerror != "function") {
                message = _LOCALE.result.error.download.onerrorIsNotFunction;
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                console.error(message);

                return false;
            }
            if (typeof details.onload != "function") {
                message = _LOCALE.result.error.download.onloadIsNotFunction;
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }
            if (typeof details.onprogress != "function") {
                message = _LOCALE.result.error.download.onprogressIsNotFunction;
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }
            if (typeof details.ontimeout != "function") {
                message = _LOCALE.result.error.download.ontimeoutIsNotFunction;
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }

            if (aName) {
                if (typeof aName == "string") {
                details.name = aName;
                }
            }

            let nameCheckBlacklist = false;
            if (NAME_EXTENSION_BLACKLIST && (NAME_EXTENSION.blacklist.length > 0)) {
                nameCheckBlacklist = NAME_EXTENSION.blacklist.some(function (aItem) {
                return details.name.toLowerCase().endsWith("." + aItem.toLowerCase());
                });
            }
            let nameCheckBlacklistRegexp = false;
            if (NAME_EXTENSION_BLACKLIST
                && (NAME_EXTENSION.blacklistRegexp.length > 0)) {
                nameCheckBlacklistRegexp = NAME_EXTENSION.blacklistRegexp.some(
                    function (aItem) {
                    return (new RegExp("\\." + aItem + "$", "i")).test(details.name);
                    });
            }
            let nameCheckWhitelist = false;
            if (NAME_EXTENSION.whitelist.length > 0) {
                nameCheckWhitelist = NAME_EXTENSION.whitelist.some(function (aItem) {
                return details.name.toLowerCase().endsWith("." + aItem.toLowerCase());
                });
            }
            let nameCheckWhitelistRegexp = false;
            if (NAME_EXTENSION.whitelistRegexp.length > 0) {
                nameCheckWhitelistRegexp = NAME_EXTENSION.whitelistRegexp.some(
                    function (aItem) {
                    return (new RegExp("\\." + aItem + "$", "i")).test(details.name);
                    });
            }

            if (NAME_EXTENSION_BLACKLIST
                && (nameCheckBlacklist || nameCheckBlacklistRegexp)) {
                details.onerror({
                "error": _RESULT.error.BLACKLISTED,
                });

                return false;
            }
            if (!nameCheckWhitelist && !nameCheckWhitelistRegexp) {
                details.onerror({
                "error": _RESULT.error.NOT_WHITELISTED,
                });

                return false;
            }

            let data = {
                "method": "GET",
                // "responseType": "arraybuffer",
                "responseType": "blob",
                "url": details.url,

                "onabort": function (aResponse) {
                    details.onabort(aResponse);
                },
                "onerror": function (aResponse) {
                    message = "\n" + "url: " + details.url;
                    message += "\n" + "name: " + details.name;
                    message = _LOCALE.result.error.download.failed
                        .replace("%1", message);
                    details.onerror({
                        "details": message,
                        "error": _RESULT.error.NOT_SUCCEEDED,
                    });

                    return false;
                },
                "onload": function (aResponse) {
                    let separators = {
                        "headers": "\n",
                        "nameValue": ":",
                    };
                    var contentTypeStartsWith = "content-type" + separators.nameValue;
                    let responseHeaders = aResponse.responseHeaders
                        .split(separators.headers);
                    let contentType = responseHeaders.find(function (aHeader) {
                        return aHeader.toLowerCase().trim().startsWith(contentTypeStartsWith);
                    });
                    if (contentType) {
                        contentType = contentType.split(separators.nameValue, 2);
                        contentType = contentType[1] ? contentType[1].trim() : undefined;
                    }
                    let type = details.overrideMimeType || contentType
                        || "application/octet-stream";
                    let blob = new Blob([aResponse.response], {
                        "type": type,
                    });
                    let url = URL.createObjectURL(blob);

                    let a = document.createElement("a");
                    a.setAttribute("href", url);
                    a.setAttribute("download", details.name);
                    a.setAttribute("style", "display: none;");
                    document.documentElement.appendChild(a);

                    let event = new MouseEvent("click");
                    a.dispatchEvent(event);

                    document.documentElement.removeChild(a);

                    setTimeout(function () {
                        URL.revokeObjectURL(url);
                        blob = undefined;
                    }, 1000);

                    details.onload(aResponse);
                },
                "onprogress": function (aResponse) {
                    details.onprogress(aResponse);
                },
                "ontimeout": function (aResponse) {
                    details.ontimeout(aResponse);
                },
            };

            for (let i in details) {
                if (!(i in data)) {
                    data[i] = details[i];
                }
            }

            try {
                return GM.xmlHttpRequest(data);
            } 
            catch (e) {
                message = "\n" + "error: " + e.toString();
                message += "\n" + "url: " + details.url;
                message += "\n" + "name: " + details.name;
                message = _LOCALE.result.error.download.error
                    .replace("%1", message);
                details.onerror({
                "details": message,
                "error": _RESULT.error.NOT_SUCCEEDED,
                });

                return false;
            }
        }
    }  
  

    // Main Code Here...
  
    const title = $('#bodywrap h2').text();
    const btn = $('.downloadbtn');

    $.ajax(btn.attr('href')).done( data => {
        const link = $('.down_btn', $(data)).attr('href')
        btn.on('click', event => {
            event.preventDefault();
            console.log(`start downloading ${link} as ${title}.zip, it might take a while...`)
          	GM_download(link, `${title}.zip`)
        })
    });

})();