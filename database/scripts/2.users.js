const bcrypt = require("bcrypt");
const { firstNames, lastNames } = require("./data/names.json");

let fni = 0,
  lni = 0;
const fnLen = firstNames.length,
  lnLen = lastNames.length;
function getFirstName() {
  if (fni >= fnLen) fni = 0;
  return firstNames[fni++];
}
function getLastName() {
  if (lni >= lnLen) lni = 0;
  return lastNames[lni++];
}

let user_id = 6;
console.log(
  "COPY users (user_id, name, email, password, premium, admin, refresh_token, last_seen) FROM stdin;"
);
for (let i = 0; i < 200; i++) {
  const fn = getFirstName();
  const ln = getLastName();

  const name = `${fn} ${ln}`;
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@fake.com`;
  const password = bcrypt.hashSync("password", 10);
  console.log(
    `${user_id++}\t${name}\t${email}\t${password}\t${
      Math.random() < 0.5 ? "t" : "f"
    }\tf\t\\N\t\\N`
  );
}
console.log("\\.");

console.log(`ALTER SEQUENCE users_user_id_seq RESTART WITH ${user_id};`);
