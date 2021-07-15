
let massUnits = {
  'oz' : 28,
  'kg'    : 1000,
  'lb'    : 454,
  'pound' : 454,
  'g'     : 1
}; // convert to g

let fluidUnits = {
  'gal'   : 3800,
  'cup'   : 237,
  'quart' : 946,
  'tbsp'  : 15,
  'tsp'   : 5,
  'pint'  : 473,
  'l'    : 1000,
  'ml'    : 1
}; // convert ml


/*
@param inputStr
FORMAT-> OUTPUT
[number] [units] [ingredient] -> ['g', num] or ['ml', num]
[number] [ingredient]         -> ['item', num]
[ingredient]                  -> ['item', 1]

RETURN
{
name : '<name of ingredient>' ,
unit :'<unit of ingredient>', 'g' or 'ml' or 'item'
val : <number of units>
};
*/

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

const unit_type = (string) => {
  if (string in fluidUnits) {
    return 'ml'
  } else {
    return 'g'
  }
}

let toUnits = (inputStr='error') => {
  let amount = 0
  if (inputStr === undefined ||inputStr === 'error') {
    return { name : 'undefined' , unit :'item', val : 0 };
  }
  let strSplit = inputStr.split(' ');
  let num = Number(strSplit[0]);
  if (num === NaN || strSplit.length < 2)
  return { name: inputStr , unit : 'item', val : 1 };
  
  if (!(strSplit[1] in massUnits) && !(strSplit[1] in fluidUnits)) { // is units given
    strSplit.shift();
    return { name: strSplit.join(' ') , unit: 'item', val: 1 };
  }

  if (isNumber(strSplit[1])) {
    amount = Number(strSplit[0]) + Number(strSplit[1]) / 10
    return {name: strSplit.slice(3), unit: unit_type(strSplit[2]), val : massUnits[strSplit[2]] * amount}
  }
  // If ingredient is in mass units or liquid units
  if (strSplit[1] in massUnits) {
    return {name : getIngredientName(strSplit), unit: 'g', val : massUnits[strSplit[1]] * num};
  }
  else { // liquid unit
    return {name : getIngredientName(strSplit), unit: 'ml', val : fluidUnits[strSplit[1]] * num};
  }
}
let getIngredientName = (inputArr) => {
  let arr = inputArr.slice();
  arr.shift();
  arr.shift(); 
  return arr.join(' ');
};


/*
ADDING AND STORING LOGIC
*/

// amount to increment an ingredient from the current basket
let addToBasket = (inputBasket = new Map(), ingredientAdd = { name: 'none', unit: 'item', val: 1 }) => {
  if (ingredientAdd.name == 'none') {
    return;
  }
  
  if (!inputBasket.has(ingredientAdd.name)) { // if current basket doesn't contain ingredient we add it
    inputBasket.set(ingredientAdd.name, ingredientAdd);
    return;
  } 
  else { // if current basket DOES contain ingredient we increment the value
    let toUpdate = inputBasket.get(ingredientAdd.name);
    toUpdate.val += ingredientAdd.val;
    return;
  }
};

// amount to decrement an ingredient from the current basket
let removeFromBasket = (inputBasket = new Map(), ingredientRemove = { name: 'none', unit: 'item', val: 1 }) => {
  if (ingredientRemove.name == 'none' || !inputBasket.has(ingredientRemove.name)) {
    return;
  } else {
    let toUpdate = inputBasket.get(ingredientRemove.name);
    toUpdate.val -= ingredientRemove.val;
    if (toUpdate.val <= 0) {
      inputBasket.delete(ingredientRemove.name);
    }
    return;
  }
};

// set 
let setIngredientInBasket = (inputBasket = new Map(), ingredientSet= { name: 'none', unit: 'item', val: 1 }) => {
  if (ingredientSet.name == 'none' || !inputBasket.has(ingredientSet.name)) {
    return;
  } else {
    // current basket contains ingredient we want to set
    if (inputBasket.has(ingredientSet.name)) {
      let toUpdate = inputBasket.get(ingredientSet.name);
      toUpdate.val = ingredientSet.val;
      if (toUpdate.val <= 0) { // If 0 then remove from current basket
        inputBasket.delete(ingredientSet.name);
      }
      return;
    }
    else { // current basket DOESN'T contains ingredient we want to set so we add it
      inputBasket.set(ingredientSet.name, ingredientSet);
    }
    return;
  }
};

// Add entire recipe to current shopping basket
let addRecipeToBasket = (inputBasket = undefined, addRecipe = undefined, servings=1) => {
  if (inputBasket === undefined || addRecipe === undefined ) {
    return;
  }
    addRecipe.compIngredients.map( eachItem => { // add every ingredient in recipe
      addToBasket(inputBasket,
        {
          name: eachItem.name,
          unit: eachItem.unit,
          val:  servings*eachItem.val
        }
        );
    
    }
    )
    return;
  }



export {addRecipeToBasket, removeFromBasket, toUnits}









