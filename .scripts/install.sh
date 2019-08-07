#!/bin/bash
set -x
ssh ubuntu@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~/spotishare-back
        git reset --hard HEAD
        git pull
        echo "Running npm install"
        npm install
        echo "Latest version of spotishare-back running."
    fi
EOF
