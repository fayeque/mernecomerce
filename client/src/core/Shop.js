import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import Search from "./Search";


const Shop = () => {
    const [categories,setCategories] = useState([]);
    const [prices,setPrice] = useState({
        min:0,
        max:0
    });
    // const [maxPrice,setMaxPrice] = useState(0);
    const [myFilters,setMyFilters] = useState({
        filters:{category:[],price:[]}
    });
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const {min,max} = prices;

    const loadFilteredResults = newFilters => {
        // console.log(newFilters);

        getFilteredProducts(0, limit, newFilters).then(data => {
            // console.log("setCategory",setCategories);
            if (data.error) {
                setError(data.error);
                console.log(data.error);
            } else {
                console.log(data);
                setFilteredResults(data.data);
                setSize(data.size);
                setSkip(0);
            }
        });
    };
    const handleChange = (e) => {
        console.log("price",prices);
        setPrice({...prices,[e.target.name]:e.target.value});
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        console.log("cddddd",myFilters.filters);
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults([...filteredResults, ...data.data]);
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    };




    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
            }

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log("categories data",data);
                setCategories(data);
            }
        });
    };
    useEffect(() => {
        init();
        loadFilteredResults(skip,limit,myFilters.filters);
    },[]);

    const onSubmit =(e) => {
        e.preventDefault();
        const newFil = {...myFilters};
        console.log("nweFil",newFil);
        console.log("myFilterss",myFilters);
        newFil.filters['price'].push(parseInt(prices.min));
        newFil.filters['price'].push(parseInt(prices.max));
        console.log("nweFil",newFil);
        console.log("myFilterss",myFilters);
        loadFilteredResults(myFilters.filters);
        // newFil.filters['price'].pop();
        // newFil.filters['price'].pop();
        console.log("54545454545",myFilters);
        setMyFilters(newFil);
    }

    const handleFilters = (filters,filterBy) => {
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;
        console.log(newFilters);
        loadFilteredResults(newFilters.filters);
        
        setMyFilters(newFilters);
    }

    return (
        <Layout
        title="Shop Page"
        description="Search and find books of your choice"
        className="container-fluid"
    >
        <div className="row">
            <div className="col-lg-4 col-sm-12 col-xs-12">
                <h4>Filter by categories</h4>
                <ul>
                    <Checkbox
                        categories={categories}
                        handleFilters={filters =>
                            handleFilters(filters, "category")
                        }
                    />
                </ul>
                 <h4>Filter by price range</h4>
            <form onSubmit= {(e) => onSubmit(e)}>
                 <input
                onChange={(e) => handleChange(e)}
                name="min"
                value={min}
                type="text"
                placeholder="From"
                className="form-control"
            />
            <input
                onChange={(e) => handleChange(e)}
                name="max"
                value={max}
                type="text"
                placeholder="To"
                className="mt-4 form-control"
            />
            <input type="submit" className="mt-4 btn btn-primary" />
            </form>
         
            </div>
            <div className="col-lg-8 col-sm-12 col-xs-12">
                <h2 className="mb-4">Products</h2>
                <div className="row">
                    {filteredResults.map((product, i) => (
                        
                        <div key={i} className="col-md-4 col-sm-6 col-xs-6 mb-3">
                            <Card product={product} />
                        </div>
                    ))}
                </div>
                <hr />
                {loadMoreButton()} 
           </div>
            </div>
    </Layout>
);

}

export default Shop;