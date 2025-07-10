/*const express = require('express');
const app=express();
const bodyParser = require('body-parser')
const multer =require ('multer');
const path =require('path')

const cors = require("cors");
app.use(cors());



app.use(express.static('./public'));
app.use( bodyParser.json());

//use of multer package
let storage = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null, './public/images')
    },
    filename:(req, file, cb)=>{
        cb(null, file.fieldname + '_'+ Date.now() + path.extname(file.originalname))
    }
})

let maxSize = 2* 1000 * 1000;
let upload= multer({
    storage : storage,
    limits : {
        fileSize : maxSize

    }
});

let uploadHandler = upload.single('file');

app.post('/upload', (req,res)=>{
    uploadHandler(req, res, function(err){
        if(err instanceof multer.MulterError){
            if(err.code == 'LIMIT_FILE_SIZE'){
                res.status(400).json({message : "Maximum file size is 20mb."})
            }
            return;

        }

        if(!req.file){
            res.status(400).json({message : "No file!"});

        }else{
            res.status(200).json( { message : "uploaded to the Server!"})
        }

    })
})


const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})  


    const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require("cors");

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());

// Dynamic storage with date & time folders
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const folderName = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
    const uploadPath = `./public/images/${folderName}`;

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

let maxSize = 20 * 1000 * 1000; // 20 MB
let upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
});

let uploadHandler = upload.single('file');

app.post('/upload', (req, res) => {
  uploadHandler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "Maximum file size is 20mb." });
      }
      return;
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file!" });
    }

    const relativePath = req.file.destination.replace('public/', '');

    res.status(200).json({
      message: "Uploaded to the server!",
      filename: req.file.filename,
      folder: relativePath
    });
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});  */



const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Create images folder if it doesn't exist
const uploadDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Name file like: file_1679658300123.jpg
    const uniqueName = `file_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Limit file size to 2MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Success response includes filename and folder for frontend to use
  res.status(200).json({
    message: "Uploaded to the Server!",
    filename: req.file.filename,
    folder: "images",
  });
});

// Use dynamic port assigned by Render or fallback to 8000 locally
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

