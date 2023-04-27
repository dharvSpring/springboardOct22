"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/*
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  salary INTEGER CHECK (salary >= 0),
  equity NUMERIC CHECK (equity <= 1.0),
  company_handle VARCHAR(25) NOT NULL
    REFERENCES companies ON DELETE CASCADE
);
*/

/** Related functions for companies. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * */

  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle,
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
   * */

  static async findAll() {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           ORDER BY title`);
    return jobRes.rows;
  }

 /** Find Jobs which match the filter
  * 
  * title: case insensitive match if title contains string
  * minSalary: minimum salary, inclusive
  * hasEquity: if true only show jobs with non-zero equity
  * 
  * Returns [{ id, title, salary, equity, companyHandle }, ...]
  **/
  static async findFilter(title, minSalary, hasEquity) {
    let where = 'WHERE ';
    const whereVars = [];
    let hasWhere = false;
    if (title) {
      hasWhere = true;
      whereVars.push(`%${title}%`);
      where += `title ILIKE $${whereVars.length} `;
    }

    if (minSalary) {
      hasWhere = true;
      whereVars.push(minSalary);
      where += `${whereVars.length > 1 ? 'AND ' : ''} salary >= $${whereVars.length} `;
    }
    
    if (hasEquity) {
      hasWhere = true;
      where += `${whereVars.length > 0 ? 'AND ' : ''} equity > 0`;
    }

    if (!hasWhere) {
      where = '';
    }

    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
            FROM jobs
            ${where}
            ORDER BY title`,
            whereVars);
    return jobRes.rows;
  }
  

  /** Given a job id, return data about the job.
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(jobId) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [jobId]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws BadRequestError is updating id or companyHandle
   * Throws NotFoundError if not found.
   */

  static async update(jobId, data) {
    if (data.id || data.companyHandle) {
        throw new BadRequestError("Cannot update job id or company");
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
            companyHandle: "company_handle",
        });
    const jobVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${jobVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, jobId]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(jobId) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [jobId]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);
  }
}


module.exports = Job;
