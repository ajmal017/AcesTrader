// AddPseudoBar/index.js

import React, { Component } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import iexData from '../../iex.json'
import { getSymbolData } from '../../lib/appGetSymbolData'
import WelcomeTrader from '../Welcome/WelcomeTrader'

const AddPseudoBar = () => {
    alert("AddPseudoBar")

    // Use the useEffect hook to perform this side effect
    useEffect(() => {
        // loadChartData(symbol, range, closeOnly, useSandbox, true) // note: useCache===true
        // loadChartData(symbol, range, closeOnly, useSandbox, false) // note: useCache===false
    })


    return <WelcomeTrader /> // return to start screen
}



export default AddPseudoBar
