# Reddit r/place Overlay Script for r/placecanada

## Installation for builders

1. Install the [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) (Chrome) or [Violentmonkey](https://addons.mozilla.org/en-CA/firefox/addon/violentmonkey/) (Firefox) browser extensions.
2. Open the [raw source file link](https://raw.githubusercontent.com/max-was-here/place-canada-2023/master/overlay.user.js) and the extension will automatically ask for installation.
3. Accept it and the next time r/place is loaded you should see a "Toggle Overlay button"
4. Refresh your browser periodically to load any potential update to the overlay image


## For maintainers

### Image preparation

1. See `/pictures/canada.provinces.psd` to update our current design
2. Images to add to the overlay must be placed under `./pictures` in a 1x scale
3. Edit `target_config.toml` with the image name and top left position

### Overlay image generation

1. You will need python version 3.11+ in order to generate the overlay
2. Generate a local venv : `python3 -m venv ./venv`
3. Install requirement : `./venv/bin/pip install -r ./requirements.txt`
4. Run the generation script : `./bin/generate.sh`
5. New overlay images should be under `./outputs`

### Deploy the new overlay

1. Commit and push the new files in `master` branch
2. Test that the overlay updated for you before any anouncement, the cache may take up to 5 minutes to update
3. Announce the overlay change to and admin or coordinator on [r/placecanada discord](https://discord.gg/placecanada-959145637922889728)
