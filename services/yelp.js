const rp = require('request-promise');
const config = require('../config');

/**
 * Search yelp
 * @param what {String} What to search for
 * @param where {String} Where to search first
 * @returns {Object} The JSON result object
 */
function search(what, where) {
    // Set parameters
    const options = {
        url: config.yelp.links.search,
        headers: {
            'Authorization': 'Bearer ' + config.yelp.token,
        },
        qs: {
            term: what,
            location: where,
        }
    };

    // Do Yelp search
    return rp(options)
        .then(results => Promise.resolve(JSON.parse(results)));
}

module.exports = {
    search,
};
