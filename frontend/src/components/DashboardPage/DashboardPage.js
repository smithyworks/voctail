import React, { useState, useEffect, useRef } from "react";
import { Typography as T } from "@material-ui/core";
import { api } from "../../utils";
import UploadDocument from "./UploadDocument";
import DashboardTile from "../common/DashboardTile";
import AppPage, { toasts } from "../common/AppPage";
import { DashboardSection } from "../common";
import WarningDialog from "../AdminPage/WarningDialog";
import EditDocument from "./EditDocument";

//example tile images
import shortStoriesPreview from "../../assets/books.jpg";
import fairyTalesPreview from "../../assets/fairytale.jpg";
import newspaperArticlesPreview from "../../assets/newspaper.jpg";
import otherDocumentsPreview from "../../assets/others.jpg";

//overview (browse through documents, see title, preview and some additional information)
function Dashboard() {
  const [user, setUser] = useState();

  //const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); // all document data fetched from the database
  const [newspaperArticles, setNewspaperArticles] = useState([]);
  const [shortStories, setShortStories] = useState([]);
  const [fairyTales, setFairyTales] = useState([]);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [usersDocuments, setUsersDocuments] = useState([]);

  //const [editOpen, setEditOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  //const [documentImage, setDocumentImage] = useState(otherDocumentsPreview);
  const [documentAuthor, setDocumentAuthor] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [category, setDocumentCategory] = useState(null);

  const dialogInfo = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [countToRefresh, setCount] = useState(0);
  function refresh() {
    setCount(countToRefresh + 1);
  }

  const handleEdit = (document) => {
    setEditDialogOpen(true);
    setDocumentId(document.document_id);
    setIsPublic(document.public);
    setDocumentAuthor(document.author);
    setDocumentDetails(document.description);
    setDocumentTitle(document.title);
    setDocumentCategory(document.category);
  };

  function verifyDelete(title, author, id) {
    setDialogOpen(true);
    dialogInfo.current = {
      title: "You are about to delete a document forever!",
      body: `Are you sure you want to delete document "${title}" by ${author}?`,
      confirmText: title,
      onClose: () => {
        setDialogOpen(false);
        dialogInfo.current.onConfirm = null;
      },
      onConfirm: () => {
        deleteThisDocument(id);
        setDialogOpen(false);
      },
    };
  }

  function deleteThisDocument(documentId) {
    if (documentId)
      api
        .deleteDocument(documentId)
        .then(() => {
          toasts.toastSuccess("The document was successfully deleted!");
          refresh();
          //setPopUpOpen(false);
        })
        .catch((err) => {
          console.log(err);
          toasts.toastError("Error communicating with the server!");
        });
    else toasts.toastWarning("The document could not be found.");
  }

  function createQuiz(documentId) {
    api
      .createQuizFromDoc(documentId, 20)
      .then(() => toasts.toastSuccess("Successfully created a quiz for this document!"))
      .catch(() => toasts.toastError("Encountered a problem while creating your quiz!"));
  }

  //get current user
  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //fetch documents (rerender when documents were added, deleted, edited
  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          //setDocumentDataFromDatabase(res.data.documents);    //if needed: fetch all documents to the frontend
          setNewspaperArticles(res.data.newspaperArticles);
          setFairyTales(res.data.fairyTales);
          setShortStories(res.data.shortStories);
          setOtherDocuments(res.data.others);
          setUsersDocuments(res.data.usersDocuments);
        }
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]);

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <DashboardSection
        title={"My Documents"}
        Button={<UploadDocument refresh={refresh} publisherId={user ? user.user_id : 1} />}
      >
        {usersDocuments.length !== 0 ? (
          usersDocuments.map((tile) => (
            <DashboardTile
              thumbnail={shortStoriesPreview}
              title={tile.title}
              author={tile.author}
              isOwned
              onEdit={() => handleEdit(tile)}
              onDelete={() => verifyDelete(tile.title, tile.author, tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
            />
          ))
        ) : (
          <T>You have no own documents.</T>
        )}
      </DashboardSection>

      <DashboardSection title={"Short Stories"}>
        {shortStories.map((tile) => (
          <DashboardTile
            thumbnail={shortStoriesPreview}
            title={tile.title}
            author={tile.author}
            linkTo={"/documents/" + tile.document_id}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Fairy Tales"}>
        {fairyTales.map((tile) => (
          <DashboardTile
            thumbnail={fairyTalesPreview}
            title={tile.title}
            author={tile.author}
            linkTo={"/documents/" + tile.document_id}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Newspaper Articles"}>
        {newspaperArticles.map((tile) => (
          <DashboardTile
            thumbnail={newspaperArticlesPreview}
            title={tile.title}
            author={tile.author}
            linkTo={"/documents/" + tile.document_id}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Other documents"}>
        {otherDocuments.map((tile) => (
          <DashboardTile
            thumbnail={otherDocumentsPreview}
            title={tile.title}
            author={tile.author}
            linkTo={"/documents/" + tile.document_id}
          />
        ))}
      </DashboardSection>

      <WarningDialog open={dialogOpen} info={dialogInfo.current} />
      <EditDocument
        refresh={refresh}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        documentId={documentId}
        title={documentTitle}
        author={documentAuthor}
        description={documentDetails}
        isPublic={isPublic}
        currentCategory={category}
      />
    </AppPage>
  );
}
export default Dashboard;
