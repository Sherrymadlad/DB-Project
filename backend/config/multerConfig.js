const multer = require('multer');

// Set up Multer to store file in memory (Buffer)
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

module.exports = upload;
