import Select from '../lib';
import assert from 'assert';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;

const statesData = [
  { label: 'Maryland', value: 'md' },
  { label: 'Virginia', value: 'va' },
  { label: 'Washington, DC', value: 'dc' }
];

const ageData = [
  { text: 'Morning', value: 'morning' },
  { text: 'Afternoon', value: 'afternoon' },
  { text: 'Night', value: 'night' },
  { text: 'All Day', value: 'allday' }
];

describe('Select component', () => {
  let renderedComponent;

  let createComponent = (dataset) => {
    let instance = TestUtils.renderIntoDocument(
      <Select value={'dc'} options={dataset} />
    );

    return instance;
  };

  before(() => {
    renderedComponent = TestUtils.renderIntoDocument(
      <Select value={'dc'} options={statesData} />
    );
  });

  it('Renders properly', () => {
    // console.log(renderedComponent);
    assert(renderedComponent);
  });

  it('Has properly selected default value', () => {
    assert(renderedComponent.state.selectedOption.value === 'dc');
  });

});