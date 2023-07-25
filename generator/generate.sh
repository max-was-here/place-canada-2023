#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
MAIN_DIR="$SCRIPT_DIR/.."

source $SCRIPT_DIR/venv/bin/activate
python $SCRIPT_DIR/pixel.py $MAIN_DIR/pictures $MAIN_DIR/target_config.toml \
--config ";;$MAIN_DIR/outputs/overlay2.dot.png;;;;1;0;1;1" \
--config ";;$MAIN_DIR/outputs/overlay2.full.png;;;;0;0;1;1"
