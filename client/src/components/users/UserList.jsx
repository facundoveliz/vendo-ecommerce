import React, { useState, useEffect } from "react";
import { getUsers } from "./fetchActions";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import dateFormat from "dateformat";
import { Edit, Delete } from "./Windows";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

const UserList = () => {
  useEffect(() => {
    getUsersRequest();
  }, []);

  const [users, setUsers] = useState([]);

  // if the 'open...' state is true, it will show the edit/delete window
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // this passes the selected user to the window
  const [selectedEdit, setSelectedEdit] = useState({
    _id: "",
    name: "",
    email: "",
  });

  // this passes the id of the selected user to delete
  const [selectedDelete, setSelectedDelete] = useState(false);

  const [loading, setLoading] = useState(false);

  // decodes tde token and use it to take tde id of tde current user
  const token = Cookies.get("jwtToken");
  const decoded = jwt_decode(token);

  const getUsersRequest = async () => {
    setLoading(true);
    let res = await getUsers();
    setUsers(res);
    setLoading(false);
  };

  return (
    <div className="table">
      <div className="table-title">
        <h1>Users</h1>
      </div>
      {loading ? (
        <Loader
          type="Oval"
          color="#627884"
          height={200}
          width={200}
          className="loading"
        />
      ) : (
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User since</th>
              <th>Actions</th>
            </tr>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{dateFormat(user.created, "d mmm, HH:MM")}</td>
                  <td>
                    <div>
                      <button
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedEdit({ ...selectedEdit, ...user });
                        }}
                      >
                        Edit
                      </button>
                      {user._id === decoded._id ? (
                        <button
                          onClick={() =>
                            toast.error("You can't delete yourself.")
                          }
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            {
                              setOpenDelete(true);
                              setSelectedDelete(user._id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div>
        {openEdit ? (
          <Edit
            setOpenEdit={setOpenEdit}
            selectedEdit={selectedEdit}
            getRequest={getUsersRequest}
          />
        ) : null}
      </div>
      <div>
        {openDelete ? (
          <Delete
            setOpenDelete={setOpenDelete}
            selectedDelete={selectedDelete}
            getRequest={getUsersRequest}
          />
        ) : null}
      </div>
    </div>
  );
};

export default UserList;
