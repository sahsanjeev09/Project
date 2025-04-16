// components/ReviewList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/book/${bookId}`);
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map(review => (
          <div key={review._id} className="review">
            <div className="review-header">
              <div className="review-user">{review.student_id.name}</div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? 'star filled' : 'star'}
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{review.review_text}</p>
            <div className="review-date">
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
