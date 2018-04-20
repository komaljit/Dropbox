var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');
var mysql = require('./mysql');
var fs = require('fs');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        cb(null, file.originalname)
    }
});


var upload = multer({storage:storage});


router.get('/',  function (req, res) {
    console.log(req.query.filedata);
    var filedata=req.query.filedata;
    console.log(filedata);
    res.download(filedata.filepath, filedata.filename);
});


router.post('/delete', function (req, res) {
    console.log(req.body);
    var filename = req.body.file.filename;
    var isfile = req.body.file.isfile;
    var filepath= req.body.file.filepath;
    var email=req.body.email;

    var findAdmin="select * from userfiles where email='"+email+"' and filepath='"+filepath+"' and admin='T'";
    console.log("Query is:"+findAdmin);

    mysql.fetchData(function(err,results) {
        if (err) {
            throw err;

            res.send({status: 401});
        }
        else {
            if (results.length > 0) {
                var deleteUserFile = "delete from userfiles where filepath = '" + filepath + "'";
                console.log("Query deleteFile is:" + deleteUserFile);

                var execQuery = 'T';
                if (isfile === 'F') {
                    try {
                        fs.rmdirSync(filepath)
                    }
                    catch (err) {
                        execQuery = 'F';
                        res.send({"status": 401, "message": "Folder is not empty!"});
                    }

                }
                else {
                    fs.unlinkSync(filepath);

                }

                if (execQuery === 'T') {
                    mysql.executeQuery(function (err) {
                        if (err) {
                            res.send({"status": 401});
                        }
                        else {
                            var deleteFile = "delete from files where filepath = '" + filepath + "'";
                            console.log("Query deleteFile is:" + deleteFile);


                            mysql.executeQuery(function (err) {
                                if (err) {
                                    console.log("Error: data not deleted from userfiles")
                                }
                                else {
                                    console.log("data deleted from userfiles")

                                }
                            }, deleteFile);


                            var userlog = "insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '" + filename
                                + "' ,'" + filepath + "','" + isfile + "','" + email + "','" +
                                "File Delete" + "',NOW())";


                            mysql.executeQuery(function (err) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    console.log("userlog inserted....")


                                }
                            }, userlog);


                        }
                        res.send({"status": 204, message: "Deleted Successfully!"});
                    }, deleteUserFile);
                }
            }
            else {
                res.send({"status": 402, message: "You need admin rights to delete the file/folder!"});
            }
        }
    },findAdmin);
});

router.post('/upload', upload.single('mypic'), function (req, res) {

    var splitedemail = req.body.email.split('.')[0];
    console.log(req.body);
    var filename = req.file.filename;
    var filepath = './public/uploads/'+splitedemail+'/'+req.file.filename;
    var fileparent = req.body.fileparent;
    var isfile = req.body.isfile;

    if(fileparent)
        filepath=fileparent+'/'+filename;
    var filedata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile
    };


    //copying a file to user's folder
    fs.createReadStream('./public/uploads/'+req.file.filename).pipe(fs.createWriteStream(filepath));

    // check user already exists
    var insertFile="insert into files (filename, filepath, fileparent, isfile) values ( '"+filename
        +"' ,'" + filepath+"' ,'" + fileparent+"','" + isfile+"')";

    console.log("Query is:"+insertFile);


    mysql.executeQuery(function(err){
        if(err){
            console.log(err);
            res.send({"status":401});
        }
        else
        {
            var insertUserFile="insert into userfiles  (filepath, email, admin)  values ( '"+filepath+"' ,'" + req.body.email+"' ,'T')";
            console.log("Query insertUserFile is:"+insertUserFile);


            mysql.executeQuery(function(err){
                if(err){
                    console.log(err);
                   console.log("Error: data not inserted in userfiles")
                }
                else
                {
                    console.log("data inserted in userfiles")

                }
            },insertUserFile);


            var userlog="insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '"+filename
                +"' ,'" + filepath +"','"+ isfile +"','" + req.body.email +"','" +
                "File Upload"+ "',NOW())";


            mysql.executeQuery(function(err){
                if(err){
                    console.log(err)
                    console.log("Error inserting userlog....")
                }
                else
                {
                    console.log("userlog inserted....")

                }
            },userlog);
            console.log(filedata);

            res.send({"filedata":filedata, "status":204});
        }
    },insertFile);



});


