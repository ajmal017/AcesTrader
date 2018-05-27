import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Appnav from "../Appnav";

describe ('Appnav', () => {
  
  it('renders a Snapshot without error', () => {
    const tree = renderer.create(
      <Appnav />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });  

});

