var botcaptcha = {
    name: "botcaptcha",
    title: "Are you a bot?",
    buttonText: "Let's go!",
    render: function(){
        var viewTemplate = $("#botcaptcha-view").html();

        // define possible speaker and listener names
        // fun fact: 10 most popular names for boys and girls
        var speaker = _.shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"])[0];
        var listener = _.shuffle(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"])[0];

        var story = speaker + ' says to ' + listener + ': "It\'s a beautiful day, isn\'t it?"'

        $("#main").html(
            Mustache.render(viewTemplate, {
                name: this.name,
                title: this.title,
                text: story,
                question: "Who is " + speaker + " talking to?",
                button: this.buttonText
            })
        );

        // don't allow enter press in text field
        $('#listener-response').keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
            }
        });

        // don't show any error message
        $("#error").hide();
        $("#error_incorrect").hide();
        $("#error_2more").hide();
        $("#error_1more").hide();

        // amount of trials to enter correct response
        var trial = 0;

        $("#next").on("click", function() {
            response = $("#listener-response").val().replace(" ","");

            // response correct
            if (listener.toLowerCase() == response.toLowerCase()) {
                exp.global_data.botresponse = $("#listener-response").val();
                exp.findNextView();

            // response false
            } else {
                trial = trial + 1;
                $("#error_incorrect").show();
                if (trial == 1) {
                    $("#error_2more").show();
                } else if (trial == 2) {
                    $("#error_2more").hide();
                    $("#error_1more").show();
                } else {
                    $("#error_incorrect").hide();
                    $("#error_1more").hide();
                    $("#next").hide();
                    $('#quest-response').css("opacity", "0.2");
                    $('#listener-response').prop("disabled", true);
                    $("#error").show();
                };
            };
            
        });

    },
    trials: 1
};

