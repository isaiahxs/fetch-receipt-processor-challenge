// Our in-memory storage for receipts
const receipts = {};

// Modularizing calculatePoints

// One point for every alphanumeric character in the retailer name
const pointsForRetailerName = (retailer) => retailer.replace(/[^a-zA-Z0-9]/g, '').length;

// 50 points if the total is a round dollar amound with no cents
const pointsForRoundTotal = (total) => parseFloat(total) % 1 === 0 ? 50 : 0;

// 25 points if the total is a multiple of 0.25
const pointsForMultipleOfQuarter = (total) => parseFloat(total) % 0.25 === 0 ? 25 : 0;

// 5 points for every two items on the receipt. Using Math.floor to ensure that only complete pairs contribute to the score.
const pointsForItemsCount = (items) => Math.floor(items.length / 2) * 5;

const pointsForItemDescriptions = (items) => {
    let points = 0;
    for (let item of items) {
        // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer
        const descriptionLength = item.shortDescription.trim().length;

        if (descriptionLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    }
    // The result is the number of points earned
    return points;
};

// unique item would have trim and lowercase
const pointsForUniqueItems = (items) => {
    const uniqueSet = new Set([]);
    // console.log(items);
    for (let item of items) {
        let shortened = item.shortDescription.trim();
        if (uniqueSet.has(shortened)) {
            return 0;
        }
        uniqueSet.add(shortened);
    }
    return 50;
}

// 6 points if the day in the purchase date is odd
const pointsForDay = (purchaseDate) => {
    const day = parseInt(purchaseDate.split('-')[2]);
    // "2022-01-01"
    // ['2022', '01', '01']
    // '01'
    // parseInt converts it to an integer so then it'd be 1
    return day % 2 === 1 ? 6 : 0;
}

//10 points if the time of purchase is after 2:00PM and before 4:00PM
const pointsForTimeRange = (purchaseTime) => {
    console.log(purchaseTime);
    //split string based on colon
    let split = purchaseTime.split(':');

    //['08', '13'] -> convert these items to Number types
    let numberHour = split.map(Number);
    console.log(numberHour);

    //if first index is greater than or equal to 14 and less than 16, return 10 points
    if (numberHour[0] >= 14 && numberHour[0] < 16) return 10;
    return 0;
}

// Now the main calculatePoints function becomes a composition of these smaller functions.
const calculatePoints = (receipt) => {
    let points = 0;

    points += pointsForRetailerName(receipt.retailer);

    points += pointsForRoundTotal(receipt.total);

    points += pointsForMultipleOfQuarter(receipt.total);

    points += pointsForItemsCount(receipt.items);

    points += pointsForItemDescriptions(receipt.items);

    points += pointsForDay(receipt.purchaseDate);

    points += pointsForTimeRange(receipt.purchaseTime);

    return points;
}

const calculateAndCachePoints = (id) => {
    if (receipts[id] && receipts[id].points === undefined) {
        receipts[id].points = calculatePoints(receipts[id]);
    }
    return receipts[id] ? receipts[id].points : null;
}

module.exports = {
    pointsForRetailerName,
    pointsForRoundTotal,
    pointsForMultipleOfQuarter,
    pointsForItemsCount,
    pointsForItemDescriptions,
    pointsForUniqueItems,
    pointsForDay,
    pointsForTimeRange,
    calculatePoints,
    calculateAndCachePoints,
    receipts
}