post:
	cp "./docs/_drafts/template.md" ./docs/_posts/$$(date +"%Y-%m-%d")-title.md
init:
	(cd ./docs && bundle install)
start:
	(cd ./docs && bundle exec jekyll serve --watch)
update:
	(cd ./docs && bundle update github-pages)
