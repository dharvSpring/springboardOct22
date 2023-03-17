const { BadRequestError } = require("../expressError");

/**
 * Takes object dataToUpdate in JS style (CamelCase) and converts the keys to
 * SQL style (lower_snake_case) using the jsToSql to convert.
 * 
 * Returns the SQL string to set columns e.g. "'col1'=$1, 'col2'=$2, ..." and
 * the corresponding values in a list where data for $1 is 1st, $2 is 2nd, etc.
 * 
 * @param {jsKey: values} dataToUpdate 
 * @param {jsKey: sql_key} jsToSql 
 * @returns { 
 *            setCols: "'sql_key1'=$1, 'sql_key2'=$2, ...",
 *            values: [corresponding_values...]
 *          }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
