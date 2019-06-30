// customize the experiment by specifying a view order and a trial structure
exp.customize = function () {
  // record current date and time in global_data
  this.global_data.startDate = Date();
  this.global_data.startTime = Date.now();
  // specify view order
  this.views_seq = [
    // botcaptcha,
    // intro,
    practice,
    main,
    // postTest,
    thanks
  ];

  // prepare information about trials (procedure)
  // randomize main trial order, but keep practice trial order fixed
  // TODO: sort according to congruency!
  console.log('TODO: sort according to congruency!');
  this.trial_info.main_trials = _.shuffle(main_trials);
  this.trial_info.practice_trials = _.shuffle(practice_trials);

  console.log(main_trials.length);

  // adds progress bars to the views listed
  // view's name is the same as object's name
  this.progress_bar_in = ['main'];
  // this.progress_bar_in = ['practice', 'main'];
  // styles: chunks, separate or default
  this.progress_bar_style = 'default';
  // the width of the progress bar or a single chunk
  this.progress_bar_width = 100;
};
