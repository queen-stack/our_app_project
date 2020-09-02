var oxfordApiKey = '1b9aa721';
var wordInputEl = document.querySelector("#wordForm");
const localStorageKey = 'wordData';
var searchHistory;
var wordListEl = document.querySelector("#searchOfWords");

// Make sure that the user actually typed something before calling the API.
function validateSearchCriteria(e) {
    e.preventDefault();
    var wordDefine = document.querySelector("#wordText").value.trim();
    //wordDefine = wordDefine.trim();
    if (wordDefine !== '') {
        fetchCurrentWord(wordDefine);
    }
}

// Call the word define API to verify that the definition  that will be found
// and to retrieved.
function fetchCurrentWord(wordDefine) {
    // fetch("https://od-api.oxforddictionaries.com/api/v2/"
    // + endpoint 
    // + language_code 
    // + word_id.lower()
    // + '&appid=' + //ApiKey
    )
        .then(function (response) {
            if (response.status !== 200) {
                // report an error to the user   (TBD)

            }

            response = response.json()
            response.then(function (data) {
               // define what added data to pull or store if any
            });
        })
        .catch(function (err) {
            // Display a "fail" message to the user.  (TBD)

        });
}

// Call the  API to retrieve all the info required for display.
function fetchFutureForecast(wordDefine, oneCallUrl) {
    fetch(oneCallUrl)
        .then(function (response) {
            if (response.status !== 200) {
                // report an error to the user  (TBD)

                return;
            }

            response = response.json();
            response.then(function (data) {
                populatePage(wordDefine, data);
            });
        })
        .catch(function (err) {
            // Display a "fail" message to the user.  (TBD)

        });
}


// This is  basic  to outline how to pull and display the data.
// Needs to be set up with correct elements in the html and accompanying .css
function populatePage(wordDefine, data) {


// This is for functional requirements in the text box
// there needs to be container for the text entry, definition

//     var searchedWord = document.querySelector('#searchedWord-container');
//     var dateOut = moment.unix(data.current.dt);
//     updateSearchHistory(wordDefine);define and outline modal

// }



function recallSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    showItem();
}

function updateSearchHistory(savedWordDefine) {
    if (!searchHistory.includes(savedWordDefine)) {
        searchHistory.push(savedWordDefine);
        localStorage.setItem(localStorageKey, JSON.stringify(searchHistory));
        showItem();
    }

}

function showItem() {
    var ul = document.getElementById("searchOfWords");
    // Display users and messages in the browser
    $('#searchOfWords').empty();
    for (var i = 0; i < searchHistory.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = searchHistory[i];
        ul.appendChild(li);
    }
}
wordInputEl.addEventListener('submit', validateSearchCriteria);
wordListEl.addEventListener('click', function (event) {

    var wordDefine = event.srcElement.innerHTML;
    fetchCurrentWord(wordDefine);
});

recallSearchHistory();