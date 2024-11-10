window.eval = null;

const mainCalc = document.querySelector("#calculator");
const inputDisplay = document.querySelector("#history");
const outputDisplay = document.querySelector("#result");
const allClear = document.querySelector('[data="all-clear"]');
const backButton = document.querySelector('[data="backspace"]');
const percentButton = document.querySelector('[data="percent"]');
const decimalButton = document.querySelector('[data="dot"]');
const equalsButton = document.querySelector('[data="calculate"]');
const operationButtons = document.querySelectorAll("[data-operator]");
const numberButtons = document.querySelectorAll("[data-number]");

//////// CALCULATOR CLASS ///////

const Calculator = class Calculator {
  constructor(inputDisplay, outputDisplay) {
    this.inp = inputDisplay;
    this.out = outputDisplay;
    this.inHist = [];
  }

  clearAllHistory() {
    this.inHist = [];
    this.updateInputDisplay();
    this.updateOutputDisplay("0");
  }

  backspace() {
    switch (this.getLastInputType()) {
      case "number":
        if (this.getLastInputValue() > 1) {
          this.editLastInput(this.getLastInputValue().slice(0, -1), "number");
        } else {
          this.deleteLastInput();
        }
        break;
      case "operator":
        this.deleteLastInput();
        break;
      default:
        return;
    }
  }

  insertNumber(value) {
    if (this.getLastInputType() === "number") {
      this.appendToLastInput(value);
    } else if (["operator", null].includes(this.getLastInputType())) {
      this.addNewInput(value, "number");
    } else {
      this.clearAllHistory();
      this.insertNumber(value);
    }
  }

  insertOperation(value) {
    switch (this.getLastInputType()) {
      case "number":
        this.addNewInput(value, "operator");
        break;
      case "operator":
        this.editLastInput(value, "operator");
        break;
      case "equals":
        let output = this.getOutputValue();
        this.clearAllHistory();
        this.addNewInput(output, "number");
        this.addNewInput(value, "operator");
        break;
      default:
        return;
    }
  }

  enterPoint() {
    if (
      this.getLastInputType() === "number" &&
      !this.getLastInputValue().includes(".")
    ) {
      this.appendToLastInput(".");
    } else if (["operator", null].includes(this.getLastInputType())) {
      this.addNewInput("0.", "number");
    }
  }

  generateResult() {
    if (["operator", "equals"].includes(this.getLastInputType())) return;
    const self = this;
    const simplifyExpression = (currExpr, operator) => {
      if (currExpr.indexOf(operator) < 0) {
        return currExpr;
      } else {
        let opInd = currExpr.indexOf(operator);
        let leftOpIdx = opInd - 1;
        let rightOpIdx = opInd + 1;
        let partialSol = self.performOperation(
          ...currExpr.slice(leftOpIdx, rightOpIdx + 1)
        );
        if ([null, undefined].includes(partialSol)) partialSol = '';
        currExpr.splice(leftOpIdx, 3, partialSol.toString());
        return simplifyExpression(currExpr, operator);
      }
    };
    let result = ['*', '/', '+', '-'].reduce(
      simplifyExpression,
      this.getAllInputValues()
    );
    this.addNewInput('=', 'equals');
    this.updateOutputDisplay(result.toString());
  }

  performOperation(left, operator, right) {
    switch (operator) {
      case "*":
        return Number(left) * Number(right);
      case "/":
        return Number(left) / Number(right);
      case "+":
        return Number(left) + Number(right);
      case "-":
        return Number(left) - Number(right);
      default:
        return;
    }
  }

  changePercentToDecimal() {
    if (this.getLastInputType() === "number") {
      this.editLastInput(this.getLastInputValue() / 100, "number");
    }
  }

  getAllInputValues() {
    return this.inHist.map((entry) => entry.value);
  }

  updateInputDisplay() {
    let val = "",
      pstr = (inp) => {
        if(inp.startsWith('-')) inp = '(' + inp + ')';
        return inp;
      };
    for (var i = 0; i < this.inHist.length; i++) {
      val += " " + (this.inHist[i].type === 'number' ? pstr(this.inHist[i].value.toString()) : this.inHist[i].value.toString());
    }
    this.inp.value = val.substring(1);
  }

  updateOutputDisplay(value) {
    this.out.value = value;
  }

  getLastInputType() {
    return this.inHist.length == 0
      ? null
      : this.inHist[this.inHist.length - 1].type;
  }

  getLastInputValue() {
    return this.inHist.length == 0
      ? null
      : this.inHist[this.inHist.length - 1].value;
  }

  getOutputValue() {
    return this.out.value;
  }

  addNewInput(value, type) {
    this.inHist.push({ value: value.toString(), type: type });
    this.updateInputDisplay();
  }

  appendToLastInput(value) {
    this.inHist[this.inHist.length - 1].value += value.toString();
    this.updateInputDisplay();
  }

  editLastInput(value, type) {
    this.deleteLastInput();
    this.addNewInput(value, type);
  }

  deleteLastInput() {
    this.inHist.pop();
    this.updateInputDisplay();
  }
};

const calculator = new Calculator(inputDisplay, outputDisplay);

allClear.addEventListener("click", (event) => {
  calculator.clearAllHistory();
});

backButton.addEventListener("click", (event) => {
  calculator.backspace();
});

percentButton.addEventListener("click", (event) => {
  calculator.changePercentToDecimal();
});

decimalButton.addEventListener("click", (event) => {
  calculator.enterPoint();
});

equalsButton.addEventListener("click", (event) => {
  calculator.generateResult();
});

operationButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    calculator.insertOperation(event.target.dataset.operator);
  });
});

numberButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    calculator.insertNumber(event.target.dataset.number);
  });
});

