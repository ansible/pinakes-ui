# Change Directory to clones
cd _clones/pinakes-ui/

# Extract UI Strings
npm run extract:messages

# Move files to translations folder
mv build/messages/messages.json translations/