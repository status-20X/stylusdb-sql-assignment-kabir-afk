const readCSV = require('../../src/csvReader');
const parseQuery = require('../../src/queryParser');

test('Read CSV File', async () => {
    const data = await readCSV('./sample.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(5);
    expect(data[0].age == data[1].age);
});

test('Parse SQL Query', () => {
    const sampleQuery = 'SELECT id, name FROM sample';
    const errorQuery = 'SELECTT id, name FROM sample';
    const parsed1 = parseQuery(sampleQuery);
    expect(parsed1).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause:null
    });
    const parsed2 = parseQuery(errorQuery);
    expect(parsed2).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause:null
    });
});