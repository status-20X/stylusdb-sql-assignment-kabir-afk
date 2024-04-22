const readCSV = require("../../src/csvReader.js");
const parseQuery = require("../../src/queryParser.js");
const executeSELECTQuery = require("../../src/index.js");

test("Read CSV File", async () => {
  const data = await readCSV("./sample.csv");
  expect(data.length).toBeGreaterThan(0);
  expect(data.length).toBe(5);
  expect(data[0].name).toBe("DevD");
});

test("Parse SQL Query", () => {
  const query = "SELECT id, name FROM sample";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "sample",
    whereClauses: [],
  });
});

test("Execute SQL Query", async () => {
  const query = "SELECT id, name FROM sample";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toHaveProperty("id");
  expect(result[0]).not.toHaveProperty("age");
  expect(result[4]).toEqual({ id: "5", name: "NeelArmstrong" });
});

test("Parse SQL Query with WHERE Clause", () => {
  const query = "SELECT id, name FROM sample WHERE age = 20";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "sample",
    whereClauses: [
      {
        field: "age",
        operator: "=",
        value: "20",
      },
    ],
  });
});

test("Parse SQL Query with WHERE Clause", () => {
  const query = "SELECT id, name FROM sample WHERE age = 23";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "sample",
    whereClauses: [{ field: "age", operator: "=", value: "23" }]
  });
});

test("Parse SQL Query with Multiple WHERE Clauses", () => {
  const query = "SELECT id, name FROM sample WHERE age = 20 AND name = Neji";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "sample",
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

test("Execute SQL Query with Multiple WHERE Clause", async () => {
  const query = "SELECT id, name FROM sample WHERE age = 20 AND name = Neji";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBe(1);
  // expect(result[0]).toEqual({ id: '1', name: 'John' });
});