var intro = {
    name: "intro",
    // introduction title
    title: "ALPS lab Stanford",
    // introduction text
    text:
        "Thank you for participating in our study. In this study, you will be asked to name 3 perceptual features that come to mind when you imagine a certain object. It will take approximately 20 minutes.<br>Please only participate once in this series of HITs.",
    legal_info:
        "<strong>LEGAL INFORMATION</strong>:<br><br>We invite you to participate in a research study on language production and comprehension.<br>Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game.<br><br>You will be paid for your participation at the posted rate.<br><br>There are no risks or benefits of any kind involved in this study.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study.<br>You may print this form for your records.<br><br>CONTACT INFORMATION:<br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director Meghan Sumner at <br>(650)-725-9336<br><br>If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, please proceed to the study tasks.",
    // introduction's slide proceeding button text
    buttonText: "Begin experiment",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#intro-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                picture: "images/alpslogo.png",
                title: this.title,
                text: this.text,
                legal_info: this.legal_info,
                button: this.buttonText
            })
        );

        var prolificId = $("#prolific-id");
        var IDform = $("#prolific-id-form");
        var next = $("#next");

        var showNextBtn = function() {
            if (prolificId.val().trim() !== "") {
                next.removeClass("nodisplay");
            } else {
                next.addClass("nodisplay");
            }
        };

        if (config_deploy.deployMethod !== "Prolific") {
            IDform.addClass("nodisplay");
            next.removeClass("nodisplay");
        }

        prolificId.on("keyup", function() {
            showNextBtn();
        });

        prolificId.on("focus", function() {
            showNextBtn();
        });

        // moves to the next view
        next.on("click", function() {
            if (config_deploy.deployMethod === "Prolific") {
                exp.global_data.prolific_id = prolificId.val().trim();
            }

            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var example = {
    name: "example",
    title: "Example",
    // text
    text:
        "You will see names of objects. For each object, please name 3 perceptual features that come to mind when you imagine it. A perceptual feature is something that you can perceive with one of your senses, like feel, see, taste, hear or smell. <br>Here is an example response for <strong>dime</strong>.",
    // proceeding button text
    buttonText: "Got it!",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#example-view").html();

        $("#main").html(    
            Mustache.render(viewTemplate, {
                picture: "images/example.png",
                title: this.title,
                text: this.text,
                button: this.buttonText
            })
        );

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        $("#next").on("click", function() {
            exp.findNextView();
        });

        // record trial starting time
        var startingTime = Date.now();
    },
    trials: 1
};

var main = {
    name: "main",
    render: function(CT) {
        // fill variables in view-template
        var viewTemplate = $("#main-view").html();

        // define article
        var mass_nouns = ["garlic","broccoli","cotton candy","corn","scissors","soap","toilet paper"];
        var vowels = ["a","e","i","o","u"];
        var article;
        // none for mass nouns
        if (mass_nouns.includes(exp.trial_info.main_trials[CT])){
            article = "";
        } else if (vowels.includes(exp.trial_info.main_trials[CT][0])) {
            article = " an";
        }
        else {
            article = " a";
        };

        $("#main").html(
            Mustache.render(viewTemplate, {
                question: "List 3 perceptual features of" + article + " <strong>" + exp.trial_info.main_trials[CT] + "</strong>!"
            })
        );

        // change appearance of text fields when box is checked
        var box_checked = false;
        $('input[id=unknown-obj]').change(function(){
            if($(this).is(':checked')) {
                box_checked = true;
                $('#feature1-response').css("opacity", "0.2");
                $('#feature2-response').css("opacity", "0.2");
                $('#feature3-response').css("opacity", "0.2");
                console.log("Yey, you checked the box!");
            } else {
                box_checked = false;
                $('#feature1-response').css("opacity", "1");
                $('#feature2-response').css("opacity", "1");
                $('#feature3-response').css("opacity", "1");
                console.log("Yey, you unchecked the box!");
            }
        });

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        $("#next").on("click", function() {
            // only submit when all text fields are filled out or th ob_unknown box is checked
            if (($("#feature1-response").val().length == 0 | $("#feature2-response").val().length == 0 | $("#feature3-response").val().length == 0) & ($('#unknown-obj').prop('checked') == false)) {
                $("#error").css({"visibility": "visible"});
            } else {
                var RT = Date.now() - startingTime; // measure RT before anything else
                var trial_data = {
                    trial_number: CT + 1,
                    question: exp.trial_info.main_trials[CT],
                    feature1: $("#feature1-response").val(),
                    feature2: $("#feature2-response").val(),
                    feature3: $("#feature3-response").val(),
                    obj_unknown: $('#unknown-obj').prop('checked')
                };
                exp.trial_data.push(trial_data);
                exp.findNextView();
            };
        });

        // record trial starting time
        var startingTime = Date.now();
    },
    trials: 52
};

var postTest = {
    name: "postTest",
    title: "Additional Info",
    text:
        "Answering the following questions is optional, but will help us understand your answers.",
    buttonText: "Continue",
    render: function() {
        var viewTemplate = $("#post-test-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                buttonText: this.buttonText
            })
        );

        $("#next").on("click", function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.HitCorrect = $("#HitCorrect").val();
            exp.global_data.age = $("#age").val();
            exp.global_data.gender = $("#gender").val();
            exp.global_data.education = $("#education").val();
            exp.global_data.languages = $("#languages").val();
            exp.global_data.enjoyment = $("#enjoyment").val();
            exp.global_data.comments = $("#comments")
                .val()
                .trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent =
                (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        });
    },
    trials: 1
};

var thanks = {
    name: "thanks",
    message: "Thank you for taking part in this experiment!",
    render: function() {
        var viewTemplate = $("#thanks-view").html();

        // what is seen on the screen depends on the used deploy method
        //    normally, you do not need to modify this
        if (
            config_deploy.is_MTurk ||
            config_deploy.deployMethod === "directLink"
        ) {
            // updates the fields in the hidden form with info for the MTurk's server
            $("#main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message
                })
            );
        } else if (config_deploy.deployMethod === "Prolific") {
            $("main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message,
                    extraMessage:
                        "Please press the button below to confirm that you completed the experiment with Prolific<br />" +
                        "<a href=" +
                        config_deploy.prolificURL +
                        ' class="prolific-url">Confirm</a>'
                })
            );
        } else if (config_deploy.deployMethod === "debug") {
            $("main").html(Mustache.render(viewTemplate, {}));
        } else {
            console.log("no such config_deploy.deployMethod");
        }

        exp.submit();
    },
    trials: 1
};
