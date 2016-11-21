var express = require('express');
var prods = require('../modules/amazon-product-collection');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    prods.addItem("B0077QMWD8");
    prods.addItem("B0053163VG");
    prods.onAllLoaded(function(result){
        res.render('index', { title: 'Express', products: result.sorted_by.price });
    });
});

module.exports = router;
