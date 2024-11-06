import React, { useState, useEffect } from 'react';
import './Api.css';

const Api = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [name, setName] = useState('');
  const [searchName, setSearchName] = useState(''); // New state for repository name
  const [order, setOrder] = useState('desc');
  const [date, setDate] = useState('2023-11-01');
  const [sort , setSort ]=useState('stars')

  const getUrl = () => {
    let url = `https://api.github.com/search/repositories?q=language:${searchLanguage}+created:%3E${date}`;
    if (searchName) {
      url += `+name=${searchName}`;
      console.log(searchName);
    }
    url += `&sort=${sort}&order=${order}&per_page=100`;
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(getUrl());
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
  }, [searchLanguage, searchName, order, date,searchName]); // Add searchName to the dependencies

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value); // Update the name filter
  };

  const handleKeyDownLanguage = (e) => {
    if (e.key === 'Enter') {
      setSearchLanguage(language); // Trigger search when Enter is pressed for language
    }
  };

  const handleKeyDownName = (e) => {
    if (e.key === 'Enter') {
      setSearchName(name);
      console.log(name)
    }
  };

  const handleOrder = () => {
    setOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value); // Update the date filter
  };

  const handleSortChange = (e) => {
    setSort(e.target.value); // Update the sort criteria
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <h2>Top Repositories Created After {date}</h2>

      <div className="filters">
        <p>Filter Repositories by Language</p>
        <input
          placeholder="Search Language"
          className="searchBar"
          value={language}
          onChange={handleLanguageChange}
          onKeyDown={handleKeyDownLanguage}
        />

        <p>Filter Repositories by Name</p>
        <input
          placeholder="Search Name"
          className="searchBar"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDownName}
        />

        <p>Select From Creation Date</p>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="dateInput"
        />
                <p>Sort By</p>
        <select value={sort} onChange={handleSortChange} className="sortSelect">
          <option value="stars">Stars</option>
          <option value="updated">Updated</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Watchers</th>
            <th
              onClick={() => {
                if (sort === 'stars') handleOrder();
              }}
              style={{ cursor: sort === 'stars' ? 'pointer' : 'default' }}
            >
              Stars {sort === 'stars' && (order === 'asc' ? '▲' : '▼')}
            </th>
            <th
              onClick={() => {
                if (sort === 'updated') handleOrder();
              }}
              style={{ cursor: sort === 'updated' ? 'pointer' : 'default' }}
            >
              Last Updated {sort === 'updated' && (order === 'asc' ? '▲' : '▼')}
            </th>
            <th>Created at</th>
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
              <td>{new Date(item.updated_at).toLocaleString()}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{item.description || 'No description available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Api;
