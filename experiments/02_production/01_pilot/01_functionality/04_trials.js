// In this file you can specify the trial data for your experiment
// const main_trials = {
//     color_ref: [

//         ["question_mark_01.png", "question_mark_02.png", "question_mark_03.jpg", "question_mark_04.png"],
//         ["question_mark_01.png", "question_mark_02.png", "question_mark_03.jpg", "question_mark_04.png"],
//         ["question_mark_01.png", "question_mark_02.png", "question_mark_03.jpg", "question_mark_04.png"],

//     ]
// };

// 

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
        condition: condition,
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
        distractorTypicality: distractorTypicality,
        trial_type: 'critical'
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

const main_trials = {
    color_ref: [unique_contexts]
};

// console.log(main_trials);