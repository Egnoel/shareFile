import express from 'express';
import multer from 'multer';
import { UploadApiResponse, v2 as cloudinary} from "cloudinary";
import File from '../models/File';
import https from 'https';
import nodemailer from 'nodemailer';
import createEmailTemplate from '../utils/createEmailTemplate';

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
    storage
})

router.post("/upload",upload.single("myFile") ,async(req, res) => {
    try {
        if(!req.file) return res.status(400).json({message:"No file uploaded"})
        let uploadedFile: UploadApiResponse = {} as UploadApiResponse;
        try {
            uploadedFile= await cloudinary.uploader.upload(req.file.path,{
                folder:"share",
                resource_type:"auto"
            })
        } catch (error) {
            console.log(error.message);
            res.status(400).json({message:"Cloudinary Error"})
            
        }
        const {originalname} = req.file;
        const {secure_url, bytes, format} = uploadedFile;
        const file = await File.create({
            filename:originalname,
            sizeInBytes:bytes,
            secure_url,
            format,
        })
        res.status(200).json({
            id:file._id,
            downloadLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
            url:file.secure_url
        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Server error :("})
    }
})

router.get("/:id",async(req,res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);
        if(!file) return res.status(404).json({message:"File not found"});
        const {filename, format, sizeInBytes} = file;
        return res.status(200).json({
            name:filename,
            sizeInBytes,
            format,
           id
        })
    } catch (error) {
        res.status(500).json({message:"Server error :("})
    }
})

router.get("/:id/download",async(req,res) => {
    try {
        const id = req.params.id;
        const file = await File.findById(id);
        if(!file) return res.status(404).json({message:"File not found"});
        https.get(file.secure_url,(fileStream)=>{fileStream.pipe(res);})
    } catch (error) {
        res.status(500).json({message:"Server error :("})
    }
});

router.post("/email",async(req, res)=>{
    const {id, emailFrom, emailTo} = req.body
    const file = await File.findById(id);
    if(!file) return res.status(404).json({message:"File not found"});

    let transporter = nodemailer.createTransport({
        //@ts-ignore
        host: process.env.SENDINBLUE_SMTP_HOST!,
        port: process.env.SENDINBLUE_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SENDINBLUE_SMTP_USER, // generated ethereal user
          pass: process.env.SENDINBLUE_SMTP_PASSWORD, // generated ethereal password
        },
      });

    const {filename,sizeInBytes} = file;
    const fileSize = `${(Number(sizeInBytes)/(1024*1024)).toFixed(2)} MB`
    const downloadLink= `${process.env.API_BASE_ENDPOINT_CLIENT}download/${id}`
    const mailOptions ={
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "File shared with you", // Subject line
        text: `${emailFrom} shared a file with you`, // plain text body
        html: createEmailTemplate(emailFrom,downloadLink,filename,fileSize), // html body
    }
    transporter.sendMail(mailOptions,async(error,info)=>{
        if(error){
            console.log(error);
            res.status(500).json({message:"Server error :("})
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        await file.save();
        return res.status(200).json({message:"Email sent"});
    })

})

export default router;