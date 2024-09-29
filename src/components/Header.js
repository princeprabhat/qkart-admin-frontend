import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, IsLoggedIn }) => {
  const history = useHistory();
  
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Box>
          {children}
        </Box>
        {!hasHiddenAuthButtons && <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>
            {history.push('/')
          }}
        >
          Back to explore
        </Button>}
        {hasHiddenAuthButtons && !IsLoggedIn && <Stack direction="row" spacing={2}>
        <Button
          className="explore-button"
          
          variant="text"
          onClick={()=>
            {history.push('/login')
          }}
        >
          LOGIN
        </Button>
        <Button
          className=""
          
          variant="contained"
          onClick={()=>
            {history.push('/register')
          }}
        >
          REGISTER
        </Button>
        </Stack>}
        
        {hasHiddenAuthButtons && IsLoggedIn && <Stack  direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}>
     
       <img src="avatar.png" alt={localStorage.getItem("username")}></img>
          <p className="username-text">{localStorage.getItem("username")}</p>
        
        
      
       <Button
          className="explore-button"
          
          variant="text"
          onClick={()=>
            {
            localStorage.clear()
            window.location.reload()
            history.push('/')
          }}
        >
          LOGOUT
        </Button>
        </Stack>}
      </Box>
    );
};

export default Header;
