//This page will be used to test components

import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";
import styled, { css } from "styled-components";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  headuptext: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },
});

function MaterialCardWithContentAndActionButtons(props) {
  return (
    <Container {...props}>
      <CardItem1Style>
        <HeaderStyle>
          <LeftImage src={require("../images/logo_green.png")}></LeftImage>
          <HeaderContent>
            <TextStyle>Title</TextStyle>
            <NoteTextStyle>Subhead</NoteTextStyle>
          </HeaderContent>
        </HeaderStyle>
      </CardItem1Style>
      <CardItemImagePlace src={require("../images/logo_green.png")}></CardItemImagePlace>
      <Body>
        <BodyText>BuilderX is a screen design tool which codes React Native for you.</BodyText>
      </Body>
      <ActionBody>
        <ActionButton1>
          <ButtonOverlay>
            <ActionText1>ACTION 1</ActionText1>
          </ButtonOverlay>
        </ActionButton1>
        <ActionButton2>
          <ButtonOverlay>
            <ActionText2>ACTION 2</ActionText2>
          </ButtonOverlay>
        </ActionButton2>
      </ActionBody>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  border-width: 1px;
  border-radius: 2px;
  border-color: #ccc;
  flex-wrap: nowrap;
  background-color: #fff;
  overflow: hidden;
  flex-direction: column;
  border-style: solid;
  box-shadow: -2px 2px 1.5px 0.1px #000;
`;

const ButtonOverlay = styled.button`
  display: block;
  background: none;
  height: 100%;
  width: 100%;
  border: none;
`;
const CardItem1Style = styled.div`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  height: 72px;
  display: flex;
`;

const HeaderStyle = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  align-items: center;
  display: flex;
`;

const LeftImage = styled.img`
  height: 40px;
  width: 100%;
  background-color: #ccc;
  border-radius: 20px;
`;

const HeaderContent = styled.div`
  padding-left: 16px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`;

const TextStyle = styled.span`
  font-family: Roboto;
  font-size: 16px;
  color: #000;
  line-height: 20px;
`;

const NoteTextStyle = styled.span`
  font-family: Roboto;
  font-size: 14px;
  color: #000;
  line-height: 16px;
  opacity: 0.5;
`;

const CardItemImagePlace = styled.img`
  background-color: #ccc;
  flex: 1 1 0%;
  min-height: 210px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  padding: 16px;
  flex-direction: column;
  display: flex;
`;

const BodyText = styled.span`
  font-family: Arial;
  line-height: 20px;
  font-size: 14px;
  color: #424242;
`;

const ActionBody = styled.div`
  padding: 8px;
  flex-direction: column;
  display: flex;
`;

const ActionButton1 = styled.div`
  padding: 8px;
  height: 36px;
  flex-direction: column;
  display: flex;
  border: none;
`;

const ActionText1 = styled.span`
  font-family: Arial;
  font-size: 14px;
  color: #000;
  opacity: 0.9;
`;

const ActionButton2 = styled.div`
  padding: 8px;
  height: 36px;
  flex-direction: column;
  display: flex;
  border: none;
`;

const ActionText2 = styled.span`
  font-family: Arial;
  font-size: 14px;
  color: #000;
  opacity: 0.9;
`;

function HeadUpText(props) {
  const styles = useStyles();
  return <Typography className={styles.headuptext}>{props.text}</Typography>;
}

function ClassroomsCreatePage({ ...props }) {
  const classes = useStyles();

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <HeadUpText text="This page is used for testing." />
      <MaterialCardWithContentAndActionButtons
        style={{
          height: 499,
          width: 460,
          borderRadius: 31,
          overflow: "visible",
        }}
      ></MaterialCardWithContentAndActionButtons>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
