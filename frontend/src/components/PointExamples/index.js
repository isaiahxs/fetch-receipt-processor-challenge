import './PointExamples.css';

export default function PointExamples() {
    const example1 = {
        "retailer": "Target",
        "purchaseDate": "2022-01-01",
        "purchaseTime": "13:01",
        "items": [
            {
                "shortDescription": "Mountain Dew 12PK",
                "price": "6.49"
            }, {
                "shortDescription": "Emils Cheese Pizza",
                "price": "12.25"
            }, {
                "shortDescription": "Knorr Creamy Chicken",
                "price": "1.26"
            }, {
                "shortDescription": "Doritos Nacho Cheese",
                "price": "3.35"
            }, {
                "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
                "price": "12.00"
            }
        ],
        "total": "35.35"
    }

    const example2 = {
        "retailer": "M&M Corner Market",
        "purchaseDate": "2022-03-20",
        "purchaseTime": "14:33",
        "items": [
            {
                "shortDescription": "Gatorade",
                "price": "2.25"
            }, {
                "shortDescription": "Gatorade",
                "price": "2.25"
            }, {
                "shortDescription": "Gatorade",
                "price": "2.25"
            }, {
                "shortDescription": "Gatorade",
                "price": "2.25"
            }
        ],
        "total": "9.00"
    }

    return (
        <div className='point-examples-container'>
            <div className='point-examples'>
                <h2>How your points are calculated</h2>
                <ul className='points-list'>
                    <li><strong>1 point</strong> for every alphanumeric character in the retailer name.</li>
                    <li><strong>50 points</strong> if the total is a round dollar amount with no cents.</li>
                    <li><strong>25 points</strong> if the total is a multiple of 0.25.</li>
                    <li><strong>5 points</strong> for every two items on the receipt.</li>
                    <li>If the trimmed length of the item description is a multiple of 3, multiply the price by <strong>0.2 and round up to the nearest integer</strong>. The result is the number of points earned.</li>
                    <li><strong>6 points</strong> if the day in the purchase date is odd.</li>
                    <li><strong>10 points</strong> if the time of purchase is after 2:00pm and before 4:00pm.</li>
                </ul>

                <div className='example-section'>
                    <h2 className='example-header'>Example 1:</h2>
                    {/* <pre className='example-code'>
                    <code >
                        {JSON.stringify(example1, null, 2)}
                    </code>
                </pre> */}
                    <ul className='receipt-list'>
                        <li><strong>Retailer:</strong> Target</li>
                        <li><strong>Purchase Date:</strong> 2022-01-01</li>
                        <li><strong>Purchase Time:</strong> 13:01</li>
                        <li><strong>Total:</strong> $35.35</li>
                        <li><strong>Items:</strong>
                            <ul className='items-list'>
                                <li>Mountain Dew 12PK - $6.49</li>
                                <li>Emils Cheese Pizza - $12.25</li>
                                <li>Knorr Creamy Chicken - $1.26</li>
                                <li>Doritos Nacho Cheese - $3.35</li>
                                <li>Klarbrunn 12-PK 12 FL OZ - $12.00</li>
                            </ul>
                        </li>
                    </ul>

                    <div className='points-section'>
                        <span className='total-points'>Total Points: 28</span>
                        <span className='breakdown-header'>Breakdown</span>
                        <ul className='breakdown-list'>
                            <li><strong>6 points</strong> - retailer name has 6 characters</li>
                            <li><strong>10 points</strong> - 4 items (2 pairs @ 5 points each)</li>
                            <li><strong>3 Points</strong> - "Emils Cheese Pizza" is 18 characters (a multiple of 3)<br />
                                item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
                            </li>
                            <li><strong>3 Points</strong> - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)<br />
                                item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
                            </li>
                            <li><strong>6 points</strong> - purchase day is odd</li>
                        </ul>
                        <div className='total-breakdown'>
                            + ---------
                            <br />
                            = 28 points
                        </div>
                    </div>
                </div>



                <div className='example-section example-2'>
                    <h2 className='example-header'>Example 2:</h2>
                    {/* <pre className='example-code'>
                    <code >
                        {JSON.stringify(example2, null, 2)}
                    </code>
                </pre> */}

                    <ul className='receipt-list'>
                        <li><strong>Retailer:</strong> M&M Corner Market</li>
                        <li><strong>Purchase Date:</strong> 2022-03-20</li>
                        <li><strong>Purchase Time:</strong> 14:33</li>
                        <li><strong>Total:</strong> $9.00</li>
                        <li><strong>Items:</strong>
                            <ul className='items-list'>
                                <li>Gatorade - $2.25</li>
                                <li>Gatorade - $2.25</li>
                                <li>Gatorade - $2.25</li>
                                <li>Gatorade - $2.25</li>
                            </ul>
                        </li>
                    </ul>

                    <div className='points-section'>
                        <span className='total-points'>Total Points: 109</span>
                        <span className='breakdown-header'>Breakdown</span>
                        <ul className='breakdown-list'>
                            <li><strong>50 points</strong> - total is a round dollar amount</li>
                            <li><strong>25 points</strong> - total is a multiple of 0.25</li>
                            <li><strong>14 points</strong> - retailer name (M&M Corner Market) has 14 alphanumeric characters<br />
                                note: '&' is not alphanumeric
                            </li>
                            <li><strong>10 points</strong> - 2:33pm is between 2:00pm and 4:00pm</li>
                            <li><strong>10 points</strong> - 4 items (2 pairs @ 5 points each)</li>
                        </ul>
                        <div className='total-breakdown'>
                            + ---------
                            <br />
                            = 109 points
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}