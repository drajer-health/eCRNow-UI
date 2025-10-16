 import { useNavigate } from "react-router-dom";
import React from "react";

export function withRouter<T extends object>(Component: React.ComponentType<T & { navigate: ReturnType<typeof useNavigate> }>) {
  return (props: T) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}