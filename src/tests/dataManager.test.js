// dataManager.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import TestUtils from 'react-dom/test-utils';
import { shallow, mount, render } from 'enzyme';

import { openExamplePlan, getCurrentPlanName, getCurrentPlanObject, getInitialPlanObject, deleteUserPlan } from '../lib/dataManager';
var FOBJ = require('./../lib/fobj'); //gets the persistent global object of constants

describe('dataManager does XML to Plan object', () => {

    beforeEach(() => {
        deleteUserPlan(); // initialize dataManager's local state
    })

    it('reads the default plan name at start', () => {
        const defaultName = FOBJ.UNTITLED_FILE_NAME; //default for the file name field
        const currentplanname = getCurrentPlanName();
        expect(currentplanname).toEqual(defaultName);
    });

    it('reads input xml and produces an object', () => {
        openExamplePlan("Saving then retirement"); // will be done in the "Open" container
        expect(getInitialPlanObject()).not.toEqual(getCurrentPlanObject());
    });


    it('updates the store plan object', () => {
        let firstplan = openExamplePlan("immediate annuity"); // load a sample
        const firstPlanObject = getCurrentPlanObject()
        let newplan = openExamplePlan("Saving then retirement"); // load a second sample
        expect(newplan.tree).toEqual(getCurrentPlanObject());
    });


})