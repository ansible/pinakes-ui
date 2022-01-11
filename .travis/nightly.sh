#!/usr/bin/env bash
set -e
set -x

# Update the remote, travis only pulls one branch
git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
git remote update

# Rest branch to master so cron job takes care of all the work
git reset --hard remotes/origin/master

# install packages
npm install
npm install @patternfly/patternfly@latest
npm install @patternfly/react-core@prerelease
npm install @patternfly/react-tokens@prerelease
npm install @patternfly/react-icons@latest
npm install @patternfly/react-charts@prerelease

# build it
npm run nightly

# show the packages
if [ -d "dist" ]; then
    npm ls @patternfly/patternfly @patternfly/react-core @patternfly/react-tokens @patternfly/react-icons @patternfly/react-charts --depth=0 --json >> dist/patternfly-deps.json
fi

if [ -d "build" ]; then
    npm ls @patternfly/patternfly @patternfly/react-core @patternfly/react-tokens @patternfly/react-icons @patternfly/react-charts --depth=0 --json >> build/patternfly-deps.json
fi
