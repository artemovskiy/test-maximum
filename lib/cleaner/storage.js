const mysql = require('serverless-mysql')({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export const saveQuery = async query => {
  await mysql.query('INSERT INTO `queries` (`query`) VALUES (?)', [query]);
  await mysql.end();
};

export const getRandomQuery = async () => {
  const result = await mysql.query(
    'SELECT query FROM queries ORDER BY RAND() LIMIT 1'
  );
  await mysql.end();
  return result.length ? result[0].query : null;
};
