/**
 * New node file
 */
var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('http tests', function() {

    it('should login', function(done) {
        request.post('http://localhost:3000/users/', {
            form : {
                email : 'kimtani90@gmail.com',
                password : 'dishkim02'
            }
        }, function(error, response, body) {
            console.log(response.status);
            console.log(response.statusCode);
            console.log("cccccccccccc");
            //console.log(body);
            assert.equal(200, response.statusCode);
            done();
        });
    });
});