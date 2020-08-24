import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../../components/globalStyles";
import { lightTheme, darkTheme } from "../../components/themes";
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

  const lightThemeToggle = () => {
    setTheme("light");
  };
  const darkThemeToggle = () => {
    setTheme("dark");
  };

  const setPosition = (j) => {
    if (j === "add") {
      setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1]);
    } else if (j === "del") {
      setCurrentPosition([currentPosition[0] - 1, currentPosition[0] - 1]);
    }
    inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1]);
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
              expression.substring(0, currentPosition[0]) +
                value +
                expression.substring(currentPosition[1])
            );
          }
          setPosition("add");
        }}
      />
    );
  };
  const renderFunctionalButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn func"
        value={i}
        onClick={(value) => {
          let leftSubs = expression.substring(
            currentPosition[0] - 1,
            currentPosition[0]
          );
          let rightSubs = expression.substring(
            currentPosition[0],
            currentPosition[0] + 1
          );
          if (result !== "") {
            setResult("");
            setExpression(value);
          } else {
            setExpression(
              expression.substring(0, currentPosition[0]) +
                value +
                expression.substring(currentPosition[1])
            );
          }
          if (leftSubs === "." || rightSubs === ".") {
            return;
          }
          if (operators.includes(leftSubs) && value === ")") {
            return;
          }
          if (operators.includes(rightSubs) && value === "(") {
            return;
          }

          setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1]);
          inputRef.current.setSelectionRange(
            currentPosition[0],
            currentPosition[1]
          );
        }}
      />
    );
  };
  const handleDeleteButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn func"
        value={i}
        onClick={(value) => {
          if (!currentPosition[0] && !currentPosition[1] && result === "") {
            return;
          }
          if (expression.length === 1 || result !== "") {
            setExpression("");
            setResult("");
            setCurrentPosition([0, 0]);
          } else {
            setExpression(
              expression.substring(0, currentPosition[0] - 1) +
                expression.substring(currentPosition[0])
            );
            setPosition("del");
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
            console.log(value)
          setExpression(
            expression.substring(0, currentPosition[0]) +
              value +
              expression.substring(currentPosition[1])
          );
          setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1]);
          inputRef.current.setSelectionRange(
            currentPosition[0],
            currentPosition[1]
          );
        }}
        disabled={isOperatorDisabled()}
      />
    );
  };
  const isOperatorDisabled = () => {
    let leftSubs = expression.substring(
      currentPosition[0] - 1,
      currentPosition[0]
    );
    let rightSubs = expression.substring(
      currentPosition[0],
      currentPosition[0] + 1
    );

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

  const moveCursor = (i) => {
    const start = currentPosition[0];
    const end = currentPosition[1];

    if (start === 0 && i === "<") {
      return;
    }
    if (start === expression.length && i === ">") {
      return;
    }

    if (i === "<") {
      if (start === end) {
        inputRef.current.setSelectionRange(start - 1, start - 1);
        setCurrentPosition([start - 1, start - 1]);
      } else {
        inputRef.current.setSelectionRange(start, start);
        setCurrentPosition([start, start]);
      }
    } else {
      if (start === end) {
        inputRef.current.setSelectionRange(start + 1, start + 1);
        setCurrentPosition([start + 1, start + 1]);
      } else {
        inputRef.current.setSelectionRange(end, end);
        setCurrentPosition([end, end]);
      }
    }

    inputRef.current.focus();
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
      // .then(setExpression(''))
    }
  }, [query]);

  const rendeEqualButton = (i) => {
    return (
      <Button
        className="d-flex calculator--btn equal"
        value={i}
        onClick={() => {
          let leftSubsi = expression.substring(
            expression.length - 1,
            expression.length
          );
          if (
            operators.includes(leftSubsi) ||
            leftSubsi === "(" ||
            leftSubsi === "."
          ) {
            return;
          } else {
            setQuery(expression);
          }
        }}
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
                    className={theme === 'light' ? 'active' : ''}
                    onClick={lightThemeToggle}
                    src={Light}
                    alt="light switch"
                  />
                </span>
              </div>
              <div className="calculator--theme-switch--dark d-flex w-50 justify-content-center">
                <span>
                  <img
                       alt='dark switch'
                       className={theme === 'dark' ? 'active' : ''}
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
                {handleDeleteButton("C")}
                {renderFunctionalButton("(")}
                {renderFunctionalButton(")")}
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
                {rendeEqualButton("=")}
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
        {props.value}
      {/*{props.value === '/' ? <span>&#247;</span> : props.value }*/}
    </button>
  );
}

export default Calculator;
