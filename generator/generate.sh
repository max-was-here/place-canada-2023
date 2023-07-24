#!/usr/bin/env bash

python pixel.py ../pictures ../target_config.toml \
--config ";;../outputs/overlay2.dot.png;;;;1;1;1;1" \
--config ";;../outputs/overlay2.full.png;;;;0;1;1;1"
