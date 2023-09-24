import mysql from "mysql";
import booksDbConfig from "../config/db.config.js";

const booksDB = mysql.createPool(booksDbConfig);

export default booksDB;
