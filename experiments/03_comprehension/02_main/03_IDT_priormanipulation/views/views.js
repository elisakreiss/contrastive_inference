// eslint-disable-next-line no-unused-vars
var botcaptcha = {
  name: 'botcaptcha',
  title: 'Are you a bot?',
  buttonText: 'Let\'s go!',
  render: function () {
    var viewTemplate = $('#botcaptcha-view').html();

    // define possible speaker and listener names
    // fun fact: 10 most popular names for boys and girls
    var speaker = _.shuffle(['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'])[0];
    var listener = _.shuffle(['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Margaret'])[0];

    var story = speaker + ' says to ' + listener + ': \'It\'s a beautiful day, isn\'t it?\''

    $('#main').html(
      Mustache.render(viewTemplate, {
        name: this.name,
        title: this.title,
        text: story,
        question: 'Who is ' + speaker + ' talking to?',
        button: this.buttonText
      })
    );

    // don't allow enter press in text field
    $('#listener-response').keypress(function (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
      }
    });

    // don't show any error message
    $('#error').hide();
    $('#error_incorrect').hide();
    $('#error_2more').hide();
    $('#error_1more').hide();

    // amount of trials to enter correct response
    var trial = 0;

    $('#next').on('click', function () {
      var response = $('#listener-response').val().replace(' ', '');

      // response correct
      if (listener.toLowerCase() === response.toLowerCase()) {
        exp.global_data.botresponse = $('#listener-response').val();
        exp.global_data.betwsubj = COMPETITOR_TYPICALITY;
        exp.global_data.prior = "normal";
        exp.findNextView();

        // response false
      } else {
        trial = trial + 1;
        $('#error_incorrect').show();
        if (trial === 1) {
          $('#error_2more').show();
        } else if (trial === 2) {
          $('#error_2more').hide();
          $('#error_1more').show();
        } else {
          $('#error_incorrect').hide();
          $('#error_1more').hide();
          $('#next').hide();
          $('#quest-response').css('opacity', '0.2');
          $('#listener-response').prop('disabled', true);
          $('#error').show();
        };
      };
    });
  },
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var intro = {
  name: 'intro',
  // introduction title
  title: 'ALPS lab Stanford',
  // introduction text
  text:
        'Thank you for participating in our study. This study has two parts. In the first part, you\'ll tell someone which of four objects to click on. In the second part, you\'ll be the one to click on objects. It will take approximately <strong>9</strong> minutes.<br>Please only participate once in this series of HITs.<br>Please do <strong>not</strong> do this HIT on a <strong>cell phone</strong>.',
  legal_info:
        '<strong>LEGAL INFORMATION</strong>:<br><br>We invite you to participate in a research study on language production and comprehension.<br>Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game.<br><br>You will be paid for your participation at the posted rate.<br><br>There are no risks or benefits of any kind involved in this study.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study.<br>You may print this form for your records.<br><br>CONTACT INFORMATION:<br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director Meghan Sumner at <br>(650)-725-9336<br><br>If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, please proceed to the study tasks.',
  // introduction's slide proceeding button text
  buttonText: 'Begin experiment',
  // render function renders the view
  render: function () {
    var viewTemplate = $('#intro-view').html();

    $('#main').html(
      Mustache.render(viewTemplate, {
        picture: 'images/alpslogo.png',
        title: this.title,
        text: this.text,
        legal_info: this.legal_info,
        button: this.buttonText
      })
    );

    $('html,body').scrollTop(0);

    var prolificId = $('#prolific-id');
    var IDform = $('#prolific-id-form');
    var next = $('#next');

    var showNextBtn = function () {
      if (prolificId.val().trim() !== '') {
        next.removeClass('nodisplay');
      } else {
        next.addClass('nodisplay');
      }
    };

    if (config_deploy.deployMethod !== 'Prolific') {
      IDform.addClass('nodisplay');
      next.removeClass('nodisplay');
    }

    prolificId.on('keyup', function () {
      showNextBtn();
    });

    prolificId.on('focus', function () {
      showNextBtn();
    });

    // moves to the next view
    next.on('click', function () {
      if (config_deploy.deployMethod === 'Prolific') {
        exp.global_data.prolific_id = prolificId.val().trim();
      }

      exp.findNextView();
    });
  },
  // for how many trials should this view be repeated?
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var practiceIntro = {
  name: 'practiceIntro',
  title: 'First Part',
  buttonText: 'I\'m ready... Let\'s go!',
  render: function () {
    var viewTemplate = $('#practiceIntro-view').html();

    var text1 = 'Imagine you\'re playing a game with another MTurk worker. Both of you see a display of the same 4 objects, but the objects are in different locations for the two of you. Your job is to get the other player to click on the object that has a green border around it. Only you can see which object has the green border.';

    var text2 = 'To tell the other player which object to click on, complete the sentence "Pick the ...!". When you\'re done, press the Continue button.';

    $('#main').html(
      Mustache.render(viewTemplate, {
        name: this.name,
        title: this.title,
        text1: text1,
        text2: text2,
        img: 'images/practiceContext.png',
        button: this.buttonText
      })
    );

    $('html,body').scrollTop(0);

    $('#img').css('visibility', 'hidden');
    $('#more_info').css('visibility', 'hidden');
    $('#text2').css('visibility', 'hidden');
    $('#text3').css('visibility', 'hidden');
    $('#next').css('visibility', 'hidden');

    $('#show_pic').on('click', function () {
      $('#img').css('visibility', 'visible');
      $('#more_info').css('visibility', 'visible');
      $('#show_pic').css('display', 'none');
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#img").offset().top
      }, 1000);
    });

    $('#more_info').on('click', function () {
      $('#text2').css('visibility', 'visible');
      $('#text3').css('visibility', 'visible');
      $('#next').css('visibility', 'visible');
      $('#more_info').css('display', 'none');
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#next").offset().top
      }, 1000);
    });

    $('#next').on('click', function () {
      exp.findNextView();
    });
  },
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var practice = {
  name: 'practice',
  render: function (CT) {
    // fill variables in view-template
    var viewTemplate = $('#practice-view').html();

    // console.log(exp.trial_info.practice_trials[CT]);
    var contextInfo = exp.trial_info.practice_trials[CT];

    var items = {
      target: contextInfo.targetcompColor + '_' + contextInfo.targetType,
      comp: contextInfo.targetcompColor + '_' + contextInfo.compType,
      contrast: contextInfo.contrastColor + '_' + contextInfo.contrastType,
      distractor: contextInfo.distractorColor + '_' + contextInfo.distractorType
    };

    var [pos1, pos2, pos3, pos4] = _.shuffle(['target', 'comp', 'contrast', 'distractor']);

    $('#main').html(
      Mustache.render(viewTemplate, {
        title: 'What should your partner click on?',
        question: 'Pick the ',
        item1: 'images/' + items[pos1] + '.png',
        item2: 'images/' + items[pos2] + '.png',
        item3: 'images/' + items[pos3] + '.png',
        item4: 'images/' + items[pos4] + '.png'
      })
    );

    $('#error').css('visibility', 'hidden');
    $('#refexp').focus();

    var posAll = [pos1, pos2, pos3, pos4];
    for (var obj in posAll) {
      if (posAll[obj] === 'target') {
        var itemNr = parseInt(obj) + 1;
        $('#grid_pos' + itemNr).css({
          'border-color': 'rgba(63, 195, 128, 1)',
          'padding': '16px',
          'border-width': '5px',
          'border-style': 'solid'
        });
      }
    }

    // pressing enter key triggers "continue" button press
    $('#refexp').keypress(function (e) {
      var key = e.which;
      if (key === 13) {
        $('#next_context').click();
      }
    });

    // event listener for buttons; when an input is selected, the response
    // and additional information are stored in exp.trial_info
    $('#next_context').on('click', function () {
      // console.log($('#refexp').val());
      if ($('#refexp').val().length < 3) {
        $('#error').css('visibility', 'visible');
        $('#refexp').focus();
      } else {
        var trialData = {
          trial_number: CT + 1,
          trial_type: 'practice',
          condition: contextInfo.condition,
          context_id: 'NaN',
          refObject: 'target',
          target: items.target,
          comp: items.comp,
          contrast: items.contrast,
          distractor: items.distractor,
          pos1: pos1,
          pos2: pos2,
          pos3: pos3,
          pos4: pos4,
          utterance: $('#refexp').val(),
          utterance_cat: 'NaN',
          selectedItem_prior: 'NaN',
          selectedItem1: 'NaN',
          selectedItem2: 'NaN',
          reaction_time_prior: 'NaN',
          reaction_time1: 'NaN',
          reaction_time2: 'NaN',
          RT: Date.now() - initialStartingTime
        };
        exp.trial_data.push(trialData);
        exp.findNextView();
      }
    });
    // record trial starting time
    var initialStartingTime = Date.now();
  },
  trials: 4
};

