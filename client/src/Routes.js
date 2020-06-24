import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from "./core/Home";
import Signup from './user/Signup';
import Signin from './user/Signin';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Orders from './admin/Orders';
import Menu from "./core/Menu.js";
import Shop from "./core/Shop.js";
import Product from "./core/Product.js";
import Cart from "./core/Cart";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/shop" exact component={Shop} />
                <Route path="/cart" exact component={Cart} />
                <Route path="/product/:productId" exact component={Product} />
                <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
                <AdminRoute path="/admin/orders" exact component={Orders} />
                <AdminRoute path="/create/category" exact component={AddCategory} />
                <AdminRoute path="/create/product" exact component={AddProduct} />
            </Switch>
        </BrowserRouter>
    )
};

export default Routes;