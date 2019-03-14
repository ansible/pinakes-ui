#!/usr/bin/env bash
set -x
set -e

echo "Automatically promoting $1 to ${TRAVIS_BRANCH}..."

cd "${TRAVIS_BUILD_DIR}"
git clean -xdf
git checkout -B "$1"
git merge --no-ff --no-edit "${TRAVIS_BRANCH}"
set +x
echo "git push origin ${TRAVIS_BRANCH}:#{$1}"
git push https://${GITHUB_PROMOTION_AUTH}@github.com/${TRAVIS_REPO_SLUG}.git "$1" &> /dev/null
echo $?
