// ==UserScript==
// @name         Dump Twitter Followers & List
// @namespace    Yr
// @version      1.0
// @description  Dump Twitter Followers & List
// @author       yanagiragi
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

/* Twitter Lib */

function _parseCookie(str) {
    return str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
}

function _getOptions(csrfToken) {
    return {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "*/*",
            "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
            "content-type": "application/json",
            "x-twitter-auth-type": "OAuth2Session",
            "x-csrf-token": csrfToken,
            "x-twitter-client-language": "zh-tw",
            "x-twitter-active-user": "yes",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "method": "GET",
        "mode": "cors"
    }
}

function _parseListMembers(data) {
    const entries = data?.data?.list?.members_timeline?.timeline?.instructions?.filter(x => x.type == 'TimelineAddEntries')?.[0]?.entries
    const result = []
    for (const entry of entries.filter(x => x.entryId.startsWith('user-'))) {
        const screenName = entry?.content?.itemContent?.user_results?.result?.legacy?.screen_name
        const name = entry?.content?.itemContent?.user_results?.result?.legacy?.name
        result.push({
            name,
            screenName
        })
    }
    return result
}

function _parseListMembersBottomCursor(data) {
    const entries = data?.data?.list?.members_timeline?.timeline?.instructions?.filter(x => x.type == 'TimelineAddEntries')?.[0]?.entries
    const bottomCursorEntry = entries?.filter(x => x.entryId.startsWith('cursor-bottom-'))?.[0]
    return bottomCursorEntry?.content?.value
}

