import React, { useState, useEffect, useRef } from "react";
import { api } from "../../utils";
import UploadDocument from "./UploadDocument";
import DashboardTile from "../common/DashboardTile";
import AppPage, { toasts } from "../common/AppPage";
import { DashboardSection } from "../common";
import WarningDialog from "../AdminPage/WarningDialog";
import EditDocument from "./EditDocument";
import PlaceholderTile from "../common/PlaceholderTile";
import VTIconButton from "../common/Buttons/IconButton";

//overview (browse through documents, see title, preview and some additional information)
function Dashboard() {
  const [user, setUser] = useState();

  //const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); // all document data fetched from the database
  const [newspaperArticles, setNewspaperArticles] = useState([]);
  const [shortStories, setShortStories] = useState([]);
  const [fairyTales, setFairyTales] = useState([]);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [usersDocuments, setUsersDocuments] = useState([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentAuthor, setDocumentAuthor] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [category, setDocumentCategory] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const dialogInfo = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddOpen = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

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
      .then(() => {
        toasts.toastSuccess("Successfully created a quiz for this document! You can check your quiz out now!");
        //setMenuOpen(false);
      }) //todo check it out
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
      <DashboardSection title={"My Documents"} Button={<VTIconButton onClick={handleAddOpen} />}>
        {usersDocuments.length !== 0 ? (
          usersDocuments.map((tile) => (
            <DashboardTile
              title={tile.title}
              author={tile.author}
              isOwned
              onEdit={() => handleEdit(tile)}
              onDelete={() => verifyDelete(tile.title, tile.author, tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
              category={tile.category}
            />
          ))
        ) : (
          <PlaceholderTile
            tooltipTitle={"You have no own documents. Add your own document now!"}
            onClick={handleAddOpen}
          />
        )}
      </DashboardSection>

      <DashboardSection title={"Short Stories"}>
        {shortStories.map((tile) => (
          <DashboardTile
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Fairy Tales"}>
        {fairyTales.map((tile) => (
          <DashboardTile
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Newspaper Articles"}>
        {newspaperArticles.map((tile) => (
          <DashboardTile
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Other documents"}>
        {otherDocuments.map((tile) => (
          <DashboardTile
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <UploadDocument
        refresh={refresh}
        publisherId={user ? user.user_id : 1}
        handleAddClose={handleAddClose}
        open={addOpen}
      />
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
