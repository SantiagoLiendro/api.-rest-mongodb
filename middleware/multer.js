import { customRandom, random, urlAlphabet } from "nanoid";

import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nano = customRandom(urlAlphabet, 10, random)

const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${nano()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}


// Pasar la configiguración y el campo
const upload = multer(configuracionMulter).single('imagen');

const subirAcrihvo = async (req, res, next) => {
    // console.log(__dirname + '../../uploads/')
    upload(req, res, function (err) {
        if (err) {
            res.json({ msg: err })
        }
        return next();
    })
}

export default subirAcrihvo
