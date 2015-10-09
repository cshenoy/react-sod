/* eslint react/jsx-sort-prop-types: 0, react/sort-comp: 0, react/prop-types: 0 */
import React from 'react';
import { canUseDOM } from 'exenv';

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

  constructor(props) {
    super(props);
    this.state = this.getStateFromValue(this.props.value);
    this.state.isOpen = false;
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
    labelKey: React.PropTypes.string,
    value: React.PropTypes.any,
    valueKey: React.PropTypes.string
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
    labelKey: 'label',
    value: null,
    valueKey: 'value'
  }

  getStateFromValue(value) {
    var options = this.props.options;
    var focusedOption = options[0];
    
    if (!Array.isArray(value)) {
      if (typeof value === 'string') {
        value = value === '' ? [] : [ value ];
      } else {
        value = value !== undefined && value !== null ? [value] : [];
      }
    }
    var selectedOption = value.map((val) => {
      if (typeof val === 'string' || typeof val === 'number') {
        for (var key in options) {
          if (options.hasOwnProperty(key) &&
            options[key] &&
            (options[key][this.props.valueKey] === val ||
              typeof options[key][this.props.valueKey] === 'number' &&
              options[key][this.props.valueKey].toString() === val
            )) {
            return options[key];
          }
        }
        return {
          [this.props.valueKey]: val,
          [this.props.labelKey]: val
        };
      } else {
        return val;
      }
    });

    return {
      selectedOption: selectedOption[0],
      focusedOption: focusedOption
    };
  }

  selectOption(option) {
    
    // first fire change event
    this.fireChangeEvent(option);

    // then set as the new selected option
    // and close out the dropdown
    this.setState({
      selectedOption: option,
      isOpen: false
    });
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

  fireChangeEvent(newState) {
    if (newState[this.props.valueKey] !== this.state.selectedOption[this.props.valueKey] && this.props.onChange) {
      this.props.onChange(newState);
    }
  }

  populateSoD() {
    var options = this.props.options;

    var ops = options.map(function(op) {
      var focusedValue = this.state.focusedOption ? this.state.focusedOption[this.props.valueKey] : null;
      var defaultValue = this.state.selectedOption[this.props.valueKey] ? this.state.selectedOption[this.props.valueKey] : null;
      var isSelected = defaultValue === op[this.props.valueKey];
      var isFocused = focusedValue === op[this.props.valueKey];
      var optionClass = 'sod_option';
      if (isSelected) {
        optionClass += ' selected';
      }
      if (isFocused) {
        optionClass += ' active';
      }
      var mouseEnter = this.focusOption.bind(this, op);
      var mouseLeave = this.unfocusOption.bind(this, op);
      var mouseDown = this.selectOption.bind(this, op);
      var opKey = 'option-' + op[this.props.valueKey];
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

  handleKeyUse(event) {
    console.log('Key down: ', event.keyCode);
    switch (event.keyCode) {
      case 8:
        break;

      default:
        break;
    }
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
    if (this.state.selectedOption) {
      sodLabel = this.state.selectedOption[this.props.labelKey];
    }
    optionsWrapper = (<span className="sod_list_wrapper">
            <span className="sod_list">
              {this.populateSoD()}
            </span>
          </span>);

    return (
      <span className={sodClassName}
            id={customID}
            onClick={::this.triggerSoD}
            onMouseLeave={::this.closeSoD}
            onKeyDown={::this.handleKeyUse}
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
