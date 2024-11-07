import { useState, useEffect } from "react";

const useFetch=(url)=>{
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log(data); 
            setItems(data.items || data.docs);
          } catch (error) {
            setError(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [url]); 

      return { items, loading, error};
}
export default useFetch;