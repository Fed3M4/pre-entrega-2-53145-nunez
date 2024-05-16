import multer from 'multer';
import { __dirname } from '../utils.js';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname+'/public/uploads')
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({storage})