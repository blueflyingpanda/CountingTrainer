var manyNumbers = Array.from(Array(10000).keys());

function shuffle(array) {
    var tmp, current, top = array.length;
    while(top && --top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
}

function isNumber(str){
    let i = 0
    while (str[i]) {
        if (str[i] < "0" || str[i] > "9")
            return false;
        i++;
    }
    return true;
}

function utter(str){
    let phrase = new SpeechSynthesisUtterance(str);
    phrase.lang = 'ru-RU'
    speechSynthesis.speak(phrase);
}


$(document).ready(function() {
//
var btn = $("#check");
var head = $("#head");
var headline = $("#toPrint");
var output = $("#out");
var out = $("#output");
var userInput = $("#printed");
var stats = $("#stats");
var correctAnswer = $("#correct");
var incorrectAnswer = $("#incorrect");
var averageTime = $("#avrT");
var slider = $("#myRange");
var start, end, avrTime = 0, index = 0, incorrect = 0, correct = 0;
var input;

window.addEventListener("keydown", function(e){
    if(e.key == 'Shift'){
        if (stats.css('visibility') == 'hidden')
            stats.css('visibility', 'visible')
        else
            stats.css('visibility', 'hidden')
    }
    else if (e.key == 'Enter')
        btn.trigger('click');
});

manyNumbers = shuffle(manyNumbers);
var number = manyNumbers[index].toString();
var formatedNumber = "";

headline.html(number);

var stop = setInterval(function () {
    if (userInput.val().length){
        if (!start)
            start = performance.now();
        headline.html(number.length);
        output.html("");
    }
    else {
        headline.html(number);
        output.html(formatedNumber);
    }
}, 100)

function highlightMistake(input){
    if (!isNumber(input)) {
        alert("'" + input + "' не число"); //'12 3'
        return;
    }
    if (input.length > number.length){
        alert("Много цифр\n" + "Нужно: " + number.length + "\nУ тебя: " + input.length);
    }
    else if (input.length < number.length){
        alert("Мало цифр\n" + "Нужно: " + number.length + "\nУ тебя: " + input.length);
    }
    else {
        var i = 0;
        while (i < input.length && i < number.length) {
            if (input[i] == number[i]) {
                formatedNumber += "<span style='color:green'>"
                while (input[i] == number[i] && i < input.length && i < number.length) {
                    formatedNumber += input[i];
                    i++;
                }
                formatedNumber += "</span>";
            }
            else {
                formatedNumber += "<span style='color:red'>"
                while (input[i] != number[i] && i < input.length && i < number.length) {
                    formatedNumber += input[i];
                    i++;
                }
                formatedNumber += "</span>";
            }
        }
    }
}

btn.click(function () {
    if (userInput.val().length == 0)
        return;
    formatedNumber = "";
    input = userInput.val().trim();
    userInput.val("");
    let timeDiff;
    if (input == number) {
        end = performance.now();
        timeDiff = Math.floor((end - start) / 1000);
        start = 0;
        index++;
        if (index >= manyNumbers.length) {
            index = 0;
            manyNumbers = shuffle(manyNumbers);
        }
        number = manyNumbers[index].toString();
        utter(number);
        if (avrTime == 0) {
            avrTime = timeDiff;
        } else {
            avrTime = Math.floor((avrTime * correct + timeDiff) / (correct + 1));
        }
        averageTime.text("среднее время ответа: " + avrTime + "сек");
        correctAnswer.text("верно: " + ++correct);
    } else {
        highlightMistake(input);
        incorrectAnswer.text("неверно: " + ++incorrect);
    }
});

head.click(function (){
    utter(number);
});

out.click(function (){
   utter(input)
});

slider.on('change', function (){
    console.log(slider.val());
    manyNumbers = Array.from(Array(Math.pow(10, slider.val())).keys());
    manyNumbers = shuffle(manyNumbers);
    console.log(manyNumbers.length);
    index = -1;
});
//
});
