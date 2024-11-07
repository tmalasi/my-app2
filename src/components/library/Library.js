import { useEffect, useState } from "react";
import useFetch from "../customFetch/useFetch";

const Library =()=>{
    const getUrl = () => {
        let url = `https://openlibrary.org/search.json?q=crime&fields=key,title,author_name,editions,first_publish_year&limit=5&page=1&sort=new`;
        return url;
      };
    const { items: items, loading, error } = useFetch(getUrl());
    
    return (
        <div>
      <h2>Library</h2>
      {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author name </th>
            <th>Editors</th>
            <th>First Publish Year </th>
            
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>
                {item.title}
              </td>
              <td>{item.author_name}</td>
              <td>{item.edition_key}</td>
              <td>{item.first_publish_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export default Library;