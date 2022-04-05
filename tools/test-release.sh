#!/bin/bash

BRANCH=$1

CURRENT_BRANCH=$(git symbolic-ref --short -q HEAD)

if [ -z "$BRANCH" ]
then
      echo "You must specify branch"
      exit 1
fi

git fetch --all
git branch -D test_release
git checkout -b test_release $BRANCH

checoutingCode=$?
if [ $checoutingCode -ne 0 ]
then
      echo "An error occured with checkouting branch"
      exit 1
fi

git push --force --set-upstream origin test_release

git checkout $CURRENT_BRANCH