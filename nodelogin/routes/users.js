const express = require('express');
const router = express.Router();
const mysql = require('./mysql');
const crypto = require('crypto');
const fs = require('fs');
const sql = require('mysql');


/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */


const sha512 = function(password, salt){
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */

function saltHashPassword(userpassword) {
    let salt = genRandomString(16); /** Gives us salt of length 16 *;
   /* console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);*/
    return sha512(userpassword, salt);
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.email !==  req.query.email) {
        return next();
    };
    let email=req.query.email;
    let userdetails={
        firstname: '',
        lastname: '',
        password: '',
        email: '',
        contactno: '',
        interests:'',
        lastlogin:'',
        files :[],
        groups: [],
        userlog:[]
    };

    // check user exists or not
    let getUser="select * from users where email=" + sql.escape(email);
    mysql.fetchData(function(err,results){
        if (err) {
               return next();
           }
        else {
            if(results.length > 0){
                userdetails.firstname=results[0].firstname;
                userdetails.lastname=results[0].lastname;
                userdetails.email=results[0].email;
                userdetails.contactno=results[0].contact;
                userdetails.interests=results[0].interests;
                userdetails.lastlogin=results[0].lastlogin;
                let getFiles="select distinct f.* from files f, userfiles u where u.email="+sql.escape(email) +
                                "and (f.filepath=u.filepath or u.filepath=f.fileparent)";
                // console.log("Query is:"+getUser);
                mysql.fetchData(function(err,fileresults){
                    if (err) {
                        return next();
                    }
                    else {
                        if(results.length > 0){
                            userdetails.files=fileresults;
                        }
                        let getUserLog="select * from userlog where email="+sql.escape(email);
                        console.log("Query is:"+getUserLog);
                        mysql.fetchData(function(err,userlogresults){
                            if (err) {
                                return next();
                            }
                            else {
                                if(results.length > 0){
                                    userdetails.userlog=userlogresults;
                                }
                                console.log(userdetails);
                                res.status(200).send({"userdetails":userdetails});
                            }
                        },getUserLog);
                    }
                },getFiles);
            }
            else {
                return next();
            }
        }
    },getUser);
});

// middleware for handling invalid requests
router.use('/', function(req, res) {
    res.status(400).json({"error":"Invaid request"});
    return res;
});


router.post('/', function (req, res) {
    let reqEmail = req.body.email;
    let reqPassword = saltHashPassword(req.body.password);
    // check user already exists
    let getUser="select * from users where email="+sql.escape(Email)+" and password="+ sql.escape(reqPassword);
    // console.log("Query is:"+getUser);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                console.log("valid Login");
                let insertUser="update users  set lastlogin = NOW() where email="+sql.escape(reqEmail);
                mysql.executeQuery(function(err){
                    if(err){
                        console.log("Error inserting last login....")
                    }
                    else
                    {
                        console.log("last login inserted....");
                        req.session.email = reqEmail;
                        res.send({"status":204});
                    }
                },insertUser);
            }
            else {
                console.log("Invalid Login");
                res.send({status:401});
            }
        }
    },getUser);
});

router.post('/signup', function (req, res) {

    if ((typeof req.body.firstName || typeof req.body.lastName || typeof req.body.email) === 'undefined'){
        return res.status(401).send("missing information");
    }

    let reqPassword = saltHashPassword(req.body.password);
    let reqfirstname = req.body.firstName;
    let reqlastname = req.body.lastName;
    let reqemail = req.body.email;
    //var reqcontact = req.body.contactNo;
    // var reqinterests = req.body.interests;
    let insertUser="insert into users (firstname, lastname, password, email) values ("+sql.escape(reqfirstname)
        +"," + sql.escape(reqlastname) +"," + sql.escape(toString(reqPassword))+ "," + sql.escape(reqemail)+")";
    console.log("Query is:"+insertUser);

    mysql.executeQuery(function(err){
        if(err){
            res.status(401).json({message: "SignUp failed"});
        }
        else
        {
            let fs = require('fs');
            let splitemail=reqemail.split('.')[0];
            let dir = './public/uploads/'+splitemail;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            res.status(201).json({message: "User Details Saved successfully"});
        }
    },insertUser);
});

router.post('/updateuser', function (req, res) {
    console.log(req.body);
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let contact = req.body.contactno;
    let interests = req.body.interests;
    let email = req.body.email;
    let updateUser="update users set firstname = "+ sql.escape(firstname)+",lastname="+ sql.escape(lastname)+", contact="+
        sql.escape(contact)+", interests="+sql.escape(interests)+" where email="+sql.escape(email);
    // console.log("Query is:"+updateUser);
    mysql.executeQuery(function(err){
        if(err){
            console.log(err);
            res.status(401).send();
        }
        else
        {
            res.status(201).send();
        }
    },updateUser);
});

//Logout the user - invalidate the session
router.post('/logout', function (req, res) {
    req.session.destroy();
    console.log('Session destroyed');
    res.status(201).send();
});

module.exports = router;