router.post('/makefolder', function (req, res) {
    console.log(req.body);
    var splitedemail = req.body.email.split('.')[0];
    var filename = req.body.folder.foldername;
    var filepath = './public/uploads/'+splitedemail+'/'+filename;
    var fileparent = req.body.folder.fileparent;
    var isfile = req.body.folder.isfile;
    var folderdata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile
    };

    var dir = './public/uploads/'+splitedemail+'/'+filename;

    if (!fs.existsSync(dir)){

        fs.mkdirSync(dir);
    }
    // check user already exists
    var insertFile="insert into files (filename, filepath, fileparent, isfile) values ( '"+filename
        +"' ,'" + filepath+"' ,'" + fileparent+"','" + isfile+"')";

    console.log("Query is:"+insertFile);


    mysql.executeQuery(function(err){
        if(err){
            console.log(err);
            res.send({"status":401});
        }
        else
        {
            var insertUserFile="insert into userfiles  (filepath, email, admin)  values ( '"+filepath+"' ,'" + req.body.email+"' ,'T')";
            console.log("Query insertUserFile is:"+insertUserFile);


            mysql.executeQuery(function(err){
                if(err){
                    console.log(err);
                    console.log("Error: data not inserted in userfiles")
                }
                else
                {
                    console.log("data inserted in userfiles")

                }
            },insertUserFile);

            var userlog="insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '"+filename
                +"' ,'" + filepath +"','"+ isfile +"','" + req.body.email +"','" +
                "Make Folder "+ "',NOW())";


            mysql.executeQuery(function(err){
                if(err){
                    console.log("Error inserting userlog....")
                }
                else
                {
                    console.log("userlog inserted....")

                }
            },userlog);

            res.send({"folderdata":folderdata, "status":204});
        }
    },insertFile);
});


router.post('/sharefile', function (req, res) {

    console.log(req.body);
    var userEmail=req.body.email;
    var shareEmail= req.body.shareEmail;
    var file=req.body.filedata;
    var filename = file.filename;
    var filepath = file.filepath;
    var fileparent = file.fileparent;
    var isfile = file.isfile;
    var splitedemail = shareEmail.split('.')[0];
   /* var newfilepath = './public/uploads/' + splitedemail + '/' + file.filename;

    console.log(newfilepath)
    // select * from files where fileparent=filpath
    //copying a file to user's folder

    fs.createReadStream(file.filepath).pipe(fs.createWriteStream(newfilepath));
    // check user already exists
    var insertFile = "insert into files (filename, filepath, fileparent, isfile) values ( '" + filename
        + "' ,'" + newfilepath + "' ,'" + fileparent + "','" + isfile + "')";

    console.log("Query is:" + insertFile);


    mysql.executeQuery(function (err) {
        if (err) {
            console.log("Error inserting in files...")
           // console.log(err)
            res.send({"status": 401, "message": "File already shared with the user!"});
        }
        else {

   */
        var insertUserFile = "insert into userfiles  (filepath, email)  values ( '" + filepath + "' ,'" + shareEmail + "')";
        console.log("Query insertUserFile is:" + insertUserFile);


        mysql.executeQuery(function (err) {
            if (err) {
                res.send({"status": 401, "message": "Error sharing file with the user!"});
            }
            else {

                console.log("data inserted in userfiles")

                var userlog = "insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '" + filename
                    + "' ,'" + filepath + "','" + isfile + "','" + userEmail + "','" +
                    "File Shared with " + shareEmail + "',NOW())";


                mysql.executeQuery(function (err) {
                    if (err) {
                        console.log("Error inserting userlog....")
                    }
                    else {

                        console.log("userlog inserted....");
                        res.send({"status": 201, "message": "File shared with the user!"});
                    }
                }, userlog);

            }
        }, insertUserFile);
/*

    }
}, insertFile);
*/

});


module.exports = router;
