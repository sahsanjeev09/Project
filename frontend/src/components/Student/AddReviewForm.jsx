// components/AddReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const AddReviewForm = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      const response = await axios.post('/api/reviews', {
        book_id: bookId,
        rating,
        review_text: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(true);
      setReviewText('');
      setRating(0);
      onReviewAdded(response.data.review);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  return (
    <div className="review-form">
      <h3>Add Your Review</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Review added successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(num => (
              <FaStar
                key={num}
                className={num <= rating ? 'star filled' : 'star'}
                onClick={() => setRating(num)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="form-control"
            rows="4"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
