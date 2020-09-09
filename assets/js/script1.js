const localStorageKey = 'wordSearchData';
const localStorageKey1 = 'wordRandomData';
const MAX_SEARCH_HISTORY = 5;
var searchHistory;
var inputEl = document.getElementById("wordText");
var wordBtnEl = document.getElementById("wordBtn");
var today = moment();
today.hours(0);
today.minutes(0);
today.milliseconds(0);

// var wodModalText - this variable hold the word of the day that was retrieved TODAY.
//           If wodModalText === '' then when the user presses the "word of the day" button,
//           call the fetch API to retrieve a new word.
//           If wodModalText !== '' then when the user presses the "word of the day " button,
//           just display the word that is stored in wodModalText.

// -=-Begin modal for word of the day-=-
// Get the modal
var modal = document.getElementById("wodModal");
// Get the button that opens the modal
var btn = document.getElementById("wodBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
       modal.style.display = "block";
   }
//   When the user clicks on <span> (x), close the modal
span.onclick = function() {
       modal.style.display = "none";
   }
//   When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
   if (event.target == modal) {
       modal.style.display = "none";
   }
};
// -=-END CODE FOR THE MODAL FUNCTION-=-

function logAttributes(obj) {
    if (document.getElementById("output-div") != null) {
        document.getElementById("output-div").remove();
    }

    let outputDivEl = document.createElement('div');
    outputDivEl.id = "output-div";
    document.getElementById('word-display').appendChild(outputDivEl);

    let wordNameEl = document.createElement("p");
    if (typeof obj[0].hwi !== 'undefined') {
        wordNameEl.innerHTML = 'Word: ' + obj[0].hwi.hw;
    } else {
        wordNameEl.innerHTML = 'Word not found!';
    }
    document.getElementById('output-div').appendChild(wordNameEl);

    let wordPronEl = document.createElement('p');
    if (typeof obj[0].hwi !== 'undefined') {
        wordPronEl.innerHTML = 'Pronunciation: ' + obj[0].hwi.prs[0].mw;
    }
    document.getElementById('output-div').appendChild(wordPronEl)

    let wordDescripEl = document.createElement('p');
    if (typeof obj[0].hwi !== 'undefined') {
        wordDescripEl.innerHTML = 'Definition: ' + obj[0].shortdef[0];
    }
    document.getElementById('output-div').appendChild(wordDescripEl);

    if (typeof obj[0].hwi !== 'undefined') {
        let audio = new Audio('https://media.merriam-webster.com/audio/prons/en/us/mp3/' + obj[0].hwi.prs[0].sound.audio[0] + '/' + obj[0].hwi.prs[0].sound.audio + '.mp3');
        let playBtnEl = document.createElement('button');
        playBtnEl.textContent = 'Play';
        playBtnEl.id = 'play-btn';
        document.getElementById('output-div').appendChild(playBtnEl);
        document.getElementById('play-btn').addEventListener('click', function() {
            event.preventDefault();
            audio.play();
        });
    }
}

function getApiData(searchText) {
    fetch('https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + searchText + '?key=ec647c6b-fb7b-4fbf-a04f-e2348323bb08')
        .then(res => res.json()).then(json => logAttributes(json));
        updateSearchHistory(searchText);
}

// This line is for getting the random word
//var randomWord = function() {
function randomWord() {
    console.log("Entering randomWord()");
    recallRandomWord();
    console.log("In random word.  wodModalText = " + wodModalText);
    if (wodModalText === "") {
        console.log("Calling the rand word API");
    fetch("https://wordsapiv1.p.rapidapi.com/words/?random=true", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "e8fc098c2emsh10a4d146e4331acp1b1ed0jsn40b66b5dada6"
            }
        })
        .then(function(response) {
            return response.json();
        }).then(function(response) {
           var wodModalText = response.word //changed, getting the data from
           updateRandomWord(wodModalText);
           console.log(wodModalText);
        })
        .catch(err => {
            console.log(err);
        });
    }
    displayRandomWord();
};


function displayRandomWord() {
            // assign the data variables
            //var word = response.word
            var word = wodModalText;  //changed

           
            //var wordTitle = document.querySelector("#title-container")
            var defBody = document.querySelector("#wodText")

            // Empty out the h4 and the p elements for the random word
            // wordTitle.innerHTML = "";
            defBody.innerHTML = "";


            // Create elements
            // Random word
            // var titleEl = document.createElement('h4');
            var bodyEl = document.createElement('h3');

            // giving the data an element
            // titleEl.textContent = word;
            bodyEl.textContent = word;

            // append the data element to the page
            // wordTitle.appendChild(titleEl);
            defBody.appendChild(bodyEl);

            //testing random word search history
            // updateSearchHistory(word);

}

// Uses the const localStorageKey listed above.
function recallSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    populateSearchHistory();
}


// Lower-case word to the check if it's in search history to locate if user typed:  "hi", "Hi" or "HI".
// Added a while loop to limit size of the array to 5 (or adjust the constant).
function updateSearchHistory(searchedWord) {
    searchedWord = searchedWord.toLowerCase();

    if (!searchHistory.includes(searchedWord)) {
        searchHistory.push(searchedWord);
        while (searchHistory.length > MAX_SEARCH_HISTORY) {
            searchHistory.shift(); //throwing away the first value in the list
        }
        localStorage.setItem(localStorageKey, JSON.stringify(searchHistory));
        populateSearchHistory();
    }
}


function populateSearchHistory() {
    var historyE1 = document.getElementById("searchHistoryList");
    // Display users and messages in the browser
    $('#searchHistoryList').empty();
    for (var i = 0; i < searchHistory.length; i++) {
        var p = document.createElement("p");
        p.innerHTML = searchHistory[i];
        historyE1.appendChild(p);
    }
}
//Uses the const localStorageKey1 listed above.
function recallRandomWord() {
    console.log("Entering recallRandomWord()");
    var randomWordData = JSON.parse(localStorage.getItem(localStorageKey1)) || [];
    if (randomWordData.length === 0 || today.diff(randomWordData[0], "L")) {
        //variable needs to be updated at this point in the code to run the local storage
        wodModalText = '';  // changed
    } else {
        console.log("Word of the day is: " + randomWordData[1]);
        wodModalText = randomWordData[1];
    }
}

// Here's what the random word data looks like:
//   randomWordData = [ date, wordOfTheDay ]
//   randomWordData[0] === the date that the data was retrieved
//   randomWordData[1] === the word that was retrieved on the date stored in [0]

function updateRandomWord(randomWord) {
    console.log("Entering updateRandomWord()");
    localStorage.setItem(localStorageKey1, JSON.stringify([today, randomWord]));
}

// This will load up the search history when the page is loaded.
recallSearchHistory();
randomWord();


wordBtnEl.addEventListener("click", function(event) {
    if (inputEl.value !== '') {
        event.preventDefault();
        getApiData(inputEl.value);
    }
});
