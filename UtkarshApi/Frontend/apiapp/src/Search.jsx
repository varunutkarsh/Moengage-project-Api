import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Search.css'; // Import the CSS file
import Navbar from './Navbar';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await fetch('http://localhost:3001/api/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!result.ok) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const createImageUrls = (query) => {
    let urls = [];
    const hasWildcard = (pattern) => query.includes(pattern);

    if (hasWildcard('xx')) {
      const base = query.replace(/xx/g, '');
      for (let i = 0; i <= 99; i++) {
        let code = i < 10 ? `0${i}` : i.toString();
        urls.push(`https://http.dog/${base}${code}.jpg`);
      }
    } else if (hasWildcard('x')) {
      const base = query.replace(/x/g, '');
      for (let i = 0; i <= 9; i++) {
        urls.push(`https://http.dog/${base}${i}.jpg`);
      }
    } else if (hasWildcard('2xx')) {
      for (let i = 200; i <= 299; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('20x')) {
      for (let i = 200; i <= 209; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('3xx')) {
      for (let i = 300; i <= 399; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('21x')) {
      for (let i = 210; i <= 219; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else {
      urls.push(`https://http.dog/${query}.jpg`);
    }
    return urls;
  };

  const executeSearch = async () => {
    let urls = createImageUrls(query);
    let fetchedUrls = [];
    for (let url of urls) {
      try {
        const result = await axios.get(url);
        if (result.status === 200) {
          fetchedUrls.push(result.config.url);
        } else {
          console.error(`Image not found at URL: ${url}`);
        }
      } catch (error) {
        console.error(`Failed to fetch image from URL: ${url}`, error);
      }
    }
    setImageUrls(fetchedUrls);
  };

  const saveToList = async () => {
    if (!query.trim()) {
      console.error('Search term is required to save the list.');
      return;
    }

    let codes = imageUrls.map(img => img.split('/').pop().replace('.jpg', ''));
    const dateCreated = new Date().toISOString();

    try {
      const result = await axios.post('http://localhost:3001/api/lists', {
        name: query,
        responseCodes: codes,
        images: imageUrls,
        createdAt: dateCreated
      }, { withCredentials: true });

      console.log('List successfully saved:', result.data);
    } catch (error) {
      console.error('Failed to save list:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div className="search-container">
        <h2 className="title">Find Response Code Images</h2>
        <p className="description">Input a response code pattern to retrieve images and save them to your lists. Use patterns like 'xx', 'x', or ranges such as '2xx' to customize your search.</p>
        
        <div className="search-form">
          <input
            type="text"
            placeholder="Enter response code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={executeSearch} className="search-btn">
            <i className="fas fa-search"></i> Search
          </button>
          <button onClick={saveToList} className="save-btn">
            <i className="fas fa-save"></i> Save List
          </button>
        </div>
        
        <div className="images-container">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Response Code ${query}`} className="result-image" />
            ))
          ) : (
            <p>No images found. Adjust your search criteria.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
