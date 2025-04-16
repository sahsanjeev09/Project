import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Reviews = ({ bookId, book = {} }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [editing, setEditing] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!bookId) {
          console.warn('No bookId provided to Reviews component');
          setLoading(false);
          return;
        }

        setLoading(true);

        // Check if user can review this book
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
          try {
            const payload = user.token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            const userId = decodedPayload.id;

            // Check if user has borrowed and returned this book
            const borrowingRes = await axios.get(`/api/borrowings/user/${userId}/book/${bookId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            });

            setCanReview(borrowingRes.data.canReview);

            // Check if user has already reviewed this book
            const userReviewRes = await axios.get(`/api/reviews/user?book_id=${bookId}`, {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            });

            setHasReviewed(!!userReviewRes.data._id);
          } catch (err) {
            console.error('Error checking review eligibility:', err);
            setCanReview(false);
            setHasReviewed(false);
          }
        }

        // Fetch book reviews
        const reviewsRes = await axios.get(`/api/reviews/book/${bookId}?page=${page}`);
        setReviews(reviewsRes.data.reviews);
        setTotalPages(reviewsRes.data.pages);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        if (err.response?.status !== 404) {
          toast.error('Failed to load reviews');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, page]);

  const handleSubmitReview = async () => {
    try {
      if (!bookId) {
        toast.error('No book selected for review');
        return;
      }

      if (!canReview) {
        toast.error('You can only review books you have borrowed and returned');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        toast.error('Please log in to submit a review');
        return;
      }

      if (!reviewText.trim()) {
        toast.error('Please write a review');
        return;
      }

      if (rating === 0) {
        toast.error('Please select a rating');
        return;
      }

      const response = await axios.post('/api/reviews', {
        book_id: bookId,
        rating,
        review_text: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Refresh reviews
      const reviewsRes = await axios.get(`/api/reviews/book/${bookId}?page=${page}`);
      setReviews(reviewsRes.data.reviews);
      setTotalPages(reviewsRes.data.pages);

      // Update user review
      setUserReview(response.data.review);
      setShowReviewForm(false);
      setEditing(false);
      toast.success(response.data.message);
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEditReview = () => {
    setEditing(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        toast.error('Please log in to delete your review');
        return;
      }

      await axios.delete(`/api/reviews/${userReview._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Refresh reviews
      const reviewsRes = await axios.get(`/api/reviews/book/${bookId}?page=${page}`);
      setReviews(reviewsRes.data.reviews);
      setTotalPages(reviewsRes.data.pages);

      setUserReview(null);
      setRating(0);
      setReviewText('');
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <>
        {Array.from({ length: fullStars }).map((_, i) => (
          <FaStar key={i} className="star filled" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="star filled" />}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <FaStar key={i + fullStars + (hasHalfStar ? 1 : 0)} className="star" />
        ))}
      </>
    );
  };

  const getProfileImage = (profileImage) => {
    if (!profileImage) return null;

    // If the image is a URL (starts with http)
    if (profileImage.startsWith('http')) {
      return profileImage;
    }

    // If it's a local path (starts with /)
    if (profileImage.startsWith('/')) {
      return `http://localhost:3000${profileImage}`;
    }

    // Default case
    return "https://via.placeholder.com/150?text=No+Image";
  };

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <div className="reviews-container" id="reviews-section">
      <ToastContainer position="top-right" />

      <div className="reviews-header">
        <h3 className="reviews-heading">Ratings & Reviews</h3>
        {!hasReviewed && canReview && (
          <button
            onClick={() => {
              setShowReviewForm(true);
              setEditing(false);
            }}
            className="rate-product-button"
          >
            Rate Product
          </button>
        )}
      </div>

      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-value">{book.average_rating?.toFixed(1) || '0.0'}</span>
          <div className="rating-stars">
            {renderStars(book.average_rating || 0)}
          </div>
          <span className="rating-count">
            {book.review_count || 0} {book.review_count === 1 ? 'Rating & Review' : 'Ratings & Reviews'}
          </span>
        </div>
      </div>

      {userReview && (
        <div className="user-review">
          <h3>Your Review</h3>
          <div className="review-item">
            <div className="review-header">
              {userReview.student_id.profileImage ? (
                <img
                  src={getProfileImage(userReview.student_id.profileImage)}
                  alt={userReview.student_id.name}
                  className="profile-pic"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              ) : (
                <FaUserCircle className="default-profile-icon" />
              )}
              <div className="review-info">
                <span className="review-user">{userReview.student_id.name}</span>
                <span className="review-date">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="review-rating">
              {renderStars(userReview.rating)}
            </div>
            <p className="review-text">{userReview.review_text}</p>
            <div className="review-actions">
              <button onClick={handleEditReview} className="edit-button">
                <FaEdit /> Edit
              </button>
              <button onClick={handleDeleteReview} className="delete-button">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                {review.student_id.profileImage ? (
                  <img
                    src={getProfileImage(review.student_id.profileImage)}
                    alt={review.student_id.name}
                    className="profile-pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                ) : (
                  <FaUserCircle className="default-profile-icon" />
                )}
                <div className="review-info">
                  <span className="review-user">{review.student_id.name}</span>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              <p className="review-text">{review.review_text}</p>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`pagination-button ${page === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showReviewForm && (
        <div className="add-review-section">
          <h3>{editing ? 'Edit Your Review' : 'Add Your Review'}</h3>
          <div className="rating-selection">
            <label>Rating: </label>
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < rating ? 'star filled' : 'star'}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="review-textarea"
            rows="4"
          />
          <div className="review-actions">
            <button
              onClick={() => {
                setShowReviewForm(false);
                setRating(0);
                setReviewText('');
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReview}
              className="submit-button"
            >
              {editing ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
