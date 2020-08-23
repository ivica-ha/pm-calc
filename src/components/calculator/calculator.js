import React, { useState, useEffect, useRef } from "react";
import './calculator.css';



function Calculator() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     error: null,
  //     isLoaded: false,
  //     items: []
  //   };
  // }

  // const componentDidMount = i => {
  //   fetch(`http://api.mathjs.org/v4/?${sum}`)
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           isLoaded: true,
  //           items: result
  //         });
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error
  //         });
  //       }
  //     )
  // }


  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [query, setQuery] = useState('');
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const inputRef = useRef();

  const operators = ['*', '-', '+', '/', '.'];

  const renderNumberButton = i => {
    return <Button className={`d-flex calculator--btn ${i === 0 ? 'zero' : ''}`} 
    value={i}
    onClick={value => {
      console.log('*',inputRef.current.selectionStart, inputRef.current.selectionEnd);
      setExpression(
      expression.substring(0, currentPosition[0]) + value +  expression.substring(currentPosition[1])
      
      )
      setCurrentPosition([currentPosition[0] + 1, currentPosition[0] + 1])

    }}
    />;
  }
  const renderFunctionalButton = i => {
    return <Button className='d-flex calculator--btn func' value={i}
            onClick={value => {
              if( expression.substring(0, expression.length - 1) !== value ) {
                setExpression(expression + value)
              }
              
            }}
            />;
  }
  const handleDeleteButton = i => {
    return <Button className='d-flex calculator--btn func' value={i}
            onClick={value => setExpression(expression.substring(0, expression.length - 1)
              )}
           
            />;
  }
  const renderOperatorButton = i => {
        return <Button 
        className='d-flex calculator--btn func' 
        value={i}
        onClick={value => {
          if( (! operators.includes(expression.slice(-1))) ) {
            setExpression(expression + value)
          }
        }}
        disabled={!expression.length}
             />;
  }
  const moveCursor = i => {
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;

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
    onClick={ () => moveCursor(i) }
             />;
  }

  useEffect(() =>
  {
    if(query.length) {
      fetch(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(
        (result) => {
          setResult(result)
        },
        (error) => {
          console.log(6*(2+4));
        }
      )
    }
  }, [query]);

  const rendeEqualButton = i => {
    return <Button className='d-flex calculator--btn equal' value={i}
            onClick={() => setQuery(expression)}
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
          {/* <input 
          value="text"
          autoFocus
          ref={inputRef}
          // onClick={ () => inputRef.current.setSelectionRange(2,2)}
          />
           <button 
           onClick={ () => {
            console.log('bla', inputRef)
            inputRef.current.setSelectionRange(2,2)
            inputRef.current.focus()} }
           value="bok"
           /> */}
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
