// ==UserScript==
// @name         PlaceCanada Overlay Userscript (Autoupdater)
// @namespace    https://github.com/max-was-here/place-canada-2023
// @version      0.1.0
// @description  The easiest way to run our overlay and keep it up to date, right from your browser
// @author       PlaceCanada
// @match        https://garlic-bread.reddit.com/embed*
// @connect      reddit.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://raw.githubusercontent.com/max-was-here/place-canada-2023/rewrite/userscript.autoupdater.js
// @downloadURL  https://raw.githubusercontent.com/max-was-here/place-canada-2023/rewrite/userscript.autoupdater.js
// @grant        GM.xmlHttpRequest
// @connect      github.com
// @connect      objects.githubusercontent.com
// ==/UserScript==

const SCRIPT_LOCATION = 'https://raw.githubusercontent.com/max-was-here/place-canada-2023/rewrite/overlay.user.js';
const UPDATE_CHECK_INTERVAL = 10 * 60 * 1000;

(function () {
    (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACECA_USERSCRIPT_AUTO_UPDATER = {
        version: '0.0.1',
        updateHook: () => {
        }
    };

    GM.xmlHttpRequest({
        method: 'GET',
        url: SCRIPT_LOCATION,
        onload: (response) => {
            if (response.status < 200 || response.status > 299) {
                alert('An error occured while loading the script. Please wait a bit and refresh the page.');
                return;
            }
            const scriptData = response.responseText;

            try {
                eval(scriptData);
            } catch (e) {
                alert('An error occurred while starting the script. Please wait a bit and refresh the page.');
                return;
            }

            setInterval(() => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: SCRIPT_LOCATION,
                    onload: async (response) => {
                        const newScriptData = response.responseText;
                        if (scriptData === newScriptData) return;

                        // Give the userscript some time to display its update message
                        await (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACECA_USERSCRIPT_AUTO_UPDATER.updateHook();
                        setTimeout(() => window.location.reload(), 5000);
                    }
                });
            }, UPDATE_CHECK_INTERVAL);
        }
    });
})();
