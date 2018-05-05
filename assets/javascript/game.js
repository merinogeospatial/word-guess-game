
            // Picks a random country from the list & sets number of underscores based on
            // //// chosen country length. Let's make this a function to call when the user
            // starts the game. We will also recall this when the game resets (win/lose).
            function initCountry() {
                guessCount =10;
                started = true;
                letterDisplay = [];
                guessedLetters = [];
                message = "Hmm. Guess that country.";
                var randIndex = Math.floor(Math.random() * countryArr.length);
                chosenCountry = countryArr[randIndex].toUpperCase();
                lettersRemaining = chosenCountry.length;
                for (var i = 0; i < chosenCountry.length; i++) {
                    letterDisplay[i] = "_";
                }

                var apiKey = "AIzaSyB0JnhZGRyqgAD16BqiEMgWdcv0E1oUSp4";
                googleRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                        chosenCountry + "&key=" + apiKey;

                fetch(googleRequest).then((response) => {
                    console.log(response);
                    response
                        .json()
                        .then((data) => {

                            chosenLat = data
                                .results[0]
                                .geometry["location"]
                                .lat;
                            chosenLng = data
                                .results[0]
                                .geometry["location"]
                                .lng;
                        });
                });
                // map.panTo([chosenLat, chosenLng]);
                html = `<h1>${letterDisplay.join(" ")}</h1><br> 
                <h2>${message}</h2><br>
                <h3>Lives remaining: ${guessCount}`;
                document
                    .querySelector("#game")
                    .innerHTML = html;

                resetButton = `<button class="btn btn-dark btn-lg shadow-lg p-0" onclick="initCountry(), tieCounter(), drawCounter()">Skip</button>`
                document
                    .querySelector("#startButton")
                    .innerHTML = resetButton;

                return chosenCountry;

                // Initialize event handler for keyboard event, captures user guess, compares
                // each letter to each character of chosen country name. If condition passes,
                // replace underscore with the letter (has a shared index value).
            }
            function countryZoom() {
                map.setView([
                    chosenLat, chosenLng
                ], 7);
            }
            function initialZoom() {
                map.setView([
                    0, 0
                ], 2);
            }
            function skipCounter() {
                tieCount++;
            }

            document.onkeyup = function (event) {
                userGuess = event
                    .key
                    .toUpperCase();
                console.log(userGuess);
                guessExp = new RegExp(userGuess); // We convert to a regular expression since the .test() method requires it.
                displayExp = new RegExp("_");
                if (started && guessExp.test(guessedLetters) === false) {
                    guessedLetters.push(userGuess.toUpperCase());
                    for (i = 0; i < chosenCountry.length; i++) {
                        if (userGuess === chosenCountry[i]) {
                            letterDisplay[i] = userGuess.toUpperCase();
                        }

                        // We are using this test to assign a single pass or fail check in the
                        // comparison. We want these single checks since the condition above will run
                        // the same number of times as there are characters. This causes two problems:
                        // 1- Our inner html message will be conditioned on the LAST check (last
                        // character) even if characters pass the check before the last character, 2)
                        // When guessCount-- is called, it will subtract the number of characters
                        // instead of by 1.
                        if (guessExp.test(chosenCountry)) {
                            message = "Nice, you got a letter!";
                        } else {
                            message = "Sorry, guess again.";
                        }
                    }

                    // We are putting the subtraction of lives outside of the for loop as stated in
                    // comment above. We can probably put our messages here.
                    if (guessExp.test(chosenCountry)) {
                        // play sound
                    } else {
                        guessCount--;
                    }

                    if (guessCount < 1) {
                        alert(
                            "Too bad. The country was " + chosenCountry.charAt(0).toUpperCase() +
                            chosenCountry.slice(1) + ". Try again?"
                        );
                        initCountry();
                        countryZoom();
                        loseCount++
                        L
                            .marker([
                                chosenLat, chosenLng
                            ], {icon: loseIcon})
                            .addTo(map);
                    }

                    if (displayExp.test(letterDisplay)) {} else {
                        alert(
                            "Nice work! The country was " + chosenCountry.charAt(0).toUpperCase() +
                            chosenCountry.slice(1) + ". Keep playing?"
                        );
                        initCountry();
                        countryZoom();
                        winCount++;
                        L
                            .marker([
                                chosenLat, chosenLng
                            ], {icon: winIcon})
                            .addTo(map);
                    }

                    // Template literal to rewrite our to innerhtml on keypress.
                    html = `<h1>${letterDisplay.join(" ")}</h1><br> 
                <h3>${message}</h3><br>
                <h3>Lives remaining: ${guessCount}<br>
                <h3>You've guessed: ${guessedLetters.join(
                        " , "
                    )}`;

                    document
                        .querySelector("#game")
                        .innerHTML = html;

                    drawCounter();
                }
            }