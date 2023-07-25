import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Invitations.css";

const Invitations = ({ currentUser }) => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await axios.get(
          `https://bug-tracker-av8h.onrender.com/invitations/requests/${currentUser.id}`
        );
        setInvitations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchInvitations();
  }, [currentUser]);

  const handleAccept = async (invitationId) => {
    try {
      await axios.patch(
        `https://bug-tracker-av8h.onrender.com/invitations/requests/${invitationId}/accept`
      );
      setInvitations([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      await axios.patch(
        `https://bug-tracker-av8h.onrender.com/invitations/requests/${invitationId}/reject/`
      );
      setInvitations([]);
      // Do something on successful decline
    } catch (err) {
      console.log(err);
    }
  };

  const pendingInvites = invitations.filter(
    (invite) => invite.status === "pending"
  );

  return (
    <div className="invitations">
      <h1>Invitations</h1>
      <div className="invitations-list animate__animated animate__fadeIn">
        {pendingInvites.length > 0 ? (
          <ul>
            {pendingInvites.map((invitation) => (
              <li key={invitation._id}>
                <p>
                  You have been invited to join the team {invitation.team?.name}{" "}
                  by {invitation.sender.username}
                </p>
                <button onClick={() => handleAccept(invitation._id)}>
                  Accept
                </button>
                <button onClick={() => handleDecline(invitation._id)}>
                  Decline
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invitations found</p>
        )}
      </div>
    </div>
  );
};

export default Invitations;
