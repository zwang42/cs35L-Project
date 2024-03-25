import React, {useContext} from "react";
import { Route, Redirect} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.js";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useAuth();
    return (
      <Route
        {...rest}
        render={routeProps =>
          !!currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/login"} />
          )
        }
      />
    );
  };
  
  
  export default PrivateRoute