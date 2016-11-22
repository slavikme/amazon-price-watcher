/**
 * Created by dna on 21/11/2016.
 */

const amazon = require('amazon-product-api');
const ini = require('node-ini');
const sleep = require('sleep');
const d3 = require('d3-queue');

var AmazonProduct = function(product_object)
{
    var self = this;
    var product = product_object;

    self.asin = product.ASIN[0];
    self.price = parseInt(product.Offers[0].Offer[0].OfferListing[0].Price[0].Amount[0]);
    self.title = product.ItemAttributes[0].Title[0];
    self.rank = parseInt(product.SalesRank[0]);
    self.price_formatted = product.Offers[0].Offer[0].OfferListing[0].Price[0].FormattedPrice[0];
    self.price_currency_code = product.Offers[0].Offer[0].OfferListing[0].Price[0].CurrencyCode[0];
    self.link = product.DetailPageURL[0];

    self.getASIN = function() { return self.asin; };
    self.getPrice = function() { return self.price; };
    self.getPriceFormatted = function() { return self.price_formatted; };
    self.getPriceCurrencyCode = function() { return self.price_currency_code; };
    self.getTitle = function() { return self.title; };
    self.getRank = function() { return self.rank; };
    self.getLink = function() { return self.link; };
};

var AmazonProductCollection = function(access_key, secret_key, assoc_tag)
{
    var RESPONSE_GROUP = 'Accessories,AlternateVersions,BrowseNodes,EditorialReview,Images,ItemAttributes,ItemIds' +
        ',Large,Medium,OfferFull,OfferListings,Offers,OfferSummary,PromotionSummary,Reviews,SalesRank,Similarities' +
        ',Small,Tracks,Variations,VariationImages,VariationMatrix,VariationOffers,VariationSummary';

    var self = this;
    var client = amazon.createClient({
        awsId: access_key,
        awsSecret: secret_key,
        awsTag: assoc_tag
    });

    var queue = d3.queue(5);
    var sorted_by = {
        price: [],
        title: [],
        rank: []
    };
    var in_process = 0;

    var callbacks = {
        'all-loaded': [],
        'load-error': []
    };

    var processItem = function(asin, callback)
    {
        // console.log("Processing " + asin);
        in_process++;
        client.itemLookup({idType:'ASIN', itemId:asin, responseGroup:RESPONSE_GROUP}).then(function(results){
            callback();
            in_process--;
            // console.log("Processed " + asin + " (" + in_process +")");
            results.forEach(function(result){
                try {
                    var product = new AmazonProduct(result);
                    addToSortList(product);
                } catch ( e ) {
                    console.log(e);
                }
            });
            !in_process && triggerCallbacks('all-loaded', [{sorted_by:sorted_by}]);
        }).catch(function(err){
            err = err[0] ? err[0] : err;
            if ( !err.Error ) {
                throw "Error (ASIN." + asin + "): " + JSON.stringify(err);
            }
            var error_code = err.Error[0].Code[0];
            var error_message = err.Error[0].Message[0];
            console.error("Load Error for ASIN." + asin + ": [" + error_code + "] " + error_message);
            triggerCallbacks('load-error', [err, asin]);
            callback();
            queue.defer(processItem, asin);
            in_process--;
        });
    };

    self.addItem = function(asin){
        // var coll_idx = collection_process.length;
        // var promise = processItem(asin,coll_idx);
        // collection_process.push(promise);
        // asins[asin] = coll_idx;
        // return promise;
        queue.defer(processItem, asin);
    };

    self.on = function(name, callback)
    {
        return callbacks[name].push(callback) - 1;
    };

    self.off = function(name, id_or_callback)
    {
        if ( id_or_callback == undefined )
        {
            callbacks[name] = [];
        }
        else if ( typeof id_or_callback == 'function' )
        {
            for ( var i=0, len=callbacks[name].length; i<len; i++ )
            {
                if ( id_or_callback === callbacks[name][i] )
                {
                    callbacks[name].splice(i, 1);
                    break;
                }
            }
        }
        else if ( typeof id_or_callback == 'number')
        {
            callbacks[name].splice(id_or_callback, 1);
        }
    };

    self.onAllLoaded = function(callback)
    {
        return self.on('all-loaded', callback);
    };

    self.offAllLoaded = function(id_or_callback)
    {
        return self.off('all-loaded', id_or_callback);
    };

    self.onLoadError = function(callback)
    {
        return self.on('load-error', callback);
    };

    self.offLoadError = function(id_or_callback)
    {
        return self.off('load-error', id_or_callback);
    };

    var triggerCallbacks = function(name, params)
    {
        callbacks[name].forEach(function(callback){
            callback.apply(self, params);
        });
    };

    var addToSortList = function(product)
    {
        if ( !(product instanceof AmazonProduct) )
        {
            throw "Product object supplied to 'addToSortList' function must be an instance of AmazonProduct class";
        }

        for ( var i = 0, len = sorted_by.price.length, done_with = {price:false, title:false, rank:false};
              i<len; i++ )
        {
            if ( !done_with.price && sorted_by.price[i].getPrice() > product.getPrice() )
            {
                sorted_by.price.splice(i, 0, product);
                done_with.price = true;
            }
            if ( !done_with.title && sorted_by.title[i].getTitle() > product.getTitle() )
            {
                sorted_by.title.splice(i, 0, product);
                done_with.title = true;
            }
            if ( !done_with.rank && sorted_by.rank[i].getRank() < product.getRank() )
            {
                sorted_by.rank.splice(i, 0, product);
                done_with.rank = true;
            }
        }

        !done_with.price && sorted_by.price.push(product);
        !done_with.title && sorted_by.title.push(product);
        !done_with.rank && sorted_by.rank.push(product);
    };
};

var cfg = ini.parseSync('.aws/credentials');
if ( cfg )
{
    var access_key = cfg.default.aws_access_key_id;
    var secret_key = cfg.default.aws_secret_access_key;
    var assoc_tag = cfg.default.associate_tag;
    var prodcoll = new AmazonProductCollection(access_key, secret_key, assoc_tag);
    // prodcoll.addItem("B0077QMWD8");
    // prodcoll.addItem("B0053163VG");
    // prodcoll.onAllLoaded(function(result){
    //     console.log(result.sorted_by.price);
    // });
    module.exports = prodcoll;
}
else
{
    throw "Unable to read the file located in './.aws/credentials'";
}
