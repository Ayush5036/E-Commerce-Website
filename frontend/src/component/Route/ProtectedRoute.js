import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import {  Route } from "react-router-dom";
import  {Navigate}  from "react-router-dom";


const ProtectedRoute = ({ isAdmin,  ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return (
                <Navigate to="/login"  />
              );
            }

            if (isAdmin === true && user.role !== "admin") {
              return (
                <Navigate to="/login" />
              );
            }

            return <element {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;