/* Helper functions */

// trials

const retrieve_contexts = function() {
    var colorObjLexicon = [
        {
          color: 'yellow',
          items: [['banana', 'typical'], ['corn', 'typical'], ['strawberry', 'atypical'], ['egg', 'atypical']]
        },
        {
          color: 'orange',
          items: [['carrot', 'typical'], ['pumpkin', 'typical'], ['banana', 'atypical'], ['lettuce', 'atypical']]
        },
        {
          color: 'red',
          items: [['strawberry', 'typical'], ['tomato', 'typical'], ['broccoli', 'atypical'], ['corn', 'atypical']]
        },
        {
          color: 'green',
          items: [['broccoli', 'typical'], ['lettuce', 'typical'], ['carrot', 'atypical'], ['swan', 'atypical']]
        },
        {
          color: 'white',
          items: [['egg', 'typical'], ['swan', 'typical'], ['pumpkin', 'atypical'], ['tomato', 'atypical']]
        }
    ];
    
    var contrastLexicon = {
        // typical
        yellow_banana: 'orange',
        yellow_corn: 'red',
        orange_carrot: 'green',
        orange_pumpkin: 'white',
        red_strawberry: 'yellow',
        red_tomato: 'white',
        green_broccoli: 'red',
        green_lettuce: 'orange',
        white_egg: 'yellow',
        white_swan: 'green',
        // atypical
        orange_banana: 'yellow',
        red_corn: 'yellow',
        green_carrot: 'orange',
        white_pumpkin: 'orange',
        yellow_strawberry: 'red',
        white_tomato: 'red',
        red_broccoli: 'green',
        orange_lettuce: 'green',
        yellow_egg: 'white',
        green_swan: 'white'
    };
    
    function createRandomDistractor (colors, types) {
        // choose color that doesn't occur in the context yet
        do {
            var lexiconEntry = _.shuffle(colorObjLexicon)[0]
            var distColor = lexiconEntry.color;
        } while (colors.includes(distColor));
        do {
            var shuffledItems = _.shuffle(lexiconEntry.items);
            var distType = shuffledItems[0][0];
            var distTypicality = shuffledItems[0][1];
        } while (types.includes(distType))
        return ([distColor, distType, distTypicality])
    }
    
    function completeContext (targetcompColor, targetType, compType, contrast, targetTypicality, compTypicality) {
        // in the case of a present contrast, find the contrast object
        if (contrast === 'present') {
            var contrastType = targetType;
            var contrastColor = contrastLexicon[targetcompColor + "_" + targetType];
            // if there is no contrast present, choose random distractor
        } else {
            var [contrastColor, contrastType] = createRandomDistractor([targetcompColor], [targetType, compType]);
        }
      
        // create a fourth random distractor
        var [distractorColor, distractorType, distractorTypicality] = createRandomDistractor([targetcompColor, contrastColor], [targetType, compType, contrastType]);
    
        // define condition
        var condition = targetTypicality[0] +
                        compTypicality[0] +
                        contrast[0]
      
        // full context definition
        var context = {
            // condition: condition,
            target: targetcompColor + "_" + targetType + ".png",
            comp: targetcompColor + "_" + compType + ".png",
            contrast: contrastColor + "_" + contrastType + ".png",
            distractor: distractorColor + "_" + distractorType + ".png"
            // targetcompColor: targetcompColor,
            // targetType: targetType,
            // targetTypicality: targetTypicality,
            // compType: compType,
            // compTypicality: compTypicality,
            // contrast: contrast,
            // contrastType: contrastType,
            // contrastColor: contrastColor,
            // distractorColor: distractorColor,
            // distractorType: distractorType,
            // distractorTypicality: distractorTypicality,
            // trial_type: 'critical'
        };
      
        return context
    }
    
    // pair each item with every other item in their color and then duplicate with and without contrast
    var unique_contexts = [];
    for (var col_id in colorObjLexicon) {
        var colorObjs = colorObjLexicon[col_id];
        var targetColor = colorObjs.color;
        for (var targetitem_id in colorObjs.items) {
            targetType = colorObjs.items[targetitem_id][0];
            targetTypicality = colorObjs.items[targetitem_id][1];
            for (var compitem_id in colorObjs.items) {
                if (targetitem_id != compitem_id) {
                    compType = colorObjs.items[compitem_id][0];
                    compTypicality = colorObjs.items[compitem_id][1];
                    // create contrast_present context
                    new_context = completeContext(targetColor, targetType, compType, contrast='present', targetTypicality, compTypicality);
                    unique_contexts.push(new_context);
                    // create contrast_not_present context
                    new_context = completeContext(targetColor, targetType, compType, contrast='not_present', targetTypicality, compTypicality);
                    unique_contexts.push(new_context);
                }
            }
        }
    }

    return unique_contexts;
}


