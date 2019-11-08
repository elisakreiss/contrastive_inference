// when the DOM is created and JavaScript code can run safely,
// the experiment initialisation is called
$("document").ready(function() {
    // prevent scrolling when space is pressed
    window.onkeydown = function(e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    };

    window.magpie_monitor = magpieInit({
        // views_seq: [init, lobby, game, thanks],
        views_seq: [intro, postTest, instructions, init, lobby, game, thanks],
        deploy: {
            // experimentID: "20",
            experimentID: "73",
            serverAppURL:
                // "https://magpie-demo.herokuapp.com/api/submit_experiment/",
                "https://mcmpact.ikw.uni-osnabrueck.de/babe/api/submit_experiment/",
            // serverAppURL: "http://localhost:4000/api/submit_experiment/",
            // socketURL: "wss://magpie-demo.herokuapp.com/socket",
            socketURL: "wss://mcmpact.ikw.uni-osnabrueck.de/babe/socket",
            deployMethod: "MTurkSandbox",
            // deployMethod: "MTurk",
            // deployMethod: "debug",
            contact_email: "ekreiss@stanford.edu",
            prolificURL:
                "https://app.prolific.ac/submissions/complete?cc=EXAMPLE1234"
        },
        progress_bar: {
            in: ["forcedChoice"],
            style: "default",
            width: 100
        }
    });
});
