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

  const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); // all document data fetched from the database
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

  const [select, setSelect] = useState("");

  const handleSelect = (event) => {
    setSelect(event.target.value);
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
  const [docFit, setDocFit] = useState(5);

  function getDocumentFit(documentId) {
    // todo this makes no sense! better push it to [] of usestate
    console.log("document id", documentId);
    api.calcDocumentFit(documentId).then((res) => {
      setDocFit(res.data.fit);
      console.log("res.data", res.data.fit);
    });
    return docFit;
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
          setDocumentDataFromDatabase(res.data.documents); //if needed: fetch all documents to the frontend
          setNewspaperArticles(res.data.newspaperArticles);
          setFairyTales(res.data.fairyTales);
          setShortStories(res.data.shortStories);
          setOtherDocuments(res.data.others);
          setUsersDocuments(res.data.usersDocuments);
        }
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]);

  useEffect(() => {
    saveDocumentFit(documentDataFromDatabase);
  });

  const documents_fit = [];
  function saveDocumentFit(documents) {
    documents.map((doc) => {
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
      console.log("array", arr[n]);
      console.log("id", id);
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

    let index; // = findMyIndex(documents_fit, documentId);
    index = documents_fit.findIndex((x) => x.document === documentId);
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
        Button={user && user.premium ? <VTIconButton onClick={handleAddOpen} /> : <VTIconButton disabled />}
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
          <PlaceholderTile tooltipTitle={"Adding new documents is only available in Voctail Premium."} />
        )}
      </DashboardSection>

      <DashboardSection title={"Recommendations"}></DashboardSection>

      <DashboardSection
        title={"Short Stories, Fairy Tales, Newspaper Articles and more for you"}
        expandable
        filter
        select={select}
        handleSelect={handleSelect}
      >
        {select === ""
          ? documentDataFromDatabase.map((tile, i) => (
              <DashboardTile
                key={i}
                title={tile.title}
                author={tile.author}
                fits={getFit(tile.document_id)}
                onGenerateQuiz={() => createQuiz(tile.document_id)}
                linkTo={"/documents/" + tile.document_id}
                category={tile.category}
              />
            ))
          : documentDataFromDatabase
              .filter((doc) => doc.category === select)
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
        {shortStories.map((tile, i) => (
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

      <DashboardSection title={"Fairy Tales"}>
        {fairyTales.map((tile, i) => (
          <DashboardTile
            key={i}
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Newspaper Articles"}>
        {newspaperArticles.map((tile, i) => (
          <DashboardTile
            key={i}
            title={tile.title}
            author={tile.author}
            onGenerateQuiz={() => createQuiz(tile.document_id)}
            linkTo={"/documents/" + tile.document_id}
            category={tile.category}
          />
        ))}
      </DashboardSection>

      <DashboardSection title={"Other documents"}>
        {otherDocuments.map((tile, i) => (
          <DashboardTile
            key={i}
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
