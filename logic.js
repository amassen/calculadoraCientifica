class CalculadoraBasica {

    /** La expresión regular proporcionada se utiliza para buscar patrones en cadenas de caracteres que representen operaciones matemáticas con números decimales. A continuación, se describe cada parte de la expresión regular:
    ([1-9][0-9]*|[0.]): Este grupo de captura coincide con un número entero mayor que cero o el número decimal 0. La expresión [1-9][0-9]* busca un número entero mayor que cero, mientras que [0.] busca el número decimal 0.
    (.[0-9]*[1-9])?: Este grupo de captura es opcional y coincide con un número decimal que contiene una parte fraccionaria. El punto . indica el comienzo de la parte fraccionaria. La expresión [0-9]* busca cero o más dígitos en la parte fraccionaria, mientras que [1-9] busca un dígito distinto de cero en la parte fraccionaria.
    [\-\+\*\/]: Este grupo de caracteres coincide con uno de los cuatro operadores matemáticos: resta -, suma +, multiplicación *, o división /.
    (([1-9][0-9]*|[0.])(.[0-9]*[1-9])?): Este grupo de captura coincide con otro número decimal, que puede ser opcional si la operación es una resta o suma. Este grupo sigue la misma estructura que el primer grupo de captura, con la adición de que también puede contener un punto decimal y una parte fraccionaria opcional.
    En resumen, la expresión regular busca patrones en cadenas de caracteres que representen operaciones matemáticas con números decimales que contienen al menos un operador matemático. Esta expresión regular puede ser utilizada para validar entradas de usuarios en una calculadora o aplicación similar. */

    constructor() {
        this.basicOperationShape = new RegExp("(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?[\-\+\*\/])(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?)");
        this.memoryRegister = 0;
    }


    printMemoryContents() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    subtractFromMemory() {
        this.memoryRegister -= this.solveOperation();
    }

    addToMemory() {
        this.memoryRegister += this.solveOperation();
    }

    writeToDisplay(data) {
        let legacy = document.getElementById("displayBox").value;
        if (data == ".") {
            legacy += data;
        } else {
            legacy = legacy == "0" ? data : legacy += data;
        }
        document.getElementById("displayBox").value = legacy;
    }

    writeOperatorToDisplay(operator) {
        let legacy = document.getElementById("displayBox").value;
        if (this.basicOperationShape.test(legacy)) {
            this.solveOperation();
        }
        this.writeToDisplay(operator);
    }

    clearDisplay() {
        document.getElementById("displayBox").value = "0";
    }

    solveOperation() {
        let operation = document.getElementById("displayBox").value;
        let result = 0;
        try {
            result = eval(operation == "" ? 0 : operation);
        } catch (err) {
            alert("Syntax error");
            this.clearDisplay();
        }
        document.getElementById("displayBox").value = result;
        return result;
    }

}

class CalculadoraCientifica extends CalculadoraBasica {

    constructor() {
        super();
        this.inputList = new Array();
        this.operationString = "";
        this.justSolved = false;
        this.operationMap = {
            "sin(": "Math.sin(",
            "cos(": "Math.cos(",
            "tan(": "Math.tan(",
            "log(": "Math.log10(",
            "ln(": "Math.log(",
            "sqrt(": "Math.sqrt(",
            "PI": "Math.PI",
            "e": "Math.E"
        };
    }

    /**
     * Writes new user input from the calculator buttons onto the
     * display.
     * 
     * @param {String} data The data to display on the screen.
     * Given by a button click from the user. 
     */
    /** Escribe una nueva entrada de usuario desde los botones de la calculadora al display de la misma. */
    writeToDisplay(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += data;
        this.inputList.push(data);
    }

    /**
     * Writes the operator clicked by the user to the screen.
     * 
     * @param {String} operator An string representing the operator 
     * that has been clicked on by the user. 
     */
    /** Escribe la operación clickeada por el usuario en la pantalla */
    writeOperatorToDisplay(operator) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        this.operationString += operator;
        super.writeToDisplay(operator);
        this.inputList.push(operator);
    }

    /**
     * Solves the operation currently displayed by the calculator.
     * If the syntax is not correct for a well formed arithmetic 
     * expression, the user will have an error prompted and the display
     * will be set to zero. Due to the complexity of the regular 
     * expression checking. This task of matching the whole set of 
     * possible operations would need a context-free gramar or some other
     * technique.
     * 
     * ~Taken from StackOverflow~
     * You can't find matching parentheses with regular expressions. 
     * This is a consequence of the pumping lemma for regular languages.
     * ~Taken from StackOverflow~
     */
    /** Resuelve la operación actualmente mostrada en el display.
     * Si la sintáxis es incorrecta el usuario recibe un aviso de error y luego regresara a 0.
     */
    solveOperation() {
        let result = 0;
        try {
            result = eval(this.operationString == "" || this.operationString == "Syntax Error" ? 0 : this.operationString);
        } catch (err) {
            result = "Syntax Error";
        }
        document.getElementById("displayBox").value = result;
        this.operationString = "";
        this.operationString += result;
        this.justSolved = true;
        return result;
    }

    /**
     * Clears the display screen.
     */
    clearDisplay() {
        super.clearDisplay();
        this.operationString = "";
    }

    toggleSign() {
        var displayBox = document.getElementById("displayBox");
        var displayContents = displayBox.value;
        if (displayContents == "Syntax Error") {
            super.clearDisplay();
        }
        if (displayContents == "0") {
            displayBox.value = "-";
            this.operationString += "-";
        } else {
            displayBox.value = "-" + displayBox.value;
            this.operationString = "-" + this.operationString;
        }
    }

    clearMemory() {
        super.subtractFromMemory(this.memoryRegister);
    }

    readMemory() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    saveToMemory() {
        this.memoryRegister = this.solveOperation();
    }

    eraseLastInput() {
        this.inputList.pop();
        var recreatedOperation = "";
        for (var each in this.inputList) {
            recreatedOperation += this.inputList[each];
        }
        document.getElementById("displayBox").value = recreatedOperation;
        for (var each in this.operationMap) {
            recreatedOperation = recreatedOperation.replace(each, this.operationMap[each]);
        }
        this.operationString = recreatedOperation;
    }

    writeMathFunction(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);
    }

    calculateFactorial() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        var result = 0;
        try {
            result = this.calculateRecursiveFactorial(number);
        } catch(err) {
            document.getElementById("displayBox").value = "That number is too big";
        }
        this.clearDisplay();
        document.getElementById("displayBox").value = result;
    }

    calculateRecursiveFactorial(number) {
        if (number == 1 || number == 0) {
            return 1;
        }
        return number * this.calculateRecursiveFactorial(number - 1);
    }

    nthTenPower() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(10, parseInt(number));
    }

    square() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(parseInt(number), 2);
    }

    cube() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(parseInt(number), 3);
    }

    inverseNumber() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(parseInt(number), -1);
    }

}

const calculadora = new CalculadoraCientifica();