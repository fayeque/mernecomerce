import React,{useState,useEffect} from "react";
import Layout from "./Layout";
import {getProducts} from "./apiCore";
import Card from "./Card";
import Search from "./Search";


const Home = () => {
    const [productsByArrival,setProductsByArrival] = useState([]);
    const [productsBySell,setProductsBySell] = useState([]);
    const [loading,setLoading] = useState(true);
    const [errors,setErrors]=useState(false);

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if(data.error){
                setErrors(data.error);
            }else{
                setProductsBySell(data);
                setLoading(false);
            }
        })
    }

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if(data.error){
                setErrors(data.error);
            }else{
                setProductsByArrival(data);
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    },[]);

return (
    <Layout
    title="FullStack React Node MongoDB Ecommerce App"
    description="Node React E-commerce App"
    className="container-fluid"
>
    <Search />
    <h3 className="mb-4">New Arrivals</h3>
    <div className="row">
    {loading ? <div style={{'margin-left':'200px',"color":"blue"}}><h3>Loading...</h3></div> :
        productsByArrival.map((product, i) => (
            <div key={i} className="col-md-3 col-sm-6 col-xs-6 mb-3">
                <Card product={product} />
            </div>
        ))
    }
    </div>

    <h2 style={{"color":"green"}} className="mb-4">Best Sellers</h2>
    <div className="row">

      {loading ? <div style={{'margin-left':'200px',"color":"blue"}}><h3>Loading...</h3></div> :
      productsBySell.map((product, i) => (
            <div key={i} className="col-lg-3 col-sm-12 col-xs-12 mb-3">
                <Card product={product} />
            </div>
        ))
      }
    </div>
</Layout>
);
        }

export default Home;

