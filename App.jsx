import { useState } from "react";
import { useEffect } from "react";

function User({ user, selected, setSelected, setAllUsers }) {
  const [editActive, setEditActive] = useState(false);

  function selection() {
    if (selected.some((obj) => obj.id === user.id)) {
      setSelected((selected) => selected.filter((obj) => obj.id !== user.id));
    } else {
      const selectionEntry = [...selected, user];
      setSelected(selectionEntry);
    }
  }

  function editing() {
    setEditActive((editActive) => !editActive);
  }

  function deletion() {
    setAllUsers((allUsers) => allUsers.filter((obj) => obj.id !== user.id));
  }

  return (
    <tbody>
      <tr
        className={`row ${
          selected.some((obj) => obj.id === user.id) ? "selectedRow" : ""
        }`}
      >
        <td>
          <button
            style={{ height: "14px" }}
            onClick={selection}
            className={`${
              selected.some((obj) => obj.id === user.id) && "active"
            }`}
          ></button>
        </td>

        {editActive ? (
          <td>
            <input
              className="nameEditBox"
              type="text"
              placeholder={user.name}
              onChange={(e) => (user.name = e.target.value)}
            />
          </td>
        ) : (
          <td>{user.name}</td>
        )}

        {editActive ? (
          <td>
            <input
              className="emailEditBox"
              type="text"
              placeholder={user.email}
              onChange={(e) => (user.email = e.target.value)}
            />
          </td>
        ) : (
          <td>{user.email}</td>
        )}

        {editActive ? (
          <td>
            <input
              className="roleEditBox"
              type="text"
              placeholder={user.role}
              onChange={(e) => (user.role = e.target.value)}
            />
          </td>
        ) : (
          <td>{user.role}</td>
        )}

        <td style={{ borderLeft: "1px solid lightgrey" }}>
          <button className="editButton" onClick={editing}>
            {editActive ? "✔" : "🖊️"}
          </button>
        </td>
        <td style={{ borderLeft: "1px solid lightgrey" }}>
          <button className="deleteButton" onClick={deletion}>
            ❌
          </button>
        </td>
      </tr>
    </tbody>
  );
}

export default function App() {
  const [selected, setSelected] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allUsers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(allUsers.length / recordsPerPage);
  const array = Array.from({ length: totalPages }, (v, i) => i);

  function previous() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function next() {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  function first() {
    setCurrentPage(1);
  }
  function last() {
    setCurrentPage(totalPages);
  }

  function deleteSelected() {
    setAllUsers((allUsers) =>
      allUsers.filter(function (user) {
        if (selected.some((obj) => obj.id === user.id)) {
          return false;
        } else {
          return true;
        }
      })
    );
    setSelected([]);
  }
  function searchFunction(e) {
    e.preventDefault();
    const s = allUsers.filter(function (user) {
      if (user.name.indexOf(search)) {
        return false;
      } else {
        return true;
      }
    });
    setSearchedUsers(s);
    setSearch("");
  }
  function resetSearch(e) {
    e.preventDefault();
    setSearchedUsers([]);
    setSearch([]);
  }
  function selectAllShown() {
    if (selected.length !== 0) {
      setSelected([]);
    } else {
      setSelected(records);
    }
  }

  useEffect(function () {
    async function fetching() {
      const res = await fetch(
        `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
        { method: "GET" }
      );
      const data = await res.json();
      setAllUsers(data);
    }
    fetching();
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <form style={{ display: "inline-block" }}>
        <input
          className="searchBox"
          placeholder="Search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" id="search" onClick={searchFunction}>
          Search
        </button>
      </form>
      <button id="reset" onClick={resetSearch}>
        Reset
      </button>

      {selected.length !== 0 && (
        <div className="deleteSelectedContainer">
          <button className="deleteSelected" onClick={deleteSelected}>
            Delete selected
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <td>
              <button
                style={{ height: "14px" }}
                onClick={selectAllShown}
              ></button>
            </td>
            <td>Name</td>
            <td>Email</td>
            <td>Role</td>
            <td colSpan="2" style={{ borderLeft: "1px solid lightgrey" }}>
              Action
            </td>
          </tr>
        </thead>
        {searchedUsers.length !== 0 &&
          searchedUsers.map((user) => {
            return (
              <User
                user={user}
                key={user.id}
                selected={selected}
                setSelected={setSelected}
                setAllUsers={setAllUsers}
              />
            );
          })}
        {searchedUsers.length === 0 &&
          records.map((user) => {
            return (
              <User
                user={user}
                key={user.id}
                selected={selected}
                setSelected={setSelected}
                setAllUsers={setAllUsers}
              />
            );
          })}
      </table>

      <div className="pages">
        {array.map((el) => (
          <div
            id="page"
            style={{ display: "inline-block" }}
            key={el}
            className={el + 1 === currentPage && "activePage"}
          >
            {eval(el + 1)}
          </div>
        ))}
      </div>
      <div className="pageNavButtons">
        <button onClick={first}>First</button>
        <button onClick={previous}>Previous</button>
        <button onClick={next}>Next</button>
        <button onClick={last}>Last</button>
      </div>
    </>
  );
}
