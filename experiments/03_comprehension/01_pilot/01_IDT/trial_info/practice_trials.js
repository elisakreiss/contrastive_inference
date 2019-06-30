// eslint-disable-next-line no-unused-vars
var practice_trials = [
  {
    contrast: 'present',
    targetType: 'flower',
    targetcompColor: 'red',
    compType: 'candle',
    distractorType: 'scissors',
    distractorColor: 'green',
    contrastType: 'flower',
    contrastColor: 'purple'
  },
  {
    contrast: 'not_present',
    targetType: 'bellpepper',
    targetcompColor: 'red',
    compType: 'book',
    distractorType: 'feather',
    distractorColor: 'black',
    contrastType: 'lamp',
    contrastColor: 'yellow'
  },
  {
    contrast: 'present',
    targetType: 'bicycle',
    targetcompColor: 'yellow',
    compType: 'jacket',
    distractorType: 'butterfly',
    distractorColor: 'orange',
    contrastType: 'bicycle',
    contrastColor: 'green'
  },
  {
    contrast: 'not_present',
    targetType: 'scissors',
    targetcompColor: 'green',
    compType: 'toothbrush',
    distractorType: 'mug',
    distractorColor: 'orange',
    contrastType: 'chair',
    contrastColor: 'light'
  }
];

console.log('practice_trials: ' + practice_trials[0].contrast)
