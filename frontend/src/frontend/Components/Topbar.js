import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function Topbar() {
  let url = "http://localhost:3000/";

  const navigate = useNavigate();
  const user_token = localStorage.getItem("user_token");
  const user_id = localStorage.getItem("user_id");
  const user_name = localStorage.getItem("user_name");
  const [items, setProductsearch] = useState([]);
  const [data, setData] = useState([]);
  const [searchElement, setSearchElement] = useState("");

  useEffect(() => {
    getProductlist();
  }, []);

  useEffect(() => {
    console.log(data);
    let filteredArray = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchElement.toLowerCase())
    );
    console.log(filteredArray);
    setProductsearch(filteredArray);
  }, [searchElement]);

  async function getProductlist() {
    try {
      const response_products = await axios.get(
        "http://localhost:3001/Catalog/listProduct"
      );

      response_products.data.length > 0 && setData(response_products.data);
    } catch (error) {}
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.

    console.log("string", results);

    setSearchElement(string);
  };

  const handleOnHover = (result) => {
    // the item hovered
    //console.log(result)
  };

  const handleOnSelect = (item) => {
    // the item selected
    //console.log(item)
    navigate("/Productdetail/" + item.id);
  };

  const handleOnFocus = () => {
    // console.log('Focused')
  };
  const removeDuplicateObjectFromArray = (array, key) => {
    var check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };
  const formatResult = (item) => {
    return (
      <>
        <a
          href={`/Productdetail/${item._id}`}
          style={{ display: "block", textAlign: "left" }}
        >
          {item.product_name}
        </a>
        ;
      </>
    );
  };

  console.log(items);
  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    navigate("/");
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row bg-secondary py-1 px-xl-5">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="d-inline-flex align-items-center h-100">
              {/*   <a href={url} className="text-body mr-3">About</a>
                    <a href={url} className="text-body mr-3" >Contact</a>
                    <a href={url} className="text-body mr-3" >Help</a>
                    <a href={url} className="text-body mr-3" >FAQs</a>
             */}
            </div>
          </div>
          <div className="col-lg-6 text-center text-lg-right">
            <div className="d-inline-flex align-items-center">
              {user_token ? (
                <Link className="text-body mr-3">
                  <b>Welcome {user_name}</b>
                </Link>
              ) : (
                ""
              )}
              {user_token ? (
                <Link to={`/Myaccount/${user_id}`} className="text-body mr-3">
                  My account
                </Link>
              ) : (
                ""
              )}
              {user_token ? (
                ""
              ) : (
                <Link to="/Register">
                  <a className="text-body mr-3">Register</a>
                </Link>
              )}
              {user_token ? (
                ""
              ) : (
                <Link to="/Login">
                  <a className="text-body mr-3">Login</a>
                </Link>
              )}
              {user_token ? (
                <Link onClick={handleLogout}>
                  <a className="text-body mr-3">Logout</a>
                </Link>
              ) : (
                ""
              )}
              {/* <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">My Account</button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" type="button">Sign in</button>
                            <button className="dropdown-item" type="button">Sign up</button>
                        </div>
                    </div>
                   <div className="btn-group mx-2">
                        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">USD</button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" type="button">EUR</button>
                            <button className="dropdown-item" type="button">GBP</button>
                            <button className="dropdown-item" type="button">CAD</button>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">EN</button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" type="button">FR</button>
                            <button className="dropdown-item" type="button">AR</button>
                            <button className="dropdown-item" type="button">RU</button>
                        </div>
                    </div>*/}
            </div>
            <div className="d-inline-flex align-items-center d-block d-lg-none">
              <a href={url} className="btn px-0 ml-2">
                <i className="fas fa-heart text-dark"></i>
                <span
                  className="badge text-dark border border-dark rounded-circle"
                  style={{ paddingBottom: "2px" }}
                >
                  0
                </span>
              </a>
              <a href={url} className="btn px-0 ml-2">
                <i className="fas fa-shopping-cart text-dark"></i>
                <span
                  className="badge text-dark border border-dark rounded-circle"
                  style={{ paddingBottom: "2px" }}
                >
                  0
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
          <div className="col-lg-4">
            <a href={url} className="text-decoration-none">
              <span className="h1 text-uppercase text-primary bg-dark px-2">
                Item
              </span>
              <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">
                Catalogue
              </span>
            </a>
          </div>
          <div className="col-lg-4 col-6 text-left">
            <form action="">
              <div className="input-group">
                <div style={{ width: 400 }}>
                  <ReactSearchAutocomplete
                    className="form-control"
                    placeholder="Search for products"
                    items={items}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    autoFocus
                    formatResult={formatResult(items)}
                  />
                </div>
                <div className="input-group-append">
                  <span className="input-group-text bg-transparent text-primary">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-4 col-6 text-right">
            <p className="m-0">Customer Service</p>
            <h5 className="m-0">+012 345 6789</h5>
          </div>
        </div>
      </div>
    </>
  );
}
export default Topbar;
