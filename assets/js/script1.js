const localStorageKey = 'wordSearchData';
const MAX_SEARCH_HISTORY = 5;
var searchHistory;
var inputEl = document.getElementById("wordText");
var wordBtnEl = document.getElementById("wordBtn");

// -=-Begin modal for word of the day-=-
// need moment.js hooked up to this
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
    // When the user clicks on <span> (x), close the modal
span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
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
    wordNameEl.innerHTML = 'Word: ' + obj[0].hwi.hw;
    document.getElementById('output-div').appendChild(wordNameEl);

    let wordPronEl = document.createElement('p');
    wordPronEl.innerHTML = 'Pronunciation: ' + obj[0].hwi.prs[0].mw;
    document.getElementById('output-div').appendChild(wordPronEl)

    let wordDescripEl = document.createElement('p');
    wordDescripEl.innerHTML = 'Definition: ' + obj[0].shortdef[0];
    document.getElementById('output-div').appendChild(wordDescripEl);

    let audio = new Audio('https://media.merriam-webster.com/audio/prons/en/us/mp3/' + obj[0].hwi.prs[0].sound.audio[0] + '/' + obj[0].hwi.prs[0].sound.audio + '.mp3');
    let playBtnEl = document.createElement('button');
    playBtnEl.textContent = 'Play';
    playBtnEl.id = 'play-btn';
    document.getElementById('output-div').appendChild(playBtnEl);
    document.getElementById('play-btn').addEventListener('click', function() {
        audio.play();
    });
}

function getApiData(searchText) {
    fetch('https://www.dictionaryapi.com/api/v3/references/collegiate/json/' + searchText + '?key=ec647c6b-fb7b-4fbf-a04f-e2348323bb08')
        .then(res => res.json()).then(json => logAttributes(json));
}

//var randomWord = function() {
function randomWord() {
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
            // assign the data variables
            var word = response.word

            // the api does not give the definition
            // Will have to tell the user that there is no definition
            var definition
            if (response.results === undefined || response.results.length === 0) {
                definition = "Definition Not Available"
            } else {
                definition = response.results[0].definition;
            };

            // Create variables for the h4 and the p elements to define
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
            updateSearchHistory(word);



        })
        .catch(err => {
            console.log(err);
        });
};

// This is the error modal that the user sees instead of alerts

// Uses the const localStorageKey listed above.
function recallSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    showItem();
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
        showItem();
    }
}


// Change "searchOfWords" to whatever ID given in list of searched for words in the HTML.
function showItem() {
    var historyE1 = document.getElementById("searchHistoryList");
    // Display users and messages in the browser
    $('#searchHistoryList').empty();
    for (var i = 0; i < searchHistory.length; i++) {
        var p = document.createElement("p");
        p.innerHTML = searchHistory[i];
        historyE1.appendChild(p);
    }
}

// This will load up the search history when the page is loaded.
recallSearchHistory();
randomWord();


wordBtnEl.addEventListener("click", function(event) {
    event.preventDefault();
    getApiData(inputEl.value);
});