#!/usr/bin/env bash

./venv/bin/python pixel.py ./pictures ./target_config.toml \
--config ";;./outputs/overlay2.dot.png;;;;1;0;1;1" \
--config ";;./outputs/overlay2.full.png;;;;0;0;1;1"