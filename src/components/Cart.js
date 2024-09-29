import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  
 
 const cartRes = cartData.map((item)=>{
  const matchData = productsData.find(product=> item.productId === product._id);
  return {...item,...matchData};
 })
return cartRes;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  const cost = items.reduce((acc,val)=>acc+(val.cost*val.qty),0);

  return cost;
};




// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  const totalItem = items.reduce((acc,item)=> item.qty+acc,0);
  return totalItem;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly,
}) => {
  return (
    <Stack direction="row" alignItems="center">
     {!isReadOnly && <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>}

      {isReadOnly && <div>Qty:</div>}
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
     {!isReadOnly && <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly,
}) => {
  const history = useHistory()
  const token = localStorage.getItem("token");
  
  

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        
  {items.map((item)=>{
    return(
      
<Box display="flex" alignItems="flex-start" padding="1rem" key={item.productId}>
      <Box className="image-container">
        <img
            // Add product image
            src={item.image}
            // Add product name as alt eext
            alt={item.name}
            width="100%"
            height="100%"
        />
    </Box>
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
    >
        <div>{item.name}</div>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
        <ItemQuantity
        // Add required props by checking implementation
        value={item.qty}
        handleAdd={async ()=> await handleQuantity(token,items,products,item.productId,item.qty+1,"ADD-ONE")}
        handleDelete={async ()=> await handleQuantity(token,items,products,item.productId,item.qty-1,"DELETE-ONE")}
        isReadOnly={isReadOnly}
        />
        <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
        </Box>
        </Box>
    </Box>
</Box>
      
    )
    
  })}



        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly && <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>{history.push('/checkout')}}
          >
            Checkout
          </Button>
        </Box>}
      </Box>
        {isReadOnly && <Box display="flex"
        flexDirection="column"
        justifyContent="space-between" sx={{margin:"0.5rem",background:"#ffffff",padding:"15px",py:"2rem"}}>
          <Stack color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            marginBottom="1rem">
                <div>Order Details</div>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={1} >
          <div>Products</div>
          <div>{getTotalItems(items)}</div>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={1} >
          <div>Subtotal</div>
          <div>${getTotalCartValue(items)}</div>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={1} >
          <div>Shipping Charges</div>
          <div>$0</div>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={1} color="#3C3C3C"
            fontWeight="700"
            fontSize="1.2rem">
          <div>Total</div>
          <div>${getTotalCartValue(items)}</div>
          </Stack>

        </Box>}
    </>
  );
};

export default Cart;
