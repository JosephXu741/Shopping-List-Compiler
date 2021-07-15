
const massUnits = {
    'oz' : 28,
    'kg'    : 1000,
    'lb'    : 454,
    'pound' : 454,
    'g'     : 1
  }; // convert to g
  
  const fluidUnits = {
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
  
  const unit_type = (string) => {
    if (string in fluidUnits) {
      return 'ml'
    } else {
      return 'g'
    }
  }
  
  const toUnits = (inputStr) => {
    let amount = 0
  
    if (inputStr === undefined ||inputStr === 'error') {
      return { name : 'undefined' , unit :'item', val : 0 };
    }
  
    let strSplit = inputStr.split(' ');
    const num = Number(strSplit[0]);
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
  
  
  
  /*
  ADDING AND STORING LOGIC
  */
  
  // amount to increment an ingredient from the current basket
  const addToBasket = (inputBasket, ingredientAdd) => {
    if (ingredientAdd.name == 'none') {
      return;
    }
    
  
    if (!inputBasket.has(ingredientAdd.name)) { // if current basket doesn't contain ingredient we add it
      inputBasket.set(ingredientAdd.name, ingredientAdd);
      return;
    } 
    else { // if current basket DOES contain ingredient we increment the value
      const toUpdate = inputBasket.get(ingredientAdd.name);
      toUpdate.val += ingredientAdd.val;
      return;
    }
  };
  
  
  const test = ['60 g cocoa powder  ', '100 g butter   ', '300 g sugar   ', '4 egg    ', '200 g flour   ', '1 tsp baking powder  ', '150 ml milk   ', 'chocolate custard    ', '1 l milk   ', '50 g sugar   ', '50 g custard powder, ', '50 g cocoa powder  ', '50 g chocolate   ']
  
  recipe = {}
  
  for (i in test) {
    addToBasket(recipe, toUnits(i))
  }
  
  print(recipe)
  