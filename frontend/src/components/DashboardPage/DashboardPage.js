import React, { useState, useEffect, useRef, useContext } from "react";
import { api } from "../../utils";
import UploadDocument from "./UploadDocument";
import DashboardTile from "../common/DashboardTile";
import AppPage, { toasts } from "../common/AppPage";
import { DashboardSection, GoPremiumDialog } from "../common";
import WarningDialog from "../AdminPage/WarningDialog";
import EditDocument from "./EditDocument";
import PlaceholderTile from "../common/PlaceholderTile";
import VTIconFlexButton from "../common/Buttons/IconButton";
import { UserContext } from "../../App";

//overview (browse through documents, see title, preview and some additional information)
function Dashboard() {
  const user = useContext(UserContext);

  const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); // all document data fetched from the database
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

  const [premiumOpen, setPremiumOpen] = useState(false);

  const handleCheckoutPremium = () => {
    setPremiumOpen(true);
  };
  const handleCheckoutPremiumClose = () => {
    setPremiumOpen(false);
  };
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
        })
        .catch((err) => {
          console.log(err);
          toasts.toastError("Error communicating with the server!");
        });
    else toasts.toastWarning("The document could not be found.");
  }

  function createQuiz(documentId) {
    if (user.premium)
      api
        .createQuizFromDocFixedLength(documentId)
        .then(() => {
          toasts.toastSuccess("Successfully created a quiz for this document! You can check your quiz out now!");
          //setMenuOpen(false);
        })
        .catch(() => toasts.toastError("Encountered a problem while creating your quiz!"));
    else toasts.goPremium();
  }

  const [fitLookup, setFitLookup] = useState({});
  function calcAllDocumentsFit() {
    if (documentDataFromDatabase)
      api
        .calcDocumentFit()
        .then((res) => {
          setFitLookup(res.data);
        })
        .catch((err) => console.log(err));
  }

  //fetch documents (rerender when documents were added, deleted, edited
  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          setDocumentDataFromDatabase(res.data.documents); //if needed: fetch all documents to the frontend
          setUsersDocuments(res.data.usersDocuments);
          calcAllDocumentsFit();
        }
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]); // eslint-disable-line

  function getFit(document_id) {
    if (!fitLookup) return false;
    const fit = fitLookup[document_id];
    return fit >= 0 && fit < 0.02;
  }

  const recommendations = documentDataFromDatabase
    ? fitLookup
      ? documentDataFromDatabase
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .slice(0, 10)
      : documentDataFromDatabase.slice(0, 10)
    : null;

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <DashboardSection
        title={"My Documents"}
        Button={
          user && user.premium ? (
            <VTIconFlexButton toolTipLabel={"Add new document"} onClick={handleAddOpen} />
          ) : (
            <VTIconFlexButton
              voctailDisabled
              toolTipLabel={"Adding new documents is not available for free users"}
              onClick={handleCheckoutPremium}
            />
          )
        }
        expandable
      >
        {usersDocuments.length !== 0 ? (
          usersDocuments
            .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
            .map((tile, i) => (
              <DashboardTile
                key={i}
                title={tile.title}
                author={tile.author}
                fits={getFit(tile.document_id)}
                isOwned
                onEdit={() => handleEdit(tile)}
                onDelete={() => verifyDelete(tile.title, tile.author, tile.document_id)}
                onGenerateQuiz={() => createQuiz(tile.document_id)}
                onAddToClassroom={() => console.log("tile.title")}
                linkTo={"/documents/" + tile.document_id}
                category={tile.category}
              />
            ))
        ) : user && user.premium ? (
          <PlaceholderTile
            tooltipTitle={"You have no own documents. Add your own document now!"}
            onClick={handleAddOpen}
          />
        ) : (
          <PlaceholderTile
            tooltipTitle={"Adding new documents is only available in Voctail Premium."}
            onClick={handleCheckoutPremium}
          />
        )}
      </DashboardSection>

      <DashboardSection title={"Recommendations"} expandable>
        {recommendations.map(({ document_id, author, title, category }, i) => (
          <DashboardTile
            key={i}
            title={title}
            author={author}
            fits={getFit(document_id)}
            onGenerateQuiz={() => createQuiz(document_id)}
            linkTo={"/documents/" + document_id}
            category={category}
            video={category === "music-video"}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Music Videos"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "music-video")
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .map((tile, i) => (
            <DashboardTile
              key={i}
              document={tile}
              title={tile.title}
              author={tile.author}
              fits={getFit(tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
              category={tile.category}
              video
            />
          ))}
      </DashboardSection>

      <DashboardSection title={"Short Stories"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "(Short) Story")
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .map((tile, i) => (
            <DashboardTile
              key={i}
              title={tile.title}
              author={tile.author}
              fits={getFit(tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
              category={tile.category}
            />
          ))}
      </DashboardSection>

      <DashboardSection title={"Fairy Tales"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "Fairy Tale")
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .map((tile, i) => (
            <DashboardTile
              key={i}
              title={tile.title}
              author={tile.author}
              fits={getFit(tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
              category={tile.category}
            />
          ))}
      </DashboardSection>

      <DashboardSection title={"Newspaper Articles"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "Newspaper Article")
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .map((tile, i) => (
            <DashboardTile
              key={i}
              title={tile.title}
              author={tile.author}
              fits={getFit(tile.document_id)}
              onGenerateQuiz={() => createQuiz(tile.document_id)}
              linkTo={"/documents/" + tile.document_id}
              category={tile.category}
            />
          ))}
      </DashboardSection>

      <DashboardSection title={"Others"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "Others")
          .sort((a, b) => (fitLookup[a.document_id] < fitLookup[b.document_id] ? -1 : 1))
          .map((tile, i) => (
            <DashboardTile
              key={i}
              title={tile.title}
              author={tile.author}
              fits={getFit(tile.document_id)}
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

      <GoPremiumDialog open={premiumOpen} onClose={handleCheckoutPremiumClose} />

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
