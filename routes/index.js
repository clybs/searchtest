const config = require('../config');
const express = require('express');
const router = express.Router();
const search = require('../models/search');

/* GET home page. */
router.get('/', function (req, res, next) {
    search.whatWhere(req)
        .then(data => res.render('index', data))
        .catch(() => res.render('index'));
});

module.exports = router;
