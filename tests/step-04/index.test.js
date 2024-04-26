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