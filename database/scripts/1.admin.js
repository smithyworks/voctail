const bcrypt = require("bcrypt");
const adminNames = ["Admin", "Christo", "Ben", "Clara", "Ryan"];

let user_id = 1;
console.log(
  "COPY users (user_id, name, email, password, premium, admin, refresh_token, last_seen) FROM stdin;"
);
adminNames.forEach((name) => {
  const email = name.toLowerCase() + "@voctail.com";
  const password = bcrypt.hashSync("password", 10);
  console.log(`${user_id++}\t${name}\t${email}\t${password}\tt\tt\t\\N\t\\N`);
});
console.log("\\.");

console.log(`ALTER SEQUENCE users_user_id_seq RESTART WITH ${user_id};`);
