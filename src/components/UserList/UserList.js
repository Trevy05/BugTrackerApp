import { useEffect, useState } from "react";
import axios from "axios";
import User from "../User/User";
import "./UserList.css";
import { AiOutlineClose } from "react-icons/ai";

const UserList = () => {
  const [usersData, setUsersData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [team, setTeam] = useState("");
  const [message, setMessage] = useState("");
  const [teamsData, setTeamsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const sender = JSON.parse(localStorage.getItem("currentUser")).id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://bug-tracker-av8h.onrender.com/invitations/requests",
        {
          sender,
          recipient,
          team,
          message,
        }
      );
      setError("");
      setOpenModal(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error);
      } else {
        setError("An error occurred while sending the request.");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUserId = JSON.parse(localStorage.getItem("currentUser")).id;

      try {
        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/users/"
        );
        // Filter the user data array to remove the current user
        const filteredUsers = res.data.filter(
          (user) => user._id !== currentUserId
        );
        setUsersData(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/teams/",
          {
            headers: {
              authorization: sender,
            },
          }
        );
        setTeamsData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, [sender]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setTeam(value);
  };

  const handleInvite = (user) => {
    setOpenModal(true);
    setRecipient(user._id);
  };

  return (
    <div className="user">
      <h1>Users</h1>
      <div class="search animate__animated animate__bounceInDown">
        <label for="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search users..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="userlist">
        {openModal && (
          <div className="modal-overlay">
            <div className="modal">
              <AiOutlineClose
                className="close-icon"
                onClick={() => setOpenModal(false)}
              />
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                <label>
                  Team:
                  <select
                    name="team"
                    value={team}
                    onChange={handleInputChange}
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
                <br />
                <label>
                  Message:
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
                <br />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
        {usersData
          .filter((user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((user) => {
            return (
              <User
                name={user.username}
                handleInvite={handleInvite}
                email={user.email}
                userInfo={user}
                avatar={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default UserList;
