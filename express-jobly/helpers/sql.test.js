const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("works: correct data", function () {
    const dataToUpdate = {
        username: 'mAddams',
        firstName: 'Morticia',
        lastName: 'Addams',
    };
    const jsToSql = {
        username: 'username',
        firstName: 'first_name',
        lastName: 'last_name',
    };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toEqual('"username"=$1, "first_name"=$2, "last_name"=$3');
    expect(values).toEqual(Object.values(dataToUpdate));
  });

  test("works: missing column name", function () {
    const dataToUpdate = {
        username: 'gAddams',
        firstName: 'Gomez',
        lastName: 'Addams',
    };
    const jsToSql = {
        firstName: 'first_name',
        lastName: 'last_name',
    };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toEqual('"username"=$1, "first_name"=$2, "last_name"=$3');
    expect(values).toEqual(Object.values(dataToUpdate));
  });

  test("fails: no data", function () {
    expect(() => sqlForPartialUpdate({}, {})).toThrow(BadRequestError);
  });

});
