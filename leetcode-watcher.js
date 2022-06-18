import fetch from 'node-fetch';

// NOTE: The `node-fetch` module won't be required in node >= v18

const usernames = ["adityag15", "chaurasiya_g", "gauravrobin2000415", "70deepak58"];

// get current date
let date = (new Date()).toDateString().split(" ").slice(1, 4).join(" ");
let allQuestionsCount = null;
let profiles = [];

let profiles_fetched = 0;

await new Promise((res, _) => {
    usernames.forEach((uname, i) => {
        // Got these from seeing requests in Networks tab
        const url = "https://leetcode.com/graphql";
        const body = {
            query: "\n    query userProblemsSolved($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    problemsSolvedBeatsStats {\n      difficulty\n      percentage\n    }\n    submitStatsGlobal {\n      acSubmissionNum {\n        difficulty\n        count\n      }\n    }\n  }\n}\n    ",
            variables: {
                username: uname,
            }
        };

        // POST to url with body
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            }
        })
            .then(res => res.json())
            .then(data => data.data)
            .then(data => {
                profiles_fetched = profiles_fetched + 1;

                /**
                 * @type {Object} data
                 * @property {Array} allQuestionsCount [{
                 *	@key {String} difficulty
                 *	@value {Number} count
                 * }]
                 * @property {Object} matchedUser {
                 *	@key {String} problemsSolvedBeatsStats
                 *	@value {Array}  [{
                 *		@key {String} difficulty
                 *		@value {Number} percentage
                 *  }],
                 *  @key {String} submitStatsGlobal
                 *  @value {Object} {
                 *  	@key {String} acSubmissionNum
                 *  	@value {Array} [{
                 *  		@key {String} difficulty
                 *  		@value {Number} count
                 *  	}]
                 *  }
                 * }
                 * */
                profiles.push({
                    username: uname,
                    problemsSolvedBeatsStats: data.matchedUser.problemsSolvedBeatsStats,
                    submitStatsGlobal: data.matchedUser.submitStatsGlobal.acSubmissionNum,
                });
                if (allQuestionsCount === null) {
                    allQuestionsCount = data.allQuestionsCount;
                }

                if (profiles_fetched === usernames.length) {
                    // Fetching all usernames done
                    res();
                }
            })
            .catch(err => {
                console.log(err);
            });
    });
});

console.log({
    date: date,
    allQuestionsCount: allQuestionsCount,
    profiles
});
