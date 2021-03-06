import React, { Component } from "react";
import PropTypes from "prop-types";
//import "./formFields.css";
import "./previewFields.css";
import BoolField from "../inputTypes/BoolField";

class FormField extends Component {
  constructor(props) {
    super(props);
    this.updateFormField = this.updateFormField.bind(this);
    this.state = {
      answer: ""
    };
  }

  updateFormField(e, answer) {
    answer = answer || false;
    if (answer) {
      this.setState({ answer });
    }
    // get the current state of the field
    const formField = Object.assign({}, this.state.formField);

    // find out which input is changing in the field
    const inputName = e.target.id.split("_")[0];

    // Update the input in our state clone
    formField[inputName] = e.target.value;

    // update component state so the field functions as expected
    this.setState({ formField });
    this.forceUpdate();
  }

  /**
   * Render the subfields recursively
   */
  renderSubFields() {
    const field = this.props.field;

    // only render if we have subfields;
    if (!field.subFields) {
      return;
    }

    // Only render the subFields we want, based on condition matching
    let subFields = [];
    subFields = field.subFields.map((currSubField, index) => {
      currSubField.key = field.key + "_subField" + index;
      /**
       * Apply show/hide styles based on answer
       */
      let showField = false;

      if (
        this.state.answer.length === 0 &&
        currSubField.conditionValue.length > 0
      ) {
        return false;
      }

      // Check to see if the answer qualifies for this subField
      switch (currSubField.condition) {
        case "Equals":
          if (
            this.state.answer.toString() ===
            currSubField.conditionValue.toString()
          ) {
            showField = true;
          }
          break;
        case "Greater Than":
          if (
            parseInt(this.state.answer, 10) >
            parseInt(currSubField.conditionValue, 10)
          ) {
            showField = true;
          }
          break;
        case "Less Than":
          if (
            parseInt(this.state.answer, 10) <
            parseInt(currSubField.conditionValue, 10)
          ) {
            showField = true;
          }
          break;
        default:
          showField = false;
      }

      if (showField === true) {
        return <FormField field={currSubField} key={currSubField.key} />;
      } else {
        return false;
      }
    });
    return subFields;
  }

  render() {
    let field = this.props.field;
    return (
      <div className="formSection">
        <div className="formField">
          <div className="question">
            <label htmlFor={field.key + "_input"}>{field.question}</label>
            {// if bool, load radios. if not, load input
            field.type === "bool" ? (
              <BoolField
                field={field}
                mode="display"
                updateFormField={this.updateFormField}
              />
            ) : (
              <input
                id={field.key + "_input"}
                type="text"
                onChange={e => this.setState({ answer: e.target.value })}
              />
            )}
          </div>
        </div>
        {this.renderSubFields()}
      </div>
    );
  }
}

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  styles: PropTypes.object
};

export default FormField;
