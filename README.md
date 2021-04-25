# vue-web-spa

## Overview

This is an example of simple static SPA (single-page application) website using markdown for content and HTML5 History API to keep the URLs nice as if it was just on plain good old static HTML pages. An actual example running this: [quackpond.nz](https://quackpond.nz/).

Content master data resides in markdown \*.txt files. These are loaded behind the scenes, parsed and presented in HTML.

| Request path | Markdown file  |
| -----------  | -----------    |
| /            | /index.txt     |
| /foo         | /foo.txt       |
| /bar/        | /bar/index.txt |

## Building

```
yarn
yarn build
```

The contents of the `dist` folder is what needs to be served.

## nginx configuration

```
server {
    server_name quackpond.nz;
    root /var/quackpond.nz;
    error_page 404 /index.html;
    location ~ \/$ {
        set $file "${request_filename}/index.txt";
        if (-f $file) {
            rewrite ^ /index.html break;
        }
    }
    location ~ \/[^\/\.]+$ {
        set $file "${request_filename}.txt";
        if (-f $file) {
            rewrite ^ /index.html break;
        }
    }
}
```
