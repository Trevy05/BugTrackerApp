import { useState, useEffect } from "react";
import axios from "axios";
import Project from "../Project/Project";
import "./ProjectList.css";
import { AiOutlineClose } from "react-icons/ai";

const ProjectList = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editID, setEditId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repoUrl: "",
    liveUrl: "",
    team: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["Authorization"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/projects/"
        );
        setProjectsData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [projectsData]);

  const handleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const handleSetShowDelete = () => {
    setShowDelete(!showDelete);
    setShowButton(!showButton);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedProjects.map((projectId) =>
          axios.delete(
            `https://bug-tracker-av8h.onrender.com/projects/delete/${projectId}`
          )
        )
      );
      setSelectedProjects([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["Authorization"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/teams/"
        );
        setTeams(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, [teams]);

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
      await axios.patch(
        `https://bug-tracker-av8h.onrender.com/projects/${editID}`,
        formData
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "https://bug-tracker-av8h.onrender.com/projects/",
        formData
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="projects">
      <h1>Projects</h1>
      <div class="search animate__animated animate__bounceInDown">
        <label for="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search projects..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="project-list animate__animated animate__fadeInRight">
        {projectsData
          .filter((project) =>
            project.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((project) => {
            return (
              <Project
                image="https://img.freepik.com/premium-photo/drawing-light-bulb-with-word-souvoo-it_605423-8677.jpg?w=2000"
                title={project.title}
                description={project.description}
                liveLink={project.liveUrl}
                codeLink={project.repoUrl}
                setProjectData={setProjectsData}
                showDelete={showDelete}
                onSelection={handleProjectSelection}
                isSelected={selectedProjects.includes(project._id)}
                id={project._id}
              />
            );
          })}
      </div>
      <div className="action-buttons">
        <div>
          {showButton && (
            <button onClick={() => setShowModal(true)}>Add Project</button>
          )}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Add Project</h2>
                  <AiOutlineClose
                    className="close-icon"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <label>
                    Title:
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={100}
                      required
                    ></textarea>
                  </label>
                  <label>
                    Url of Repository
                    <textarea
                      name="repoUrl"
                      value={formData.repoUrl}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </label>
                  <label>
                    Live Url
                    <textarea
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </label>
                  <div>
                    <label htmlFor="team-select">Team:</label>
                    <select
                      name="team"
                      id="team-select"
                      value={formData.team}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
          {showButton && (
            <button onClick={() => setShowEditModal(true)}>Edit Project</button>
          )}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Edit Project</h2>
                  <AiOutlineClose
                    className="close-icon"
                    onClick={() => setShowEditModal(false)}
                  />
                </div>
                <form onSubmit={handleEdit}>
                  <label>
                    Title:
                    <select
                      name="status"
                      value={editID}
                      onChange={handleEditIdChange}
                      required
                    >
                      <option value="">--Select--</option>
                      {projectsData.map((project) => {
                        return (
                          <option value={project._id}>{project.title}</option>
                        );
                      })}
                    </select>
                  </label>
                  <label>
                    New Title:
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={100}
                      required
                    ></textarea>
                  </label>
                  <label>
                    Url of Repository
                    <textarea
                      name="repoUrl"
                      value={formData.repoUrl}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </label>
                  <label>
                    Live Url
                    <textarea
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </label>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="delete-buttons">
            <button onClick={handleSetShowDelete}>
              {showDelete ? "Cancel" : "Delete Projects"}
            </button>
            {showDelete && (
              <button
                onClick={handleDelete}
                disabled={!selectedProjects.length}
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
