import React from 'react';

const BookForm = ({
  formData, setFormData,
  selectedFile, setSelectedFile,
  previewURL, setPreviewURL,
  handleSubmit, editMode
}) => {
  const categories = [
    'Big Data', 'AI/ML', 'Web Development',
    'IOT', 'Game Development', 'Software Engineering'
  ];

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="books-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Book Name</label>
        <input type="text" name="Book_Name" value={formData.Book_Name} onChange={onChange} required />
      </div>

      <div className="form-group">
        <label>Author</label>
        <input type="text" name="Author" value={formData.Author} onChange={onChange} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="Description" value={formData.Description} onChange={onChange}></textarea>
      </div>

      <div className="form-group">
        <label>ISBN</label>
        <input type="text" name="ISBN" value={formData.ISBN} onChange={onChange} />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input type="text" name="Book_Location" value={formData.Book_Location} onChange={onChange} />
      </div>

      <div className="form-group">
        <label>Available Count</label>
        <input type="number" name="Available_count" value={formData.Available_count} onChange={onChange} required />
      </div>

      <div className="form-group">
        <label>Publisher</label>
        <input type="text" name="Publisher" value={formData.Publisher} onChange={onChange} required />
      </div>

      <div className="form-group">
        <label>Published Date</label>
        <input type="date" name="PublishedDate" value={formData.PublishedDate} onChange={onChange} required />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select name="Category" value={formData.Category} onChange={onChange} required>
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Image</label>
        <input type="file" onChange={handleFileChange} />
        {previewURL && <img src={previewURL} alt="Preview" className="image-preview" />}
      </div>

      <button type="submit">{editMode ? 'Update' : 'Add'} Book</button>
    </form>
  );
};

export default BookForm;
