import React, { useState, useEffect, useRef } from "react";
import {
  Typography as T,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  DialogContentText,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { api } from "../../utils";
import UploadDocument from "./UploadDocument";
import DashboardTile from "../common/DashboardTile";
import AppPage, { toasts } from "../common/AppPage";
import { VTButton, DashboardSection } from "../common";
import HeaderSection from "../common/HeaderSection";
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

  const [editOpen, setEditOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentImage, setDocumentImage] = useState(otherDocumentsPreview);
  const [documentAuthor, setDocumentAuthor] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [category, setDocumentCategory] = useState(null);

  const dialogInfo = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [countToRefresh, setCount] = useState(0);
  function refresh() {
    setCount(countToRefresh + 1);
  }

  const handleEdit = (document_id, title, author, description, isPublic, category) => {
    setEditOpen(true);
    setDocumentId(document_id);
    setDocumentTitle(title);
    setDocumentDetails(description);
    setDocumentAuthor(author);
    setIsPublic(isPublic);
    setDocumentCategory(category);
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
      <HeaderSection mainTitle="Dashboard" description="Enjoy your media!" />

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
              onEdit={() =>
                handleEdit(tile.document_id, tile.title, tile.author, tile.description, tile.public, tile.category)
              }
              onDelete={() => verifyDelete(tile.title, tile.author, tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
            />
          ))
        ) : (
          <Typography>You have no own documents.</Typography>
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
        editOpen={editOpen}
        onClose={() => setEditOpen(false)}
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
