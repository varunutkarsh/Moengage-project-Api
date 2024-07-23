import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditList.css'; // Ensure to style this page

const EditList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listDetails, setListDetails] = useState({ name: '', images: [], responseCodes: [] });
  const [listName, setListName] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch the list details from the server
  const loadListDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/lists/${id}`, { withCredentials: true });
      const data = response.data;
      setListDetails(data);
      setListName(data.name);
      setCodeFilter(data.responseCodes.join(',')); // Initialize filter input
      previewImages(data.responseCodes); // Load images based on response codes
    } catch (error) {
      console.error('Unable to fetch list details:', error);
    }
  };

  // Generate URLs for images based on the response codes
  const previewImages = async (codes) => {
    const urls = createImageUrls(codes.join(','));
    const images = [];
    for (const url of urls) {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          images.push(response.config.url);
        }
      } catch (error) {
        console.error(`Failed to load image from ${url}:`, error);
      }
    }
    setImagePreviews(images);
    setListDetails((prev) => ({ ...prev, images }));
  };

  // Create image URLs based on the filter criteria
  const createImageUrls = (filter) => {
    const urlList = [];
    const hasWildcard = (pattern) => filter.includes(pattern);

    if (hasWildcard('xx')) {
      const base = filter.replace(/xx/g, '');
      for (let i = 0; i <= 99; i++) {
        const code = i < 10 ? `0${i}` : i.toString();
        urlList.push(`https://http.dog/${base}${code}.jpg`);
      }
    } else if (hasWildcard('x')) {
      const base = filter.replace(/x/g, '');
      for (let i = 0; i <= 9; i++) {
        urlList.push(`https://http.dog/${base}${i}.jpg`);
      }
    } else if (hasWildcard('2xx')) {
      for (let i = 200; i <= 299; i++) {
        urlList.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('20x')) {
      for (let i = 200; i <= 209; i++) {
        urlList.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('3xx')) {
      for (let i = 300; i <= 399; i++) {
        urlList.push(`https://http.dog/${i}.jpg`);
      }
    } else if (hasWildcard('21x')) {
      for (let i = 210; i <= 219; i++) {
        urlList.push(`https://http.dog/${i}.jpg`);
      }
    } else {
      urlList.push(`https://http.dog/${filter}.jpg`);
    }
    return urlList;
  };

  // Save the updated list to the server
  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:3001/api/lists/${id}`, {
        name: listName,
        images: listDetails.images,
        responseCodes: codeFilter.split(',')
      }, { withCredentials: true });
      navigate('/lists'); // Redirect to lists page after saving
    } catch (error) {
      console.error('Error saving updates:', error);
    }
  };

  // Update the list of images based on the new filter criteria
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setCodeFilter(newFilter);
    previewImages(newFilter.split(',')); // Update the image previews
  };

  useEffect(() => {
    loadListDetails(); // Load details when component mounts
  }, [id]);

  return (
    <div className="edit-list-wrapper">
      <h2 className="header">Edit Your List</h2>
      <div className="input-group">
        <label htmlFor="listName">
          <h4>List Name:</h4>
        </label>
        <input
          id="listName"
          type="text"
          className="input-field"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="filterInput">
          <h4>Response Code Filter (comma-separated):</h4>
        </label>
        <input
          id="filterInput"
          type="text"
          className="input-field"
          value={codeFilter}
          onChange={handleFilterChange}
        />
      </div>
      <div className="image-preview">
        {imagePreviews.length > 0 ? (
          imagePreviews.map((img, idx) => (
            <img key={idx} src={img} alt={`Code ${listDetails.responseCodes[idx]}`} className="image-thumbnail" />
          ))
        ) : (
          <p>No images available. Adjust your filter criteria to display images.</p>
        )}
      </div>
      <button className="save-button" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default EditList;
