import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTimes } from "@fortawesome/free-solid-svg-icons";

import "./Ticket.css";

const Ticket = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [projectData, setProjectData] = useState();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["Authorization"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/projects/"
        );

        setProjectData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = () => {
    props.onSelection(props.id);
  };

  return (
    <div className="ticket">
      <div className="ticket-header underline" onClick={handleClick}>
        <div className="ticket-header-status">{props.status}</div>
        <div className="ticket-header-title">{props.title}</div>
        {props.showDelete && (
          <label className="neobrutalist-checkbox">
            <input type="checkbox" onChange={handleChange} />
            <span className="checkmark"></span>
            <span className="label-text">Delete</span>
          </label>
        )}
        <div className="ticket-header-arrow">
          <FontAwesomeIcon icon={faArrowDown} rotation={expanded ? 180 : 0} />
        </div>
      </div>
      {expanded && (
        <div className="ticket-details">
          <div className="ticket-details-header">
            <div className="ticket-details-header-text">Details:</div>
            <div className="ticket-details-header-close" onClick={handleClick}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className="ticket-details-description">{props.description}</div>
          <div className="ticket-details-footer">
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Priority:</div>
              <div className="ticket-details-footer-value">
                {props.priority}
              </div>
            </div>
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Assigned To:</div>
              <div className="ticket-details-footer-value">
                {props.assignedTo}
              </div>
            </div>
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Type:</div>
              <div className="ticket-details-footer-value">{props.type}</div>
            </div>
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Project:</div>
              <div className="ticket-details-footer-value">
                {projectData[0].title}
              </div>
            </div>
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Created:</div>
              <div className="ticket-details-footer-value">
                {props.createdAt}
              </div>
            </div>
            <div className="ticket-details-footer-item">
              <div className="ticket-details-footer-label">Updated:</div>
              <div className="ticket-details-footer-value">
                {props.updatedAt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;
