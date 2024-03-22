case $1 in
"start") (cd ./docs && bundle exec jekyll serve --watch) ;;
"update") (cd ./docs && bundle update github-pages) ;;
*) printf "available commands\n- start: start a local server\n- update: update github-pages\n" ;;
esac
