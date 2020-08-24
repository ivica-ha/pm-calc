import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../globalStyles";
import { lightTheme, darkTheme } from "../themes";
import "./calculator.css";
import Light from "../../images/sun.svg";
import Dark from "../../images/moon.svg";

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [query, setQuery] = useState("");
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const [theme, setTheme] = useState("light");
  const inputRef = useRef();

  const operators = ["*", "-", "+", "/", "."];
  const cursorStart = currentPosition[0];
  const cursorEnd = currentPosition[1];

  const lightThemeToggle = () => {
    setTheme("light");
  };
  const darkThemeToggle = () => {
    setTheme("dark");
  };

  const setPosition = (startPos, endPos, startRange, endRange) => {
    setCurrentPosition([startPos, endPos]);
    inputRef.current.setSelectionRange(startRange, endRange);
  };

  useEffect(() => {
    if (query.length) {
      fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setResult(result);
            setCurrentPosition([0, 0]);
          },
          (error) => {
            setResult("error");
          }
        );
    }
  }, [query]);

  const isOperatorDisabled = () => {
    let leftSubs = expression.substring(cursorStart - 1, cursorStart);
    let rightSubs = expression.substring(cursorStart, cursorStart + 1);

    if (leftSubs === "." || rightSubs === ".") {
      return true;
    }

    if (operators.includes(leftSubs) || operators.includes(rightSubs)) {
      return true;
    }

    if (leftSubs === "(" || rightSubs === ")") {
      return true;
    }

    if (!expression.length || result !== "") {
      return true;
    }
    return false;
  };

  const isBracketDisabled = (value) => {
    let leftSubs = expression.substring(cursorStart - 1, cursorStart);
    let rightSubs = expression.substring(cursorStart, cursorStart + 1);

    if (leftSubs === "." || rightSubs === ".") {
      return true;
    }
    if (operators.includes(leftSubs) && value === ")") {
      return true;
    }
    if (operators.includes(rightSubs) && value === "(") {
      return true;
    }
    return false;
  };

  const isEqualDisabled = () => {
    let leftSubs = expression.substring(
      expression.length - 1,
      expression.length
    );
    return operators.includes(leftSubs) || leftSubs === "(" || leftSubs === ".";
  };

  const moveCursor = (i) => {
    if (cursorStart === 0 && i === "<") {
      return;
    }
    if (cursorStart === expression.length && i === ">") {
      return;
    }

    if (i === "<") {
      if (cursorStart === cursorEnd) {
        setPosition(
          cursorStart - 1,
          cursorStart - 1,
          cursorStart - 1,
          cursorStart - 1
        );
      } else {
        setPosition(cursorStart, cursorStart, cursorStart, cursorStart);
      }
    } else {
      if (cursorStart === cursorEnd) {
        setPosition(
          cursorStart + 1,
          cursorStart + 1,
          cursorStart + 1,
          cursorStart + 1
        );
      } else {
        setPosition(cursorEnd, cursorEnd, cursorEnd, cursorEnd);
      }
    }
    inputRef.current.focus();
  };

  const renderNumberButton = (i) => {
    return (
      <Button
        className={`d-flex calculator--btn ${i === 0 ? "zero" : ""}`}
        value={i}
        onClick={(value) => {
          if (result) {
            setResult("");
            setExpression(value);
          } else {
            setExpression(
              expression.substring(0, cursorStart) +
                value +
                expression.substring(cursorEnd)
            );
          }
          setPosition(cursorStart + 1, cursorStart + 1, cursorStart, cursorEnd);
        }}
      />
    );
  };

  const renderBracketsButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn func"
        value={i}
        onClick={(value) => {
          if (result !== "") {
            setResult("");
            setExpression(value);
          } else {
            setExpression(
              expression.substring(0, cursorStart) +
                value +
                expression.substring(cursorEnd)
            );
          }

          setPosition(cursorStart + 1, cursorStart + 1, cursorStart, cursorEnd);
        }}
        disabled={isBracketDisabled(i)}
      />
    );
  };

  const renderDeleteButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn func"
        value={i}
        onClick={(value) => {
          if (!cursorStart && !cursorEnd && result === "") {
            return;
          }
          if (expression.length === 1 || result !== "") {
            setExpression("");
            setResult("");
            setCurrentPosition([0, 0]);
          } else {
            setExpression(
              expression.substring(0, cursorStart - 1) +
                expression.substring(cursorStart)
            );
            setPosition(
              cursorStart - 1,
              cursorStart - 1,
              cursorStart,
              cursorEnd
            );
          }
        }}
      />
    );
  };

  const renderOperatorButton = (i) => {
    return (
      <Button
        className={`d-flex calculator--btn ${i === "." ? "dot" : "operator"}`}
        value={i}
        onClick={(value) => {
          setExpression(
            expression.substring(0, cursorStart) +
              value +
              expression.substring(cursorEnd)
          );

          setPosition(cursorStart + 1, cursorStart + 1, cursorStart, cursorEnd);
        }}
        disabled={isOperatorDisabled()}
      />
    );
  };

  const renderNavButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn nav"
        value={i}
        onClick={() => {
          moveCursor(i);
        }}
      />
    );
  };

  const renderEqualButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn equal"
        value={i}
        onClick={() => {
          setQuery(expression);
        }}
        disabled={isEqualDisabled()}
      />
    );
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <div className="container">
          <section className="calculator" id="calculator">
            <div className="calculator--theme-switch d-flex flex-wrap">
              <div className="calculator--theme-switch--light d-flex w-50 justify-content-center">
                <span>
                  <img
                    className={theme === "light" ? "active" : ""}
                    onClick={lightThemeToggle}
                    src={Light}
                    alt="light switch"
                  />
                </span>
              </div>
              <div className="calculator--theme-switch--dark d-flex w-50 justify-content-center">
                <span>
                  <img
                    alt="dark switch"
                    className={theme === "dark" ? "active" : ""}
                    src={Dark}
                    onClick={darkThemeToggle}
                  />
                </span>
              </div>
            </div>
            <div className="calculator--display d-flex flex-wrap">
              <div className="d-flex w-20 calculator--nav-btns flex-column">
                {renderNavButton("<")}
                {renderNavButton(">")}
              </div>
              <div className="calculator--results w-80 d-flex flex-wrap">
                <input
                  className={"w-100 text-right expression"}
                  value={expression}
                  ref={inputRef}
                  onChange={(e) => setExpression(e.target.value)}
                />
                <input
                  className={"w-100 text-right result"}
                  value={result}
                  placeholder={"0"}
                  readOnly
                />
              </div>
            </div>
            <div className="calculator--num">
              <div className="d-flex justify-content-between">
                {renderDeleteButton("C")}
                {renderBracketsButton("(")}
                {renderBracketsButton(")")}
                {renderOperatorButton("/")}
              </div>
              <div className="d-flex justify-content-between">
                {renderNumberButton(7)}
                {renderNumberButton(8)}
                {renderNumberButton(9)}
                {renderOperatorButton("*")}
              </div>
              <div className="d-flex justify-content-between">
                {renderNumberButton(4)}
                {renderNumberButton(5)}
                {renderNumberButton(6)}
                {renderOperatorButton("-")}
              </div>
              <div className="d-flex justify-content-between">
                {renderNumberButton(1)}
                {renderNumberButton(2)}
                {renderNumberButton(3)}
                {renderOperatorButton("+")}
              </div>
              <div className="d-flex justify-content-between">
                {renderNumberButton(0)}
                {renderOperatorButton(".")}
                {renderEqualButton("=")}
              </div>
            </div>
          </section>
        </div>
      </>
    </ThemeProvider>
  );
}

function Button(props) {
  return (
    <button
      className={props.className}
      value={props.value}
      onClick={(e) => {
        props.onClick(e.target.value);
      }}
      disabled={props.disabled}
    >
      {props.value === "/" ? "÷" : props.value}
    </button>
  );
}

export default Calculator;
