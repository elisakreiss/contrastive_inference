/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
var participantCond = 'typical';

function createRandomDistractor (colors, types, typicality = 'random') {
  do {
    // choose color that doesn't occur in the context yet
    do {
      var shuffledLexicon = _.shuffle(colorObjLexicon)
      var distColor = shuffledLexicon[0].color;
    } while (colors.includes(distColor));

    // console.log('distColor: '+distColor);

    // select objects in this color
    if (typicality === 'random') {
      var possibleTypes = _.flatten([shuffledLexicon[0].typical, shuffledLexicon[0].atypical]);
    } else {
      // console.log('shuffledLexicon[0][typicality]: ' + shuffledLexicon[0][typicality]);
      var possibleTypes = shuffledLexicon[0][typicality];
    }

    var distType = _.shuffle(possibleTypes)[0];
  } while (types.includes(distType));
  return ([distColor, distType])
}

function findContrastColor (targetColor, type) {
  // go through colors in lexicon
  for (var col in colorObjLexicon) {
    var objects = _.flatten([colorObjLexicon[col].typical, colorObjLexicon[col].atypical]);

    // if a color has an object of the desired type and the color is not the target color, return color
    if ((colorObjLexicon[col].color !== targetColor) & objects.includes(type)) {
      return (colorObjLexicon[col].color);
    }
  }
}

function completeContext (targetcompColor, targetType, compType, contrast, targetTypicality, compTypicality) {
  // in the case of a present contrast, find the contrast object
  if (contrast === 'present') {
    var contrastType = targetType;
    var contrastColor = findContrastColor(targetcompColor, contrastType);
    // if there is no contrast present, choose random distractor
  } else {
    var [contrastColor, contrastType] = createRandomDistractor([targetcompColor], [targetType, compType]);
  }

  // create a fourth random distractor
  var [distractorColor, distractorType] = createRandomDistractor([targetcompColor, contrastColor], [targetType, compType, contrastType]);

  // define condition and unique context name
  var condition = targetTypicality[0] +
        compTypicality[0] +
        contrast[0]
  var context = targetcompColor + '_' +
        condition + '_' +
        targetType;

  // full context definition
  var context = {
    condition: condition,
    context: context,
    targetcompColor: targetcompColor,
    targetType: targetType,
    targetTypicality: targetTypicality,
    compType: compType,
    compTypicality: compTypicality,
    contrast: contrast,
    contrastType: contrastType,
    contrastColor: contrastColor,
    distractorColor: distractorColor,
    distractorType: distractorType,
    refObject: 'target',
    utterance: 'modified',
    trial_type: 'critical'
  }

  return context
}

var criticalContexts = [];
var potentialFillerFontexts = [];
var colorObjLexicon = [
  {
    color: 'yellow',
    typical: ['banana', 'corn'],
    atypical: ['strawberry', 'egg']
  },
  {
    color: 'orange',
    typical: ['carrot', 'pumpkin'],
    atypical: ['banana', 'lettuce']
  },
  {
    color: 'red',
    typical: ['strawberry', 'tomato'],
    atypical: ['broccoli', 'corn']
  },
  {
    color: 'green',
    typical: ['broccoli', 'lettuce'],
    atypical: ['carrot', 'swan']
  },
  {
    color: 'white',
    typical: ['egg', 'swan'],
    atypical: ['pumpkin', 'tomato']
  }
];
var typicality = ['typical', 'atypical'];
var contrast = ['present', 'not_present'];

// iterate through all colors (5)
for (var col in colorObjLexicon) {
  var colorObjs = colorObjLexicon[col];
  var targetColor = colorObjs.color;

  // targets and color competitors can appear in a typical or atypical color
  for (var tTarget in typicality) {
    for (var tComp in typicality) {
      // contrasts can be present or absent
      for (var contr in contrast) {
        // for a given color and typicality select one object randomly as
        // the target for the critical context, the other one will be the
        // target of a potential filler context
        var [targetTypeCritical, targetTypeFiller] = _.shuffle(colorObjs[typicality[tTarget]]);

        // if target and competitor typicality are the same, then they are
        // each other's competitors/targets
        if (tTarget === tComp) {
          var compTypeCritical = targetTypeFiller;
          var compTypeFiller = targetTypeCritical;
          // otherwise the other two objects of that color become competitors
        } else {
          var [compTypeCritical, compTypeFiller] = _.shuffle(colorObjs[typicality[tComp]]); 
        }

        // after the rigid parts are set, the context can be filled
        var criticalContext = completeContext(targetColor, targetTypeCritical, compTypeCritical, contrast[contr], typicality[tTarget], typicality[tComp]);
        var fillerContext = completeContext(targetColor, targetTypeFiller, compTypeFiller, contrast[contr], typicality[tTarget], typicality[tComp]);

        potentialFillerFontexts.push(fillerContext);

        if (typicality[tComp] == participantCond) {
          // push the context to their respective lists
          criticalContexts.push(criticalContext);
        } else {
          potentialFillerFontexts.push(criticalContext);
        }
      }
    }
  }
}

function compareContrast (a, b) {
  const contextA = a.contrast;
  const contextB = b.contrast;

  let comparison = 0;
  if (contextA > contextB) {
    comparison = 1;
  } else if (contextA < contextB) {
    comparison = -1;
  }
  return comparison * -1;
}

function createFillers (allContexts) {
  // TODO: This ignores typicality! Unmodified refexps should refer to typical objects!
  // strong preference for contexts with typical distractor
  console.log(allContexts);

  var contexts = (_.shuffle(allContexts)).slice(0,35);
  // contrast present contexts are in the front now
  var sorted = contexts.sort(compareContrast);
  for (var i in sorted) {
    if (i < 5) {
      // 5x utterance: modified; target: contrast
      var refObject = 'contrast';
      var utterance = 'modified';
    } else if (i < 15) {
      // 5x utterance: modified; target: color competitor
      // 5x utterance: unmodified; target: color competitor
      var refObject = 'comp';
      var utterance = i % 2 ? 'modified': 'unmodified';
    } else {
      // 20x utterance: unmodified; target: random distractor
      var refObject = 'distractor';
      var utterance = 'unmodified';
      [sorted[i].distractorColor,sorted[i].distractorType] = createRandomDistractor([sorted[i].targetcompColor,sorted[i].contrastColor],[sorted[i].targetType,sorted[i].compType,sorted[i].contrastType],typicality='typical');
    }
    sorted[i].refObject = refObject;
    sorted[i].utterance = utterance;
    sorted[i].trial_type = 'filler';
  }
  return (sorted)
}

var fillerContexts = createFillers(potentialFillerFontexts);

// console.log(fillerContexts);
// console.log(criticalContexts);

var main_trials = _.flatten([criticalContexts, fillerContexts]);
