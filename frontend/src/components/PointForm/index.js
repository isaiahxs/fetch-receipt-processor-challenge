import React, { useState } from 'react';
import './PointForm.css';

export default function PointForm() {
    const [formData, setFormData] = useState({
        retailer: "",
        purchaseDate: "",
        purchaseTime: "",
        totalCost: "",
        items: [
            {
                shortDescription: "",
                price: ""
            }
        ],
    });

    const [receiptId, setReceiptId] = useState(null);
    const [latestPoints, setLatestPoints] = useState(null);
    const [allReceiptIds, setAllReceiptIds] = useState([]);
    const [idToPointsMap, setIdToPointsMap] = useState({});
    const [searchId, setSearchId] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...formData.items];
        list[index][name] = value;
        setFormData({ ...formData, items: list });
    };

    const addNewItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { shortDescription: "", price: "" }]
        });
    };

    const removeLastItem = () => {
        const list = [...formData.items];
        list.pop();
        setFormData({ ...formData, items: list });
    };

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the complete data object
        const completeData = {
            // ...formData,
            retailer: formData.retailer,
            purchaseDate: formData.purchaseDate,
            purchaseTime: formData.purchaseTime,
            total: formData.totalCost,
            // items: itemsArray
            items: formData.items
        };

        // Sending form data to your backend here
        try {
            // const response = await fetch(`http://localhost:3000/api/receipts/process`, {
            const response = await fetch(`${API_URL}/receipts/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completeData),
            });
            const data = await response.json();
            // console.log(data); // Will show this data in the UI

            setReceiptId(data.id);
            setAllReceiptIds([...allReceiptIds, data.id]);

            // New code to get points
            const pointsResponse = await fetch(`${API_URL}/receipts/${data.id}/points`);
            const pointsData = await pointsResponse.json();
            setLatestPoints(pointsData.points);
            setIdToPointsMap({
                ...idToPointsMap,
                [data.id]: pointsData.points,
            });
        } catch (err) {
            console.error('There was a problem with the fetch:', err);
        }
    };

    const handleSearch = () => {
        const points = idToPointsMap[searchId];
        if (points == undefined) {
            alert(`Receipt with ID "${searchId}" not found`);
        }
    };

    const isFormValid = () => {
        // Validate non-item fields
        for (let key in formData) {
            if (key !== "items" && !formData[key]) return false;
        }

        // Validate items
        for (let item of formData.items) {
            if (!item.shortDescription || !item.price) return false;
        }

        return true;
    };

    return (
        <div>
            <h2 className='form-header'>Please enter your receipt data</h2>
            <form className='receipt-form' onSubmit={handleSubmit}>
                Retailer
                <input
                    type="text"
                    name="retailer"
                    placeholder="Walgreens"
                    value={formData.retailer}
                    onChange={handleChange}
                />
                Purchase Date
                <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                />
                Purchase Time
                <input
                    type="time"
                    name="purchaseTime"
                    value={formData.purchaseTime}
                    onChange={handleChange}
                />
                Total Cost ($)
                <input
                    type="number"
                    step="0.01"
                    name="totalCost"
                    placeholder="10.00"
                    value={formData.totalCost}
                    onChange={handleChange}
                />

                {formData.items.map((x, i) => {
                    return (
                        <div key={i}>
                            Item Description
                            <input
                                name="shortDescription"
                                placeholder="Item Description"
                                value={x.shortDescription}
                                onChange={e => handleItemChange(e, i)}
                            />
                            Item Price
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                placeholder="Item price"
                                value={x.price}
                                onChange={e => handleItemChange(e, i)}
                            />
                        </div>
                    );
                })}

                <button className='add-item-button' type="button" onClick={addNewItem}>
                    Add Item
                </button>

                <button className='remove-item-button' type="button" onClick={removeLastItem}>
                    Remove Last Item
                </button>

                <button className={`submit-receipt ${!isFormValid() ? 'disabled-button' : ''}`} type="submit" disabled={!isFormValid()}>
                    Submit
                </button>
            </form>

            {receiptId &&
                <div className='receipt-id'>
                    <strong>Your Receipt ID:</strong> {receiptId}
                </div>
            }

            {latestPoints &&
                <div className='latest-points'>
                    <strong>Points earned on latest purchase:</strong> {latestPoints}
                </div>
            }

            {allReceiptIds.length > 0 &&
                <div className='previous-receipts'>
                    <strong>Your previous Receipt IDs:</strong>
                    <ul>
                        {allReceiptIds.map((id, index) =>
                            <li key={index}>
                                {id}
                            </li>)}
                    </ul>
                </div>
            }

            {allReceiptIds.length > 0 &&
                <div className='search-section'>
                    <div>
                        See how many points you got on previous purchases by Receipt ID:
                    </div>
                    <input
                        className='search-field'
                        type="text"
                        placeholder="Paste Receipt ID here"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    {/* <button className='submit-receipt' onClick={handleSearch}>Search</button> */}
                    {searchId &&
                        <div>
                            Points earned on Receipt ID {searchId}: <strong>{idToPointsMap[searchId]}</strong>
                        </div>
                    }
                </div>
            }
        </div>
    )
}