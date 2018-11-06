#!/usr/bin/env bash

REPO_DIR=$(basename "$DEPLOY_REPO")
REPO_DIR=${REPO_DIR%%.git}

git clone ${DEPLOY_REPO} -b $1
cd dist
cp ../${REPO_DIR}/Jenkinsfile ./Jenkinsfile
git init
git config --global user.name $COMMIT_AUTHOR_USERNAME
git config --global user.email $COMMIT_AUTHOR_EMAIL
git remote add travis-build ${DEPLOY_REPO}
git add .
git commit -m "${TRAVIS_COMMIT_MESSAGE}"
git push --force --set-upstream travis-build HEAD:$1
