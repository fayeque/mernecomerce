const queryString = require("query-string");


export const getProducts = (sortBy) => {
    return fetch(`/api/products?sortBy=${sortBy}&order=desc&limit=6`,{
        method:'GET'
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    }
    )
}

export const getProductsImage = (url,item) => {
    return fetch(`/api/${url}/photo/${item._id}`,{
        method:'GET'
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    }
    )
}


export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit,
        skip,
        filters
    };
    return fetch(`/api/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const getCategories = () => {
    return fetch(`/api/categories`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const list = params => {
    const query = queryString.stringify(params);
    console.log("query", query);
    return fetch(`/api/products/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const read = productId => {
    return fetch(`/api/product/${productId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const listRelated = productId => {
    return fetch(`/api/products/related/${productId}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getBraintreeClientToken = (token) => {
    return fetch(`/api/braintree/getToken`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": `${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const processPayment = (token, paymentData) => {
    return fetch(`/api/braintree/payment`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": `${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const createOrder = (token, createOrderData) => {
    return fetch(`/api/order/create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": `${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};