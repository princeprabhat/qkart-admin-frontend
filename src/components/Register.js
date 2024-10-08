import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";




const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [getUserName,SetUserName] = useState("");
  const [getPassword,SetPassword] = useState("");
  const [confirmPassword,SetConfirmPassword] = useState("");
  const [loader,setLoader] = useState(false);
  const history = useHistory();




  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setLoader(true);
    const url = config.endpoint+"/auth/register"
    const {username,password} = formData;
   
 
    
      await axios.post(url,{
      "username":username,
      "password":password,
     
  
     }).then((res)=>{
     
       if(res.status===201 && res.data.success){
        enqueueSnackbar('Registered Successfully',{variant: 'success'});
        setLoader(false);
        SetUserName("");
        SetPassword("");
        SetConfirmPassword("");
        history.push('/login');


      }
      
    }).catch((err)=>{
      if(err.response && err.response.status===400){
        enqueueSnackbar(err.response.data.message,{variant: 'error'});
        setLoader(false);

       
      }else{
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant: 'error'})
        setLoader(false);
      }
   
      
    }
        

    
     )
   


   
   
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const{username,password,confirmpassword} = data;
    
    if(username===''){
      enqueueSnackbar('Username is a required field',{variant: 'warning'});
      return false;
    }
    if(username.length<6){
      enqueueSnackbar('Username must be at least 6 characters',{variant: 'warning'});
      return false;
    }
    if(password===''){
      enqueueSnackbar('Password is a required field',{variant: 'warning'});
      return false;
    }
    if(password.length<6){
      enqueueSnackbar('Password must be at least 6 characters',{variant: 'warning'});
      return false;
    }
    if(confirmpassword!==password){
      enqueueSnackbar('Passwords do not match',{variant: 'warning'});
      return false;
    }
    return true

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
          
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            value={getUserName}
            onChange={(e)=>{SetUserName(e.target.value)}}
            name="username"
            placeholder="Enter Username"
            fullWidth
            
            
          />
          <TextField
          
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={getPassword}
            onChange={(e)=>{SetPassword(e.target.value)}}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            
            
          />
          <TextField
        
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e)=>{SetConfirmPassword(e.target.value)}}
            type="password"
            fullWidth
           
           
          />
           {!loader ? <Button className="button" variant="contained" onClick={()=>{
            if(validateInput({username:getUserName,password:getPassword,confirmpassword:confirmPassword})){
              register({username:getUserName,password:getPassword});

            }
            }}>
            Register Now
           </Button>:<Box textAlign="center">
      <CircularProgress />
    </Box>}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login" className="link">
              Login here
              </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
