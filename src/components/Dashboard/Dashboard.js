import React, { useEffect, useState } from "react";
import { Card, Title, DonutChart } from "@tremor/react";
import "./Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [ticketData, setTicketData] = useState([]);
  const [ticketCount, setticketCount] = useState([]);
  const [openTicketsData, setOpenTicketsData] = useState([]);
  const [priorityCount, setPriorityCount] = useState([]);
  const [typeCount, setTypeCount] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser")).id;
        axios.defaults.headers.common["currentuser"] = user;

        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/bugs"
        );
        setTicketData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBugs();
  }, []);

  useEffect(() => {
    let open = 0;
    let inProgress = 0;
    let closed = 0;

    ticketData.map((ticket) => {
      if (ticket.status === "Open") {
        open += 1;
      } else if (ticket.status === "In Progress") {
        inProgress += 1;
      } else {
        closed += 1;
      }
    });

    setticketCount([
      { name: "Open", count: open },
      { name: "In Progress", count: inProgress },
      { name: "Closed", count: closed },
    ]);
  }, [ticketData]);

  useEffect(() => {
    let severe = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    ticketData.map((ticket) => {
      if (ticket.priority === "Severe") {
        severe += 1;
      } else if (ticket.priority === "High") {
        high += 1;
      } else if (ticket.priority === "Medium") {
        medium += 1;
      } else {
        low += 1;
      }
    });

    setPriorityCount([
      { name: "Severe", count: severe },
      { name: "High", count: high },
      { name: "Medium", count: medium },
      { name: "Low", count: low },
    ]);
  }, [ticketData]);

  useEffect(() => {
    let enhancement = 0;
    let feature = 0;
    let security = 0;
    let design = 0;
    let documentation = 0;
    let maintenance = 0;
    let support = 0;

    ticketData.map((ticket) => {
      if (ticket.type === "Enhancement") {
        enhancement += 1;
      } else if (ticket.type === "Feature") {
        feature += 1;
      } else if (ticket.type === "Design") {
        design += 1;
      } else if (ticket.type === "Security") {
        security += 1;
      } else if (ticket.type === "Documentation") {
        documentation += 1;
      } else if (ticket.type === "Maintenance") {
        maintenance += 1;
      } else {
        support += 1;
      }
    });

    setTypeCount([
      { name: "Enhancement", count: enhancement },
      { name: "Feature", count: feature },
      { name: "Design", count: design },
      { name: "Security", count: security },
      { name: "Documentation", count: documentation },
      { name: "Maintenance", count: maintenance },
      { name: "Support Request", count: support },
    ]);
  }, [ticketData]);

  useEffect(() => {
    setOpenTicketsData([]);
    ticketData.map((ticket) => {
      if (ticket.status === "Open")
        setOpenTicketsData((prevOpenTickets) => [...prevOpenTickets, ticket]);
    });
  }, [ticketData]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          "https://bug-tracker-av8h.onrender.com/activity"
        );

        setActivityData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivity();
  }, [ticketData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="issue-summary ">
          <Card className="max-w-lg animate__animated animate__fadeInTopLeft">
            <Title>Issues</Title>
            <DonutChart
              className="mt-6"
              data={ticketCount}
              category="count"
              index="name"
              colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            />
          </Card>
          <Card className="max-w-lg animate__animated animate__fadeInDown">
            <Title>Priority</Title>
            <DonutChart
              className="mt-6"
              data={priorityCount}
              category="count"
              index="name"
              colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            />
          </Card>
          <Card className="max-w-lg animate__animated animate__fadeInTopRight ">
            <Title>Ticket Type</Title>
            <DonutChart
              className="mt-6"
              data={typeCount}
              category="count"
              index="name"
              colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            />
          </Card>
        </div>
        <div className="ticket-activity">
          <div className="open-tickets  animate__animated animate__fadeInBottomLeft">
            <div className="open-ticket-summary">
              <h2>Open Tickets</h2>
              <div className="ticket-list">
                <ul>
                  {openTicketsData.map((ticket) => (
                    <li>
                      <p>Title: {ticket.title}</p>
                      <p>Description: {ticket.description}</p>
                      <p>Priority: {ticket.priority}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="recent-activity animate__animated animate__fadeInBottomRight">
            <div className="recent-activity-summary">
              <h2>Recent Activity</h2>
              <div className="ticket-list">
                <ul>
                  {activityData.map((ticket) => (
                    <li>
                      <p>{ticket.details}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
