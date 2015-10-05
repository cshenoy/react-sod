/* eslint react/jsx-sort-prop-types: 0, react/sort-comp: 0, react/prop-types: 0 */
import React from 'react';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

class Option extends React.Component {

  displayName = 'Option'

  static propTypes = {
    click: React.PropTypes.func,
    mouseEnter: React.PropTypes.func,
    mouseLeave: React.PropTypes.func
  }

  render() {
    return (
      <span className={this.props.className}
            onClick={this.props.click}
            onMouseEnter={this.props.mouseEnter}
            onMouseLeave={this.props.mouseLeave}>
        {this.props.option.text}
      </span>
    );
  }

}


export default class Select extends React.Component {

  constructor() {
    super();
    console.log('OMG');
    this.setState(this.getStateFromValue(this.props.value));
  }

  displayName = 'Select'

  static propTypes = {
    customID: React.PropTypes.string,
    customClass: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    placeholderOption: React.PropTypes.bool,
    prefix: React.PropTypes.string,
    cycle: React.PropTypes.bool,
    stripEmpty: React.PropTypes.bool,
    links: React.PropTypes.bool,
    linksExternal: React.PropTypes.bool,
    size: React.PropTypes.number,
    tabIndex: React.PropTypes.number,
    onChange: React.PropTypes.func,
    options: React.PropTypes.array,
    value: React.PropTypes.any
  }

  state = {
    isOpen: false,
    options: this.props.options
  }

  static defaultProps = {
    customID: null,      // String  - '' by default - Adds an ID to the SoD
    customClass: '',        // String  - '' by default - Adds a class to the SoD
    placeholder: null,      // String  - '' by default - Adds a placeholder that will be shown before a selection has been made
    placeholderOption: false,     // Boolean - false by default - Same as above, but it uses the first option in the <select> as a placeholder (and hides it from the list)
    prefix: null,      // String  - '' by default - Adds a prefix that always will be shown before the selected value
    cycle: false,     // Boolean  - false by default - Should keyboard cycle through options or not?
    stripEmpty: false,     // Boolean  - false by default - Should empty <option>'s be stripped from the <select>
    links: false,     // Boolean  - false by default - Should the options be treated as links?
    linksExternal: false,     // Boolean  - false by default - Should the options be treated as links and open in a new window/tab?
    size: 0,         // Integer  - 0 by default - The value set equals the amount of items before scroll is needed
    tabIndex: 0,         // integer  - 0 by default
    onChange: function() {},     // Adds a callback function for when the SoD gets changed
    options: null,
    value: null
  }

  componentWillMount() {
    console.log('Mount: ', this.getStateFromValue(this.props.value));
  }

  getStateFromValue(value) {
    var options = this.props.options;
    var focusedOption = options[0];
    var value = options[0]['value'];

    return {
      focusedOption: focusedOption
    };
  }

  selectValue(option) {
    var value = option['value'];
    this.setState({
      value: value
    }, this.closeSoD());
  }

  focusOption(option) {
    this.setState({
      focusedOption: option
    });
  }

  unfocusOption(op) {
    if (this.state.focusedOption === op) {
      this.setState({
        focusedOption: null
      });
    }
  }

  populateSoD() {
    var options = this.props.options;

    var ops = options.map(function(op) {
      // var op = options[key];
      var focusedValue = this.state.focusedOption ? this.state.focusedOption['value'] : null;
      var defaultValue = this.state.value ? this.state.value : null;
      var isSelected = defaultValue === op['value'];
      var isFocused = focusedValue === op['value'];
      var optionClass = 'sod_option';
      if (isSelected) {
        optionClass += ' selected';
      }
      if (isFocused) {
        optionClass += ' active';
      }
      var mouseEnter = this.focusOption.bind(this, op);
      var mouseLeave = this.unfocusOption.bind(this, op);
      var mouseDown = this.selectValue.bind(this, op);
      var opKey = 'option-' + op['value'];
      return (
        <Option key={opKey}
                className={optionClass}
                mouseEnter={mouseEnter}
                mouseLeave={mouseLeave}
                click={mouseDown}
                option={op}
        />
      );
    }, this);

    return ops;
  }

  closeSoD() {
    this.setState({ isOpen: false });
  }

  triggerSoD(event) {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    var settingsCycle = this.props.cycle;
    var prefix = this.props.prefix;
    var customID = this.props.customID;
    var sodPrefix = null;
    var optionsWrapper;
    var sodLabel;

    // If there's a prefix defined
    if (prefix) {
      sodPrefix = <span className="sod_prefix">{prefix}</span>;
    }

    var sodClassName = 'sod_select';

    if (this.state.isOpen) {
      sodClassName += ' focus open';
    }
    if (this.state.value) {
      sodLabel = this.state.value;
    }
    optionsWrapper = (<span className="sod_list_wrapper">
            <span className="sod_list">
              {this.populateSoD()}
            </span>
          </span>);
    // console.log('Options: ', this.props.options);
    // var clickSelect = this.triggerSoD.bind(this);
    return (
      <span className={sodClassName}
            id={customID}
            onClick={this.triggerSoD}
            onMouseLeave={this.closeSoD}
            >
        <span className="sod_label">
          {sodPrefix}
          {sodLabel}
        </span>
        {optionsWrapper}
      </span>
    );
  }

}
