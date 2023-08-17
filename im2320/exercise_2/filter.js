/* we will briefly cover this function in class but it'll handle everything you need to filter your recipes */

function resetFilter(){
  let recipeElements = Array.from(document.getElementsByClassName("RecipeBox"));
  // console.log(recipeElements);
  for(let recipe of recipeElements){
   recipe.style.display = "block";
  }
  let filterButtonsArray = Array.from(document.getElementsByClassName("FilterButton"));
  for(let filterButton of filterButtonsArray){
   filterButton.classList.remove("SelectedFilter");
  }
}

// I've given the function a name related to its functionality - I've also declared three parameters:
// filterCategory will be the name of the data attribute we want to look at
// filterBy will be the specific value of the data attribute we want to display
// buttonClicked will be the individual button was clicked
function filterRecipes(filterCategory, filterBy, buttonClicked){
  // first we're creating an array (like a list) called itemsToFilter made from all of the elements assigned the class RecipeBox
  let itemsToFilter = Array.from(document.getElementsByClassName("RecipeBox"));
  // next we're running a for loop on the array, so it's going to run some code on each element in the list
  // we're also assigning a variable name to the item on the list we're looking at for each loop, in this case listItem
  for(let listItem of itemsToFilter){
    // for each element, reffered to now by the variable name listItem we're looking at its data attribute associated with 
    // the category (we pass this in as filterCategory) and if its value matches filterBy we're setting its display to block 
    // otherwise if it doesn't have the class we're looking for we're going to hide it by setting the display to none
    if(listItem.dataset[filterCategory] === filterBy){
      listItem.style.display = "block";
    } else {
      listItem.style.display = "none";
    }
  }

  // here's some more advanced code for adding feedback to our filter itself, but as you can see it works in a similar way to above
  // again getting an array of elements, this time using the FilterButtons class
  let filterButtonsArray = Array.from(document.getElementsByClassName("FilterButton"));
  // using a for loop but this time on all of our filter buttons
  for(let filterButton of filterButtonsArray){
    // again we're using an if statement, this time checking if it was the button we just clicked
    if(filterButton === buttonClicked){
      // here is where you might change the style of the button clicked - instead of directly changing the style we're adding a new class
      filterButton.classList.add("SelectedFilter");
    } else {
      // and here we're removing this class from all other buttons so only the one you clicked has it applied
      filterButton.classList.remove("SelectedFilter");
    }
  }

}

