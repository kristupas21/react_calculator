import React from 'react';
import './calculator.scss';

const Operations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue
};

export class CalculatorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: "0",
      waitingForOperand: false,
      operator: null,
      value: null
    };
    this.inputDigit = this.inputDigit.bind(this);
  }
  inputDigit(digit) {
    const { displayValue, waitingForOperand } = this.state;
    if (waitingForOperand) {
      this.setState({
        displayValue: (String(digit)).substring(0,10),
        waitingForOperand: false
      });
    } else {
      this.setState({
        displayValue: displayValue === "0" ? String(digit) : (displayValue + digit).substring(0,10)
      });
    }

  }
  inputDot() {
    const { displayValue, waitingForOperand } = this.state;
    if (waitingForOperand) {
      this.setState({
        displayValue: ".",
        waitingForOperand: false
      });
    } else if (displayValue.indexOf(".") === -1) {
      this.setState({
        displayValue: displayValue + ".",
        waitingForOperand: false
      });
    }
  }
  clearDisplay() {
    this.setState({
      displayValue: "0"
    });
  }
  clearAll() {
    this.setState({
      displayValue: "0",
      value: null,
      waitingForOperand: false,
      operator: null
    });
  }
  toggleSign() {
    const { displayValue } = this.state;
    this.setState({
      displayValue: displayValue.charAt(0) === "-" ? displayValue.substr(1) : "-" + displayValue
    });
  }
  inputPercent() {
    const { displayValue } = this.state;
    const value = parseFloat(displayValue);
    this.setState({
      displayValue: String(value / 100)
    });
  }
  operate(nextOperator) {
    const { displayValue, operator, value } = this.state;
    const nextValue = parseFloat(displayValue);

    if (value == null) {
      this.setState({
        value: nextValue
      })
    } else if (operator) {
        const currentValue = value || 0;
        const newValue = Operations[operator](currentValue, nextValue);
        this.setState({
          value: newValue,
          displayValue: (String(newValue)).substring(0,10)
        })
      }
    this.setState({
      waitingForOperand: true,
      operator: nextOperator
    });
  }
  handleKeyDown(e) {
    let { key } = e;
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    if (key === "Enter") {
      let keyEnter = "="
      this.operate(keyEnter);
    }
    if (/\d/.test(key)) {
      this.inputDigit(parseInt(key, 10));
    } else if (key in Operations) {
      this.operate(key);
    } else if (key === ".") {
      this.inputDot();
    } else if (key === "%") {
      this.inputPercent();
    } else if (key === "Delete") {
      e.preventDefault();
      if(this.state.displayValue !== "0") {
        this.clearDisplay();
      } else {
        this.clearAll();
      }
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  render() {
    return (
      <div className="col-sm-12 calculator">
        <div className="calculator-display">{this.state.displayValue}</div>
        <div className="calculator-keypad">
          <button className="calculator-key function-key" id="key-clear" onClick={() => this.clearDisplay()}>AC</button>
          <button className="calculator-key function-key" id="key-sign" onClick={() => this.toggleSign()}>±</button>
          <button className="calculator-key function-key" id="key-percent" onClick={() => this.inputPercent()}>%</button>
          <button className="calculator-key operator-key" id="key-divide" onClick={() => this.operate("/")}>÷</button>

          <button className="calculator-key" id="key-7" onClick={() => this.inputDigit(7)}>7</button>
          <button className="calculator-key" id="key-8" onClick={() => this.inputDigit(8)}>8</button>
          <button className="calculator-key" id="key-9" onClick={() => this.inputDigit(9)}>9</button>
          <button className="calculator-key operator-key" id="key-multiply" onClick={() => this.operate("*")}>×</button>

          <button className="calculator-key" id="key-4" onClick={() => this.inputDigit(4)}>4</button>
          <button className="calculator-key" id="key-5" onClick={() => this.inputDigit(5)}>5</button>
          <button className="calculator-key" id="key-6" onClick={() => this.inputDigit(6)}>6</button>
          <button className="calculator-key operator-key" id="key-subtract" onClick={() => this.operate("-")}>−</button>

          <button className="calculator-key" id="key-1" onClick={() => this.inputDigit(1)}>1</button>
          <button className="calculator-key" id="key-2" onClick={() => this.inputDigit(2)}>2</button>
          <button className="calculator-key" id="key-3" onClick={() => this.inputDigit(3)}>3</button>
          <button className="calculator-key operator-key" id="key-add" onClick={() => this.operate("+")}>+</button>

          <button className="calculator-key" id="key-0" onClick={() => this.inputDigit(0)}>0</button>
          <button className="calculator-key" id="key-dot" onClick={() => this.inputDot()}>.</button>
          <button className="calculator-key operator-key" id="key-equals" onClick={() => this.operate("=")}>=</button>
        </div>
      </div>
    );
  }
}
