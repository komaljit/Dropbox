var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var crypto = require('crypto');
var fs = require('fs');


/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
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
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
   /* console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);*/
    return passwordData;
}

/* GET users listing. */
router.get('/', function (req, res) {
    console.log(req.query);
    var email=req.query.email;

    var userdetails={
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

    // check user already exists
    var getUser="select * from users where email='"+email+"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {

            if(results.length > 0){

                console.log("valid Login");

                //res.send({"result":result});
                userdetails.firstname=results[0].firstname;
                userdetails.lastname=results[0].lastname;
                userdetails.email=results[0].email;
                userdetails.contactno=results[0].contact;
                userdetails.interests=results[0].interests;
                userdetails.lastlogin=results[0].lastlogin;

                var getFiles="select distinct f.* from files f, userfiles u where u.email='"+email+"' " +
                                "and (f.filepath=u.filepath or u.filepath=f.fileparent)";
                console.log("Query is:"+getUser);

                mysql.fetchData(function(err,fileresults){
                    if(err){
                        throw err;
                    }
                    else
                    {

                        if(results.length > 0){

                            userdetails.files=fileresults;

                        }

                        var getUserLog="select * from userlog where email='"+email+"'";
                        console.log("Query is:"+getUserLog);

                        mysql.fetchData(function(err,userlogresults){
                            if(err){
                                throw err;
                            }
                            else
                            {
                                if(results.length > 0){
                                    userdetails.userlog=userlogresults;
                                }
                                console.log(userdetails);
                                res.send({"userdetails":userdetails, "status":201});
                            }

                        },getUserLog);
                    }

                },getFiles);

            }
            else {

                console.log("Invalid Login");
                res.status(401).json({message: "Login failed"});
            }
        }
    },getUser);

});


router.post('/', function (req, res) {
    var reqEmail = req.body.email;
    var reqPassword = saltHashPassword(req.body.password);
    // check user already exists
    var getUser="select * from users where email='"+reqEmail+"' and password='" + reqPassword +"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;

            res.send({status:401});
        }
        else
        {

            if(results.length > 0){
                req.session.email = reqEmail;
                console.log("valid Login");

                var insertUser="update users  set lastlogin = NOW() where email='"+reqEmail+"'";


                mysql.executeQuery(function(err){
                    if(err){
                        console.log("Error inserting last login....")
                    }
                    else
                    {
                        console.log("last login inserted....");
                        res.send({"status":201, "email" :reqEmail});
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
    var reqPassword = saltHashPassword(req.body.password);
    var reqfirstname = req.body.firstName;
    var reqlastname = req.body.lastName;
    var reqemail = req.body.email;
    //var reqcontact = req.body.contactNo;
   // var reqinterests = req.body.interests;
    var insertUser="insert into users (firstname, lastname, password, email) values ( '"+reqfirstname
        +"' ,'" + reqlastname +"','" +
        reqPassword+ "','" + reqemail+"')";

    console.log("Query is:"+insertUser);

    mysql.executeQuery(function(err){
        if(err){
            res.status(401).json({message: "SignUp failed"});
        }
        else
        {
            var fs = require('fs');
            var splitemail=reqemail.split('.')[0];
            var dir = './public/uploads/'+splitemail;

            if (!fs.existsSync(dir)){

                fs.mkdirSync(dir);
            }
            res.status(201).json({message: "User Details Saved successfully"});
        }
    },insertUser);
});



router.post('/updateuser', function (req, res) {
console.log(req.body)
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var contact = req.body.contactno;
    var interests = req.body.interests;
    var email = req.body.email;
    var updateUser="update users set firstname = "+"'"+ firstname+"'"+", lastname="+ "'"+lastname+"'"+", contact="+
        "'"+contact+"'"+", interests="+"'"+interests+"'"+" where email="+"'"+email+"'";

    console.log("Query is:"+updateUser);

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
