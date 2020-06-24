import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search  = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });
    const [loading,setLoading] = useState('notloaded');

    const { categories, category, search, results, searched } = data;

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setData({ ...data, categories: data });
            }
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const searchData = () => {
        // console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setData({ ...data, results: response, searched: true });
                        setLoading("notloaded");
                    }
                }
            );
        }
    };

    const searchSubmit = e => {
        e.preventDefault();
        // console.log("loading",loading);
        setLoading("loading");
        searchData();
    };

    const handleChange = name => e => {
        // console.log("loading",loading);
        setData({...data,[name]:e.target.value});
    }

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} products`;
        }
        if (searched && results.length < 1) {
            return `No products found`;
        }
    };

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                
                    {results.map((product, i) => (
                        <div className="row">
                        <div className="col-lg-4 col-sm-12 col-xs-12 mb-3">
                            <Card key={i} product={product} />
                        </div>
                        </div>
                    ))}
                
            </div>
        );
    };


    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span style={{"background-color":"teal","color":"white"}} className="input-group-text">
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend">
                        <select
                            className="btn mr-1"
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                    />
                </div>
                <div
                    className="btn input-group-append"
                    style={{ border: "none" }}
                >
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>

    )

    return (
        <div>
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
        </div>
            <div className="container mb-3">
           {loading=="loading" ? <div style={{'margin-left':'200px',"color":"blue"}}><h4>Loading...</h4></div> : ""}
         {searchedProducts(results) }
            </div>
        </div>
    );
}

export default Search;