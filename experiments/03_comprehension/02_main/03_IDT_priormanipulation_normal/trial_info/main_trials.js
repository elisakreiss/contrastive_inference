/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
// var participantCond = 'typical';
// var participantCond = 'atypical';
var participantCond = COMPETITOR_TYPICALITY;
// console.log("color competitor typicality: ", participantCond)

function createRandomDistractor (colors, types, set_typicality = 'random') {
  // I think this 'do' is vacuous
  do {
    // choose color that doesn't occur in the context yet
    do {
      var shuffledLexicon = _.shuffle(colorObjLexicon)
      var distColor = shuffledLexicon[0].color;
    } while (colors.includes(distColor));

    // select objects in this color/typicality
    var distTypicality = set_typicality === 'random' ? _.shuffle(["typical", "atypical"])[0] : set_typicality;
    var possibleType = shuffledLexicon[0][distTypicality];
    var distType = _.shuffle(possibleType)[0];
  } while (types.includes(distType));
  return ([distColor, distType, distTypicality])
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
  var contrastTypicality = targetTypicality == "typical" ? "atypical" : "typical";
  // in the case of a present contrast, find the contrast object
  if (contrast === 'present') {
    var contrastType = targetType;
    var contrastColor = findContrastColor(targetcompColor, contrastType);
    // if there is no contrast present, choose random distractor
  } else {
    var [contrastColor, contrastType, contrastTypicality] = createRandomDistractor([targetcompColor], [targetType, compType], set_typicality=contrastTypicality);
  }

  // create a fourth random distractor
  var [distractorColor, distractorType, distractorTypicality] = createRandomDistractor([targetcompColor, contrastColor], [targetType, compType, contrastType], set_typicality=targetTypicality);

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
    contrastTypicality: contrastTypicality,
    distractorColor: distractorColor,
    distractorType: distractorType,
    distractorTypicality: distractorTypicality,
    refObject: 'target',
    utterance: 'modified',
    trial_type: 'critical'
  }

  return context
}

var criticalContexts = [];
var potentialFillerContexts = [];
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

        potentialFillerContexts.push(fillerContext);

        if (typicality[tComp] == participantCond) {
          // push the context to their respective lists
          criticalContexts.push(criticalContext);
        } else {
          potentialFillerContexts.push(criticalContext);
        }
      }
    }
  }
}

function updateFillerinfo (context, refObject, utterance) {
  context.refObject = refObject;
  context.utterance = utterance;
  context.trial_type = 'filler';
  return (context);
}

function createFillers (allContexts) {
  var contexts = (_.shuffle(allContexts));
  var fillers = [];

  var c = 0;
  while (fillers.length < 5) {
    // 5x utterance: modified; target: contrast
    if (contexts[c].contrast === 'present') {
      var new_context = updateFillerinfo(contexts[c], refObject='contrast', utterance='modified');
      fillers.push(new_context);
      contexts.splice(c, 1);
    } else {
      c += 1;
    }
  }

  c = 0;
  while (fillers.length < 10) {
    // 5x utterance: unmodified; target: typical color competitor
    // to avoid priming, exclude contexts where comp is atypical
    if (contexts[c].compTypicality === 'typical') {
      var new_context = updateFillerinfo(contexts[c], refObject='comp', utterance='unmodified');
      fillers.push(new_context);
      contexts.splice(c, 1);
    } else {
      c += 1;
    }
  }

  c = 0;
  while (fillers.length < 15) {
    // 5x utterance: modified; target: atypical scolor competitor
    // to avoid priming, exclude contexts where comp is typical and where the target has a contrast
    if (contexts[c].compTypicality === 'atypical' & contexts[c].contrast === 'not_present') {
      var new_context = updateFillerinfo(contexts[c], refObject='comp', utterance='modified');
      fillers.push(new_context);
      contexts.splice(c, 1);
    } else {
      c += 1;
    }
  }

  c = 0;
  while (fillers.length < 25) {
    // 10x utterance: unmodified; target: typical distractor
    if (contexts[c].distractorTypicality === 'typical') {
      var new_context = updateFillerinfo(contexts[c], refObject='distractor', utterance='unmodified');
      fillers.push(new_context);
      contexts.splice(c, 1);
    } else {
      c += 1;
    }
  }

  c = 0;
  while (fillers.length < 35) {
    // 10x utterance: modified; target: atypical distractor
    if (contexts[c].distractorTypicality === 'atypical') {
      var new_context = updateFillerinfo(contexts[c], refObject='distractor', utterance='modified');
      fillers.push(new_context);
      contexts.splice(c, 1);
    } else {
      c += 1;
    }
  }

  // c = 0;
  // while (fillers.length < 35) {
  //   // 20x utterance: modified & unmodified; target: random distractor
  //   // use typical and atypical distractors now to have equal number of instances
  //   // if distractor is typical, use it
  //   if (contexts[c].distractorTypicality === 'typical') {
  //     var new_context = updateFillerinfo(contexts[c], refObject='distractor', utterance='unmodified');
  //     fillers.push(new_context);
  //     contexts.splice(c, 1);
  //     console.log("typ");
  //   // // if there is no contrast and this contrast-distractor is typical, use it
  //   // } else if (contexts[c].contrast === 'not_present' & contexts[c].contrastTypicality === 'typical') {
  //   //   var new_context = updateFillerinfo(contexts[c], refObject='contrast_as_distractor', utterance='unmodified');
  //   //   fillers.push(new_context);
  //   //   contexts.splice(c, 1);
  //   // } else {
  //   //   c += 1;
  //   // }
  //   } else {
  //     var new_context = updateFillerinfo(contexts[c], refObject='distractor', utterance='modified');
  //     fillers.push(new_context);
  //     contexts.splice(c, 1);
  //   }
  // }
                            
  return (fillers)
}

var fillerContexts = createFillers(potentialFillerContexts);

var main_trials = _.flatten([criticalContexts, fillerContexts]);
