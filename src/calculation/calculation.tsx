
export interface profile{
    user_id: number;
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

/**
 * target profile
 * @bmr Basal metabolic rate
 * @tdee Total Daily Energy Expenditure
 */
export interface target{
    user_id: number,
    bmr: number,
    tdee: number,
    protein:{
        percentage: number,
        gram: number,
        calorie: number,
    },
    carbs:{
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

export interface nutritionLabal{
    foodname: string,
    calorie_100g: number,
    protein_100g: number,
    carbs_100g: number,
    fat_100g: number,
}

export interface calorieRecord{
    foodname: string,
    gram: number,
    calorie: number,
    protein: number,
    carbs: number,
    fat: number
}

/**
 * function to quantify the target of calorie intake as well as main nutrition for user
 * @param profile basic personal information
 * @param TEA Thermic Effect of Activity, how often exercise per week
 * @param goal muscle goal, related to the amount of protein intake
 * @param dietstyle diet style, related to the ratio of carbs and fat in daily intake
 * @returns {target} target quantified diet profile
 */
export function setTarget(
    profile:profile, 
    TEA: "0 per week" | "1-2 per week" | "3-4 per week" | "5-6 per week" | "7+ per week", 
    goal: "static" | "maintain muscle" | "grow muscle", 
    dietstyle: "Causal" | "High Carbohydrates" | "Low Carbohydrates"):target{
    
    //BMR
    let gFactor :number = 0;
    if(profile.gender == "Male"){
        gFactor = 5;
    } else if (profile.gender == "Female"){
        gFactor = -16;
    }

    var bmr: number = (profile.weight*10) + (profile.height*6.25) - (profile.age*5) + gFactor;

    //TDEE
    var tFactor: number = 0;
    switch(TEA){
        case "0 per week":
            tFactor = 1.2;
            break;
        case "1-2 per week":
            tFactor = 1.375;
            break;
        case "3-4 per week":
            tFactor = 1.55;
            break;
        case "5-6 per week":
            tFactor = 1.725;
            break;
        case "7+ per week":
            tFactor = 1.9;
            break;
        default:
            tFactor = 1;
            break;
    }
    var tdee: number = bmr * tFactor;

    //protein Intake
    var proteinIntake_gram: number = 0;
    var pFactor:number = 0;
    switch(goal){
        case "static":
            pFactor = 1;
            break;
        case "maintain muscle":
            pFactor = 1.2;
            break;
        case "grow muscle":
            pFactor = 1.5;
            break;
        default:
            break;
    }

    proteinIntake_gram = profile.weight * pFactor;

    var proteinPer:number = proteinIntake_gram * 4/tdee;
    var carbsPer: number = 0;
    var fatPer: number = 0;

    switch(dietstyle){
        case "Causal":
            carbsPer = 0.5;
            break;
        case "High Carbohydrates":
            carbsPer = 0.65;
            break;
        case "Low Carbohydrates":
            carbsPer = 0.15;
            break;
        default:
            break;
    }

    fatPer = 1 - proteinPer - carbsPer;

    var target: target= {
        user_id: profile.user_id,
        bmr: bmr,
        tdee: tdee,
        protein:{
            percentage: proteinPer,
            gram: proteinPer*tdee/4,
            calorie: proteinPer*tdee,
        },
        carbs:{
            percentage: carbsPer,
            gram: carbsPer*tdee/4,
            calorie: carbsPer*tdee,
        },
        fat:{
            percentage: fatPer,
            gram: fatPer*tdee/9,
            calorie: fatPer*tdee,
        },
    }

    return target;
}

/**
 * function to calcuate the food of total calorie and nutrition for calorie record
 * @param nutLabel 
 * @param gram 
 * @return {calorieRecord} calorieRecord
 */
export function calTotalNutrition(nutLabel: nutritionLabal, gram: number): calorieRecord{
    var outdata = {
        foodname: nutLabel.foodname,
        gram: gram,
        calorie: nutLabel.calorie_100g * gram,
        protein: nutLabel.protein_100g * gram,
        carbs: nutLabel.carbs_100g * gram,
        fat: nutLabel.fat_100g * gram
    }
    return outdata;
}