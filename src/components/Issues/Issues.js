import Ticket from "../Ticket/Ticket";
import { useState, useEffect } from "react";
import axios from "axios";

import "./Issues.css";
import { AiOutlineClose } from "react-icons/ai";

const Issues = () => {
  const [ticketData, setTicketData] = useState([]);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectEdit, setProjectEdit] = useState("");
  const [editID, setEditId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    type: "",
    status: "",
    assignedTo: "",
    project: "",
  });

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["currentuser"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/bugs/"
        );
        setTicketData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBugs();
  }, [ticketData]);

  const handleBugSelection = (bugId) => {
    if (selectedBugs.includes(bugId)) {
      setSelectedBugs(selectedBugs.filter((id) => id !== bugId));
    } else {
      setSelectedBugs([...selectedBugs, bugId]);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedBugs.map((bugId) =>
          axios.delete(
            `https://bug-tracker-av8h.onrender.com/bugs/delete/${bugId}`
          )
        )
      );
      setSelectedBugs([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["currentUser"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/projects/"
        );
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [projects]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditIdChange = (event) => {
    const { value } = event.target;
    const selectedOption = event.target.options[event.target.selectedIndex];
    const project = selectedOption.getAttribute("project");
    setEditId(value);
    setProjectEdit(project);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`https://bug-tracker-av8h.onrender.com/bugs/${editID}`, {
        ...formData,
        project: projectEdit,
      });
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("https://bug-tracker-av8h.onrender.com/bugs", formData);

      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBugState = (bug) => {
    setTicketData((prevBugs) => [...prevBugs, bug]);
  };

  return (
    <div class="issues-container">
      <h1>Issues</h1>
      <div className="filter-sort-search animate__animated animate__bounceInDown">
        <div className="filter">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="">All</option>
            <option value="Feature">Feature</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Security">Security</option>
            <option value="Design">Design</option>
            <option value="Documentation">Documentation</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Support Request">Support Request</option>
          </select>
        </div>
        <div className="sort">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort">
            <option value="created">Created date</option>
            <option value="updated">Last updated</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="search">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search issues..."
          />
        </div>
      </div>

      <div className="issues-list animate__animated animate__slideInRight">
        {ticketData
          .filter((ticket) => {
            // Filter tickets based on the selected filter value
            if (filterValue === "") return true;
            return ticket.type === filterValue;
          })
          .filter((ticket) => {
            // Filter tickets based on the search value
            if (searchValue === "") return true;
            const title = ticket.title.toLowerCase();
            const description = ticket.description.toLowerCase();
            const searchTerm = searchValue.toLowerCase();
            return (
              title.includes(searchTerm) || description.includes(searchTerm)
            );
          })
          .map((ticket) => (
            // Rest of the code remains the same
            <Ticket
              key={ticket._id}
              id={ticket._id}
              title={ticket.title}
              description={ticket.description}
              priority={ticket.priority}
              type={ticket.type}
              status={ticket.status}
              project={ticket.project}
              createdAt={ticket.createdAt}
              updatedAt={ticket.updatedAt}
              assignedTo={ticket.assignedTo}
              comments={ticket.comments}
              setTicketData={setTicketData}
              showDelete={showDelete}
              onSelection={handleBugSelection}
              isSelected={selectedBugs.includes(ticket._id)}
            />
          ))}
      </div>
      <div className="control-buttons">
        <div>
          <button onClick={() => setShowModal(true)}>Add Issue</button>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Add Issue</h2>
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
                      required
                    ></textarea>
                  </label>
                  <label>
                    Priority:
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Severe">Severe</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                  <label>
                    Type:
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Feature">Feature</option>
                      <option value="Enhancement">Enhancement</option>
                      <option value="Security">Security</option>
                      <option value="Design">Design</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Support Request">Support Request</option>
                    </select>
                  </label>
                  <label>
                    Status:
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </label>
                  <label>
                    Project:
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      {projects.map((project) => {
                        return (
                          <option value={project._id} key={project._id}>
                            {project.title}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <label>
                    Assigned To:
                    <input
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button onClick={handleBugState} type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
          <button onClick={() => setShowEditModal(true)}>Edit Issue</button>
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Edit Issue</h2>
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
                      {ticketData.map((bug) => {
                        return (
                          <option
                            value={bug._id}
                            key={bug._id}
                            project={bug.project}
                            daniel="two"
                          >
                            {bug.title}
                          </option>
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
                      required
                    ></textarea>
                  </label>
                  <label>
                    Priority:
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Severe">Severe</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                  <label>
                    Type:
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Feature">Feature</option>
                      <option value="Enhancement">Enhancement</option>
                      <option value="Security">Security</option>
                      <option value="Design">Design</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Support Request">Support Request</option>
                    </select>
                  </label>
                  <label>
                    Status:
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </label>
                  <label>
                    Assigned To:
                    <input
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button onClick={handleBugState} type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div>
          <div>
            <button onClick={() => setShowDelete(!showDelete)}>
              {showDelete ? "Cancel" : "Delete Bugs"}
            </button>
            {showDelete && (
              <button onClick={handleDelete} disabled={!selectedBugs.length}>
                Delete Selected
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;
