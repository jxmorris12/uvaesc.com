#!/bin/env node
// Jack Morris 06/26/16

var express = require('express');
var fs    = require('fs');

var App = function() {

  //  Scope.
  var self = this;

  /*  ================================================================  */
  /*  Helper functions.                         */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };

  /**
   * Store layout files in cache to be rendered with every HTML request.
   */
  self.createLayout = function() {
    self.Cache = {};
    self.Cache.HEAD = fs.readFileSync('layout/head.html');
    self.Cache.FOOT = fs.readFileSync('layout/foot.html');
    self.Cache.ERROR = fs.readFileSync('error.html');
    self.Cache.MAIN = {};
  }

  /**
   *  Create routes to handle all GET requests to server.
   */
  self.createRoutes = function() {
    self.app.get('/*', 
      function(req, res) {
        // Get path
        var path = req.path; // The path, like /*
        if(path == '/') {
          // render home
          path = '/index';
        } else if (path == '/index') {
          // redirect
          res.redirect('/');
          return;
        }
        // Look for HTML at path
        var fileNameToRender = confirmHTMLExtension(__dirname + '/html' + path);
        // Check cache, render from cache if possible
        if (self.Cache.MAIN[path]) {
          var data = self.Cache.MAIN[path];
          // Send back header
          res.writeHead(200, {'Content-Type': 'text/html'});
          // Send file HEAD
          res.write(self.Cache.HEAD);
          // Send file data
          res.write(data);
          // Send file FOOT
          res.write(self.Cache.FOOT);
          // End response
          res.end();
        } else {
          // Read from file
          fs.readFile(fileNameToRender, function (err, data) {
            if (err) {
              // This file does not exist - send error
              res.writeHead(404, {'Content-Type': 'text/html'});
              // Send 404 HTML
              res.write(self.Cache.ERROR);
              // End response
              res.end();
            }
            else {
              // Send back header
              res.writeHead(200, {'Content-Type': 'text/html'});
              // Send file HEAD
              res.write(self.Cache.HEAD);
              // Send file data
              res.write(data);
              // Send file FOOT
              res.write(self.Cache.FOOT);
              // End response
              res.end();
              // Store in cache
              // self.Cache.MAIN[path] = data;
            }
          });
        }
      }
    );
  }

  /*  ================================================================  */
  /*  App server functions (main app logic here).             */
  /*  ================================================================  */

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.app = express();

    // New call to compress content
    self.app.use(express.compress());

    // Call static content from /public folder
    self.app.use(express.static(__dirname + '/public'));

    // Handle all get routes
    self.createRoutes();

    // Load layout TOP and BOTTOM
    self.createLayout();
  };

  /**
   *  Initialize the sample application.
   */
  self.initialize = function() {
    self.setupVariables();

    // Create the express server and routes.
    self.initializeServer();
  };

  /**
   *  Start the server.
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
            Date(Date.now() ), self.ipaddress, self.port);
    });
  };


};   /*  End Application.  */

/* 
 * Helper function for taking a string that may end in '.html'
 * and returning a string that definitely ends in '.html'.
 */
 var confirmHTMLExtension = function(path) {
  var extension = '.html';
  var pathExtension = path.substr(path.length - extension.length);
  if(pathExtension != extension) {
    return path + extension;
  } else {
    return path;
  }
 }

/**
 *  main():  Main code.
 */
var app = new App();
app.initialize();
app.start();
