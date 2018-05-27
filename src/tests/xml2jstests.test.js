// xml2jstests.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import TestUtils from 'react-dom/test-utils';
import { shallow, mount, render } from 'enzyme';

import { openExamplePlan, getCurrentPlanName, getCurrentPlanObject, getInitialPlanObject, deleteUserPlan } from '../lib/dataManager';
var xml2jstests = require("./../lib/xml2jstests");

describe('xml2jstests does XML/JS conversions', () => {

    it('test code does round trips from Object to Json to XML', () => {
        deleteUserPlan(); // initialize dataManager's local state
        openExamplePlan("Saving then retirement");
        const planObject = getCurrentPlanObject();
        const testResult = xml2jstests.testCurrentJS(planObject)

        // console.log("planObject= " + planObject.forecaster.persons.person[1].title);
        // console.log("testResult= " + testResult)

        expect(testResult).toEqual(true);
    });

})
