import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "../css/navbar.css";
import {BsArrowUpRight} from "react-icons/bs";
import { icons } from "react-icons";
export default function Navbar() {
  const Linkto=()=>{
    window.open("https://github.com/Varshithvhegde/FreeShare","_blank");
  }
  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
        <Typography variant="h3" className="Navtext">
          FreeShare
        </Typography>
        <div className="aboutContainer" style={{cursor:"pointer"}}>
        
          <Typography variant="h6" className="aboutText" onClick={Linkto}>
            About<BsArrowUpRight style={{width:"15px",height:"15px"}}/>
          </Typography>
          
        </div>
        {/* Add additional navigation items here */}
      </Toolbar>
    </AppBar>
  );
}
