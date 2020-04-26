import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

interface PrivateRouteProps extends RouteProps {
  component: any;
  isLoggedIn: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, isLoggedIn, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}
export default PrivateRoute;
