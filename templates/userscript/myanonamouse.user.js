// ==UserScript==
// @name MyAnonaMouse / WM Integrator
// @namespace https://karamanolev.com
// @version 0.1.0
// @description Integration between WM and MyAnonaMouse.net
// @match http://*.myanonamouse.net/*
// @match https://*.myanonamouse.net/*
// @grant GM_xmlhttpRequest
// @updateURL {{ root }}/userscript/bibliotik.user.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require {{ root }}/static/js/jquery.noty.packaged.min.js
// ==/UserScript==

var torrentsInfoUrl = '{{ root }}/myanonamouse/json/torrents_info';
var addTorrentUrl = '{{ root }}/myanonamouse/json/add/';
var downloadUrl = '{{ root }}/download/zip/myanonamouse/';

$.noty.defaults.timeout = 5000;
var loadingImg = '<img class="loading-img" src="data:image/gif;base64,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" width="12" height="12" valign="middle" />';
function formatResponseError(response) {
    if (response.statusText) {
        return response.statusText;
    }
    return "Unknown network error.";
}

function submitIds(rows, callback) {
    setTimeout(function () {
        var ids = [];
        $.each(rows, function (k, row) {
            ids.push(row.whatId);
        });
        var idsString = 'ids=' + encodeURIComponent(ids.join(','));
        GM_xmlhttpRequest({
            method: "GET",
            url: torrentsInfoUrl + '?' + idsString,
            onload: function (response) {
                callback($.parseJSON(response.responseText));
            },
            onerror: function (response) {
                debugger;
                noty({
                    text: 'Error loading WM data: ' + formatResponseError(response),
                    type: 'error'
                });
            }
        });
    }, 0);
}

function addTorrent(torrentId, callback) {
    var params = encodeURIComponent(torrentId);
    GM_xmlhttpRequest({
        method: "GET",
        url: addTorrentUrl + params,
        onload: function (response) {
            callback($.parseJSON(response.responseText));
        },
        onerror: function (response) {
            callback({
                success: false,
                error: formatResponseError(response)
            });
        }
    });
}

function getId(link) {
    var regexps = [
        /torBookmark(\d+)/
    ];
    var result = null;
    $.each(regexps, function (i, r) {
        var m = link.match(r);
        if (m !== null) {
            result = m[1];
        }
    });
    return result;
}

function downloadTorrent(row) {
    row.actions.html(loadingImg);
    row.isAdding = true;
    addTorrent(row.whatId, function (addResult) {
        var htmlTitle;
        row.isAdding = false;
        if (addResult.success) {
            htmlTitle = $('<b>').text(addResult.title).prop('outerHTML');
            noty({
                text: 'Torrent ' + htmlTitle + ' added successfully!',
                type: 'success'
            });
            row.actions.text('OK');
        } else if (addResult.error_code == 'already_added') {
            htmlTitle = $('<b>').text(addResult.title).prop('outerHTML');
            noty({
                text: 'Torrent ' + htmlTitle + ' already added!',
                type: 'warning'
            });
            row.actions.text('ERR');
        } else {
            noty({
                text: 'Error adding ' + resp.id + ': ' + addResult.error,
                type: 'error'
            });
            row.actions.text('ERR');
        }
    });
}

var torrentRows = [];

function processResult(result) {
    $.each(result, function (i, resp) {
        var row = torrentRows[i];
        var link;

        if (row.isAdding) {
            return;
        }

        row.actions.empty();
        delete row.downloadLink;
        if (resp.status == 'downloaded') {
            // Download
            link = $('<a href="' + downloadUrl + resp.id + '">↓</a>');
            row.actions.append(link);
        } else if (resp.status == 'downloading') {
            row.actions.text(Math.floor(resp.progress * 100) + '%');
        } else if (resp.status == 'missing') {
            // Add to WM

            link = $('<a href="#">GET</a>');
            link.click(function (e) {
                e.preventDefault();
                if (confirm('Are you sure you want to download ' + resp.id + '?')) {
                    downloadTorrent(row);
                }
            });
            row.actions.append(' ');
            row.actions.append(link);
            row.downloadLink = link;
        } else {
            row.actions.text(result[i].status);
        }
    });
}

function processRow() {
    var $this = $(this);
    var link = $this.find('a[title="bookmark"]');
    if (!link.length) return;
    var actions = link.parent();
    //actions.css('width', 50);
    var torrentId = getId(link.attr('id'));
    if (!torrentId) debugger;
    var customActions = $('<span style="float: none;"></span>');
    actions.append(customActions);

    customActions.append(loadingImg);

    torrentRows.push({
        row: $this,
        whatId: torrentId,
        actions: customActions
    });
}

$('.newTorTable > tbody > tr').each(processRow);

if (torrentRows.length) {
    function refreshStatuses() {
        submitIds(torrentRows, processResult);
    }

    refreshStatuses();
    if (torrentRows.length < 256) {
        setInterval(refreshStatuses, 10000);
    }
}

unsafeWindow.wmGetAllTorrents = function () {
    $.each(torrentRows, function (i, row) {
        if (row.downloadLink) {
            downloadTorrent(row);
        }
    });
};