async function _getListMembers(listId, count, csrfToken, currentCursor) {
    const options = _getOptions(csrfToken)
    const variables = { "listId": listId, "count": count, "withSafetyModeUserFields": true, cursor: currentCursor }
    const features = { "rweb_lists_timeline_redesign_enabled": true, "responsive_web_graphql_exclude_directive_enabled": true, "verified_phone_label_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": true, "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "tweetypie_unmention_optimization_enabled": true, "responsive_web_edit_tweet_api_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true, "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": false, "tweet_awards_web_tipping_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "longform_notetweets_rich_text_read_enabled": true, "longform_notetweets_inline_media_enabled": true, "responsive_web_media_download_video_enabled": false, "responsive_web_enhance_cards_enabled": false }

    const resp = await fetch(`https://twitter.com/i/api/graphql/1icjxQY7vy1IQQyY8Sr7iw/ListMembers?variables=${encodeURI(JSON.stringify(variables))}&features=${encodeURI(JSON.stringify(features))}`, options);
    const text = await resp.text()
    const json = JSON.parse(text)

    const members = _parseListMembers(json)
    const cursor = _parseListMembersBottomCursor(json)

    return {
        members,
        cursor,
    }
}

function _parseLists(data) {
    const entries = data?.data?.viewer?.list_management_timeline?.timeline?.instructions?.filter(x => x?.type == 'TimelineAddEntries')?.[0]
    const listEntries = entries?.entries.filter(x => x?.entryId?.startsWith('owned-subscribed-list-module-'))?.map(x => x.content.items)?.flat()
    const result = []
    for (const entry of listEntries) {
        const id_str = entry?.item?.itemContent?.list?.id_str
        const name = entry?.item?.itemContent.list?.name
        result.push({
            name,
            id_str
        })
    }
    return result
}

function _parseListsBottomCursor(data) {
    const entries = data?.data?.viewer?.list_management_timeline?.timeline?.instructions?.filter(x => x?.type == 'TimelineAddEntries')?.[0]
    const bottomCursorEntry = entries?.entries?.filter(x => x.entryId.startsWith('cursor-bottom-'))?.[0]
    return bottomCursorEntry?.content?.value
}

// This api only supports fetch once for now
async function _getLists(count, csrfToken, currentCursor) {
    const options = _getOptions(csrfToken)
    const variables = { "count": 100 }
    const features = { "rweb_lists_timeline_redesign_enabled": true, "responsive_web_graphql_exclude_directive_enabled": true, "verified_phone_label_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": true, "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "tweetypie_unmention_optimization_enabled": true, "responsive_web_edit_tweet_api_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true, "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": false, "tweet_awards_web_tipping_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "longform_notetweets_rich_text_read_enabled": true, "longform_notetweets_inline_media_enabled": true, "responsive_web_media_download_video_enabled": false, "responsive_web_enhance_cards_enabled": false }

    const resp = await fetch(`https://twitter.com/i/api/graphql/DcpIrsrn_SDT_5q0jV_exQ/ListsManagementPageTimeline?variables=${encodeURI(JSON.stringify(variables))}&features=${encodeURI(JSON.stringify(features))}`, options);
    const text = await resp.text()
    const json = JSON.parse(text)

    const lists = _parseLists(json)
    const cursor = null // parseListsBottomCursor(json)

    return {
        lists,
        cursor,
    }
}

function _parseFollowers(data) {
    const entries = data?.data?.user?.result?.timeline?.timeline?.instructions?.filter(x => x.type == 'TimelineAddEntries')?.[0]?.entries
    const result = []
    for (const entry of entries.filter(x => x.entryId.startsWith('user-'))) {
        const screenName = entry?.content?.itemContent?.user_results?.result?.legacy?.screen_name
        const name = entry?.content?.itemContent?.user_results?.result?.legacy?.name
        result.push({
            name,
            screenName
        })
    }
    return result
}

function _parseFollowersBottomCursor(data) {
    const entries = data?.data?.user?.result?.timeline?.timeline?.instructions?.filter(x => x.type == 'TimelineAddEntries')?.[0]?.entries
    const bottomCursorEntry = entries?.filter(x => x.entryId.startsWith('cursor-bottom-'))?.[0]
    return bottomCursorEntry?.content?.value
}

async function _getFollowers(twid, count, csrfToken, currentCursor) {
    const options = _getOptions(csrfToken)
    const variables = { "userId": twid, "count": count, "includePromotedContent": false, "cursor": currentCursor }
    const features = { "rweb_lists_timeline_redesign_enabled": true, "responsive_web_graphql_exclude_directive_enabled": true, "verified_phone_label_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": true, "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "tweetypie_unmention_optimization_enabled": true, "responsive_web_edit_tweet_api_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true, "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": false, "tweet_awards_web_tipping_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "longform_notetweets_rich_text_read_enabled": true, "longform_notetweets_inline_media_enabled": true, "responsive_web_media_download_video_enabled": false, "responsive_web_enhance_cards_enabled": false }

    const resp = await fetch(`https://twitter.com/i/api/graphql/t-BPOrMIduGUJWO_LxcvNQ/Following?variables=${encodeURI(JSON.stringify(variables))}&features=${encodeURI(JSON.stringify(features))}`, options);
    const text = await resp.text()
    const json = JSON.parse(text)

    const followers = _parseFollowers(json)
    const cursor = _parseFollowersBottomCursor(json)

    return {
        followers,
        cursor,
    }
}

/* Wrapper Functions */

async function getFollowers() {
    const parsedCookie = _parseCookie(document.cookie)
    const twid = parsedCookie.twid.replace('u=', '')
    const csrfToken = parsedCookie.ct0
    const count = 50 // max count = 50

    const result = []
    let currentCursor = ''
    let i = 0
    while (true) {
        console.log(`Fetch followers, now = ${i + 1}, current cursor = ${currentCursor}, accumulated = ${result.length}`)
        const { followers, cursor } = await _getFollowers(twid, count, csrfToken, currentCursor)

        followers.forEach(x => result.push(x))
        i += 1

        if (!cursor || cursor.startsWith('0|')) {
            break;
        }

        currentCursor = cursor
    }

    return result
}

async function getLists() {
    const parsedCookie = _parseCookie(document.cookie)
    const csrfToken = parsedCookie.ct0
    const count = 50 // max count = 50

    const result = []
    let currentCursor = ''
    let i = 0
    while (true) {
        console.log(`Fetch list, now = ${i + 1}, current cursor = ${currentCursor}, accumulated = ${result.length}`)
        const { lists, cursor } = await _getLists(count, csrfToken, currentCursor)

        lists.forEach(x => result.push(x))
        i += 1

        if (!cursor || cursor.startsWith('0|')) {
            break;
        }

        currentCursor = cursor
    }

    return result
}

async function getListMembers(list) {
    const listId = list.id_str
    const parsedCookie = _parseCookie(document.cookie)
    const csrfToken = parsedCookie.ct0
    const count = 50 // max count = 50

    const result = []
    let currentCursor = ''
    let i = 0
    while (true) {
        console.log(`Fetch member of ${list.name}, now = ${i + 1}, current cursor = ${currentCursor}, accumulated = ${result.length}`)
        const { members, cursor } = await _getListMembers(listId, count, csrfToken, currentCursor)

        members.forEach(x => result.push(x))
        i += 1

        if (!cursor || cursor.startsWith('0|')) {
            break;
        }

        currentCursor = cursor
    }

    return result
}

async function getListsWithMembers() {
    const lists = await getLists()
    for (const list of lists) {
        const members = await getListMembers(list)
        list.members = members
    }

    return lists
}

/* Userscript functions */

function getElements() {
    return `
    <a href="#" id="YrDumpBtn" aria-label="Dump Data" role="link" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1habvwh r-1loqt21 r-6koalj r-eqz5dr r-16y2uox r-1ny4l3l r-oyd9sg r-13qz1uu" data-testid="AppTabBar_Profile_Link">
        <div class="css-1dbjc4n r-1awozwy r-sdzlij r-18u37iz r-1777fci r-dnmrzs r-xyw6el r-o7ynqc r-6416eg">
            <div id="YrDumpBtn_NormalIcon" class="css-1dbjc4n">
                <svg viewBox="0 0 24 24" aria-hidden="true" class="r-1kihuf0 r-1nao33i r-4qtqp9 r-yyyyoo r-1q142lx r-1472mwg r-mbgqwd r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp" data-testid="icon"><g><path d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"></path></g></svg>
            </div>
            
            <div id="YrDumpBtn_LoadingIcon" aria-valuemax="1" aria-valuemin="0" role="progressbar" class="css-1dbjc4n r-1awozwy r-1777fci" style="display:none;">
                <div class="css-1dbjc4n r-17bb2tj r-1muvv40 r-127358a r-1ldzwu0" style="height: 26px; width: 26px;">
                    <svg height="100%" viewBox="0 0 32 32" width="100%"><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 155, 240); opacity: 0.2;"></circle><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 155, 240); stroke-dasharray: 80px; stroke-dashoffset: 60px;"></circle></svg>
                </div>
            </div>

            <div dir="ltr" class="css-901oao css-1hf3ou5 r-1nao33i r-37j5jr r-adyw6z r-16dba41 r-135wba7 r-1joea0r r-88pszg r-bcqeeo r-qvutc0">
                <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Dump Data</span>
            </div>
        </div>
    </a>`
}

async function dumpFollowers() {

    // animation part
    const normalIcon = document.querySelector('#YrDumpBtn_NormalIcon')
    const loadingIcon = document.querySelector('#YrDumpBtn_LoadingIcon')

    // the button is already pressed
    if (normalIcon.style.display != "") {
        console.log('dumpFollowers is already in running!')
        return;
    }

    normalIcon.style.display = "none"
    loadingIcon.style.display = ""

    const followers = await getFollowers()
    const lists = await getListsWithMembers()
    downloadJson({
        followers,
        lists
    })

    normalIcon.style.display = ""
    loadingIcon.style.display = "none"
}

function downloadJson(content) {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "dump.json";
    a.click();
}

function setup() {
    const sidebarButton = document.querySelector('div[data-testid="AppTabBar_More_Menu"]')
    sidebarButton.insertAdjacentHTML('beforebegin', getElements())
    document.querySelector('#YrDumpBtn').addEventListener('click', dumpFollowers)
}

(function () {
    'use strict';

    const interval = setInterval(() => {
        const sidebarButton = document.querySelector('div[data-testid="AppTabBar_More_Menu"]')
        if (sidebarButton) {
            clearInterval(interval)
            console.log('sidebar is ready')
            setup()
        }
        else {
            console.log('sidebar is not ready yet')
        }
    }, 1000 * 1)
})();