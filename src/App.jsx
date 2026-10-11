import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  function getUsers() {
    fetch("http://localhost:3000/users")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then(function (data) {
        setUsers(data);
      })
      .catch(function (error) {
        console.error("Error loading users:", error);
      });
  }

  useEffect(function () {
    getUsers();
  }, []);

  function addUser(event) {
    event.preventDefault();

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.trim(),
        age: Number(age)
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then(function () {
        setName("");
        setAge("");
        getUsers();
      })
      .catch(function (error) {
        console.error("Error adding user:", error);
        alert("Could not add user. Please try again.");
      });
  }

  function editUser(user) {
    setEditingId(user._id);
    setName(user.name);
    setAge(String(user.age));
  }

  function updateUser(event) {
    event.preventDefault();

    fetch("http://localhost:3000/users/" + editingId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.trim(),
        age: Number(age)
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then(function () {
        setEditingId(null);
        setName("");
        setAge("");
        getUsers();
      })
      .catch(function (error) {
        console.error("Error updating user:", error);
        alert("Could not update user. Please try again.");
      });
  }

  function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
  return;
}
    fetch("http://localhost:3000/users/" + userId, {
      method: "DELETE"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        if (editingId === userId) {
          setEditingId(null);
          setName("");
          setAge("");
        }

        getUsers();
      })
      .catch(function (error) {
        console.error("Error deleting user:", error);
        alert("Could not delete user. Please try again.");
      });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">U</div>
          <span>
            User<span className="brand-highlight">Manager</span>
          </span>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Full-stack app
        </div>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <p className="eyebrow">DASHBOARD / USERS</p>
          <h1>User Management</h1>
          <p className="subtitle">
            Create, update, and manage your users in one place.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">TOTAL USERS</span>
            <h2>{users.length}</h2>
            <p>Users in your database</p>
          </div>

          <div className="stat-card">
            <span className="stat-label">DATABASE</span>
            <h2 className="connected">MongoDB</h2>
            <p>Database service</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">USER DETAILS</p>
                <h2>{editingId ? "Edit user" : "Add a user"}</h2>
              </div>

              <span className="panel-icon">
                {editingId ? "✎" : "+"}
              </span>
            </div>

            <form onSubmit={editingId ? updateUser : addUser}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={function (event) {
                  setName(event.target.value);
                }}
                placeholder="e.g. Alba"
                required
              />

              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                min="1"
                value={age}
                onChange={function (event) {
                  setAge(event.target.value);
                }}
                placeholder="e.g. 26"
                required
              />

              <button className="primary-button" type="submit">
                {editingId ? "Save changes" : "+ Add user"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={function () {
                    setEditingId(null);
                    setName("");
                    setAge("");
                  }}
                >
                  Cancel editing
                </button>
              )}
            </form>
          </div>

          <div className="panel users-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR DATABASE</p>
                <h2>All users</h2>
              </div>

              <span className="count-badge">{users.length}</span>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <h3>No users yet</h3>
                <p>Add your first user using the form.</p>
              </div>
            ) : (
              <div className="user-list">
                {users.map(function (user) {
                  return (
                    <div className="user-row" key={user._id}>
                      <div className="avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="user-info">
                        <h3>{user.name}</h3>
                        <p>Age {user.age}</p>
                      </div>

                      <div className="user-actions">
                        <button
                          className="edit-button"
                          type="button"
                          onClick={function () {
                            editUser(user);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          type="button"
                          onClick={function () {
                            deleteUser(user._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          Built with React <span>·</span> Express <span>·</span> MongoDB
        </footer>
      </main>
    </div>
  );
}

export default App;