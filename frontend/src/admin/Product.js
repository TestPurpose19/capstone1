import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DefaultEditor } from 'react-simple-wysiwyg';


function Product(){
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }

   let formValues={
    brand_id:"",
    product_name: "",
    error:{
      brand_id:"",
      product_name: "",
       }
  }

  const [formData,setFormdata]=useState(formValues); 
  const [userdata,setUserdata]=useState([]);
  const [brandList,setBranddata]=useState([]);
  const [loading, setLoading] = useState(true);
  const [html_editor, setHtml] = useState('');
  const [html_editor1, setHtml1] = useState('');
  
  const handleChange =(e)=>{
    let error= { ...formValues.error };
    if(e.target.value === ""){
      error[e.target.name]=`${e.target.placeholder} is required`;
    }else{
      error[e.target.name]=""; 
    }
    setFormdata({...formData, [e.target.name]:e.target.value, error});
  }
  const handleSubmit= async (e)=>{
    e.preventDefault();
  
    const errorkeys=Object.keys(formData).filter((key)=>{
      if(formData[key] === "" && key!='error'){
        return key;
      }
    });
    if(errorkeys.length>0){
      toast('pls fill all the fields');
    }else{
      setLoading(true);
      try {

       const response=await axios.post("http://localhost:3001/Catalog/createProduct",{"product_details":{
        brand_id:formData.brand_id,
        product_name: formData.product_name,
        product_description: html_editor1, 
        product_specification: html_editor,
      }
      });
     
      setFormdata(formValues);
      setHtml(''); setHtml1('');
      toast(response.data.msg);    
      
      listDatas();
    
    }catch(error){
  
    }
    setLoading(false);
    } 
  }
  function onChangeeditor(e) {
    setHtml(e.target.value);
  }
  function onChangeeditor1(e) {
    setHtml1(e.target.value);
  }
   useEffect(() => {

        async function getData(){
          setLoading(true);
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listProduct");
            setUserdata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }

        async function getBrand(){
          setLoading(true);
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listBrand");
            setBranddata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }
         getBrand(); getData();//call user data when loading the file
        },[]);
        
      const listDatas= async function getData(){
        setLoading(true);
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listProduct");
          setUserdata(response.data); 
         
          }catch(error){
          }
          setLoading(false);
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Productedit/${id}`); }else{  }
      };
    
      async function onDeleteData(id){
        setLoading(true);
        try {
        const response = await axios.delete(`http://localhost:3001/Catalog/deleteProduct/${id}`);
        toast(response.data.msg);    
        listDatas();
        }catch(error){
    
        }
        setLoading(false);
      }  
     
        
    return (
        <>
        <Navbaradmin/>
        <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Create product</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                       <div className="control-group">
                        <label for="category_name">Brand name</label>
                        <select className="form-control"  name="brand_id" id="brand_id" value={formData.brand_id}  onChange={(e) => handleChange(e)} >
                        <option value=''>Select Brand</option>  
                        { brandList.length > 0 && brandList.map((brand_item) => (
                        <option value={brand_item._id}>{brand_item.brand_name}</option>  
                        ))
                        }  
                       </select> 
                       <span style={{color:"red"}}> {formData.error.brand_id}</span>
                       <p className="help-block text-danger"></p>
                       </div>         
                       <div className="control-group">
                       <label for="product_name">Product name</label>
                            <input className="form-control" id="product_name" name="product_name" type="text" value={formData.product_name}  onChange={(e) => handleChange(e)}  placeholder="product name" required/>
                            <span style={{color:"red"}}> {formData.error.product_name}</span>
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                        <label for="product_name">Product highlights</label>
                           <DefaultEditor value={html_editor1} onChange={onChangeeditor1} />
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                        <label for="product_name">Product overview</label>
                           <DefaultEditor value={html_editor} onChange={onChangeeditor} />
                            <p className="help-block text-danger"></p>
                        </div>
                       
                        <div>
                        <button className="btn btn-primary btn-lg" type="submit">Save</button>
                            
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-lg-5 mb-5">
             
            </div>
        </div>
    </div>
    <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">List product</span></h2>
        <div className="row px-xl-5">
        {loading && <div className='loading'>Loading</div>}
    {!loading && (
         
  <table className="table table-bordered bg-light" id="dataTable" style={{width:"100%",cellSpacing:"0"}}>  
   <thead>
     <tr>
       <th>Name</th>
       <th>Action</th>
       </tr>
       </thead> 
       <tbody>   
       {userdata ? (
         userdata.map((row) => (   
       <tr key={row._id}>
       <td>{row.product_name}</td>
       <td>
          <button className="btn btn-primary btn-sm" style={{margin:"2px"}}  onClick={(e)=>handleProceed(row._id,1)}><i className="fas fa-edit"></i></button>&nbsp;<br/>
          <button className="btn btn-primary btn-sm" style={{margin:"2px"}} onClick={()=>onDeleteData(row._id)}><i className="fas fa-trash"></i></button>
       </td>
       </tr>
     )))
     :" Loading..." }
     </tbody>
    </table>
    )}
        </div>
     </div>   
       <Footeradmin/>
   
    </>
    );
}

export default Product;