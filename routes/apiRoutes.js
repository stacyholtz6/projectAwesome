var db = require(`../models`);
const passport = require(`../config/passport`);
const bodyParser = require(`body-parser`);
const upload = require(`../config/middleware/multer`);
const cloudinary = require(`cloudinary`);
require(`../config/cloudinary`);


module.exports = function (app) {
    app.post(`/api/signup`, (req, res) => {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then(() => {
            res.json(200).end();
        }).catch((err) => {
            res.json(err);
        });
    });

    app.post(`/login`, passport.authenticate(`local`, {
        successRedirect: `/`,
        failureRedirect: `/login`,
        failureFlash: true
    }), (req, res) => {
        
    });

    // add profile picture and profile name
    app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
  
    app.post(`/profile/image`, upload.single(`image`), async (req, res) => {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        res.send(result);
    });
    
};

