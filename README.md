# uvaesc.com

## Set up node

Run `brew install node` or install nodejs from online.

## Set up node package manager

If you didn't install using homebrew, install that from online

## Install things locally

Clone this repo, enter it and run `npm install`

## Start the server

Start things using `node server`, open your browser, and go to http://localhost:8080/

## for making live HTML edits

You may notice that if you edit an HTML page you won't be able to see your changes. to disable server HTML caching, comment out this line in `server.js`: `self.Cache.MAIN[path] = data;`. Remember to uncomment the line when you're ready to put up a pull request.

## deploy the website

Push to Openshift (not Github) to actually deploy to uvaesc.com

## For setting this up with OpenShift

The OpenShift `nodejs` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs
