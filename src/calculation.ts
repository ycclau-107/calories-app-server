
interface profile{
    id: number;
    name: string;
    //weight of user in kg
    weight: number;
    //height of user in cm
    height: number;
    //age of user in years
    age: number;
    gender: "Male"| "Female";
    
    bodyFat: null | number;
}

interface dietPlan{
    calorieIntake: number;
    style: "Causal" | "High Carbohydrates" | "Low Carbohydrates" | "Customized";
    carbs:{
        percentage: number,
        gram: number,
        calorie: number,
    },
    protein:{
        percentage: number,
        gram: number,
        calorie: number,
    },
    fat:{
        percentage: number,
        gram: number,
        calorie: number,
    },
}

/**
 * function to calculate Basal Metabolic Rate(BMR) in calorie
 * @param profile the profile of user
 */
export function calBMR(p: profile): number {
    let gFactor :number = 0;
    if(p.gender == "Male"){
        gFactor = 5;
    } else if (p.gender == "Female"){
        gFactor = -16;
    }

    var res: number = (p.weight*10) + (p.height*6.25) - (p.age*5) + gFactor;

    return res;
};

/**
 *  function to calculate Total Daily Energy Expenditure (TDEE) in calorie
 * @param profile the profile of user
 * @param tea thermic effect of activity, frequency of exercise per week
 */
export function calTDEE(bmr: number, tea: string): number {
    var res: number = 0;
    var tFactor: number = 0;
    switch(tea){
        case "sedentary":
            tFactor = 1.2;
            break;
        case "lightly":
            tFactor = 1.375;
            break;
        case "moderately":
            tFactor = 1.55;
            break;
        case "actively":
            tFactor = 1.725;
            break;
        case "extremely":
            tFactor = 1.9;
            break;
        default:
            tFactor = 1;
            break;
    }

    res = bmr * tFactor;
    return res;
};

/**
 * function to calculate target 
 * @param tdee TDEE calculated
 * @param goal goal of exercise
 * @returns the target protein intake in grams
 */
export function calTargetProtein_g(p: profile, goal: string): number{
    
    var res: number = 0;
    var gFactor:number = 0;
    switch(goal){
        case "static":
            gFactor = 1;
            break;
        case "maintain muscle":
            gFactor = 1.2;
            break;
        case "grow muscle":
            gFactor = 1.5;
            break;
        default:
            break;
    }

    res = p.weight * gFactor;

    return res;
}

/**
 * function to finalize the portion for different main nutritions intake. User can customize the carbs intake percentage
 * 
 * @param style exercise style with muscle goal
 * @param proteinGoal target protein intake in grams
 */
export function designDietPlan(tdee: number, 
    style: "Causal" | "High Carbohydrates" | "Low Carbohydrates" | "Customized", 
    proteinGram: number, 
    carbsPercentage: any|number){

    var proteinPercentage:number = proteinGram * 4/tdee;

    var fatPercentage: number = 0;

    switch(style){
        case "Causal":
            carbsPercentage = 0.5;
            break;
        case "High Carbohydrates":
            carbsPercentage = 0.65;
            break;
        case "Low Carbohydrates":
            carbsPercentage = 0.15;
            break;
        case "Customized":
            break;
        default:
            break;
    }

    fatPercentage = 1 - carbsPercentage - proteinPercentage;

    var dietProfile: dietPlan= {
        calorieIntake: tdee,
        style: style,
        carbs:{
            percentage: carbsPercentage,
            gram: carbsPercentage*tdee/4,
            calorie: carbsPercentage*tdee,
        },
        protein:{
            percentage: proteinPercentage,
            gram: proteinPercentage*tdee/4,
            calorie: proteinPercentage*tdee,
        },
        fat:{
            percentage: fatPercentage,
            gram: fatPercentage*tdee/9,
            calorie: fatPercentage*tdee,
        },
    }

    return dietProfile;
}