// eslint-disable-next-line no-unused-vars
var mainIntro = {
  name: 'mainIntro',
  title: 'Second Part',
  buttonText: 'Meet Jamie!',
  render: function () {
    var viewTemplate = $('#mainIntro-view').html();

    var text1 = 'Well done! <br>Now the <strong>roles are reversed</strong> and you are going to play with <strong>Jamie</strong>. This time, it is your task to pick out the right object.';

    var text2 = 'Note that <strong>you won\'t see the whole expression at once</strong>. After each word following "Pick the ...", you\'ll be asked for your best guess about the object Jamie wants you to pick.';

    $('#main').html(
      Mustache.render(viewTemplate, {
        name: this.name,
        title: this.title,
        text1: text1,
        text2: text2,
        img: 'images/mainContext.png',
        button: this.buttonText
      })
    );

    // $('#img').css('visibility', 'hidden');
    // $('#more_info').css('visibility', 'hidden');
    // $('#text2').css('visibility', 'hidden');
    // $('#next').css('visibility', 'hidden');

    // $('#show_pic').on('click', function () {
    //   $('#img').css('visibility', 'visible');
    //   $('#more_info').css('visibility', 'visible');
    //   $('#show_pic').css('display', 'none');
    //   $([document.documentElement, document.body]).animate({
    //     scrollTop: $("#img").offset().top
    //   }, 1000);
    // });

    // $('#more_info').on('click', function () {
    //   $('#text2').css('visibility', 'visible');
    //   $('#next').css('visibility', 'visible');
    //   $('#more_info').css('display', 'none');
    //   $([document.documentElement, document.body]).animate({
    //     scrollTop: $("#next").offset().top
    //   }, 1000);
    // });

    $('#next').on('click', function () {
      exp.findNextView();
    });
  },
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var priorManipulation = {
  name: 'priorManipulation',
  title: 'Play a game with Jamie!',
  buttonText: 'Start the game!',
  render: function () {
    var viewTemplate = $('#priorManipulation-view').html();

    var text1 = 'Jamie is organizing a garden party with the theme "prude meets freaky". She still needs some last things from the store and it is your task to get them.';

    var text2 = 'You know that <strong>she likes NORMAL things</strong> and she generally prefers them over weird things whenever possible. But since it\'s a "prude and freaky" theme, she will sometimes also ask you to get some weird things.';

    var text3 = 'Note that <strong>you won\'t see everything she says at once</strong>. After each word following "Pick the ...", you\'ll be asked for your best guess on the object Jamie wants you to pick.';

    options = _.shuffle(["weird", "normal", "wooden", "round"]);


    $('#main').html(
      Mustache.render(viewTemplate, {
        name: this.name,
        title: this.title,
        text1: text1,
        text2: text2,
        text3: text3,
        img: 'images/jamie.png',
        opt_1: options[0],
        opt_2: options[1],
        opt_3: options[2],
        opt_4: options[3],
        button: this.buttonText
      })
    );

    $('#clarification').hide();
    $('#next').hide();
    $('#error').hide();
    $('#error2').hide();
    $('#error3').hide();
    $('#show_jamieintro').hide();

    $('#clarif_button').on('click', function () {
      $('#introjamie1').hide();
      $('#introjamie2').hide();
      $('#introjamie3').hide();
      $('#img').hide();
      $('#clarif_button').hide();
      $('#error3').hide();

      $('#clarification').show();
      $('#next').show();
    });

    $('#show_jamieintro').on('click', function () {
      $('#introjamie1').show();
      $('#introjamie2').show();
      $('#introjamie3').show();
      $('#img').show();
      $('#clarif_button').show();

      $('#clarification').hide();
      $('#next').hide();
      $('#show_jamieintro').hide();
      $('#error').hide();
      $('#error2').hide();
    });
    
    var failed_question = false;

    $("#next").on("click", function() {
      var opt1_checked = $("#opt-1").prop("checked");
      var opt2_checked = $("#opt-2").prop("checked");
      var opt3_checked = $("#opt-3").prop("checked");
      var opt4_checked = $("#opt-4").prop("checked");
      if(!opt1_checked & !opt2_checked & !opt3_checked & !opt4_checked) {
         
          console.log("show me that error, yo")
          $("#error").show();
          $("#error2").show();
          $('#show_jamieintro').show();
          failed_question = true;

      } else if ((opt1_checked & options[0] != "normal")
      | (opt2_checked & options[1] != "normal")
      | (opt3_checked & options[2] != "normal")
      | (opt4_checked & options[3] != "normal")) {

        console.log("wrong selection");
        $("#error3").show();
        $('#introjamie1').show();
        $('#introjamie2').show();
        $('#introjamie3').show();
        $('#img').show();
        $('#clarif_button').show();

        $('#clarification').hide();
        $('#next').hide();
        $('#show_jamieintro').hide();
        $('#error').hide();
        $('#error2').hide();
        failed_question = true;

      } else {
        exp.global_data.failed_question = failed_question;
        exp.findNextView();
      };
    });
  },
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var main = {
  name: 'main',
  render: function (CT) {
    // fill variables in view-template
    var viewTemplate = $('#main-view').html();

    // console.log(exp.trial_info.main_trials[CT]);
    var contextInfo = exp.trial_info.main_trials[CT];

    var items = {
      target: contextInfo.targetcompColor + '_' + contextInfo.targetType,
      comp: contextInfo.targetcompColor + '_' + contextInfo.compType,
      contrast: contextInfo.contrastColor + '_' + contextInfo.contrastType,
      distractor: contextInfo.distractorColor + '_' + contextInfo.distractorType
    };

    var [pos1, pos2, pos3, pos4] = _.shuffle(['target', 'comp', 'contrast', 'distractor']);

    var refexpTarget = items[contextInfo.refObject];

    var allUtts = [' ...'];

    if (contextInfo.utterance === 'modified') {
      // console.log('refexpTarget: ' + refexpTarget);
      var adjUtterance = refexpTarget.split('_').shift() + ' ...';
      var fullUtterance = refexpTarget.replace('_', ' ');
      allUtts.push(adjUtterance, fullUtterance);
    } else {
      // console.log('refexpTarget: ' + refexpTarget);
      var fullUtterance = refexpTarget.split('_').pop();
      allUtts.push(fullUtterance);
    }

    var utt = 0;

    var selectedItemsAll = [];
    var selectedItem = [];
    var reactionTimes = [];
    var rt = [];
    var startingTime;

    $('#main').html(
      Mustache.render(viewTemplate, {
        // title: 'Guess what your partner wants you to click on!',
        question: 'Pick the ' + allUtts[utt] + '!',
        item1: 'images/' + items[pos1] + '.png',
        item2: 'images/' + items[pos2] + '.png',
        item3: 'images/' + items[pos3] + '.png',
        item4: 'images/' + items[pos4] + '.png'
      })
    );

    $('#next_context').css('display', 'none');
    $('#helpText').css('display', 'none');

    //
    // FUNCTIONS
    //

    function showBorder (gridID) {
      hideBorders();
      $('#grid_' + gridID).css({
        'border-color': 'rgba(63, 195, 128, 1)',
        'padding': '16px',
        'border-width': '5px',
        'border-style': 'solid'
      });
    };

    function hideBorders () {
      var gridCells = ['pos1', 'pos2', 'pos3', 'pos4'];
      for (var id in gridCells) {
        $('#grid_' + gridCells[id]).css({
          'border-color': 'rgba(133, 133, 133, 0.705)',
          'padding': '20px',
          'border-width': '1px',
          'border-style': 'solid'
        });
      }
    };

    function checkNextStep () {
      if ((utt + 1) < allUtts.length) {
        $('#next_word').css('visibility', 'visible');
      } else if ((utt + 1) === allUtts.length) {
        $('#next_word').css('display', 'none');
        $('#next_context').css('display', 'block');
      } else {
        console.log('CATASTROPHE!!!!!!')
      }
    }

    function showNextUtt () {
      $('.question').text('Pick the ' + allUtts[utt] + '!');

      $('#error').hide();
      $('#next_word').css('visibility', 'hidden');
      rt = [];
      selectedItem = [];
      startingTime = Date.now();
    }

    //
    //
    //

    showNextUtt();

    $('#pos1,#pos2,#pos3,#pos4').click(function () {
      rt.push(Date.now() - startingTime);
      selectedItem.push(items[eval(this.id)]);
      showBorder(this.id);
      checkNextStep();
    });

    // BUTTONS

    // help button
    var active = false;
    $('#help').on('click', function () {
      // console.log("clicked");
      if (!active) {
        $('#helpText').css('display','block')
        active = true;
        $("#help").html('Hide Help');
        $([document.documentElement, document.body]).animate({
          scrollTop: $("#helpText").offset().top
        }, 1000);
      } else {
        $('html,body').scrollTop(0);
        $('#helpText').css('display','none')
        active = false;
        $("#help").html('Help');
      }
    })

    $('#next_word').on('click', function () {
      reactionTimes.push(rt);
      selectedItemsAll.push(selectedItem);
      hideBorders();
      utt = utt + 1;
      showNextUtt();
    })

    // event listener for buttons; when an input is selected, the response
    // and additional information are stored in exp.trial_info
    $('#next_context').on('click', function () {
      reactionTimes.push(rt);
      selectedItemsAll.push(selectedItem);
      // console.log(selectedItemsAll);
      var item2;
      var rt2;
      if (contextInfo.utterance === "modified") {
        item2 = selectedItemsAll[2].join()
        rt2 = reactionTimes[2].join()
      } else {
        item2 = "NaN"
        rt2 = "NaN"
      }
      var trialData = {
        trial_number: CT + 1,
        trial_type: contextInfo.trial_type,
        condition: contextInfo.condition,
        context_id: contextInfo.context,
        refObject: contextInfo.refObject,
        target: items.target,
        comp: items.comp,
        contrast: items.contrast,
        distractor: items.distractor,
        pos1: pos1,
        pos2: pos2,
        pos3: pos3,
        pos4: pos4,
        utterance: fullUtterance,
        utterance_cat: contextInfo.utterance,
        selectedItem_prior: selectedItemsAll[0].join(),
        selectedItem1: selectedItemsAll[1].join(),
        selectedItem2: item2,
        reaction_time_prior: reactionTimes[0].join(),
        reaction_time1: reactionTimes[1].join(),
        reaction_time2: rt2,
        RT: Date.now() - initialStartingTime
      };
      exp.trial_data.push(trialData);
      exp.findNextView();
    });

    // record trial starting time
    var initialStartingTime = Date.now();
  },
  trials: 55
};

// eslint-disable-next-line no-unused-vars
var debriefing = {
  name: 'debriefing',
  title: 'Debriefing',
  text:
        'Great, you\'re almost done! <br> Please note that we came up with the expressions you saw and not another MTurk worker. If you have further questions or concerns, don\'t hesitate to contact us.',
  buttonText: 'Got it!',
  render: function () {
    var viewTemplate = $('#debriefing-view').html();
    $('#main').html(
      Mustache.render(viewTemplate, {
        title: this.title,
        text: this.text,
        buttonText: this.buttonText
      })
    );

    $('html,body').scrollTop(0);

    $('#next').on('click', function () {
      exp.findNextView();
    });
  },
  trials: 1
};

// eslint-disable-next-line no-unused-vars
var postTest = {
  name: 'postTest',
  title: 'Additional Info',
  text:
        'Answering the following questions is optional, but will help us understand your answers.',
  buttonText: 'Continue',
  render: function () {
    var viewTemplate = $('#post-test-view').html();
    $('#main').html(
      Mustache.render(viewTemplate, {
        title: this.title,
        text: this.text,
        buttonText: this.buttonText
      })
    );

    $('html,body').scrollTop(0);

    $('#next').on('click', function (e) {
      // prevents the form from submitting
      e.preventDefault();

      // records the post test info
      exp.global_data.HitCorrect = $('#HitCorrect').val();
      exp.global_data.age = $('#age').val();
      exp.global_data.gender = $('#gender').val();
      // exp.global_data.education = $('#education').val();
      exp.global_data.languages = $('#languages').val();
      exp.global_data.enjoyment = $('#enjoyment').val();
      exp.global_data.comments = $('#comments')
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

// eslint-disable-next-line no-unused-vars
var thanks = {
  name: 'thanks',
  message: 'Thank you for taking part in this experiment!',
  render: function () {
    var viewTemplate = $('#thanks-view').html();

    // what is seen on the screen depends on the used deploy method
    //    normally, you do not need to modify this
    if (
      config_deploy.is_MTurk ||
            config_deploy.deployMethod === 'directLink'
    ) {
      // updates the fields in the hidden form with info for the MTurk's server
      $('#main').html(
        Mustache.render(viewTemplate, {
          thanksMessage: this.message
        })
      );
    } else if (config_deploy.deployMethod === 'Prolific') {
      $('main').html(
        Mustache.render(viewTemplate, {
          thanksMessage: this.message,
          extraMessage:
                        'Please press the button below to confirm that you completed the experiment with Prolific<br />' +
                        '<a href=' +
                        config_deploy.prolificURL +
                        ' class="prolific-url">Confirm</a>'
        })
      );
    } else if (config_deploy.deployMethod === 'debug') {
      $('main').html(Mustache.render(viewTemplate, {}));
    } else {
      console.log('no such config_deploy.deployMethod');
    }

    exp.submit();
  },
  trials: 1
};
