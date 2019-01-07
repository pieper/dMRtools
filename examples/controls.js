
function buildControls(id, options={}) {

  const commonSchemaDefinitions = {};

  commonSchemaDefinitions.stringArray = { type: "array", items: { type: "string" }};

  const schema = {
    definitions: commonSchemaDefinitions,
    title: "dMR Simulator",
    type: "object",
    properties: {
      title: {type: "string", title: "Title", default: "Untitled Form"},
      quality: {type: "boolean", title: "Is the data okay to use?", default: false, enumNames: ["Yes", "No"]},
      approved: {type: "boolean", title: "Approved", default: false},
      when: {type: "string", format: "date", title: "When did you look at it?"},
      value: {type: "number", minimum: 0, maximum: 100},
      score: {type: "number", enum: [10, 20, 30], enumNames: ["ten", "twenty", "thirty"]},
      comments: { "$ref": "#/definitions/stringArray", title: "Comments" },
      addAdditionalComments: { type: "boolean", title: "Add additional comments" },
    },
    required: ["title"],
    dependencies: { 
      "addAdditionalComments": {
        "properties": {
          "additionalComments": {"$ref": "#/definitions/stringArray", title: "Additional Comments"}
        }
      }
    },
  };

  const uiSchema = {
    "ui:order": ["title", "comments", "when", "*", "approved"],
    comments: {
      "ui:options": {
        orderable: true
      }
    },
    quality: {
      "ui:widget": "radio"
    },
    value: {
      "ui:widget": "range"
    },
  }

  const formData = {
    title: "Untitled",
    approved: false,
    when: "tbd",
    comments: [
      "one", "two", "and more"
    ]
  }

  const customValidation = (formData, errors) => {
    if (!formData.approved) {
      errors.approved.addError("Form must be approved to submit");
    }
    return errors;
  }

  const log = (type) => console.log.bind(console, type);
  const formElementProperties = {
    schema,
    uiSchema,
    formData,
    validate: customValidation,
    showErrorList: false,
    onChange: options.onChange,
    onSubmit: options.onSubmit,
    onError: options.onError,
  };

  const Form = JSONSchemaForm.default;
  const formElement = React.createElement(Form, formElementProperties);
  const controls = document.getElementById(id);

  ReactDOM.render(formElement, controls);
}

/*

    See also:

    the repo: https://github.com/mozilla-services/react-jsonschema-form

    tool to define form schemas: https://www.fourmilieres.net/#/ 
*/

