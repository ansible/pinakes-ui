#!/bin/bash

# Rename the zh_cn folder 
mv translations/zh_cn translations/zh

# locale will be dropped here
pinakes_ui_path="locales" 

# Copy and update the files
rsync -av translations/ $pinakes_ui_path

# Cleanup
rm -rf translations/
