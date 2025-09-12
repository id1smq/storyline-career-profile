
// Initialize variables to track time in seconds for the course and slide
var courseSeconds = 0;
var slideSeconds = 0;

// Flags to indicate if the timers are active
var isCourseTimerActive = false;
var isSlideTimerActive = false;

// Record the start time for the course and slide
let courseStartTime = Date.now();
let slideStartTime = Date.now();

// Function to update the timers
function updateTimers() {
    // If the course timer is active, calculate the elapsed time
    if (isCourseTimerActive) {
        let now = Date.now();
        courseSeconds = parseFloat(((now - courseStartTime) / 1000).toFixed(2));
    }
    // If the slide timer is active, calculate the elapsed time
    if (isSlideTimerActive) {
        let now = Date.now();
        slideSeconds = parseFloat(((now - slideStartTime) / 1000).toFixed(2));
    }
    // Call updateTimers again after 10 milliseconds
    setTimeout(updateTimers, 10);
}



// Object to manage the course and slide timers
const manageTimer = {
    "course": {
        "start": () => { isCourseTimerActive = true;
            courseStartTime = Date.now(); // Reset the start time
		   updateTimers(); },// Start updating the timer}
        "stop": () => { isCourseTimerActive = false },
        "reset": () => { courseSeconds = 0 }
    },
    "slide": {
        "start": () => { isSlideTimerActive = true },
        "stop": () => { isSlideTimerActive = false },
        "reset": () => { slideSeconds = 0 }
    }
}

// Function to get a unique identifier from local storage or create a new one
function getUniqueIdentifier() {
    let identifier = localStorage.getItem('uniqueIdentifier');
    if (!identifier) {
        identifier = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('uniqueIdentifier', identifier);
    }
    return identifier;
}

// Function to send the current course time with an alert (for debugging)
function sendTime(stuff) { alert(stuff + courseSeconds); }

/*
// Configuration for the xAPI endpoint
const conf = {
    "endpoint": "https://test-lb.lrs.io/xapi/",
	//"user" : "pojzan",
	//"password" : "vuputj"
    "auth": "Basic " + toBase64("pojzan:vuputj")
	
};
*/
// Configuration for the xAPI endpoint
const conf = {
    "endpoint": "https://activity-store.lrs.io/xapi/",

	//"user" : "IDSQ_xAPI",
	//"password" : "5Tgh$rfv$$"
    "auth": "Basic " + toBase64("IDSQ_xAPI:5Tgh$rfv$$")
	
};




// Apply the xAPI configuration
ADL.XAPIWrapper.changeConfig(conf);

// Function to send an xAPI statement
function sendStatement(timer) {
    // Get variables from the player
    const player = GetPlayer();
    const userScorejs = Number(player.GetVar("userScore"));
    const maxScorejs = Number(player.GetVar("maxScore"));
    const scaledScore = userScorejs / maxScorejs;
    const userDidPass = scaledScore >= 0.8 ? true : false;

    // Get or create a unique identifier
    let uniqueIdentifier = getUniqueIdentifier();

    // Determine the final duration based on the timer type
    let finalDuration;
    if (timer == "course") {
        finalDuration = convertToIso(courseSeconds);
    } else if (timer == "slide") {
        finalDuration = convertToIso(slideSeconds);
    } else {
        finalDuration = null;
    }

    // Create the xAPI statement
    const statement = {
        "actor": {
            "mbox": "mailto:" + uniqueIdentifier + "@gov.nl.ca",
            "name": "PPA" + uniqueIdentifier
        },
        "verb": {
            "id": "https://psaccess.ca/verbs/passed",
            "display": { "en-US": "passed" }
        },
        "object": {
            "id": "https://psaccess.ca/quizzes/HIPO_Quiz",
            "definition": {
                "name": { "en-US": "HIPO Quiz" },
                "description": { "en-US": "HIPO quiz in the PPA course" },
                "type": "https://psaccess.ca/schema/1.0/kcheck1"
            },
            "objectType": "Activity"
        },
        "result": {
            "score": {
                "scaled": scaledScore,
                "raw": courseSeconds
            },
            "success": userDidPass,
            "duration": finalDuration
        }
    };

    // Send the statement to the LRS
    const result = ADL.XAPIWrapper.sendStatement(statement);
}

