const readCSV = require('../../src/csvReader.js');
const parseQuery = require('../../src/queryParser.js');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(5);
    expect(data[0].age == data[1].age);
});

test('Parse SQL Query', () => {
    const studentQuery = 'SELECT id, name FROM student';
    const parsed1 = parseQuery(studentQuery);
    expect(parsed1).toEqual({
        fields: ['id', 'name'],
        table: 'student',
        whereClauses:[],
        joinType:null,
        joinCondition: null,
        joinTable: null,
    });
    
    // const errorQuery = 'SELECTT id, name FROM student';
    // const parsed2 = parseQuery(errorQuery);
    // expect(parsed2).toEqual({
    //     fields: ['id', 'name'],
    //     table: 'student',
    //     whereClause:[]
    // });
});