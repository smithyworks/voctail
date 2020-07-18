// Example usage (cd into database/scripts):
// $ node 11.users_documents.js > ../init/11.users_documents.sql

async function main() {
  try {
    console.log("COPY users_documents (document_id, user_id) FROM stdin;");
    const numberOfUsers = 205;
    const numberOfDocuments = 45;

    for (let user_id = 1; user_id <= numberOfUsers; user_id++) {
      for (
        let document_id = 1;
        document_id <= numberOfDocuments;
        document_id++
      ) {
        console.log(`${document_id}\t${user_id}`);
      }
    }
    console.log("\\.");
  } catch (err) {
    console.error(err);
  }
}

main();
