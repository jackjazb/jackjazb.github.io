# jackjazb.github.io

This repository contains the markup and posts for [jackjazb.github.io](https://jackjazb.github.io).

## Local Development

The `pageman.sh` tool can be used to automate certain aspects of managing this site.

Usage

```text
./pageman.sh <option>
```

Options

``` text
init            installs dependencies on first run
start           runs a local server on port 4000
update          updates the `github-pages` gem
post <title>    creates a post in _posts with the current date and the passed title
```

## Images

Images should be convert to the `.webp` format. This can be done using `webp` as follows:

```sh
cwebp -q 80 input.jpg -o output.webp
```
