"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "newJob",
    salary: 100,
    equity: 0.5,
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
        id: expect.any(Number),
        title: "newJob",
        salary: 100,
        equity: "0.5",
        companyHandle: "c1",
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = ${job.id}`);
    expect(result.rows).toEqual([
      {
        id: job.id,
        title: "newJob",
        salary: 100,
        equity: "0.5",
        company_handle: "c1",
      },
    ]);
  });

  test("fails with invalid company", async function () {
    try {
      await Job.create({
        title: "newJob",
        salary: 100,
        equity: 0.5,
        companyHandle: "c11254",
      });
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "job3",
        salary: 3,
        equity: "0",
        companyHandle: "c3",
      },
    ]);
  });
});

// /************************************** findFilter */

describe("findFilter simple", function () {
  test("works: name filter exact", async function () {
    let jobs = await Job.findFilter("job1");
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });

  test("works: name filter ignore case", async function () {
    let jobs = await Job.findFilter("JOB1");
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });

  test("works: minSalary 2", async function () {
    let jobs = await Job.findFilter(null, 2);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "job3",
        salary: 3,
        equity: "0",
        companyHandle: "c3",
      },
    ]);
  });

  test("works: hasEquity true", async function () {
    let jobs = await Job.findFilter(null, null, true);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: hasEquity false returns all", async function () {
    let jobs = await Job.findFilter(null, null, false);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "job3",
        salary: 3,
        equity: "0",
        companyHandle: "c3",
      },
    ]);
  });
});

describe("findFilter compound", function () {
  test("works: title and minSalary", async function () {
    let jobs = await Job.findFilter("Job2", 2);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: title and hasEquity", async function () {
    let jobs = await Job.findFilter("Job2", null, true);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
    ]);
  });

  test("works: minSalary hasEquity", async function () {
    let jobs = await Job.findFilter(null, 1, true);
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "job2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const jobData = {
        title: "newJob",
        salary: 100,
        equity: 0.5,
        companyHandle: "c1",
    };
    const newJob = await Job.create(jobData);

    let job = await Job.get(newJob.id);
    expect(job).toEqual({
        id: newJob.id,
        title: "newJob",
        salary: 100,
        equity: "0.5",
        companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(1337);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 12345,
    equity: "0.9",
  };

  let jobId, companyHandle;
  beforeEach(async function() {
    const jobRes = await db.query(
        `SELECT id, company_handle AS "companyHandle" FROM jobs
        LIMIT 1`);
    jobId = jobRes.rows[0].id;
    companyHandle = jobRes.rows[0].companyHandle;
  });

  test("works", async function () {
    let job = await Job.update(jobId, updateData);
    expect(job).toEqual({
      id: jobId,
      companyHandle: companyHandle,
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = ${jobId}`);
    expect(result.rows).toEqual([{
      id: jobId,
      title: "New",
      salary: 12345,
      equity: "0.9",
      company_handle: companyHandle,
    }]);
  });

  test("fail to update id", async function () {
    try {
      await Job.update(jobId, {id: '4321'});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fail to update companyHandle", async function () {
    try {
      await Job.update(jobId, {companyHandle: 'Addams Inc'});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fail with negative salary", async function () {
    try {
      await Job.update(jobId, {salary: -1});
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test("fail with large equity", async function () {
    try {
      await Job.update(jobId, {equity: 2});
      fail();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(4321, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const jobData = {
        title: "newJob1234",
        salary: 1234,
        equity: 0.7,
        companyHandle: "c3",
    };
    const deleteMe = await Job.create(jobData);

    await Job.remove(deleteMe.id);
    const res = await db.query(
        `SELECT id FROM jobs WHERE id=${deleteMe.id}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(1337);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
