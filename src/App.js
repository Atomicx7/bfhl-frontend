import React, { useState } from 'react';
import Select from 'react-select';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // The three filter options
  const filterOptions = [
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Maximum Alphabet', label: 'Maximum Alphabet' }
  ];

  // Submit JSON to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);

    try {
      // Validate JSON
      const parsedData = JSON.parse(inputValue);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON. Must contain "data": [ ... ]');
      }

      // POST to your backend
      const res = await fetch('https://bfhl-backend-psi-three.vercel.app/bfhl', { // Update the URL to point to your local backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: inputValue,
      });

      if (!res.ok) {
        throw new Error('API request failed.');
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update selected filters (react-select returns an array)
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions || []);
  };

  // Build the filtered response
  let filteredData = {};
  if (apiResponse) {
    if (selectedFilters.some(opt => opt.value === 'Numbers')) {
      filteredData.numbers = apiResponse.numbers;
    }
    if (selectedFilters.some(opt => opt.value === 'Alphabets')) {
      filteredData.alphabets = apiResponse.alphabets;
    }
    if (selectedFilters.some(opt => opt.value === 'Maximum Alphabet')) {
      // Assuming backend calls it "highest_alphabet"
      filteredData.maximumAlphabet = apiResponse.highest_alphabet;
    }
  }

  return (
    <div style={{ width: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2D3748',
        marginBottom: '24px',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Roll Number: 2237505
      </h1>

      {/* API Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
          API Input
        </label>
        <input
          type="text"
          placeholder='{"data":["X","10","34","4","I"]}'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            borderRadius: '8px', // Fixed property name and added rounded corners
            marginBottom: '20px'
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#4A90E2',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              ':hover': {
                backgroundColor: '#357ABD',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: '#E53E3E', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#FFF5F5',
          borderRadius: '8px',
          border: '1px solid #FED7D7'
        }}>
          {error}
        </div>
      )}

      {apiResponse && (
        <div style={{ 
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#F7FAFC',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <label style={{ 
            fontWeight: '600',
            display: 'block',
            marginBottom: '12px',
            color: '#2D3748'
          }}>
            Multi Filter
          </label>
          <Select
            isMulti
            options={filterOptions}
            value={selectedFilters}
            onChange={handleFilterChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />

          {/* Filtered Response */}
          {Object.keys(filteredData).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Filtered Response
              </div>
              {filteredData.numbers && (
                <div>Numbers: {filteredData.numbers.join(',')}</div>
              )}
              {filteredData.alphabets && (
                <div>Alphabets: {filteredData.alphabets.join(',')}</div>
              )}
              {filteredData.maximumAlphabet && (
                <div>Maximum Alphabet: {filteredData.maximumAlphabet}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
