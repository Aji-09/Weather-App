let fruits = ["Apple", "Banana", "Avocado", "Cherry"];
let query = "a"; // user input

let text = "hahaha";
// Filter all items that include the query (case-insensitive)
let results = text.includes("h");
console.log(results);

let container = []
let results2 = fruits.forEach((fruit) => {
    if (fruit.includes("a")) {
        container.push(fruit)
    }
});

let results3 = fruits.filter(fruit => {
    return fruit.includes('a')
})

let results4 = fruits.map(fruit => {
    return fruit.includes('a')
})

console.log(results4)
console.log("This is result 3: ", results3)
console.log(container)