import React, { useState, useEffect } from 'react';
import './Api.css';

const Api = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState('');
  const [searchLanguage, setSearchLanguage] = useState(''); // New state for input
  const [order,setOrder]=useState('desc');
  const [date, setDate] = useState('2024-11-01');
  const [name, setName]=useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=language:${searchLanguage}+created:>=${date}&sort=stars&order=${order}&per_page=100`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchLanguage, order, date]);

  const handleInputChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchLanguage(language); // Trigger search when Enter is pressed
    }
  };

  const handleOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value); // Update the date filter
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <h2>Top JavaScript Repositories Created After {date}</h2>

      <div className="filters">
        <p>Filter Repositories by Language</p>
        <input
          placeholder="Search Language"
          className="searchBar"
          value={language}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <p>Select From Creation Date</p>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="dateInput"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Watchers</th>
            <th onClick={handleOrder} style={{ cursor: 'pointer' }}>Stars {order === 'asc' ? '▲' : '▼'}</th>
            <th>
              LastUpdated
            </th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
              </td>
              <td>{item.language}</td>
              <td>{item.watchers}</td>
              <td>{item.stargazers_count}</td>
              <td>{new Date(item.updated_at).toLocaleDateString()}</td>
              <td>{item.description || 'No description available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Api;
