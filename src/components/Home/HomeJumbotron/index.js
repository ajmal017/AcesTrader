import React, { Component } from 'react';
import logo from './../../../images/duck.svg';
import './styles.css';

class HeadJumbotron extends Component {
    render(){
        return (
            <div>
                <div id="featured" className="jumbotron home-row0 home-row0-background">
                    <div className="container text-center">
                        <h1><span className="duck-jumbotron">MoneyPlan</span></h1>
                        <h3><img id="duck-home" src={logo} alt="Logo" width="40"/><em><span className="duck-slogan">Get your financial ducks in a row.</span></em></h3>
                    </div>
                </div>
            </div>
        );
    }
}
export default HeadJumbotron;