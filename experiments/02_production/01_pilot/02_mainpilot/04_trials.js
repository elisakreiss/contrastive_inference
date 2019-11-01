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
        intended_target: 'target',
        selected: false
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

// sampling

var sampled_contexts = [];
var shuffled_contexts = _.shuffle(unique_contexts);

// console.log("shuffled_contexts");
// console.log(shuffled_contexts);

var condition_list = ["ttn", "atn", "tan", "aan", "ttp", "atp", "tap", "aap"];

for (var cond_id in condition_list) {
    for (var num in [0,1,2,3]) {
        
        var context_id = 0;
        var context_found = false;
        while (context_found == false) {
            var current_context = shuffled_contexts[context_id];
            if (current_context.condition == condition_list[cond_id] & 
                current_context.selected == false) {

                current_context.selected = true;
                if (condition_list[cond_id].includes("p") & num > 1) {
                    current_context.intended_target = "comp";
                }
                sampled_contexts.push(current_context);
                context_found = true;
            }
            context_id += 1;
        }
    }
}

for (var num in [0,1,2,3,4,5,6,7]) {
    var context_id = 0;
    var context_found = false;
    while (context_found == false) {
        var current_context = shuffled_contexts[context_id];
        if (current_context.condition.includes("p") & 
            current_context.selected == false) {

            current_context.selected = true;
            current_context.intended_target = "contrast";
            sampled_contexts.push(current_context);
            context_found = true;
        }
        context_id += 1;
    }
}

for (var num in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]) {
    var context_id = 0;
    var context_found = false;
    while (context_found == false) {
        var current_context = shuffled_contexts[context_id];
        if (current_context.selected == false) {

            current_context.selected = true;
            current_context.intended_target = "distractor";
            sampled_contexts.push(current_context);
            context_found = true;
        }
        context_id += 1;
    }
}


// console.log("sampled_contexts");
// console.log(sampled_contexts);

const main_trials = {
    color_ref: [sampled_contexts]
};

// console.log(main_trials);