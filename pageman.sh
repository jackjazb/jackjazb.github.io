#!/bin/bash

post() {
    if [ $# -eq 0 ]; then
        echo "usage: post <name>"
        return
    fi
    now=$(date +"%Y-%m-%d")
    file="./docs/_posts/$now-$1.md"
    cp "./docs/_drafts/template.md" $file
    echo "created $file"
}

case $1 in
"init")
    (cd ./docs && bundle install)
    ;;
"start")
    (cd ./docs && bundle exec jekyll serve --watch)
    ;;
"update")
    (cd ./docs && bundle update github-pages)
    ;;
"post")
    post $2
    ;;
*)
    printf "
usage: pageman.sh <option>

init            installs dependencies on first run
start           runs a local server on port 4000
update          updates the github-pages gem
post <title>    creates a post in _posts with the current date and the passed title

"
    ;;

esac
