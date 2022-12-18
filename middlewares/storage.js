const multer  = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage(
    {
        destination:(req, file, cb) => {
            cb(null, 'image');
        },
        filename: (req, file, cb) => {
            // console.log('storage', file);
            const mimeType = file.mimetype.split('/');
            const fileType = mimeType[1];
            // const fileName = `${file.originalname}.${fileType}`;
            const fileName = `${file.originalname}`;
            cb(null, fileName);
            // cb(null, file.originalname);
        }
    }
)




// const fileFilter = (req, file, cb) => {
//     const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
//     allowedMimeTypes.includes(file.mimeType) ? cb(null, true) :cb(null, false);
// }

const storage = multer({storage: diskStorage}).single('imgFile'); 

module.exports = storage;