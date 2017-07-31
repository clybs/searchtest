const _ = require('lodash');
const config = require('../config');
const mongoClient = require('mongodb').MongoClient;
const yelp = require('../services/yelp');

/**
 * Check DB for cached response
 * @param data
 */
function checkDBCache(data) {
    let {what, where} = data;

    if (_.isString(what) && _.isString(where)) {
        what = what.trim().toLowerCase();
        where = where.trim().toLowerCase();
    }

    console.log('Find existing data');
    return mongoClient.connect(config.mongoDb.url)
        .then((db) => {
            const query = {
                what,
                where,
            };
            return db.collection(config.mongoDb.collection)
                .findOne(query)
                .then((results) => {
                    db.close();
                    return Promise.resolve(results);
                });
        });
}

/**
 * Save results to DB
 * @function saveResultsToDB
 * @param data {Object} The item to save
 * @returns {Promise.<TResult>}
 */
function saveResultsToDB(data) {
    let {what, where, results} = data;

    if (_.isString(what) && _.isString(where)) {
        what = what.trim().toLowerCase();
        where = where.trim().toLowerCase();
    }

    console.log('Save new data');
    return mongoClient.connect(config.mongoDb.url)
        .then((db) => {
            const item = {
                what,
                where,
                results,
            };
            return db.collection(config.mongoDb.collection)
                .insertOne(item)
                .then(() => {
                    db.close();
                    return Promise.resolve();
                });
        });
}

/**
 * Search what and where
 * @param req {Object} The request object
 * @returns {Promise.<TResult>|*}
 */
function whatWhere(req) {
    // Set parameters
    const data = {
        what: req.query.what,
        where: req.query.where,
        map: config.google.maps.key,
        results: {},
    };

    // Start search
    console.log(`Searching ${data.what} near ${data.where}`);
    return checkDBCache(data)
        .then((resultsCheck) => {
            // Check if previous search exists
            if (!resultsCheck) {
                // No saved data matches
                // Start a new search
                console.log('No existing data found');
                return yelp.search(data.what, data.where)
                    .then((resultsYelp) => {
                        // Format the results
                        data.results = resultsYelp;
                        const formattedResultsBusinesses = resultsYelp.businesses.map((business) => {
                            const categories = business.categories.map((category) => {
                                return category.title;
                            });
                            business.categories = categories.join(', ');
                            business.address = business.location.display_address.join(', ');
                            return business;
                        });
                        data.results.businesses = formattedResultsBusinesses;
                        return Promise.resolve(data);
                    })
                    .then((data) => saveResultsToDB(data)
                        .then(() => Promise.resolve(data)))
                    .catch((err) => {
                        console.log('Error occured', err.message);
                        return Promise.reject(err);
                    });
            }

            // Data exists
            console.log('Existing data found');
            data.results = resultsCheck.results;
            return Promise.resolve(data);
        });
}

module.exports = {
    whatWhere,
};