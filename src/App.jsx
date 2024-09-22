import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState(null);

    // Handle submit button click
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error before new submission

        try {
            // Parse and validate JSON input
            const parsedData = JSON.parse(jsonInput);

            if (!parsedData.data || !Array.isArray(parsedData.data)) {
                setError('Invalid JSON: data field is missing or not an array');
                return;
            }

            // Send the valid JSON to the backend
            const response = await axios.post('https://backendtest-rkk0.onrender.com/bfhl', parsedData);
            setResponse(response.data);
        } catch (err) {
            console.error(err);
            setError('Invalid JSON format');
        }
    };

    // Handle multi-select option change
    const handleOptionChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            // Add the selected option to the array
            setSelectedOptions(prevOptions => [...prevOptions, value]);
        } else {
            // Remove the deselected option from the array
            setSelectedOptions(prevOptions => prevOptions.filter(option => option !== value));
        }
    };

    // Render the response based on the selected options
    const renderResponse = () => {
        if (!response) return null;

        let displayData = {};
        if (selectedOptions.includes('Numbers')) displayData.numbers = response.numbers;
        if (selectedOptions.includes('Alphabets')) displayData.alphabets = response.alphabets;
        if (selectedOptions.includes('Highest lowercase alphabet')) displayData.highest_lowercase_alphabet = response.highest_lowercase_alphabet;

        return (
            <div>
                <h3>Response Data</h3>
                {Object.keys(displayData).map((key) => (
                    <div key={key}>
                        <strong>{key}:</strong> {JSON.stringify(displayData[key])}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h3>API Input</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter valid JSON input here'
                    style={{ width: '100%' }}
                />
                <br />
                <button type="submit">Submit</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {response && (
                <>
                    <h3>Select Data to Display</h3>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                value="Numbers"
                                onChange={handleOptionChange}
                                checked={selectedOptions.includes('Numbers')}
                            />
                            Numbers
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Alphabets"
                                onChange={handleOptionChange}
                                checked={selectedOptions.includes('Alphabets')}
                            />
                            Alphabets
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Highest lowercase alphabet"
                                onChange={handleOptionChange}
                                checked={selectedOptions.includes('Highest lowercase alphabet')}
                            />
                            Highest lowercase alphabet
                        </label>
                    </div>
                    {renderResponse()}
                </>
            )}
        </div>
    );
};

export default App;
