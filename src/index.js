import React  from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers } from 'redux';
import { FormGroup, FormControl, ControlLabel,
        PageHeader,
        Button, ButtonToolbar, } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';


// questions is the forms reducer.
const questions = (state = [], action) => {
  switch (action.type) {
    case "ADD_QUESTION":
      return [
        ...state, {
          id: action.id,
          text: action.text,
          answerType: action.answerType,
          // sub-input = {},
        }
      ]
//     case "DELETE_QUESTION":
//       // look for id to del, if ?  !id return q : not empty ....
    default:
      return state;
//
  }
};

// visibilityFilter will set the view based on the Nav selected
const view = (
  state = "CREATE_FORMS",
  action
) => {
    switch (action.type) {
      case "CHANGE_VIEW":
        return action.filter;
      default:
        return state;
    }
  };


const formBuilder = combineReducers({
  questions,
  view,
});

// the store holds state for the form-builder application, questions is the reducer
const store = createStore(formBuilder);


//////////// REACT COMPONENTS ///////////////
class Question extends React.Component {

  render () {
    // console.log(store.getState());
    return (

      <div>
        <form>
          {/*  To inline lable with input field -->
            https://react-bootstrap.github.io/components/forms/#forms-horizontal*/}
          <FormGroup
            controlId="question" //make controlId unique **TODO**
          >
              <ControlLabel>Question</ControlLabel>
              <FormControl
                type="text"
                // onChange will update the value by dispatch  **TODO**
                // value={this.state.value}
                placeholder="Enter question"
                // onChange={this.handleChange} **TODO**
              />
            </FormGroup>
            <FormGroup controlId="type">
            <ControlLabel>Type</ControlLabel>
            <FormControl
              componentClass="select"
              placeholder="select"
              // onChange   **TODO**
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="radio">Yes/No</option>
            </FormControl>
            </FormGroup>

            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="sm" >
                Sub-Input
              </Button>
              <Button bsStyle="danger" bsSize="sm" >
                Delete
              </Button>
            </ButtonToolbar>

        </form>
      </div>
    )
  }
}

let qId = 0;
class FormBuilder extends React.Component {

  // use map to get each q from state and create each form
  // will have navs here
  render() {
    console.log(store.getState());
    return (
      <div>
        <div>
        <PageHeader>
          Form Builder 0.1
        </PageHeader>
        </div>

        <ul>
          {this.props.questions.map(qu =>
          <li key={qu.id}>
            <Question/>
          </li>
          )}
        </ul>

        <div>
        <Button
          bsStyle="primary"
          bsSize="large"
          active
          onClick={()=> {
            store.dispatch({
              type: "ADD_QUESTION",
              id: qId++,
              text: "newQuestion",
              answerType: "text" //could be "radio" or "number"
            })
          }}
          >
          Add Input
        </Button>
        </div>

      </div>
    );
  }
}

/////////// END REACT COMPONENTS///////////////


// define a render function that can be subscribed, and will be reacalled after
// any update to the store's state.
const render = () => {
  ReactDOM.render(
    <FormBuilder
    questions={store.getState().questions}/>,
    document.getElementById('root'));
}

store.subscribe(render);
render();
