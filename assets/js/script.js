var randomWord = function() {
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
            console.log(response)
            // the api does not give the definition
            // Will have to tell the user that there is no definition
            var definition
            if (response.results === undefined || response.results.length === 0) {
                definition = "Definition Not Available"
            } else {
                definition = response.results[0].definition;
            };

            // Create variables for the h4 and the p elements to define
            var wordTitle = document.querySelector("#title-container")
            var defBody = document.querySelector("#p-container")

            // Empty out the h4 and the p elements for the random word
            wordTitle.innerHTML = "";
            defBody.innerHTML = "";

            // Create elements
            // Random word
            var titleEl = document.createElement('h4');
            var bodyEl = document.createElement('p');

            // giving the data an element
            titleEl.textContent = word;
            bodyEl.textContent = definition;

            // append the data element to the page
            wordTitle.appendChild(titleEl);
            defBody.appendChild(bodyEl);
        })
        .catch(err => {
            console.log(err);
        });
};

// This is the error modal that the user sees instead of alerts