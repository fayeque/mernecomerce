import React,{useState} from "react";
import {Link, Redirect} from "react-router-dom";
import Layout from "../core/Layout";
import {signin, isAuthenticated,authenticate} from "../auth";

const Signup = () => {

    const [formData,setFormData] = useState({
        email:"asmatjahan@gmail.com",
        password:"123456",
        error:"",
        errors:[],
        loading:false,
        redirectToRefree:false
    });

    var {name,email,password,loading,error,errors,redirectToRefree} = formData;
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        setFormData({...formData,error:false,[name]:event.target.value});
    } 

    const clickSubmit = (event) => {
        event.preventDefault();
        setFormData({ ...formData, error: false });
        // console.log(`name:${name}  email:${email} password:${password}`);
        signin({email,password}).then((data) => {
            if(data.errors && data.errors.length>0){
                console.log(data.errors);
                setFormData({...formData,error:true,errors:data.errors,loading:false});
                // console.log(errors);
            }else{
                authenticate(data, () => {
                    setFormData({...formData,redirectToRefree:true})
                })

            }
        })
    };




    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const showError = () => {
        if(error){
           return errors.map((err) => (
            <div className="alert alert-danger">{err.msg}</div>
           )
        )
    }
}

    const showLoading = () => {
        if(loading){
        return (<div className="alert alert-info">
            <h2>Loading...</h2>
        </div>)
        }
        }

    const redirectUser = () => {
        if(redirectToRefree){
            if(user && user.role===1){
                return <Redirect to="/admin/dashboard" />
            }else{
                return <Redirect to="/user/dashboard" />
            }

        }
        if(isAuthenticated()){
            return <Redirect to="/" />
        }

    }
    
    return (
        <Layout
        title="Signin"
        description="Signin to Node React E-commerce App"
        className="container col-md-8 offset-md-2" >
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signup;