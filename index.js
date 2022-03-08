const express = require('express');
const app = express();
const port = process.env.PORT || 3010;
const bodyParser = require("body-parser");
const cors = require('cors');

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    if (req.methods === 'OPTIONS'){
        cosole.log({options: req});
        res.sendStatus(204)
    }
    next();
});

const server = app.listen(port, function () {
    //console.log('Server is running on: ' + port);
});

app.get('/', function (request, response) {
    response.send({});
});

// Retrieves a single image from the Gallery Api
app.use('/api/image', require('./routes/gallery/gallery_image'));

// Retrieve all images in a specific named Gallery / Category
app.use('/api/gallery/category', require('./routes/gallery/gallery_category'));

// Post / Upload an Image to your Gallery
// Retrieve a paginated list of images from your Gallery
app.use('/api/gallery', require('./routes/gallery/gallery'));

app.use('/api/authenticate', require('./routes/authentication/authenticate'));

