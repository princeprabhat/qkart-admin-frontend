import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart";



// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const { enqueueSnackbar } = useSnackbar();
  const [items,setItems] = useState([]);
  const [loader,setLoader] = useState(false);
  const [searchItem,setSearchItem] = useState(false);
  const [cartItems,setCartItems] = useState([]);
  const [finalCart,setFinalCart] = useState([]);

  const performAPICall = async () => {
    const url = config.endpoint+"/products";
    await axios.get(url).then((res)=>{
      if(res.status===200){
        setItems(res.data);
        setLoader(true);
       
      }
    }).catch((err)=>{
      if(err.response && err.response.status===500){

        enqueueSnackbar(err.message,{variant: 'error'});
      }
     else{
      enqueueSnackbar(err.message,{variant: 'error'});
     }
  
    })
  };
 
  useEffect(()=>{
    performAPICall();
 
  },[])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const url = `${config.endpoint}/products/search?value=${text}`;
    await axios.get(url).then((res)=>{
      if(res.status===200){
     
        setItems(res.data);
        setSearchItem(false);
       
     
       
      }
    }).catch((err)=>{
      if(err.response.status===404){
      
        setItems([])
       
        setSearchItem(true);
      }
      else{
        enqueueSnackbar(err.message,{variant: 'error'});
        
      }
      
    })
  };

  const debounce = (func) => {
    let timeoutId;
    return function executedFunction(value,delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(value);
      }, delay);
    };
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  
  const debouncePerformance = debounce(performSearch);

  const debounceSearch = (event, debounceTimeout)=>{
   debouncePerformance(event.target.value,debounceTimeout);

  };




  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {

    if (!token) return;

    const url = `${config.endpoint}/cart`;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(url,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      return response;
    
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
   const res = items.some(item => item.productId===productId);
   return res;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    
    if(!token){
      enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "warning",
        })

        return
    }
    
    

    if(isItemInCart(finalCart,productId) && options==='ADD TO CART'){
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        })

        return
    }

    const url = config.endpoint+"/cart";

    const data = {
      productId: productId,
      qty: qty
    };

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    await axios.post(url,data,{headers}).then((response)=>{
        if(response.status===200){
          setCartItems(response.data);

        } 
    }).catch((err)=>{
      if (err.response && err.response.status === 404) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
     
    })
    
   
  
   

    
  };

  const isLoggedIn = localStorage.getItem("username") && localStorage.getItem("username")!=='';
  
  useEffect(()=>{
   fetchCart(localStorage.getItem("token")).then((res)=>{
    setCartItems(res.data);

   }).catch((err)=>{
      setCartItems([]);
   })
   
  },[])

  useEffect(()=>{
    if(cartItems.length && items.length){
      const resultCart = generateCartItemsFrom(cartItems,items);
      setFinalCart(resultCart);
      
     }
     else{
      setFinalCart([]);
     }
   
  
  },[cartItems])

  return (
    <div>
      <Header hasHiddenAuthButtons={true} IsLoggedIn={isLoggedIn} >

        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        sx={{width:"350px"}}
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{
          debounceSearch(e,500)
        }}
      />
      </Header>

     

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{debounceSearch(e,500)}}
      />



<Grid container>
<Grid container sx={{ width: { md: `${isLoggedIn?"75%":"100%"}` } }}>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           
           
         </Grid>
         {loader? 

      
<Grid container spacing={2}  p={1}>
   {
     items.map((item)=>{
       return(
    <Grid item xs={6} md={3} key={item['_id']}>
      <ProductCard product={item} handleAddToCart={addToCart}/>
    </Grid>
       )
     })
   }
  
</Grid>
:
<Box className="loading">

<CircularProgress />


<h4>Loading Products</h4>
</Box>}
      
       
    {
      
      searchItem && <Box className="loading">
       <SentimentDissatisfied/>
       <h4>No products found</h4>
      </Box>
    }
   </Grid>
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
 <Grid container sx={{ width: { md: "25%" }, alignItems:"flex-start", background:"#E9F5E1" }}>
       {isLoggedIn && <Cart products={items} items={finalCart} handleQuantity={addToCart}/>}

 </Grid>
</Grid>


     
    
      <Footer />
     
    </div>
  );
};

export default Products;
