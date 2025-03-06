import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBook.css';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    location: '',
    image: null,
    publisher: '',
    publishedDate: '',
    available: 1
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^[0-9-]{10,13}$/.test(formData.isbn)) {
      newErrors.isbn = 'Invalid ISBN format';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Book cover image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // In a real app, this would be an API call
      // const formDataObj = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataObj.append(key, formData[key]);
      // });
      // await axios.post('/api/books', formDataObj);
      
      // For demo purposes, alert success and navigate
      setTimeout(() => {
        alert('Book added successfully!');
        navigate('/books');
        setLoading(false);
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add book');
      setLoading(false);
    }
  };

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Biography',
    'History',
    'Poetry',
    'Drama',
    'Other'
  ];

  return (
    <div className="add-book-container">
      <div className="add-book-card">
        <h2 className="add-book-title">Add New Book</h2>
        
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        
        <form onSubmit={handleSubmit} className="add-book-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title <span className="required">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <div className="error-text">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author <span className="required">*</span></label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? 'input-error' : ''}
              />
              {errors.author && <div className="error-text">{errors.author}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="isbn">ISBN <span className="required">*</span></label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={errors.isbn ? 'input-error' : ''}
                placeholder="e.g., 978-3-16-148410-0"
              />
              {errors.isbn && <div className="error-text">{errors.isbn}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre <span className="required">*</span></label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={errors.genre ? 'input-error' : ''}
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {errors.genre && <div className="error-text">{errors.genre}</div>}
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'input-error' : ''}
              ></textarea>
              {errors.description && <div className="error-text">{errors.description}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location <span className="required">*</span></label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'input-error' : ''}
                placeholder="e.g., Shelf A-12"
              />
              {errors.location && <div className="error-text">{errors.location}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="publishedDate">Published Date</label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="available">Available Copies</label>
              <input
                type="number"
                id="available"
                name="available"
                min="0"
                value={formData.available}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Book Cover <span className="required">*</span></label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="image" className="file-input-label">Choose File</label>
              </div>
              {errors.image && <div className="error-text">{errors.image}</div>}
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Book cover preview" />
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={() => navigate('/books')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
