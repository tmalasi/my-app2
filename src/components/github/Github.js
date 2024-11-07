import React, { useState, useEffect, useMemo } from "react";
import useFetch from "../customFetch/useFetch";

const Github = () => {
 const [language, setLanguage] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [name, setName] = useState("");
  const [searchName, setSearchName] = useState(""); // New state for repository name
  const [order, setOrder] = useState("desc");
  const [date, setDate] = useState("2023-11-01");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const getUrl = useMemo(() => {
    let url = `https://api.github.com/search/repositories?q=language:${searchLanguage}+created:%3E${date}`;
    if (searchName) {
      url += `+name=${searchName}`;
      console.log(searchName);
    }
    url += `&sort=${sort}&order=${order}&per_page=5&page=${page}`;
    return url;
  },[searchLanguage, searchName, order, date, sort, page]);

  const { items, loading, error } = useFetch(getUrl);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value); // Update the name filter
  };

  const handleKeyDownLanguage = (e) => {
    if (e.key === "Enter") {
      setSearchLanguage(language); 
      setPage(1);
    }
  };

  const handleKeyDownName = (e) => {
    if (e.key === "Enter") {
      setSearchName(name);
      setPage(1);
    }
  };

  const handleOrder = () => {
    setOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value); // Update the date filter
  };

  const handleSortChange = (e) => {
    setSort(e.target.value); // Update the sort criteria
  };
  const handlePrevious = () => {
    setPage(page-1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    [item.name, item.description, item.language]
      .filter(Boolean) // Ignore null values
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
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

        <p>Search Repositories on the Client side</p>
        <input
          placeholder="Search"
          className="searchBar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Watchers</th>
            <th
              onClick={() => {
                if (sort === "stars") handleOrder();
              }}
              style={{ cursor: sort === "stars" ? "pointer" : "default" }}
            >
              Stars { (order === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => {
                if (sort === "updated") handleOrder();
              }}
              style={{ cursor: sort === "updated" ? "pointer" : "default" }}
            >
              Last Updated {(order === "asc" ? "▲" : "▼")}
            </th>
            <th>Created at</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <a
                  href={item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              </td>
              <td>{item.language}</td>
              <td>{item.watchers}</td>
              <td>{item.stargazers_count}</td>
              <td>{new Date(item.updated_at).toLocaleString()}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{item.description || "No description available"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <button className="button" onClick={handlePrevious} disabled={page === 1}>
          Previous
        </button>
        <p className="page-number">{page}</p>
        <button className="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Github;
