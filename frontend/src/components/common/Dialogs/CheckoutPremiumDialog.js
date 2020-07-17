import React from "react";
import VoctailDialogTitle from "./VoctailDialogTitle";
import VTButton from "../Buttons/VTButton";
import { api } from "../../../utils";
import { toasts } from "../AppPage";
import { refresh } from "../../../App";
import { Dialog, DialogContentText, DialogActions, DialogContent } from "@material-ui/core";

function CheckoutPremiumDialog(title, feature, open, onClose) {
  console.log("in here premium");
  const goPremium = () => {
    api
      .setPremium(true)
      .then((res) => {
        toasts.toastSuccess("Congratulations, you are now a Premium user!");
        refresh();
        onClose();
      })
      .catch((err) => toasts.toastError("Something went wrong while communicating with the server..."));
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="checkout-premium">
      <VoctailDialogTitle>{title}</VoctailDialogTitle>
      <DialogContent>
        <DialogContentText>{feature} is only possible for our Premium users.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <VTButton secondary onClick={onClose}>
          Cancel
        </VTButton>
        <VTButton accept onClick={goPremium}>
          Check out Premium now!
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default CheckoutPremiumDialog;
