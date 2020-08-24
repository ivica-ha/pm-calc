import React, { useState, useEffect, useRef } from "react";
import './calculator.css';



function Calculator() {

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [query, setQuery] = useState('');
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const inputRef = useRef();

  const operators = ['*', '-', '+', '/', '.'];

  const setPosition = j => {
    if(j === 'add') {
      setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1])
    } else if(j === 'del') {
      setCurrentPosition([currentPosition[0] -1, currentPosition[0] - 1])
    }
    inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1])
  }

  const renderNumberButton = i => {
    return <Button className={`d-flex calculator--btn ${i === 0 ? 'zero' : ''}`} 
    value={i}
    onClick={value => {
      if(result) {
        setResult('')
        setExpression(value)
      } else {
        setExpression(
          expression.substring(0, currentPosition[0]) + value +  expression.substring(currentPosition[1])
          )
      }
      setPosition('add')
      // setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1])
      // inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1])
    }}
    />;
  }
  const renderFunctionalButton = i => {
    return <Button className='d-flex calculator--btn func' value={i}
            onClick={value => {
              let leftSubs = expression.substring(currentPosition[0] -1, currentPosition[0])
              let rightSubs = expression.substring(currentPosition[0], currentPosition[0] + 1 )
              if(result !== '') {
                setResult('')
                setExpression(value)
              } else {
              setExpression(
                expression.substring(0, currentPosition[0]) + value +  expression.substring(currentPosition[1])
              )
              }
              if( (leftSubs === '.') || (rightSubs === '.') ) {
                return
              }
              if( operators.includes(leftSubs) && value === ')' ) {
                return
              }
              if( operators.includes(rightSubs) && value === '(' ) {
                return
              }

              setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1])
              inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1])

            }}

            />;
  }
  const handleDeleteButton = i => {
    return <Button className='d-flex calculator--btn func' value={i}
            onClick={value => {
              if( ! currentPosition[0] && ! currentPosition[1] && result === '') {
                return
              }
              if( expression.length === 1 || result !== '') {
                setExpression('')
                setResult('')
                setCurrentPosition([0,0])

              } else {
                setExpression(
                  expression.substring(0, currentPosition[0] -1) + expression.substring(currentPosition[0]) 
                  )
                  setPosition('del')
                  // setCurrentPosition([currentPosition[0] -1, currentPosition[0] - 1])
                  // inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1])
                  
              }

              
            }

            }
           
            />;
  }
  const renderOperatorButton = i => {
        return <Button 
        className='d-flex calculator--btn func' 
        value={i}
        onClick={value => {

          setExpression(
            expression.substring(0, currentPosition[0]) + value +  expression.substring(currentPosition[1])
          )
          setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1])
          inputRef.current.setSelectionRange(currentPosition[0], currentPosition[1])

        }}
        disabled={isOperatorDisabled()}
             />;
  }
  const isOperatorDisabled = () => {

    let leftSubs = expression.substring(currentPosition[0] -1, currentPosition[0])
    let rightSubs = expression.substring(currentPosition[0], currentPosition[0] + 1 )

    if( (leftSubs === '.') || (rightSubs === '.') ) {
      return true
    }

    if( operators.includes(leftSubs) || operators.includes(rightSubs) ) {
      return true
    }

    if( leftSubs === '(' || rightSubs === ')' ) {
      return true
    }

    if(!expression.length || result !== '') {
      return true
    }
    return false
    
  }

  const moveCursor = i => {
    const start = currentPosition[0];
    const end = currentPosition[1];

    if(start === 0 && i === '<') {
      return
    }
    if(start === expression.length && i === '>') {
      return
    }

    if(i === '<') {
      if(start === end) {
        inputRef.current.setSelectionRange(start -1,start -1)
        setCurrentPosition([start - 1, start - 1])
      } else {
        inputRef.current.setSelectionRange(start,start)
        setCurrentPosition([start, start])
      }
    } else {
      if(start === end) {
        inputRef.current.setSelectionRange(start +1,start +1)
        setCurrentPosition([start + 1, start + 1])
      } else {
        inputRef.current.setSelectionRange(end,end)
        setCurrentPosition([end, end])
      }
    }

    inputRef.current.focus()
  }
  const rendeNavButton = i => {

    return <Button className='d-flex calculator--btn nav' value={i}
    onClick={ () => {moveCursor(i)} }
             />;
  }

  useEffect(() =>
  {
    if(query.length) {
      fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(
        (result) => {
          setResult(result)
          setCurrentPosition([0,0])
        },
        (error) => {
          setResult('error')
        }
      )
      // .then(setExpression(''))
    }
  }, [query]);

  const rendeEqualButton = i => {
    return <Button className='d-flex calculator--btn equal' value={i}
            onClick={() => 
              {
                let leftSubsi = expression.substring(expression.length -1, expression.length )
                if( operators.includes(leftSubsi) || leftSubsi === '(' || leftSubsi === '.' ) {
                  return
                } else {
                  setQuery(expression)}
                }
                
              }
              
             />;
  }

  
  return (
    
<div className="container">
    <div className="toggle-container">
    </div>
    <section className="calculator" id="calculator">
        <div className="calculator--display">
        {rendeNavButton('<')}
        {rendeNavButton('>')}
          <input
          value={expression}
          ref={inputRef}
          onChange={e => setExpression(e.target.value)}
          />
          <input 
          value={result}
          readOnly
          />
          
        </div>
        <div className="calculator--num">
            <div className="d-flex justify-content-between">
                {handleDeleteButton('C')}
                {renderFunctionalButton('(')}
                {renderFunctionalButton(')')}
                {renderOperatorButton('/')}
            </div>
            <div className="d-flex justify-content-between">
              {renderNumberButton(7)}
              {renderNumberButton(8)}
              {renderNumberButton(9)}
              {renderOperatorButton('*')}
            </div>
            <div className="d-flex justify-content-between">
              {renderNumberButton(4)}
              {renderNumberButton(5)}
              {renderNumberButton(6)}
              {renderOperatorButton('-')}
            </div>
            <div className="d-flex justify-content-between">
                {renderNumberButton(1)}
                {renderNumberButton(2)}
                {renderNumberButton(3)}
                {renderOperatorButton('+')}
            </div>
            <div className="d-flex justify-content-between">
                {renderNumberButton(0)}
                {renderOperatorButton('.')}
                {rendeEqualButton('=')}
            </div>
        </div>
    </section>

</div>

  
  );
  }




function Button(props) {
  return(
  <button 
  className = {props.className} 
  value={props.value} 
  onClick={e => {props.onClick(e.target.value)}}
  disabled={props.disabled}
  >
    {props.value}
      </button>
    );
}





export default Calculator;
