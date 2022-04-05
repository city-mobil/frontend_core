#!/bin/bash

BRANCH=$1
NPM_TAG=$2

if [ -z "$BRANCH" ]
then
      echo "You must specify branch"
      exit 1
fi

if [ "$NPM_TAG" != "alpha" ] && [ "$NPM_TAG" != "beta" ]; then
      echo "Spicify tag alpha or beta"
      exit 1
fi

# select INCREMENT to be prepatch, preminor or premajor
INCREMENT=prepatch
if [ "$3" == "preminor" ] || [ "$3" == "premajor" ]; then
  INCREMENT=$3
fi

CURRENT_BRANCH=$(git symbolic-ref --short -q HEAD)

git fetch --all
git branch -D $NPM_TAG
git checkout -b $NPM_TAG $BRANCH

checoutingCode=$?
if [ $checoutingCode -ne 0 ]
then
      echo "An error occured with checkouting branch"
      exit 1
fi

LAST_COMMIT_HASH=$(git rev-parse --short HEAD)

npx lerna version $INCREMENT --yes --no-push --preid $NPM_TAG.$LAST_COMMIT_HASH --force-publish

git push --force --follow-tags --set-upstream origin $NPM_TAG

git checkout $CURRENT_BRANCH
