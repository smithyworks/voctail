const { log } = require("./log.js");
const { query } = require("./db.js");

async function documentsHandler(req, res) {
  try {
    const {
      rows: [documents],
    } = await query("SELECT document_id, title, subtitle, description, embedLink, isPublic, text, image, author FROM documents WHERE document_id = $1", [document_id]);
    res.status(200).json(..documents);
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { documentsHandler };
