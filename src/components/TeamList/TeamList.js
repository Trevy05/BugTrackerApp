import { useState, useEffect } from "react";
import Team from "../Team/Team";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import "./TeamList.css";

const TeamList = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editID, setEditId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    admin: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditIdChange = (event) => {
    const { value } = event.target;
    setEditId(value);
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser")).id;
      const res = await axios.patch(`http://localhost:8000/teams/${editID}`, {
        formData,
        currentUser,
      });
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const teamData = JSON.parse(localStorage.getItem("currentUser")); // Retrieve teamData from localStorage

    const updatedFormData = {
      ...formData,
      admins: teamData.id, // Add teamData to formData
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/teams/",
        updatedFormData
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["Authorization"] = user;

        const res = await axios.get("http://localhost:8000/teams/");
        setTeamsData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, [teamsData]);

  const handleTeamsSelection = (projectId) => {
    if (selectedTeams.includes(projectId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== projectId));
    } else {
      setSelectedTeams([...selectedTeams, projectId]);
    }
  };

  const handleSetShowDelete = () => {
    setShowDelete(!showDelete);
    setShowButton(!showButton);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedTeams.map((teamId) =>
          axios.delete(`http://localhost:8000/teams/${teamId}`)
        )
      );
      setSelectedTeams([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="team">
      <h1>Teams</h1>
      <div class="search animate__animated animate__bounceInDown">
        <label for="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search teams..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="team-content animate__animated animate__fadeIn">
        {teamsData
          .filter((team) =>
            team.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((team) => {
            return (
              <Team
                teamName={team.name}
                admins={team.admins}
                teamMembers={team.members}
                showDelete={showDelete}
                onSelection={handleTeamsSelection}
                isSelected={selectedTeams.includes(team._id)}
                id={team._id}
                key={team._id}
              />
            );
          })}
      </div>
      <div className="action-buttons">
        <div>
          {showButton && (
            <button onClick={() => setShowModal(true)}>Add Team</button>
          )}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Add Team</h2>
                  <AiOutlineClose
                    className="close-icon"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
          {showButton && (
            <button onClick={() => setShowEditModal(true)}>Edit Team</button>
          )}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Edit Team</h2>
                  <AiOutlineClose
                    className="close-icon"
                    onClick={() => setShowEditModal(false)}
                  />
                </div>
                <form onSubmit={handleEdit}>
                  <label>
                    Name:
                    <select
                      name="status"
                      value={editID}
                      onChange={handleEditIdChange}
                      required
                    >
                      <option value="">--Select--</option>
                      {teamsData.map((team) => {
                        return (
                          <option value={team._id} key={team._id}>
                            {team.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <label>
                    New Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div>
          <button onClick={handleSetShowDelete}>
            {showDelete ? "Cancel" : "Delete Team"}
          </button>
          {showDelete && (
            <button onClick={handleDelete} disabled={!selectedTeams.length}>
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamList;
