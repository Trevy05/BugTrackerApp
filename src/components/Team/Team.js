import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Team.css";

const Team = ({ teamName, onSelection, showDelete, id }) => {
  const [adminsData, setAdminsData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Function to fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://bug-tracker-av8h.onrender.com/teams/${id}/members`
      );

      setAdminsData(res.data.admins);
      setMembersData(res.data.members);
    } catch (err) {
      console.error(err);
    }
  }, [id]); // Make sure to include id in the dependency array since it's used in the function

  // Fetch users data on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Use the fetchUsers function as a dependency to ensure it's called when the function changes

  // Function to handle delete
  const handleDelete = async (memberId) => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser")).id;
      if (!user) {
        console.error("User not found in localStorage");
        return;
      }

      // Assuming you have a valid token for authorization, set it as the Authorization header
      axios.defaults.headers.common["Authorization"] = user;

      const res = await axios.delete(
        `https://bug-tracker-av8h.onrender.com/teams/${id}/members/${memberId}`
      );

      if (res.status === 200) {
        // Deletion successful, fetch updated users data
        fetchUsers();
      } else {
        console.error("Failed to delete team member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCheckboxChange = () => {
    onSelection(id);
  };

  return (
    <>
      <div className="team-card">
        {showDelete && (
          <label className="neobrutalist-checkbox">
            <input type="checkbox" onChange={handleCheckboxChange} />
            <span className="checkmark"></span>
            <span className="label-text">Delete</span>
          </label>
        )}
        <h2 className="team-name" onClick={handleCardClick}>
          {teamName}
        </h2>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-icon" onClick={handleCloseModal}>
              &times;
            </span>
            <h2 className="modal-heading">{teamName}</h2>
            {adminsData.map((admin) => (
              <li className="team-member" key={admin.id}>
                <div className="member-info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
                    alt={admin.username}
                  />
                  <div className="team-member-details">
                    <h3>{admin.username}</h3>
                  </div>
                </div>
              </li>
            ))}
            <h3>Members</h3>
            <ul className="team-members">
              {membersData.length === 0 ? (
                <p>No members found</p>
              ) : (
                membersData.map((member) => (
                  <li className="team-member" key={member._id}>
                    <div className="member-info">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
                        alt={member.username}
                      />
                      <div className="team-member-details">
                        <h3>{member.username}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleDelete(member._id);
                      }}
                    >
                      Leave
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Team;
