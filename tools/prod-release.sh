#!/bin/bash

# select INCREMENT to be patch, minor or major
INCREMENT=patch
if [ "$1" == "minor" ] || [ "$1" == "major" ]; then
  INCREMENT=$1
fi

# test we are in monorepo root
if [ ! -f "./lerna.json" ]; then
  echo "ERROR: script should be executed from monorepo root"
  exit -1
fi

CURRENT_BRANCH=$(git symbolic-ref --short -q HEAD)

if [ "$CURRENT_BRANCH" != "master" ]; then
  echo 'Aborting script. You should switch to master.';
  exit 1;
fi

# increment package versions
git pull --tags --force
npx lerna version $INCREMENT --yes
if [ $? -ne 0 ]; then
  echo "ERROR: lerna version failed"
  exit -1
fi

git checkout $CURRENT_BRANCH
