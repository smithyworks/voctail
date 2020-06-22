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

console.log("INSERT INTO users (name, email, password, premium) VALUES");

async function main() {
  for (let i = 0; i < 200; i++) {
    const fn = getFirstName();
    const ln = getLastName();
    console.log(
      `('${fn} ${ln}', '${fn.toLowerCase()}.${ln.toLowerCase()}@fake.com', '${bcrypt.hashSync(
        "password",
        10
      )}', ${Math.random() < 0.5 ? true : false} )${i === 199 ? ";" : ","}`
    );
  }
}

main();
