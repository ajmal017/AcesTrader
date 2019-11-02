// TesterOptions/index.js

import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { loadLocalState, saveLocalState } from '../../lib/localStateStorage'
import defaultTesterState from '../../json/defaultTesterState.json'
import { ACESTESTERSTATE } from '../App'
import { setStaleCharts } from '../../lib/chartDataCache'
//
const Wrapper = styled.section`
  margin: 30px 30px 30px 30px;
  border: 1px solid blue;
  border-radius: 3px;
  overflow: auto;
  background-color: white;
`

const MainContent = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: [main-content] auto;
`
const RowContent = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
`
