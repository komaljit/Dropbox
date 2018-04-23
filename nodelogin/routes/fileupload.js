const express = require('express');
const router = express.Router();
const multer = require('multer');
const glob = require('glob');
const mysql = require('./mysql');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        cb(null, file.originalname)
    }
});


const upload = multer({storage:storage});


router.get('/',  function (req, res) {
    console.log(req.query.filedata);
    let filedata=req.query.filedata;
    console.log(filedata);
    res.download(filedata.filepath, filedata.filename);
});


router.post('/delete', function (req, res) {
    console.log(req.body);
    let filename = req.body.file.filename;
    let isfile = req.body.file.isfile;
    let filepath= req.body.file.filepath;
    let email=req.body.email;

    let findAdmin="select * from userfiles where email='"+email+"' and filepath='"+filepath+"' and admin='T'";
    console.log("Query is:"+findAdmin);

    mysql.fetchData(function(err,results) {
        if (err) {
            throw err;
        }
        else {
            if (results.length > 0) {
                let deleteUserFile = "delete from userfiles where filepath = '" + filepath + "'";
                console.log("Query deleteFile is:" + deleteUserFile);

                let execQuery = 'T';
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
                            let deleteFile = "delete from files where filepath = '" + filepath + "'";
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

    let splitedemail = req.body.email.split('.')[0];
    console.log(req.body);
    let filename = req.file.filename;
    let filepath = './public/uploads/'+splitedemail+'/'+req.file.filename;
    let fileparent = req.body.fileparent;
    let isfile = req.body.isfile;

    if(fileparent)
        filepath=fileparent+'/'+filename;
    let filedata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile
    };


    //copying a file to user's folder
    fs.createReadStream('./public/uploads/'+req.file.filename).pipe(fs.createWriteStream(filepath));

    // check user already exists
    let insertFile="insert into files (filename, filepath, fileparent, isfile) values ( '"+filename
        +"' ,'" + filepath+"' ,'" + fileparent+"','" + isfile+"')";

    console.log("Query is:"+insertFile);


    mysql.executeQuery(function(err){
        if(err){
            console.log(err);
            res.send({"status":401});
        }
        else
        {
            let insertUserFile="insert into userfiles  (filepath, email, admin)  values ( '"+filepath+"' ,'" + req.body.email+"' ,'T')";
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


            let userlog="insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '"+filename
                +"' ,'" + filepath +"','"+ isfile +"','" + req.body.email +"','" +
                "File Upload"+ "',NOW())";


            mysql.executeQuery(function(err){
                if(err){
                    console.log(err);
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
    let splitedemail = req.body.email.split('.')[0];
    let filename = req.body.folder.foldername;
    let filepath = './public/uploads/'+splitedemail+'/'+filename;
    let fileparent = req.body.folder.fileparent;
    let isfile = req.body.folder.isfile;
    let folderdata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile
    };

    let dir = './public/uploads/'+splitedemail+'/'+filename;

    if (!fs.existsSync(dir)){

        fs.mkdirSync(dir);
    }
    // check user already exists
    let insertFile="insert into files (filename, filepath, fileparent, isfile) values ( '"+filename
        +"' ,'" + filepath+"' ,'" + fileparent+"','" + isfile+"')";

    console.log("Query is:"+insertFile);


    mysql.executeQuery(function(err){
        if(err){
            console.log(err);
            res.send({"status":401});
        }
        else
        {
            let insertUserFile="insert into userfiles  (filepath, email, admin)  values ( '"+filepath+"' ,'" + req.body.email+"' ,'T')";
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

            let userlog="insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '"+filename
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
    let userEmail=req.body.email;
    let shareEmail= req.body.shareEmail;
    let file=req.body.filedata;
    let filename = file.filename;
    let filepath = file.filepath;
    let fileparent = file.fileparent;
    let isfile = file.isfile;
    let splitedemail = shareEmail.split('.')[0];
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
        let insertUserFile = "insert into userfiles  (filepath, email)  values ( '" + filepath + "' ,'" + shareEmail + "')";
        console.log("Query insertUserFile is:" + insertUserFile);


        mysql.executeQuery(function (err) {
            if (err) {
                res.send({"status": 401, "message": "Error sharing file with the user!"});
            }
            else {

                console.log("data inserted in userfiles");

                let userlog = "insert into userlog (filename, filepath, isfile, email, action, actiontime) values ( '" + filename
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
