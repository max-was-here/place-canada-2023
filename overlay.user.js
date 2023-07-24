// ==UserScript==
// @name         r/place 2023 Canada Overlay
// @namespace    https://github.com/max-was-here/place-canada-2023
// @version      1.0.2
// @description  Script to add one or multiple overlay images to 2023 r/place canvas
// @author       max-was-here
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @grant        GM.xmlHttpRequest
// ==/UserScript==


if (window.top !== window.self) {
  addEventListener('load', () => {
    // Constants
    const CONFIG_LOCATION = 'https://raw.githubusercontent.com/max-was-here/place-canada-2023/rewrite/outputs/userscript.config.json';
    const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000;
    const STORAGE_KEY = 'place-canada-2023-ostate';

    // Config vars
    let configDataChecksum = "";
    let configData = {v:0, l:[]};
    let displayedImgs = [];

    // Load state
    let oState = {
      opacity: 75,
      overlayIdx: 0
    };
    const oStateStorage = localStorage.getItem(STORAGE_KEY);
    if(oStateStorage !== null) {
      try {
        oState = Object.assign({}, oState, JSON.parse(oStateStorage));
      } catch(e){}
    }

    // Ui Vars
    const mainContainer = document
        .querySelector('garlic-bread-embed')
        .shadowRoot.querySelector('.layout');
    const positionContainer = mainContainer
        .querySelector('garlic-bread-canvas')
        .shadowRoot.querySelector('.container');

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.style.position = "absolute";
    buttonsWrapper.style.top = "25px";
    buttonsWrapper.style.right = "25px";
    mainContainer.appendChild(buttonsWrapper);

    // Config functions
    const checksum = (s) => {
      var chk = 0x12345678;
      var len = s.length;
      for (var i = 0; i < len; i++) {
        chk += (s.charCodeAt(i) * (i + 1));
      }

      return (chk & 0xffffffff).toString(16);
    };

    const loadNewConfig = (dataStr) => {
      try {
        configDataChecksum = checksum(dataStr);
        configData = JSON.parse(dataStr);
      } catch (e) {
        alert('An error occurred while starting the script. Please wait a bit and refresh the page.');
        return;
      }

      // Remove currently displayed images
      displayedImgs.forEach((img) => {
        img.parentNode.removeChild(img);
      });
      displayedImgs = [];

      configData['l'].forEach((cfg, idx) => {
        addImg(cfg, idx);
      });
    }

    const saveState = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oState));
    }

    // UI Functions
    const changeOpacity = (e) => {
      oState.opacity = e.target.value
      displayedImgs.forEach(img => {
        img.style.opacity = oState.opacity / 100;
      });
      saveState();
    };

    const switchOverlay = () => {
      oState.overlayIdx++;
      if(oState.overlayIdx >= 2){
        oState.overlayIdx = 0;
      }
      displayedImgs.forEach(img => {
        img.src = `${configData['l'][img.dataset.idx].s[oState.overlayIdx]}?${configDataChecksum}`;
        img.style.opacity = oState.opacity / 100;
      });
      saveState();
    };

    const addButton = (text, onClick) => {
      const button = document.createElement('button');
      button.onclick = onClick;
      button.style.width = "100px";
      button.style.height = "45px";
      button.style.backgroundColor = "#555";
      button.style.color = "white";
      button.style.border = "var(--pixel-border)";
      button.style.boxShadow = "var(--pixel-box-shadow)";
      button.style.fontFamily = "var(--garlic-bread-font-pixel)";
      button.style.cursor = "pointer";

      button.innerText = text;

      buttonsWrapper.appendChild(button);
    };

    const addSlider = (text, min, max, val, onChange) => {
      const opacityWrapper = document.createElement('div');
      opacityWrapper.style.width = "100px";
      opacityWrapper.style.height = "45px";
      opacityWrapper.style.backgroundColor = "#555";
      opacityWrapper.style.color = "white";
      opacityWrapper.style.border = "var(--pixel-border)";
      opacityWrapper.style.boxShadow = "var(--pixel-box-shadow)";
      opacityWrapper.style.fontFamily = "var(--garlic-bread-font-pixel)";
      opacityWrapper.style.marginTop = "15px";
      opacityWrapper.style.textAlign = "center";
      opacityWrapper.innerText = text;

      const opacitySlider = document.createElement('input');
      opacitySlider.type = "range";
      opacitySlider.min = min;
      opacitySlider.max = max;
      opacitySlider.value = val;
      opacitySlider.style.webkitAppearance = "none";
      opacitySlider.style.appearance = "none";
      opacitySlider.style.height = "15px";
      opacitySlider.style.width = "95px";
      opacitySlider.style.borderRadius = "5px";
      opacitySlider.style.background = "#d3d3d3";
      opacitySlider.style.outline = "none";
      opacitySlider.oninput = onChange;

      opacityWrapper.appendChild(opacitySlider);
      buttonsWrapper.appendChild(opacityWrapper);
    };

    addImg = (imgConfig, idx) => {
      const img = document.createElement('img');
      img.style.pointerEvents = 'none';
      img.style.position = 'absolute';
      img.style.imageRendering = 'pixelated';
      img.src = `${imgConfig.s[oState.overlayIdx]}?${configDataChecksum}`;
      img.style.opacity = oState.opacity;
      img.style.top = `${imgConfig.y}px`;
      img.style.left = `${imgConfig.x}px`;
      img.style.width = `${imgConfig.w}px`;
      img.style.height = `${imgConfig.h}px`;
      img.style.zIndex = '100';
      img.dataset.idx = idx;
      img.onload = () => {
        img.style.opacity = oState.opacity / 100;
      };
      displayedImgs.push(img);
      positionContainer.appendChild(img);
    };

    addButton(
        'Switch Overlay',
        switchOverlay
    );
    addSlider(
        'Opacity',
        0, 100, oState.opacity,
        changeOpacity
    );

    GM.xmlHttpRequest({
      method: 'GET',
      url: CONFIG_LOCATION,
      onload: (response) => {
        if (response.status < 200 || response.status > 299) {
          alert('An error occured while loading the config. Please wait a bit and refresh the page.');
          return;
        }

        loadNewConfig(response.responseText);

        setInterval(() => {
          GM.xmlHttpRequest({
            method: 'GET',
            url: CONFIG_LOCATION,
            onload: async (response) => {
              const newChecksum = checksum(response.responseText);
              if (configDataChecksum === newChecksum) return;

              loadNewConfig(response.responseText)
            }
          });
        }, UPDATE_CHECK_INTERVAL);
      }
    });
  });
}
