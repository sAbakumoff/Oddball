(function (scope, undefined) {
    var algorithms = {}, targetSum = 0;
    
    if (!Array.isArray) {
        Array.isArray = function (value) {
            return {}.toString.call(value) === '[object Array]';
        };
    }
    
    if (typeof Number.isFinite !== 'function') {
        Number.isFinite = function isFinite(value) {
            if (typeof value !== 'number') {
                return false;
            }
            if (value !== value || value === Infinity || value === -Infinity) {
                return false;
            }
            return true;
        };
    }
    
    function selectNumbersSubset(inputArray) {
        var i;
        if (!Array.isArray(inputArray)) {
            return;
        }
        var numbersArray = inputArray.slice();
        for (i = 0; i < inputArray.length; i++){
            var currentItem = inputArray[i];
            if (Number.isFinite(currentItem)) {
                numbersArray.push(currentItem);
            }
        }
        return numbersArray;
    }
    
    function selectTrackedItems(inputArray, trackArray){
        var trackedItems = [], i;
        for (i = 0; i < inputArray.length; i++) {
            if (trackArray[i] === 1) {
                trackedItems.push(inputArray[i]);
            }
        }
        return trackedItems;
    }
    
    function solve(startIndex, currentSum, inputArray, trackArray, callback){
        var i;
        if (currentSum === targetSum) {
            callback(selectTrackedItems(inputArray, trackArray));
        }
        if (currentSum === Infinity)
            currentSum = 0;
        for (i = startIndex; i < inputArray.length; i++) {
            var currentItem = inputArray[i];
            var prevItem = inputArray[i-1];
            if (currentSum + currentItem > targetSum) {
                continue;
            }
            if (i > 0 && currentItem === prevItem && trackArray[i-1] === 0) {
                continue;   
            }
            trackArray[i] = 1;
            solve(i + 1, currentSum + currentItem, inputArray, trackArray, callback);
            trackArray[i] = 0;
        }    
    }
    
    algorithms.findSummingSubsets = function(inputArray, callback){
        var numbersSubset = selectNumbersSubset(inputArray), i;
        if (numbersSubset === undefined || numbersSubset.length === 0) {
            return;
        }
        numbersSubset.sort();
        var trackArray = [];
        for ( i = 0; i<numbersSubset.length; i++) {
            trackArray[i] = 0;
        }
        solve(0, Infinity, inputArray, trackArray, callback);
    };
    
    if (typeof(module) == 'object' && module.hasOwnProperty('exports')) {
        module.exports = algorithms;
    }
    else if(typeof(define) === 'function' && define.hasOwnProperty('amd')) {
        define(algorithms);
    }
    else {
        scope.algorithms = algorithms;
    }
})(this);