import React, { useState } from "react";
import { useNavigate, Link } from "react-router";


function Login() {
   
  return (
    <>
    <h1>Login Page</h1>
    <Link to="/register">Go to Register</Link>
    </>
  )
}

export default Login;