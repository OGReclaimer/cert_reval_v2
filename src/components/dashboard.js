import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../index"
import * as actions from "../actions"

import { 
    USER_OBJECT
 } from "../actions/types"

import IntroScreen from "./intro"
import Loader from "./loader"

// MOCK UP COMPONENT

class Dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            selected: "home",
        }

        this.handleClickHome = this.handleClickHome.bind(this)
        this.handleClickCerts = this.handleClickCerts.bind(this)
        this.handleClickAddCert = this.handleClickAddCert.bind(this)
    }

    componentDidMount() {
         // Only run fetchdata if the dashboard is in loading state AND data hasn't been previously saved to redux state
         console.log(this.props.user.loaded)
         if (this.state.loading === true && this.props.user.loaded === false) {
            this.fetchData()
            return ( <Loader/> )  
        }
    }


    render() {
        if(this.props.intro === true) {
            return(<IntroScreen/>)
        }
        else if (this.props.user.loaded === true) {  
            // REF \/
            let user = this.props.user.instance
            console.log(this.state.selected)
            console.log(this.props.state)
            return (
                <div className="dashboard">
                    <div className="dashboard__header clearfix">
                        <div className="dashboard__header__profile-box">
                            {user.firstname} {user.lastname}   
                        </div>
                        <div className="dashboard__header__links-box">
                            <ul className="header__links-list">
                                <Link to="/" className="header__link">Home</Link>
                                <Link to="/signout" className="header__link">Sign Out</Link>
                            </ul>
                        </div>
                    </div>
                    <div className="side-menu">
                        <div className="side-menu__logo-box">
                            <img className="side-menu__logo" src="img/logo-white.png"/>
                        </div>
                        <div className="side-menu__links-container">
                            <ul className="side-menu__links-list">
                                <li className="side-menu__link"><button onClick={this.handleClickHome} className="side-menu__link--button"> Home </button></li>
                                <li className="side-menu__link"><button onClick={this.handleClickCerts} className="side-menu__link--button"> Certificates </button></li>
                                <li className="side-menu__link"><button onClick={this.handleClickAddCert} className="side-menu__link--button"> Add Certificate </button> </li>
                            </ul>
                        </div>


                    </div>
                    <div className="dashboard__content-container">
                        {this.renderContent()}
                    </div>
                </div>
            )
        }
        else {
            return (<Loader />)
            
    } 

    }

    renderContent() {
        if(this.state.selected === "home") {
            return (
                <h1 className="heading-primary"> HOME </h1>
            )
        }
        if(this.state.selected === "certificates") {
            this.fetchCerts()
            return (
                <div style={{textAlign: "center"}}>
                    <h1 className="heading-primary"> CERTIFICATES </h1>
                <div className="certificate-container">
                    yo
                </div>
                </div>
            )
        }
        if(this.state.selected === "add-certificate") {
            return (
                <h1 className="heading-primary"> ADD CERTIFICATE </h1>
            )
        }
    }

    fetchCerts() {

        let uid = this.props.user.uid

        db.collection("users").doc(uid).collection("certificates")
        .get()
        .then(function(certs){
            certs.forEach(function(cert){
                console.log( cert.data() )
            })
        })
        .catch(function(error) {
            console.log("Error getting certificates: ", error);
        });


    }
    
    fetchData() {
        
        let uid = this.props.user.uid

        // USER QUERY
        db.collection("users").doc(uid).get()
        .then(doc => {
                let userObject = doc.data()
                // Save data to redux state
                this.props.saveToState(userObject)
                this.props.userLoaded()
                this.setState({ loading: false})
        })
        .catch(function(error){
            console.log("Error fetching data, ", error)
        })
    }

    handleClickHome() {
        this.setState({ selected: "home" })
    }
    handleClickCerts() {
        this.setState({ selected: "certificates"})
    }
    handleClickAddCert() {
        this.setState({ selected: "add-certificate"})
    }
}

function mapStateToProps(state) {
    return {
        intro: state.intro.intro,
        user: state.user,
        state: state   
    }
}

export default connect(mapStateToProps, actions)(Dashboard)


