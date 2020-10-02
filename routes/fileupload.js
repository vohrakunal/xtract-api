const express = require("express");



const { v4: uuidv4 } = require('uuid');

// express router
const router = express.Router();

// Models
const {
    Users    
} = require("../models/users")

const {
    Files
} = require("../models/files")

// Other Lib
const fs = require('fs');
const pdf = require('pdf-parse');
const { parse } = require("path");


const parsePdf = async(pdfid) =>{
    let dataBuffer = fs.readFileSync(`${__dirname}/.uploads/${pdfid}`);

    return await pdf(dataBuffer);


}


router.post('/uploadfile', async(req,res)=>{
    if(!req.files){
        return res.status(500).send({err: "No file Uploaded"});

    }

    const file = req.files.file;
    const fileName = uuidv4().split("-").join("");
    file.mv(`${__dirname}/.uploads/${fileName}.pdf`, async(err)=>{
        if(err){
            return res.send({err:err}).status(500)
        }
    
    let File = new Files({
        filePath: fileName+".pdf",
        userId: req.payload.id
    })
    const savedFileData = await File.save()

    let user = await Users.findOne({_id: req.payload.id});
    
    user.files.push({fileId: savedFileData._id})
    
    await user.save();

    let pdfData = await parsePdf(fileName+'.pdf');

    return res.send({msg:"Success", data:pdfData}).status(200);

    })

});
 
router.get('/getallpdfs', async(req,res)=>{

    const user = await Users.findOne({_id:req.payload.id}, 'files');


    let allUserFiles = []
    console.log(user.files)
    if(user.files){
        for(file of user.files){
            let file_model = await Files.findOne({_id: file.fileId}, 'filePath');
            let fileData = {};
            fileData.date = file.timeStamp
            fileData.name = file.ori_name;
            fileData.parsedData = await parsePdf(file_model.filePath);
            allUserFiles.push(fileData);
        }
    
    }
    
    return res.send({prevUploads: allUserFiles}).status(200);

})

module.exports = router;


