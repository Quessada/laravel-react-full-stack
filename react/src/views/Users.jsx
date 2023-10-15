import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();

  useEffect(() => {
    getUsers();
  }, []);

  const MySwal = withReactContent(Swal);

  const onDelete = (u) => {
    MySwal.fire({
      title: 'Are you sure you want to delete this user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00a762',
      cancelButtonColor: '#b72424',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/users/${u.id}`)
        .then(() => {
          Swal.fire(
            'Deleted!',
            'The user has been deleted.',
            'success'
          );
          setNotification("User was succesfully deleted!");
          getUsers();
        })        
      }
    })

    // if(!window.confirm("Are you sure you want to delete this user?")) {
    //   return;
    // }

  };

  const getUsers = () => {
    setLoading(true);
    axiosClient.get('/users')
    .then(({data}) => {
      setLoading(false);
      console.log(data);
      setUsers(data.data);
    })
    .catch(() => {
      setLoading(false);
    });
  };
    return (
      <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1>Users</h1>
            <Link to={'/users/new'} className="btn-add">Add New</Link>
          </div>
          <div className="card animated fadeInDown">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Create Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
             {loading && <tbody>
                  <td colSpan={"5"} className="text-center">
                    Loading...
                  </td>
              </tbody>}
              {!loading && <tbody>
                {
                  users.map(u => (
                    <tr>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.created_at}</td>
                      <td>
                        <Link to={'/users/'+u.id} className="btn-edit">Edit</Link>  
                        &nbsp;
                        <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>}
            </table>
          </div>
      </div>
    )
}
  