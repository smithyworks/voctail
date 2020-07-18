import React, { useState, useEffect, useRef, useContext } from "react";
import { api } from "../../utils";
import UploadDocument from "./UploadDocument";
import DashboardTile from "../common/DashboardTile";
import AppPage, { toasts } from "../common/AppPage";
import { DashboardSection } from "../common";
import WarningDialog from "../AdminPage/WarningDialog";
import EditDocument from "./EditDocument";
import PlaceholderTile from "../common/PlaceholderTile";
import VTIconFlexButton from "../common/Buttons/IconButton";
import CheckoutPremiumDialog from "../common/Dialogs/CheckoutPremiumDialog";
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
  const documents_fit = [];

  const [premiumOpen, setPremiumOpen] = useState(false);

  const handleCheckoutPremium = () => {
    setPremiumOpen(true);
    console.log("premium", premiumOpen);
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
          //setPopUpOpen(false); //todo
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
        .createQuizFromDoc(documentId, 20)
        .then(() => {
          toasts.toastSuccess("Successfully created a quiz for this document! You can check your quiz out now!");
          //setMenuOpen(false);
        }) //todo check it out
        .catch(() => toasts.toastError("Encountered a problem while creating your quiz!"));
    else toasts.goPremium();
  }

  //fetch documents (rerender when documents were added, deleted, edited
  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          setDocumentDataFromDatabase(res.data.documents); //if needed: fetch all documents to the frontend
          setUsersDocuments(res.data.usersDocuments);
        }
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]);

  useEffect(() => {
    calcAllDocumentsFit();
    console.log("cald all documents fit in use effect mit set data", documents_fit);
    console.log("use effect length", documents_fit.lastIndexOf());
  });

  function calcAllDocumentsFit() {
    documentDataFromDatabase.map((doc) => {
      api
        .calcDocumentFit(doc.document_id)
        .then((res) => {
          documents_fit.push({ document: doc.document_id, fit: res.data.fit });
        })
        .catch((err) => console.log(err));
    });
  }

  function findMyIndex(arr, id) {
    console.log("arr", arr);
    console.log("arr.length", arr.length);

    for (let n = 0; n < arr.length; n++) {
      if (arr[n].document === id) {
        return n;
      }
    }
    console.log("error doc was not found (index)");
    return -1;
  }

  function getFit(documentId) {
    console.log("doc id", documentId);
    console.log("documents_fit", documents_fit);

    console.log("documents fit length", documents_fit.length);
    let index = findMyIndex(documents_fit, documentId);
    //index = documents_fit.findIndex((x) => x.document === documentId);
    console.log("index", index);
    if (index < 0) return false;
    let currentFit = documents_fit[index].fit;
    console.log("current fit in doc", documentId);
    console.log("fit is", currentFit);
    if (currentFit < 0.1) {
      console.log("my currentFit is less than 0.1");
      return true;
    }
    return false;
  }

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <DashboardSection
        title={"My Documents"}
        Button={
          user && user.premium ? (
            <VTIconFlexButton toolTipLabel={"Add new document"} onClick={handleAddOpen} />
          ) : (
            <VTIconFlexButton disabled />
          )
        }
        expandable
      >
        {usersDocuments.length !== 0 ? (
          usersDocuments.map((tile, i) => (
            <DashboardTile
              key={i}
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

      <DashboardSection title={"Recommendations"}></DashboardSection>

      <DashboardSection title={"Music Videos"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "music-video")
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

      <DashboardSection title={"Short Stories"} expandable>
        {documentDataFromDatabase
          .filter((doc) => doc.category === "(Short) Story")
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

      <CheckoutPremiumDialog
        title={"You are not allowed to add your own document."}
        feature={"Adding new documents"}
        open={premiumOpen}
        onClose={handleCheckoutPremiumClose}
      />
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
