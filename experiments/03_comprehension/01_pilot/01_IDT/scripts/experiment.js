// customize the experiment by specifying a view order and a trial structure
exp.customize = function () {
  // record current date and time in global_data
  this.global_data.startDate = Date();
  this.global_data.startTime = Date.now();
  // specify view order
  this.views_seq = [
    botcaptcha,
    intro,
    practiceIntro,
    practice,
    mainIntro,
    main,
    debriefing,
    postTest,
    thanks
  ];

  // prepare information about trials (procedure)
  // randomize main trial order, but keep practice trial order fixed
  // TODO: sort according to congruency!
  console.log('TODO: sort according to congruency!');
  this.trial_info.main_trials = _.shuffle(main_trials);
  this.trial_info.practice_trials = _.shuffle(practice_trials);

  console.log(main_trials.length);

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
