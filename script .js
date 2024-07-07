const start_btn = document.querySelector(".start-btn");
const skip_btn = document.querySelector(".buttons button");
const que_count = document.querySelector("#ques-count");
const timer_cont = document.querySelector('.timer');
const question_cont = document.querySelector('.ques-cont');
const option_cont = document.querySelector('.options-cont');
let minutes=1;
let totalTime=minutes*60;
let intervalID;
let totalQuestions=20;
let question=1;
let questionIndex= 0;
let questions = [];
let marks = 0;


async function fetchQuestions() {
    try{
        const response = await fetch('https://opentdb.com/api.php?amount=20&type=multiple');
        const data = await response.json();

        questions = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correct_answer: q.correct_answer
        }));

        displayQuestions();
        startTimer();
    }
     catch(error){
        console.error('Error fetching questions',error);
     }
}

//Displaying questions

function displayQuestions(){
    if(questionIndex<totalQuestions){
        const question = questions[questionIndex];
        question_cont.innerHTML = question.question;
        option_cont.innerHTML = '';
        question.options.forEach(option =>{
            const button = document.createElement('button');
            button.innerHTML = option;
            button.addEventListener('click', () =>selectOption(option,button));
            option_cont.appendChild(button);
        });
        que_count.innerText = `${questionIndex + 1}/${totalQuestions}`;
    }
    else{
        clearInterval(intervalID);
        alert(`Submitted Your score is ${marks}`);
    }
}


// function selectOption(selectedOption) {
//     // Logic to handle selected option
//     console.log(`Selected: ${selectedOption}`);
//     if (questions[questionIndex].correct_answer === selectedOption) {
//         marks++;
//         console.log('Correct!');
//     } else {
//         console.log('Incorrect!');
//     }
//     questionIndex++;
//     resetTimer();
//     displayQuestions();
// }


function selectOption(selectedOption, selectedButton) {
    const correctAnswer = questions[questionIndex].correct_answer;
    const buttons = option_cont.querySelectorAll('button');
    
    buttons.forEach( button => {
        if (button.innerHTML === correctAnswer) {
            button.classList.add('correct-answer');
        }
       
        
    });
    
    if (selectedOption === correctAnswer) {
        marks++;
    }
    else{
        selectedButton.classList.add('wrong-answer');
    }
    
    setTimeout(() => {
        questionIndex++;
        resetTimer();
        displayQuestions();
    }, 1000); 
}


// to start the quiz

start_btn.addEventListener("click",()=>{
    start_btn.style.display="none";
    document.querySelector(".quiz-container").style.display="block";
    fetchQuestions();
    startTimer();
});

//Skip btn
skip_btn.addEventListener("click",()=>{
    
    questionIndex++;
    if (questionIndex < totalQuestions) {
        que_count.innerText = `${questionIndex + 1}/${totalQuestions}`;
        resetTimer();
        displayQuestions();
    } else {
        clearInterval(intervalID);
        alert(`Quiz completed! Your score is ${score}/${totalQuestions}`);
    }
})

//startTimer function

function startTimer(){
    if(intervalID){
        clearInterval(intervalID);
    }
    intervalID = setInterval(timer,1000);
}

//resetTimer function
function resetTimer(){
    totalTime=1*60;
    startTimer();
}


//Timer function
function timer(){
    let seconds = totalTime%60;
    minutes=Math.floor(totalTime/60);
    seconds=seconds<10?'0'+seconds:seconds;
    timer_cont.innerText=`0${minutes}:${seconds}`;
    totalTime--;
    if(totalTime<0){
        clearInterval(intervalID);
        question++;
        que_count.innerText=`${question}/20`;
        resetTimer();
        displayQuestions();
    }
}

