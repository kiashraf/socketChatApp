function updateInventory(arr1, arr2) {
    // All inventory must be accounted for or you're fired!

    var bigArray = [];

    for (var i = 0; i < arr1.length; i++) {

        bigArray.push([]);
        bigArray[i].push(new Array(2));
        bigArray[i][0] = arr1[i][0];
        bigArray[i][1] = arr1[i][1];


    }


    for (var j = arr1.length, i = 0; i < arr2.length; i++, j++) {

        bigArray.push([]);
        bigArray[j].push(new Array(2));
        bigArray[j][0] = arr2[i][0];
        bigArray[j][1] = arr2[i][1];

    }
    console.log(bigArray);


    for (var i = 0; i < bigArray.length; i++) {
        for (var j = i+1; j < bigArray.length; j++) {

            if (bigArray[i][1] === bigArray[j][1]) {
                bigArray[i][0] = bigArray[i][0] + bigArray[j][0];
bigArray.splice(j,1);
            }


        }


    }



     bigArray.sort(function (a,b) {

        return a[1]===b[1] ? 0 : (a[1] < b[1]) ? -1 : 1;


    });

    console.log(bigArray);

    return bigArray;

}


updateInventory([], [[2, "Hair Pin"], [3, "Half-Eaten Apple"], [67, "Bowling Ball"], [7, "Toothpaste"]]);