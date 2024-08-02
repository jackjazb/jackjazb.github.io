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
available commands
- start: start a local server
- update: update github-pages
- post <name>: create a post in _posts

"
	;;

esac