// Function to convert seconds to ISO 8601 duration format
function convertToIso(secondsVar) {
    let seconds = secondsVar;
    if (seconds > 60) {
        if (seconds > 3600) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            seconds = ((seconds % 3600) % 60).toFixed(2);
            return `PT${hours}H${minutes}M${seconds}S`;
        } else {
            const minutes = Math.floor(seconds / 60);
            seconds = (seconds % 60).toFixed(2);
            return `PT${minutes}M${seconds}S`;
        }
    } else {
        seconds = seconds.toFixed(2);
        return `PT${seconds}S`;
    }
}

// Function to populate the leaderboard
function populateLeaderboard() {
    const query = {
        "filter": {
            "verb.id": "https://psaccess.ca/verbs/passed",
            "object.id": "https://psaccess.ca/quizzes/HIPO_Quiz",
            "result.success": { "$eq": true }
        },
        "process": [
            { "$sort": { "duration": 1 } },
            { "$limit": 20 },
            { "$project": { "_id": "$duration" } }
        ]
    };
    const parameters = ADL.XAPIWrapper.searchParams();
    parameters.query = JSON.stringify(query);

    console.log("Query Parameters:", parameters);

    // Function to fetch statements from the LRS
    function fetchStatements(parameters, accumulatedStatements = []) {
        try {
            ADL.XAPIWrapper.getStatements(parameters, null, function(response) {
                console.log("Raw Response:", response);
                let statements = [];
                try {
                    statements = JSON.parse(response.responseText).statements || [];
                } catch (parseError) {
                    console.error("Error parsing response:", parseError);
                    alert("Error parsing response.");
                    return;
                }
                accumulatedStatements = accumulatedStatements.concat(statements);
                const more = JSON.parse(response.responseText).more;
                if (more) {
                    const nextParameters = ADL.XAPIWrapper.searchParams();
                    nextParameters.query = JSON.stringify(query);
                    nextParameters.more = more;
                    fetchStatements(nextParameters, accumulatedStatements);
                } else {
                    processStatements(accumulatedStatements);
                }
            });
        } catch (err) {
            console.error("Error", err);
        }
    }

    // Function to process the fetched statements
    function processStatements(statements) {
        console.log("Parsed Statements:", statements);
        if (statements.length > 0) {
            statements.sort(function(a, b) {
                return a.result.score.raw - b.result.score.raw;
            });

            const player = GetPlayer();
            for (let i = 0; i < 20; i++) {
                if (statements[i] && statements[i].result && statements[i].result.duration) {
                    console.log(`Setting time${i + 1} to`, formatIsoString(statements[i].result.duration));
                    player.SetVar(`time${i + 1}`, formatIsoString(statements[i].result.duration));
                }
            }

            const newestElement = statements.reduce((newest, current) => {
                if (!current.timestamp || !newest.timestamp) {
                    console.log("Missing timestamp in one of the statements.");
                    return newest;
                }
                console.log(`Comparing: ${current.timestamp} with ${newest.timestamp}`);
                return new Date(current.timestamp) > new Date(newest.timestamp) ? current : newest;
            }, statements[0]);

            player.SetVar("timeCurrentuser", formatIsoString(newestElement.result.duration));
        } else {
            alert("No statements found.");
        }
    }

    // Function to format ISO duration strings
    function formatIsoString(isoString) {
        return isoString
            .replace(/^PT/, 'PT ')
            .replace(/(\d+)H/, '$1 H - ')
            .replace(/(\d+)M/, '$1 M - ')
            .replace(/(\d+)S/, '$1 S')
            .replace(/ - $/, ''); // Remove trailing dash if present
    }

    // Start fetching statements
    fetchStatements(parameters);
}

// Function to bold the current user's time in the leaderboard
function boldLeaderboard(){
		
		
	   const player = GetPlayer(); 
	 const timeCurrentuser = player.GetVar("timeCurrentuser");
	const timeVariables = [
		"time1", "time2", "time3", "time4", "time5",
		"time6", "time7", "time8", "time9", "time10",
		"time11", "time12", "time13", "time14", "time15",
		"time16", "time17", "time18", "time19", "time20"
	];

	let isTimeCurrentuserInList = false;

	for (let i = 0; i < timeVariables.length; i++) {
		const timeVar = player.GetVar(timeVariables[i]);
		if (timeVar === timeCurrentuser) {
			isTimeCurrentuserInList = true;
			// Bold the corresponding value
			player.SetVar(timeVariables[i], `<b>${timeVar}</b>`);
		}
	} 

	}
