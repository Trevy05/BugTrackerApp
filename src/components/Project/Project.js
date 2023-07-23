import React from "react";
import "./Project.css";

const Project = ({
  image,
  title,
  liveLink,
  codeLink,
  description,
  onSelection,
  showDelete,
  id,
}) => {
  const handleChange = () => {
    onSelection(id);
  };

  return (
    <div className="Card animate__bounceInUp">
      {showDelete && (
        <label class="neobrutalist-checkbox">
          <input type="checkbox" onChange={handleChange} />
          <span class="checkmark"></span>
          <span class="label-text">Delete</span>
        </label>
      )}
      <img src={image} alt={title} />
      <div className="Card-details">
        <h3 className="Card-title">{title}</h3>
        <p className="Card-description">{description}</p>
        <div className="Card-links">
          <a href={liveLink} target="_blank" rel="noopener noreferrer">
            Live
          </a>
          <a href={codeLink} target="_blank" rel="noopener noreferrer">
            Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default Project;
