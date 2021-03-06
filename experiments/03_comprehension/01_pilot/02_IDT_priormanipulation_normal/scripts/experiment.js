// customize the experiment by specifying a view order and a trial structure
exp.customize = function () {
  // record current date and time in global_data
  this.global_data.startDate = Date();
  this.global_data.startTime = Date.now();
  // specify view order
  this.views_seq = [
    botcaptcha,
    intro,
    // practiceIntro,
    // practice,
    // mainIntro,
    priorManipulation,
    main,
    debriefing,
    postTest,
    thanks
  ];

  // prepare information about trials (procedure)
  // randomize main trial order, but keep practice trial order fixed

  // have no incongruent trials among the first 15 trials of the experiment
  // & have no prior manipulation incongruent trials among the first 15 trials
  var shuffled_main_trials = _.shuffle(main_trials);
  var i = 0;
  while (i < 15) {
    var context = shuffled_main_trials[i];
    
    if ((context.trial_type === 'critical' & (context.condition === 'tan' | context.condition === 'ttn')) |
        ((i < 5) & 
            ((context.refObject == 'target' & context.targetTypicality == 'atypical') |
            (context.refObject == 'comp' & context.compTypicality == 'atypical') |
            // if target is typical, contrast must be atypical; distractor is always typical
            (context.refObject == 'contrast' & context.targetTypicality == 'typical')))) {

      shuffled_main_trials.splice(i, 1);
      var new_pos = _.random(15,shuffled_main_trials.length);
      shuffled_main_trials.splice(new_pos, 0, context);

    } else {
      i += 1;
    }
  }

  console.log("shuffled_main_trials")
  console.log(shuffled_main_trials)



  this.trial_info.main_trials = shuffled_main_trials;
  this.trial_info.practice_trials = _.shuffle(practice_trials);

  // preload images
  function preloadImage(images){
    for (var pos in images){
        (new Image()).src = 'images/' + images[pos] + '.png';
    };
    console.log('pictures are loaded');
  };
  var images = ['orange_balloon', 'red_car', 'white_swan', 'alpslogo', 'orange_banana', 'red_corn', 'white_tomato', 'black_feather', 'orange_butterfly', 'red_flower', 'whitebrown_horse', 'blue_sponge', 'orange_carrot', 'red_jacket', 'yellow_banana', 'green_bicycle', 'orange_lettuce', 'red_pumpkin', 'yellow_bicycle', 'green_broccoli', 'orange_mug', 'red_rock', 'yellow_bike', 'green_carrot', 'orange_pumpkin', 'red_soap', 'yellow_bike_oldbutnormed', 'green_corn', 'practiceContext', 'red_strawberry', 'yellow_corn', 'green_lettuce', 'practiceContext_old', 'red_table', 'yellow_egg', 'green_scissors', 'purple_flower', 'red_tomato', 'yellow_jacket', 'green_swan', 'red_bellpepper', 'white_carrot', 'yellow_lamp', 'green_toothbrush', 'red_book', 'white_egg', 'yellow_snowman', 'light_chair', 'red_broccoli', 'white_pumpkin', 'yellow_strawberry', 'mainContext', 'red_candle', 'white_snowman'];
  preloadImage(images);

  // adds progress bars to the views listed
  // view's name is the same as object's name
  // this.progress_bar_in = ['main'];
  this.progress_bar_in = ['practice', 'main'];
  // styles: chunks, separate or default
  this.progress_bar_style = 'default';
  // the width of the progress bar or a single chunk
  this.progress_bar_width = 100;
};
