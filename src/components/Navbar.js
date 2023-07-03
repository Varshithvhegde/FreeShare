import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "../css/navbar.css";
export default function Navbar() {
  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
        <Typography variant="h3" className="Navtext">
          Anyshare
        </Typography>
        {/* Add additional navigation items here */}
      </Toolbar>
    </AppBar>
  );
}
