const validateReceiptData = (data) => {
    let errors = [];

    const { retailer, purchaseDate, purchaseTime, total, items } = data;

    // Validate that retailer name exists and is a string
    if (!retailer || typeof retailer !== 'string') {
        errors.push('Invalid retailer name. Must be a string.');
    }

    // Validate purchase date exists and is in correct format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!purchaseDate || !dateRegex.test(purchaseDate)) {
        errors.push('Invalid purchase date. Structure must be YYYY-MM-DD.');
    }

    // Check if date is valid
    // New Date object created from purchaseDate string
    const parsedDate = new Date(purchaseDate);
    // isNan(parsedDate.getTime()) returns numeric value related to the time for the specified date according to universal time
    // if purchaseDate is invalid, we will return Nan and add that error
    // parsedDate.toISOString().split('T')[0] converts Date into string "2022-01-01T00:00:00.000Z"
    // we split at the T and check the first part to see if it matches the format we passed in
    if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().split('T')[0] !== purchaseDate) {
        errors.push('Invalid purchase date. Please insert a valid date from the calendar year.');
    }

    // Validate purchase time exists and is in correct format
    // const timeRegex = /^\d{2}:\d{2}$/;
    // if (!purchaseTime || !timeRegex.test(purchaseTime)) {
    //     errors.push('Invalid purchase time. Structure must be HH:MM.');
    // }

    // Validate purchase time exists and is in correct format
    // Match strings that start with 0 or 1 and are followed by any digit to cover 00 to 19
    // | for OR. Then match any string that starts with 2 and is followed by digit between 0 and 3
    // For second part, match string that starts with digit between 0 and 5 and is followed by any digit
    // XX:XX
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!purchaseTime || !timeRegex.test(purchaseTime)) {
        errors.push('Invalid purchase time. Structure must be HH:MM.');
    } else {
        const [hour, minute] = purchaseTime.split(':').map(Number);
        if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60) {
            errors.push('Invalid purchase time. Hours must be between 00 and 23, and minutes must be between 00 and 59.');
        }
    }

    // Validate total exists and is a valid number
    if (!total || isNaN(parseFloat(total))) {
        errors.push('Invalid total. Must be a valid number.');
    }

    // Validate items array exists and has at least one item in it
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('Invalid items. Must be a non-empty array.');
    } else {
        // Validate individual items
        items.forEach((item, index) => {
            if (!item.shortDescription || typeof item.shortDescription !== 'string') {
                errors.push(`Invalid shortDescription for item at index ${index}. Please enter a valid string description for this item.`);
            }

            if (item.price === undefined || isNaN(parseFloat(item.price))) {
                errors.push(`Invalid price for item at index ${index}. Please enter a valid price number for this item.`);
            }
        })
    }
    return errors;
}

module.exports = {
    validateReceiptData
}