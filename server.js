#!/bin/env node
// Jack Morris 06/26/16

var express = require('express');
var fs      = require('fs');

var App = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    /**
     *  Create routes to handle all GET requests to server.
     */
    self.createRoutes = function() {
        self.app.get('/*', 
            function(req, res) {
                // Get path
                var path = req.path; // The path, like /*
                if(path == '/') {
                    path = '/index.html';
                }
                // Look for HTML at path
                var fileNameToRender = __dirname + '/html' + path;
                fs.readFile(fileNameToRender, function (err, data) {
                  if (err) {
                    // This file does not exist, send error
                    res.send('404 not found');
                  }
                  else {
                    // Send back file
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                  }
                });
            }
        );
    }

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
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

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var app = new App();
app.initialize();
app.start();