import React,{useState} from "react";
import {Link} from "react-router-dom";
import Layout from "../core/Layout";
import {signUp} from "../auth";

const Signup = () => {

    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        errors:[],
        success:false
    });

    var {name,email,password,success,error,errors} = formData;
    const handleChange = name => event => {
        setFormData({...formData,error:false,[name]:event.target.value});
    } 

    const clickSubmit = (event) => {
        event.preventDefault();
        setFormData({ ...formData, error: false });
        console.log(`name:${name}  email:${email} password:${password}`);
        signUp({name,email,password}).then((data) => {
            if(data.errors && data.errors.length>0){
                console.log(data.errors);
                setFormData({...formData,error:true,errors:data.errors,success:false});
                // console.log(errors);
            }else{
                setFormData({
                    ...formData,
                    name:"",
                    email:"",
                    password:"",
                    error:"",
                    errors:[],
                    success:true
                })
            }
        })
    }    ;




    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

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

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    const showError = () => {
        if(error){
           return errors.map((err) => (
            <div className="alert alert-danger">{err.msg}</div>
           )
        )
        }
        // console.log(errors);
        // return errors.forEach((err) => {
        //    return  <div className="alert alert-danger">
        //         err.msg
        //     </div>
        
    }
    return (
        <Layout
        title="Signup"
        description="Signup to Node React E-commerce App"
        className="container col-md-8 offset-md-2">
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
    )
}

export default Signup;