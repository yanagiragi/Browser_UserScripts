// ==UserScript==
// @name         wnacgDownload
// @namespace    yrWnacg
// @version      1.9
// @description  Enhanced download of wnacg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @author       Toudaimori
// @include      /https:\/\/(.|\.)*wnacg\.[a-zA-Z]+\/photos\-index\-aid\-[0-9]*\.html/
// @grant 	     GM.xmlHttpRequest
// @grant 	     GM_download
// ==/UserScript==

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
else {
    console.log('GM_download Founded.')
}


// Main Code Here...

const title = $('#bodywrap h2').text();
const img = `data:image/png;base64,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`
const element = `<a class="downloadbtn" style="width:120px; background: url(${img})" href=${$('.downloadbtn').attr('href')}>&nbsp;</a>`
const btn = $(element);


$('.asTBcell.uwthumb').append(btn);

$.ajax(btn.attr('href')).done( data => {
    const link = $('.down_btn', $(data)).attr('href')
    btn.on('click', event => {
        event.preventDefault();
        console.log(`start downloading ${link} as ${title}.zip, it might take a while...`)
      	GM_download(link, `${title}.zip`)
    })
});

