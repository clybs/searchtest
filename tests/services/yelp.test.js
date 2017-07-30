const yelp = require('../../services/yelp');

test('Data can be fetched', done => {
    yelp.search('toys', 'serangoon')
        .then((results) => {
            expect(results).toHaveProperty('businesses');
            done();
        });
});
