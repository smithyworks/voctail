import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  unknown: { fontFamily: "inherit", backgroundColor: "blue", "&:hover": {} },
  known: { fontFamily: "inherit" },
});

function Word({ children, known, onMouseEnter, onMouseLeave, onClick }) {
  const classes = useStyles();

  const ref = useRef();
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (!known)
      setTimeout(() => {
        try {
          if (ref?.current?.matches(":hover") && !hoveredRef.current) {
            if (typeof onMouseEnter === "function") onMouseEnter(ref.current, children);
            hoveredRef.current = true;
          }
        } catch (err) {
          console.log(err);
        }
      }, 300);
  }, [known]); // eslint-disable-line

  const [t, setT] = useState();
  function enter() {
    if (known) return;
    setT(
      setTimeout(() => {
        hoveredRef.current = true;
        if (typeof onMouseEnter === "function") onMouseEnter(ref.current, children);
      }, 300)
    );
  }
  function leave() {
    if (known) return;
    if (t) clearTimeout(t);
    if (hoveredRef.current)
      setTimeout(() => {
        setT();
        if (typeof onMouseLeave === "function") onMouseLeave();
      }, 300);
    hoveredRef.current = true;
  }

  function click() {
    if (!known) return;
    if (typeof onClick === "function") {
      onClick(children);
    }
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={click}
        className={known ? classes.known : classes.unknown}
      >
        {children}
      </span>{" "}
    </>
  );
}

export default Word;
