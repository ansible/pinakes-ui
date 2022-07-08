#!/bin/bash

# Extract UI Strings
npm run extract:messages

# Move files to translations folder
mv build/messages/messages.json translations/