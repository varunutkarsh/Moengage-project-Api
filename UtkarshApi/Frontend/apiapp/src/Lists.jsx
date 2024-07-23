import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Lists.css'; // Import the CSS file

const ListsPage = () => {
  const [listItems, setListItems] = useState([]);
  const navigate = useNavigate();

  const loadLists = async () => {
    try {
      const result = await axios.get('http://localhost:3001/api/lists', { withCredentials: true });
      setListItems(result.data);
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    }
  };

  const deleteList = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/lists/${id}`, { withCredentials: true });
      loadLists();
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };

  const editList = (id) => {
    navigate(`/edit-list/${id}`);
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div className="lists-container">
      <h2 className="header">Saved Lists</h2>
      <p className="info">
        You can view, modify, or remove your saved lists here. Each list shows response codes along with their associated images.
      </p>
      
      <ul className="lists">
        {listItems.length > 0 ? (
          listItems.map((item) => (
            <li key={item._id} className="list-entry">
              <h3 className="list-title">{item.name}</h3>
              <p className="list-details"><strong>Created On:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
              <p className="list-details"><strong>Response Codes:</strong> {item.responseCodes.join(', ')}</p>
              <div className="images-section">
                {item.images.length > 0 ? (
                  item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Response Code ${item.responseCodes[idx]}`}
                      className="list-image"
                    />
                  ))
                ) : (
                  <p>No images available for this list.</p>
                )}
              </div>
              <div className="action-buttons">
                <button onClick={() => editList(item._id)} className="button edit-button">
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button onClick={() => deleteList(item._id)} className="button delete-button">
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="empty-message">You don't have any lists yet. Start by creating a new one.</p>
        )}
      </ul>
    </div>
  );
};

export default ListsPage;
