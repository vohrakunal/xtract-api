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
    
    user.files.push({fileId: savedFileData._id, ori_name: file.name})
    
    await user.save();

    let pdfData = await parsePdf(fileName+'.pdf');

    return res.send({msg:"Success", data:pdfData}).status(200);

    })

});
 
router.get('/getallpdfs', async(req,res)=>{

    const user = await Users.findOne({_id:req.payload.id}, 'files');


    let allUserFiles = []
    if(user.files){
        for(file of user.files){
            let fileData ={}
            fileData.id = file._id
            fileData.date = file.timeStamp
            fileData.name = file.ori_name;
            allUserFiles.push(fileData);
        }
    
    }
    
    return res.send(allUserFiles).status(200);

});

router.get('/getspecificpdf/:id', async(req,res)=>{

    const user = await Users.findOne({_id:req.payload.id}, 'files');
    if(user.files){
        for(file of user.files){
       
            if(file._id.toString() == req.params.id){
                let file_model = await Files.findOne({_id: file.fileId}, 'filePath');
                return res.send(await parsePdf(file_model.filePath)).status(200)
            }
        }
    }
    res.send({err:"No File Found"}).status(400);
})

router.get("/getUserDetails", async(req,res)=>{
    const user = await Users.findOne({_id: req.payload.id}, 'name userEmail');

    if(user){
        return res.send(user).status(200);
    }
    return res.send({err:"No User Found"}).status(400);

  })
  
module.exports = router;


