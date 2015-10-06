import Select from '../lib';
import assert from 'assert';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;

describe('Select component', () => {
  let renderedComponent;

  before(() => {
    const states = [
      { label: 'Maryland', value: 'md' },
      { label: 'Virginia', value: 'va' },
      { label: 'Washington, DC', value: 'dc' }
    ];

    renderedComponent = TestUtils.renderIntoDocument(
      <Select value={'dc'} options={states} />
    );
  });

  it('Something', () => {
    console.log(renderedComponent);
    assert('a' === 'a');
  });

});