const readCSV = require('../../src/csvReader');
const parseQuery = require('../../src/queryParser');
const executeSELECTQuery = require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./sample.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(5);
    expect(data[0].name).toBe('DevD');
});

test('Parse SQL Query', () => {
    const query = 'SELECT id, name FROM sample';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClauses: []
    });
});

test('Execute SQL Query', async () => {
    const query = 'SELECT id, name FROM sample';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).not.toHaveProperty('age');
    expect(result[4]).toEqual({ id: '5', name: 'NeelArmstrong' });
});

test('Parse SQL Query with WHERE Clause', () => {
    const query = 'SELECT id, name FROM sample WHERE age = 23';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause: 'age = 23'
    });
});

// TEST CASE FOR INSENSITIVITY 
// AND WHERE THE ABOVE IMPLMENTATION WOULD FAIL

// IN THE TEST CASE BELOW THE QUERY IS NOT IDEAL 
// AND STILL MANAGES TO PASS ALL THE EXPECTATIONS 
// HENCE THE ABOVE IMPLEMENTATION FAILS
test('Execute SQL Query with WHERE Clause', async () => {
    const query = 'select id, name from sample where age = 21 = ';
    const result = await executeSELECTQuery(query);
    expect(result[0].name == 'DevD');
    expect(result[0].whereClause == 'age = 21');
    expect(result.length == 2);
});