#!/bin/bash

cd _clones/pinakes-ui/

# Rename the zh_cn folder 
mv translations/zh_cn translations/zh

# Create a directory for api (locale)
# rm -rf locale
mkdir locales

# Copy all subdirectories to locale
cp -r translations/ locales/

# Loop over each directory and create another directory LC_Messages
# Move django.po files to LC_Messages and remove messages.po
# cd locales/
# for d in */ ; do
#     dir=${d%*/}
#     mkdir $dir/LC_MESSAGES
#     mv $dir/django.po $dir/LC_MESSAGES/
# done

# cd ..
# echo $(pwd)


# echo $pwd

# cd to repository

# cd _clones/

pinakes_ui_path="pinakes/locales" # locale will be dropped here

rsync -av locales/ $pinakes_api_path

rm -rf translations/
rm -rf locales/
