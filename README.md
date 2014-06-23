Meteor Rider
============

Built on top of [zeroasterisk/MeteorRider](https://github.com/zeroasterisk/MeteorRider).

Meteor Rider lets you run Meteor apps in a Cordova/Phonegap project by hijacking
the main index.html. This seems to be the most used method to create
Meteor apps in Cordova as of yet.

Pre-requisites
==============

You need to have a Cordova project created with the
[cordova-cli](https://github.com/apache/cordova-cli) utiliy.

Usage
=====

- `npm install meteor-rider`
- Go to the root of your cordova project and run `meteorRider`
- This will copy and set up the necessary files.
- You will be asked for the url of the Meteor App. Make sure to enter it without
  the trailing slash.

You can test it by running `cordova platform add ios` then `cordova build ios`,
open the xcode project under `platforms/ios` and run it. It should now display a
generic html page before loading the Meteor app.


