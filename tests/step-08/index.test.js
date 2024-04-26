const readCSV = require("../../src/csvReader.js");
const parseQuery = require("../../src/queryParser.js");
const executeSELECTQuery = require("../../src/index.js");

test("Read CSV File", async () => {
  const data = await readCSV("./student.csv");
  expect(data.length).toBeGreaterThan(0);
  expect(data.length).toBe(5);
  expect(data[0].name).toBe("DevD");
});

test("Parse SQL Query", () => {
  const query = "SELECT id, name FROM student";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "student",
    whereClauses: [],
    joinType:null,
    joinCondition: null,
    joinTable: null,
  });
});

test("Execute SQL Query", async () => {
  const query = "SELECT id, name FROM student";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toHaveProperty("id");
  expect(result[0]).not.toHaveProperty("age");
  expect(result[4]).toEqual({ id: "5", name: "NeelArmstrong" });
});

test("Parse SQL Query with WHERE Clause", () => {
  const query = "SELECT id, name FROM student WHERE age = 20";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    joinType:null,
    joinCondition: null,
    joinTable: null,
    table: "student",
    whereClauses: [
      {
        field: "age",
        operator: "=",
        value: "20",
      },
    ],
  });
});

test("Execute SQL Query with WHERE Clause", () => {
  const query = "SELECT id, name FROM student WHERE age = 23";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "student",
    whereClauses: [{ field: "age", operator: "=", value: "23" }],
    joinCondition: null,
    joinTable: null,
    joinType:null,
  });
});

test("Parse SQL Query with Multiple WHERE Clauses", () => {
  const query = "SELECT id, name FROM student WHERE age = 20 AND name = Neji";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    joinCondition: null,
    joinTable: null,
    joinType:null,
    table: "student",
    whereClauses: [
      {
        field: "age",
        operator: "=",
        value: "20",
      },
      {
        field: "name",
        operator: "=",
        value: "Neji",
      },
    ],
  });
});

test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM student WHERE age > 22';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(1);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM student WHERE age != 25';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(5);
    expect(result[0]).toHaveProperty('name');
});

test('Parse SQL Query with INNER JOIN', async () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id';
    const result = await parseQuery(query);
    expect(result).toEqual({
        fields: ['student.name', 'enrollment.course'],
        table: 'student',
        whereClauses: [],
        joinType:"INNER",
        joinTable: 'enrollment',
        joinCondition: { left: 'student.id', right: 'enrollment.student_id' }
    })
});

test('Parse SQL Query with INNER JOIN and WHERE Clause', async () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id = enrollment.student_id WHERE student.age > 20';
    const result = await parseQuery(query);
    expect(result).toEqual({
        fields: ['student.name', 'enrollment.course'],
        table: 'student',
        whereClauses: [{ field: 'student.age', operator: '>', value: '20' }],
        joinType:"INNER",
        joinTable: 'enrollment',
        joinCondition: { left: 'student.id', right: 'enrollment.student_id' }
    })
});

test('Execute SQL Query with INNER JOIN', async () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id';
    const result = await executeSELECTQuery(query);
    expect(result.length).toEqual(5);
    // toHaveProperty is not working here due to dot in the property name
    expect(result[0]).toEqual(expect.objectContaining({
        "enrollment.course": "Mathematics",
        "student.name": "DevD"
    }));
});

test('Execute SQL Query with INNER JOIN and a WHERE Clause', async () => {
    const query = 'SELECT student.name, enrollment.course, student.age FROM student INNER JOIN enrollment ON student.id = enrollment.student_id WHERE student.age = 21';
    const result = await executeSELECTQuery(query);
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(expect.objectContaining({
        "enrollment.course": "Mathematics",
        "student.name": "DevD"
    }));
});