/* For generating random colors */
// From Dawkins' code.

const color_ref_utils = {
    randomColor: function(options) {
        var h = ~~(Math.random() * 360);
        var s = ~~(Math.random() * 100);
        var l = options.hasOwnProperty("fixedL") ? 50 : ~~(Math.random() * 100);
        return [h, s, l];
    },

    sampleColors: function() {
        const opts = { fixedL: true };

        // Sample the three colors to be used as the target colors.
        var target = this.randomColor(opts);
        var firstDistractor = this.randomColor(opts);
        var secondDistractor = this.randomColor(opts);
        var thirdDistractor = this.randomColor(opts);

        return {
            target,
            firstDistractor,
            secondDistractor,
            thirdDistractor
        };
    },

    sampleImages: function() {
        // new
        const ttp = {
            target: 'yellow_banana.png', 
            firstDistractor: 'yellow_corn.png', 
            secondDistractor: 'orange_banana.png', 
            thirdDistractor: 'red_broccoli.png'
        };
        const atp = {
            target: 'orange_lettuce.png', 
            firstDistractor: 'orange_pumpkin.png', 
            secondDistractor: 'green_lettuce.png', 
            thirdDistractor: 'red_broccoli.png'
        };
        const tan = {
            target: 'green_broccoli.png', 
            firstDistractor: 'green_swan.png', 
            secondDistractor: 'yellow_egg.png', 
            thirdDistractor: 'orange_banana.png'
        };
        const ttn = {
            target: 'red_strawberry.png', 
            firstDistractor: 'red_tomato.png', 
            secondDistractor: 'white_swan.png', 
            thirdDistractor: 'orange_pumpkin.png'
        };
        const aap = {
            target: 'red_corn.png', 
            firstDistractor: 'red_broccoli.png', 
            secondDistractor: 'yellow_corn.png', 
            thirdDistractor: 'green_carrot.png'
        };

        // console.log(_.shuffle(retrieve_contexts()));
        return _.shuffle([atp, ttp, ttn, aap, tan]);

        // for main experiment
        // return _.shuffle(retrieve_contexts());
    },

    // Produce random indices so that in each trial the position of the target div is different.
    // The first index is the target's, the second the first distractor's, the third the second distractor's
    sampleIndices: function() {
        let indices = [0, 1, 2, 3];
        this.shuffleArray(indices);
        return indices;
    },

    /* For generating random participant IDs */
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    // dec2hex :: Integer -> String
    dec2hex: function(dec) {
        return ("0" + dec.toString(16)).substr(-2);
    },
    // generateId :: Integer -> String
    generateId: function(len) {
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, this.dec2hex).join("");
    },

    /* For shuffling arrays */
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    /* For producing usable strings to be set as the background color. */
    produceColorStyle: function(hslArray) {
        return `hsl(${hslArray[0]},${hslArray[1]}%,${hslArray[2]}%)`;
    },

    // submits to MTurk's servers
    // and the correct url is given in config.MTurk_server
    submitToMTurk: function() {
        var form = $("#mturk-submission-form");
        form.submit();
    },

    // parses the url to get the assignmentId and workerId
    getHITData: function() {
        const url = window.location.href;
        let qArray = url.split("?");
        let HITData = {};

        if (qArray[1] === undefined) {
            throw new Error(
                "Cannot get participant' s assignmentId from the URL (happens if the experiment does NOT run on MTurk or MTurkSandbox)."
            );
        } else {
            qArray = qArray[1].split("&");

            for (var i = 0; i < qArray.length; i++) {
                HITData[qArray[i].split("=")[0]] = qArray[i].split("=")[1];
            }
        }

        return HITData;
    },

    // adds columns with NA values
    addEmptyColumns: function(trialData) {
        var columns = [];

        for (var i = 0; i < trialData.length; i++) {
            for (var prop in trialData[i]) {
                if (
                    trialData[i].hasOwnProperty(prop) &&
                    columns.indexOf(prop) === -1
                ) {
                    columns.push(prop);
                }
            }
        }

        for (var j = 0; j < trialData.length; j++) {
            for (var k = 0; k < columns.length; k++) {
                if (!trialData[j].hasOwnProperty(columns[k])) {
                    trialData[j][columns[k]] = "NA";
                }
            }
        }

        return trialData;
    },

    magpieSubmitWithSocket: function(magpie) {
        const submit = {
            // submits the data
            // trials - the data collected from the experiment
            // global_data - other data (start date, user agent, etc.)
            // config - information about the deploy method and URLs
            submit: function(magpie) {
                // construct data object for output
                let data = {
                    experiment_id: magpie.deploy.experimentID,
                    trials: color_ref_utils.addEmptyColumns(magpie.trial_data),
                    variant: magpie.variant,
                    chain: magpie.chain,
                    realization: magpie.realization,
                    participant_id: magpie.participant_id
                };

                // merge in global_data accummulated so far
                // this could be unsafe if 'global_data' contains keys used in 'trials'!!
                data = _.merge(magpie.global_data, data);

                // add more fields depending on the deploy method
                if (magpie.deploy.is_MTurk) {
                    const HITData = color_ref_utils.getHITData();
                    data["assignment_id"] = HITData["assignmentId"];
                    data["worker_id"] = HITData["workerId"];
                    data["hit_id"] = HITData["hitId"];

                    // creates a form with assignmentId input for the submission ot MTurk
                    const form = jQuery("<form/>", {
                        id: "mturk-submission-form",
                        action: magpie.deploy.MTurk_server,
                        method: "POST"
                    }).appendTo(".magpie-thanks-view");
                    jQuery("<input/>", {
                        type: "hidden",
                        name: "trials",
                        value: JSON.stringify(data)
                    }).appendTo(form);
                    jQuery("<input/>", {
                        type: "hidden",
                        name: "status",
                        value: "finished"
                    }).appendTo(form);
                    // MTurk expects a key 'assignmentId' for the submission to work,
                    // that is why is it not consistent with the snake case that the other keys have
                    jQuery("<input/>", {
                        type: "hidden",
                        name: "assignmentId",
                        value: HITData["assignmentId"]
                    }).appendTo(form);
                }
                submitResults(
                    magpie.deploy.contact_email,
                    magpie.deploy.submissionURL,
                    flattenData(data),
                    magpie.deploy
                );
            }
        };

        function submitResults(contactEmail, submissionURL, data, config) {
            // set a default contact email
            contactEmail =
                typeof contactEmail !== "undefined"
                    ? contactEmail
                    : "not provided";

            // if the experiment is set to live (see config liveExperiment)
            // the results are sent to the server
            // if it is set to false
            // the results are displayed on the thanks slide
            if (magpie.deploy.liveExperiment) {
                console.log("submits");
                //submitResults(config_deploy.contact_email, config_deploy.submissionURL, data);
                magpie.participantChannel
                    .push("submit_results", {
                        results: data
                    })
                    .receive("ok", () => {
                        $("#warning-message").addClass("magpie-nodisplay");
                        $("#thanks-message").removeClass("magpie-nodisplay");
                        $("#extra-message").removeClass("magpie-nodisplay");

                        if (magpie.deploy.is_MTurk) {
                            // submits to MTurk's server if isMTurk = true
                            setTimeout(function() {
                                color_ref_utils.submitToMTurk(), 500;
                            });
                        }
                    })
                    .receive("error", (reasons) => {
                        if (magpie.deploy.is_MTurk) {
                            // submits to MTurk's server if isMTurk = true
                            color_ref_utils.submitToMTurk();

                            // shows a thanks message after the submission
                            $("#thanks-message").removeClass("magpie-nodisplay");
                        } else {
                            // It seems that this timeout (waiting for the server) is implemented as a default value in many browsers, e.g. Chrome. However it is really long (1 min) so timing out shouldn't be such a concern.
                            alert(
                                "Oops, the submission failed. The server says: " +
                                    reasons +
                                    "\nPlease try again. If the problem persists, please contact " +
                                    contactEmail +
                                    "with this error message, including your ID"
                            );
                        }
                    });
            } else {
                const flattenedData = data;
                jQuery("<div/>", {
                    class: "magpie-debug-results",
                    html: formatDebugData(flattenedData)
                }).appendTo($("#magpie-debug-table-container"));
                createCSVForDownload(flattenedData);
            }
        }

        // prepare the data form debug mode
        const formatDebugData = function(flattenedData) {
            var output = "<table id='magpie-debug-table'>";

            var t = flattenedData[0];

            output += "<thead><tr>";

            for (var key in t) {
                if (t.hasOwnProperty(key)) {
                    output += "<th>" + key + "</th>";
                }
            }

            output += "</tr></thead>";

            output += "<tbody><tr>";

            var entry = "";

            for (var i = 0; i < flattenedData.length; i++) {
                var currentTrial = flattenedData[i];
                for (var k in t) {
                    if (currentTrial.hasOwnProperty(k)) {
                        entry = String(currentTrial[k]);
                        output +=
                            "<td>" + entry.replace(/ /g, "&nbsp;") + "</td>";
                    }
                }

                output += "</tr>";
            }

            output += "</tbody></table>";

            return output;
        };

        const createCSVForDownload = function(flattenedData) {
            var csvOutput = "";

            var t = flattenedData[0];

            for (var key in t) {
                if (t.hasOwnProperty(key)) {
                    csvOutput += '"' + String(key) + '",';
                }
            }
            csvOutput += "\n";
            for (var i = 0; i < flattenedData.length; i++) {
                var currentTrial = flattenedData[i];
                for (var k in t) {
                    if (currentTrial.hasOwnProperty(k)) {
                        csvOutput += '"' + String(currentTrial[k]) + '",';
                    }
                }
                csvOutput += "\n";
            }

            var blob = new Blob([csvOutput], {
                type: "text/csv"
            });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, "results.csv");
            } else {
                jQuery("<a/>", {
                    class: "magpie-view-button",
                    html: "Download the results as CSV",
                    href: window.URL.createObjectURL(blob),
                    download: "results.csv"
                }).appendTo($(".magpie-thanks-view"));
            }
        };

        const flattenData = function(data) {
            var trials = data.trials;
            delete data.trials;

            // The easiest way to avoid name clash is just to check the keys one by one and rename them if necessary.
            // Though I think it's also the user's responsibility to avoid such scenarios...
            var sample_trial = trials[0];
            for (var trial_key in sample_trial) {
                if (sample_trial.hasOwnProperty(trial_key)) {
                    if (data.hasOwnProperty(trial_key)) {
                        // Much easier to just operate it once on the data, since if we also want to operate on the trials we'd need to loop through each one of them.
                        var new_data_key = "glb_" + trial_key;
                        data[new_data_key] = data[trial_key];
                        delete data[trial_key];
                    }
                }
            }

            var out = _.map(trials, function(t) {
                // Here the data is the general informatoin besides the trials.
                return _.merge(t, data);
            });
            return out;
        };

        return submit;
    }
};
