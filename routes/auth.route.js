const router = require('express').Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { uploadS3 } = require('../helpers/commonfile');

router.route('/login')
    .post(authCtrl.login);
router.route('/signup')
    .post(authCtrl.signup);

module.exports = router;