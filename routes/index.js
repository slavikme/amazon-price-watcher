var express = require('express');
var prods = require('../modules/amazon-product-collection');
var d3 = require('d3-queue');

var router = express.Router();

var asins = ["B0077QMWD8","B0053163VG","B0038BAHEC","B0038BHZPG","B0038B8IE8","B00TSWO3SG","B00D9J7EFI","B0053163KM","B0038BCN08","B00BTWEGBW","B00JFIDTXS","B0080H4FSS","B0077QLOH8","B00TAG9Q14","B0080H669O","B0077QM0TE","B00TAG7TKO","B0077QJ5EC","B0077V4SD0","B0038BAHGK","B0038BG2T6","B0077QMIG4","B0077QKR8A","B0077QHEKY","B00JFIFNZ0","B00D9J7F4I","B0085WQLK8","B00KDGX0EY","B00D9J7EC6","B00AK0M6HK","B00TSWOEOY","B0053163A2","B00C7M3SC6","B0038BAHI8","B00AK0M7S8","B0077QJW8Q","B0038BCN44","B0038BCMYU","B0038B8IDO","B00D9J7F2U","B0038B8ICU","B00KDGWWRA","B0085W9H72","B00D9J7EGM","B00D9J7FUM","B0038BHZW4","B00KDGX4CC","B00KDGX4EK","B00BTWEGKI","B00D9J7FSE","B00KDGX0JO","B0038BE996","B00D9J7FSY","B00D9J7F2A","B00EEC5DE8","B00EEC5DCK","B00ISIO0MK","B00KDGX0L2","B00AD8B88C","B00KDGX4BS","B00S35JFQE","B00KDGX4CM","B0038BHZS8","B00KDGX0IA","B00TSWNH5G","B00AK0M8FU","B00TSWNRUQ","B00TSWNQZC","B00IU6DVDY","B0077QHZGM","B0038BE99Q","B00EPGCY04","B00ISITVWO","B00AK0M6DO","B00C7M3TN4","B007ZFEH5C","B00TSWO3E0","B00TSWNSKU","B0038BE94Q","B00TSWNRJ2","B007ZFF4HC","B00TSWOFH0","B00TJ4RL1O","B00EEC5D0C","B00TSWNR9M","B00C7M3SAS","B007ZFQBMY","B00TSWNRH4","B0077QIKZC","B00CG4147G","B00SXG4CNO","B00S35JGSQ","B00KDGX4B8","B00KDGXBXY","B00D9J7ED0","B00KDGX7KG","B00D9J7F34","B00D9J7FT8","B00C7M3S9E","B007YASQ32","B00TEOWGLO","B00TSWO3LI","B00TSWNROC","B00BTWE81A","B01C5TFAD0","B00TSWO3G8","B00TSWO2YQ","B00EPGDFDE","B00D9J7FUC","B00TSWOEJ4","B01C5TFAAI","B01C5TF9PO","B007ZFGBCE","B00J0KBXBQ","B011OHA5YI","B011OHB8LW","B00KDGX7JW","B00TSWNG5C","B00U79OXBQ","B00TSWO462","B0107NDF24","B011OHBHAY","B00KDGX0HQ","B0107NDK92","B00TSWMWES","B00AHLUJLM","B009GXVXOY","B01E6T7UQW","B01K7KRP82","B01CQQHNIC","B00EEC5D6Q"];

/* GET home page. */
router.get('/', function(req, res, next) {
    multi = [];
    asins.forEach(function(asin, index){
        multi.push(asin);
        if ( index % 10 == 9 || index == asins.length-1 )
        {
            prods.addItem(multi.join(","));
            multi = [];
        }
    });
    prods.onAllLoaded(function(result){
        res.render('index', { title: 'Express', products: result.sorted_by.price });
    });
    prods.onLoadError(function(error, asin){
        // console.error({});
    })
});

// var q = d3.queue(2);
// in_process = 0;
// var time = (new Date()).getTime();
// var items = {a:200,b:700,c:300,d:1000,e:100,f:500,g:300}; //a,c,b,e,f,d,g
// var handler = function(name, delay, cb){ setTimeout(function(){ console.log((new Date()).getTime()-time + ": " + name); cb(null,name); in_process--; if ( !in_process ) { console.log("Queue is empty!"); } },delay); };
// for ( var name in items )
// {
//     in_process++;
//     q.defer(handler, name, items[name]);
// }
// setTimeout(function(){
//     in_process++;
//     q.defer(handler, "h", 50);
// }, 1650);


module.exports = router;
