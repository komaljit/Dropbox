/**
 * New node file
 */
let request = require('request');
let express = require('express');
let assert = require("assert");
let http = require("http");

describe('http tests', function() {

    it('should update', function(done) {
        request.post('http://localhost:3000/users/updateuser', {
            form : {
                email : 'komaljit@gmail.com',
                password : 'komaljit',
                lastname: 'singh',
                contact:'111111111',
                interests:'playing football'
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