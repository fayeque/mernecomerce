import React,{useState,useEffect} from "react";
import { getProductsImage } from './apiCore';
const ShowImage = ({item,url}) => {
    const [picurl,setpicUrl] = useState("");
    const [errors,setErrors] = useState(false);
    const [loading,setLoading] = useState(true);
    const gerProducturl = (url,item) => {
        getProductsImage(url,item).then((data) => {
            console.log("dtaa",data);
            if(data.error){
                setErrors(data.error);
            }else{
                console.log(data.url);
                setpicUrl(data.url);
                setLoading(true);
            }
        })
    }
    useEffect(() => {
        console.log(item._id);
        gerProducturl(url,item);
    },[]);

    return (
    <div className="product-image">
    {loading && <img src={picurl} alt={item.name} className="mb-3" style={{"height":"200px"}} />}
        
    </div>
    );
}

export default ShowImage;