var participant_cond = "typical";

function create_random_distractor(colors,types,typicality="random"){

    do {

        // choose color that doesn't occur in the context yet
        do {
            var shuffled_lexicon = _.shuffle(color_obj_Lexicon)
            var dist_color = shuffled_lexicon[0].color;
        } while(colors.includes(dist_color));

        // console.log("dist_color: "+dist_color);

        // select objects in this color
        if (typicality=="random"){
            var possible_types = _.flatten([shuffled_lexicon[0].typical,shuffled_lexicon[0].atypical]);    
        } else {
            // console.log("shuffled_lexicon[0][typicality]: " + shuffled_lexicon[0][typicality]);
            var possible_types = shuffled_lexicon[0][typicality];
        }

        var dist_type = _.shuffle(possible_types)[0];

    } while(types.includes(dist_type));

    return([dist_color,dist_type])
}

function find_contrast_color(target_color,type){

    // go through colors in lexicon
    for (col in color_obj_Lexicon){
        var objects = _.flatten([color_obj_Lexicon[col].typical,color_obj_Lexicon[col].atypical]);

        // if a color has an object of the desired type and the color is not the target color, return color
        if ((color_obj_Lexicon[col].color != target_color) & objects.includes(type)){
            return(color_obj_Lexicon[col].color);
        }
    }
}

function complete_context(targetcomp_color,target_type,comp_type,contrast,target_typicality,comp_typicality){
    // in the case of a present contrast, find the contrast object
    if (contrast == "present"){
        var contrast_type = target_type;
        var contrast_color = find_contrast_color(targetcomp_color,contrast_type);
    // if there is no contrast present, choose random distractor
    } else {
        var [contrast_color, contrast_type] = create_random_distractor([targetcomp_color],[target_type,comp_type]);
    }

    // create a fourth random distractor
    var [distractor_color,distractor_type] = create_random_distractor([targetcomp_color,contrast_color],[target_type,comp_type,contrast_type]);

    // define condition and unique context name
    var condition = target_typicality[0]
        + comp_typicality[0] 
        + contrast[0]
    var context = targetcomp_color + "_" 
        + condition + "_"
        + target_type;

    // full context definition
    var context = {
        condition: condition,
        context: context,
        targetcomp_color: targetcomp_color,
        target_type: target_type,
        target_typicality: target_typicality,
        comp_type: comp_type,
        comp_typicality: comp_typicality,
        contrast: contrast,
        contrast_type: contrast_type,
        contrast_color: contrast_color,
        distractor_color: distractor_color,
        distractor_type: distractor_type,
        ref_object: "target",
        utterance: "modified",
        trial_type: "critical"
    }

    return context
}



var critical_contexts = [];
var potential_filler_contexts = [];
var color_obj_Lexicon = [
    {
        color: "yellow",
        typical: ["banana", "corn"],
        atypical: ["strawberry","egg"]
    },
    {
        color: "orange",
        typical: ["carrot", "pumpkin"],
        atypical: ["banana","lettuce"]
    },
    {
        color: "red",
        typical: ["strawberry", "tomato"],
        atypical: ["broccoli","corn"]
    },
    {
        color: "green",
        typical: ["broccoli", "lettuce"],
        atypical: ["carrot","swan"]
    },
    {
        color: "white",
        typical: ["egg", "swan"],
        atypical: ["pumpkin","tomato"]
    }
];
var typicality = ["typical","atypical"];
var contrast = ["present","not_present"];

// iterate through all colors (5)
for (col in color_obj_Lexicon){
    var color_objs = color_obj_Lexicon[col];
    var target_color = color_objs.color;

    // targets and color competitors can appear in a typical or atypical color
    for (t_target in typicality){
        for (t_comp in typicality){

	        // contrasts can be present or absent
	        for (contr in contrast){

	            // for a given color and typicality select one object randomly as  
	            // the target for the critical context, the other one will be the
	            // target of a potential filler context
	            var [target_type_critical, target_type_filler] = _.shuffle(color_objs[typicality[t_target]]);

	            // if target and competitor typicality are the same, then they are
	            // each other's competitors/targets
	            if (t_target == t_comp){
	                var comp_type_critical = target_type_filler;
	                var comp_type_filler = target_type_critical;
	            // otherwise the other two objects of that color become competitors
	            } else {
	                var [comp_type_critical, comp_type_filler] = _.shuffle(color_objs[typicality[t_comp]]); 
	            }

	            // after the rigid parts are set, the context can be filled
	            var critical_context = complete_context(target_color,target_type_critical,comp_type_critical,contrast[contr],typicality[t_target],typicality[t_comp]);
	            var filler_context = complete_context(target_color,target_type_filler,comp_type_filler,contrast[contr],typicality[t_target],typicality[t_comp]);

	            potential_filler_contexts.push(filler_context);

	            if (typicality[t_comp] == participant_cond){
	            	// push the context to their respective lists
	            	critical_contexts.push(critical_context);
		        } else {
		        	potential_filler_contexts.push(critical_context);
		        }
	            

	        }
        }
    }
}

function compare_contrast(a, b) {
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

function create_fillers(all_contexts){

    // TODO: This ignores typicality! Unmodified refexps should refer to typical objects!
    // strong preference for contexts with typical distractor
    console.log(all_contexts);
    
    var contexts = (_.shuffle(all_contexts)).slice(0,35);
    // contrast present contexts are in the front now
    var sorted = contexts.sort(compare_contrast);
    for (i in sorted){
        if (i < 5){
            // 5x utterance: modified; target: contrast
            var ref_object = "contrast";
            var utterance = "modified";
        } else if (i < 15){
            // 5x utterance: modified; target: color competitor
            // 5x utterance: unmodified; target: color competitor
            var ref_object = "comp";
            var utterance = i % 2 ? "modified": "unmodified";
        } else {
            // 20x utterance: unmodified; target: random distractor
            var ref_object = "distractor";
            var utterance = "unmodified";
            [sorted[i].distractor_color,sorted[i].distractor_type] = create_random_distractor([sorted[i].targetcomp_color,sorted[i].contrast_color],[sorted[i].target_type,sorted[i].comp_type,sorted[i].contrast_type],typicality="typical");
        }
        sorted[i].ref_object = ref_object;
        sorted[i].utterance = utterance;
        sorted[i].trial_type = "filler";
    }
    return(sorted)
}

var filler_contexts = create_fillers(potential_filler_contexts);

// console.log(filler_contexts);
// console.log(critical_contexts);

var main_trials = _.flatten([critical_contexts,filler_contexts]);
