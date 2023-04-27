"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "New Job",
    salary: 13337,
    equity: 0.1,
    companyHandle: "c1",
  };

  test("ok for admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "New Job",
        salary: 13337,
        equity: "0.1",
        companyHandle: "c1",
      },
    });
  });

  test("unauth for non admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {
        message: "Unauthorized",
        status: 401,
      }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          handle: "new",
          numEmployees: 10,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          logoUrl: "not-a-url",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "Job1",
                salary: 1111,
                equity: "0.1",
                companyHandle: "c1",
            },
            {
                id: expect.any(Number),
                title: "Job2",
                salary: 2222,
                equity: "0.2",
                companyHandle: "c1",
            },
            {
                id: expect.any(Number),
                title: "Job3",
                salary: 3333,
                equity: "0",
                companyHandle: "c3",
            },
          ],
    });
  });

  test("query for title", async function () {
    const resp = await request(app).get("/jobs?title=job1");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "Job1",
                salary: 1111,
                equity: "0.1",
                companyHandle: "c1",
            },
          ],
    });
  });

  test("query for minSalary", async function () {
    const resp = await request(app).get("/jobs?minSalary=2222");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "Job2",
                salary: 2222,
                equity: "0.2",
                companyHandle: "c1",
            },
            {
                id: expect.any(Number),
                title: "Job3",
                salary: 3333,
                equity: "0",
                companyHandle: "c3",
            },
          ],
    });
  });

  test("query for hasEquity", async function () {
    const resp = await request(app).get("/jobs?hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "Job1",
                salary: 1111,
                equity: "0.1",
                companyHandle: "c1",
            },
            {
                id: expect.any(Number),
                title: "Job2",
                salary: 2222,
                equity: "0.2",
                companyHandle: "c1",
            },
          ],
    });
  });

  test("query for title, minSalary and hasEquity", async function () {
    const resp = await request(app).get("/jobs?title=job&minSalary=2222&hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                id: expect.any(Number),
                title: "Job2",
                salary: 2222,
                equity: "0.2",
                companyHandle: "c1",
            },
          ],
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
    const newJob = {
        title: "newJob",
        salary: 54321,
        equity: 0.5,
        companyHandle: "c1",
    };

    let jobId;
    beforeEach(async function() {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        jobId = resp.body.job.id;
    });

  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/${jobId}`);
    expect(resp.body).toEqual({
      job: {
            id: jobId,
            title: "newJob",
            salary: 54321,
            equity: "0.5",
            companyHandle: "c1",
        },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/987654321`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:handle */

describe("PATCH /jobs/:handle", function () {
    const updateData = {
        title: "Updated!",
        salary: 12345,
        equity: 0.9,
    };

    const newJob = {
        title: "newJob",
        salary: 54321,
        equity: 0.5,
        companyHandle: "c1",
    };

    let jobId;
    beforeEach(async function() {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        jobId = resp.body.job.id;
    });

  test("works for admin", async function () {
    const resp = await request(app)
        .patch(`/jobs/${jobId}`)
        .send(updateData)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      job: {
            id: jobId,
            title: "Updated!",
            salary: 12345,
            equity: "0.9",
            companyHandle: "c1",
        },
    });
  });

  test("unauth for non admin", async function () {
    const resp = await request(app)
        .patch(`/jobs/${jobId}`)
        .send(updateData)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/${jobId}`)
        .send(updateData);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
        .patch(`/jobs/987654321`)
        .send(updateData)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const resp = await request(app)
        .patch(`/jobs/${jobId}`)
        .send({
            companyHandle: "c1-new",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/jobs/${jobId}`)
        .send({
          equity: "not-a-number",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:handle */

describe("DELETE /jobs/:handle", function () {
    const newJob = {
        title: "newJob",
        salary: 54321,
        equity: 0.5,
        companyHandle: "c1",
    };

    let jobId;
    beforeEach(async function() {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        jobId = resp.body.job.id;
    });

  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/jobs/${jobId}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: `${jobId}` });
  });

  test("unauth for non admin", async function () {
    const resp = await request(app)
        .delete(`/jobs/${jobId}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/${jobId}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/jobs/987654321`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
