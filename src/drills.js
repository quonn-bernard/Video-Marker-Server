//functions as arguments(1)
// function filter(n, fn) {
//     let newArr = [];
//     for (i = 0; i < n; i++) {
//         fn();
//     }
//     return newArr
// }

// const Names = filter(5, function () {
//     sayGoodBye();
//     sayHello();
// });

// function sayHello() {
//     console.log("Hello")
// }

// function sayGoodBye() {
//     console.log("Goodbye")
// }

//Names;
//Functions as arguments (2)

function myFilter(array, fn) {
    let newArr = [];
    array.map(element => {
        if (fn(element)) {
            newArr.push(element)
        }
    })
    return newArr
}

const myNames = ['Rich', 'Joe', 'Bhaumik', 'Ray'];

const filteredNames = myFilter(myNames, function (name) {
    return name[0] === 'R';
});

//console.log(filteredNames)

hazardWarningCreator = (typeOfWarning) => {
    let warningCounter = 0;
    return function(location){
        warningCounter++;
        console.log(`DANGER! There is a ${typeOfWarning} hazard at ${location}!` )
    console.log(`The ${typeOfWarning} hazard alert has triggered ${warningCounter} times(s) today!`)
    }
}

const rocksWarning = hazardWarningCreator('Rocks on the Road');
rocksWarning()


