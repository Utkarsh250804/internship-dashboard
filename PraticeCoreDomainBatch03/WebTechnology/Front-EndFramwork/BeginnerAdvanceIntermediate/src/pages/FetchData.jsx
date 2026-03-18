import React, { useState, useEffect } from "react";

function FetchData() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });

  }, []);

  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  if (error) {
    return <h3 className="text-center text-danger">{error}</h3>;
  }

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Users</h2>

      <div className="row">

        {data.map((user) => (

          <div className="col-md-4 mb-4" key={user.id}>

            <div className="card shadow">

              <div className="card-body">

                <h5 className="card-title">{user.name}</h5>

                <p>Email: {user.email}</p>

                <p>City: {user.address.city}</p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default FetchData;