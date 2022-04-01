import { Pool, QueryResult } from "pg";
import config from "../config/psql.config";
import { comparePassword, cryptPassword } from "../services/bcrypt.services";
import { PSQLInfo, PSQLLogin } from "../types/psql.types";

async function insertNewUser(email: string, password: string) {
  const pool = new Pool(config);
  const hashedPassword = await cryptPassword(password);
  const query = `insert into logins(email,password,refresh_token) values ('${email}','${hashedPassword}','')`;
  try {
    const res = (await pool.query(query)) as unknown as PSQLInfo;
    await pool.end();
    return res;
  } catch (err) {
    await pool.end();
  }
}

async function getUserRefreshToken(email: string) {
  const pool = new Pool(config);
  const query = `select refresh_token from logins where email='${email}'`;
  try {
    const res: QueryResult<PSQLLogin> = await pool.query(query);
    await pool.end();
    return res;
  } catch (err) {
    await pool.end();
  }
}

async function setRefreshToken(email: string, refresh_token: string) {
  const pool = new Pool(config);
  const query = `update logins set refresh_token = '${refresh_token}' where email='${email}'`;
  try {
    const res = await pool.query(query);
    await pool.end();
    return res;
  } catch (err) {
    await pool.end();
    return err;
  }
}

async function getUserByEmail(email: string) {
  const pool = new Pool(config);
  const query = `select * from logins where email='${email}'`;
  const res = await pool.query(query);
  await pool.end();
  return res;
}

async function verifyUserLogin(email: string, password: string) {
  const { rows } = await getUserByEmail(email);
  const isPasswordMatch = await comparePassword(password, rows[0].password);
  if (!isPasswordMatch) {
    return false;
  }
  return true;
}

export {
  insertNewUser,
  getUserByEmail,
  setRefreshToken,
  verifyUserLogin,
  getUserRefreshToken,
};
