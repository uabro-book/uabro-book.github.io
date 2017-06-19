#!/bin/sh

pug raw-pug -o chapters

if [ "$#" -ne 0 ]; then
    comment="$@"
    else
    comment="`date`"
fi

git add .

git commit -m "$comment"

git push