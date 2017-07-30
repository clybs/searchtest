const search = require('../../models/search');

test('whatWhere should be defined', () => {
    expect(search.whatWhere).toBeDefined();
});

test('Should be able to fetch existing data', done => {
    const data = {
        query: {
            what: 'Food',
            where: 'Sengkang',
        },
    };

    search.whatWhere(data)
        .then((results) => {
            expect(results).toHaveProperty('what', data.query.what);
            expect(results).toHaveProperty('where', data.query.where);
            expect(results).toHaveProperty('map');
            expect(results).toHaveProperty('results');
            done();
        });
});

test('Should be able to fetch new data', done => {
    const randomSuffix = Math.random();
    const data = {
        query: {
            what: `Food Test ${randomSuffix}`,
            where: 'Sengkang',
        },
    };

    search.whatWhere(data)
        .then((results) => {
            expect(results).toHaveProperty('what', data.query.what);
            expect(results).toHaveProperty('where', data.query.where);
            expect(results).toHaveProperty('map');
            expect(results).toHaveProperty('results');
            done();
        });
});
