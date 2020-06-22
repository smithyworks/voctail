const { log } = require("./log.js");
const { query } = require("./db.js");

async function documentsHandler(req, res) {
  try {
    const {document_id, masquerading}=req.;
    const {
      rows: [documentRecord],
    } = await query("SELECT document_id, title, description, isPublic, content, author FROM documents WHERE document_id = $1", [document_id]);
    res.status(200).json({...documentRecord, masquerading: !!masquerading});
  } catch (err) {
    log(error);
    res.status(500).send("Something went wrong.");
  }
}

module.exports = { documentsHandler };
