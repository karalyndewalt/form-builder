import React  from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers } from 'redux';
import { Form, FormGroup, FormControl, ControlLabel, Col,
        PageHeader,
        Button, ButtonToolbar,
        Well, } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';


// questions is the forms reducer on the Create 'page'.
let qId = 0;
const questions = (state = [], action) => {
  switch (action.type) {
    case "ADD_QUESTION":
      return [
        ...state, {
          id: qId++,
          text: action.text,
          answerType: action.answerType,
          condition: action.condition,
          // sub-input = [],
        }
      ]
    case "CHANGE_TYPE":
      return state.map(question => {
        if (question.id !== action.id) {
          return question;
        }

        return {
          ...question,
          answerType: action.answerType // FIXME
        }
      }
    )

    case "CHANGE_TEXT":
      return state.map(question => {
        if (question.id !== action.id) {
          return question;
        }

        return {
          ...question,
          text: action.text // FIXME
        }
      }
    )

//     case "DELETE_QUESTION":
//       // look for id to del, if ?  !id return q : not empty ....
    default:
      return state;
  }
};

// view will set the view based on the Nav selected
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

const Condition = ({
  id,

}) => (
  <Form inline >
    <FormGroup controlId={"condition-" + id} >
      <ControlLabel>Condition</ControlLabel>{' '}
        <FormControl
          componentClass="select"
          // inputRef={ref => { this.input = ref; }}
          // onChange={() => {
          //   store.dispatch({
          //     type: "CHANGE_TYPE",
          //     id: this.props.id,
          //     answerType: this.input.value, //**TODO** FIXME, needs selected option value **use event handler
          //   })
          // }}
        >
          <option value="equal">Equals</option>
          <option value="greater">Greater than</option>
          <option value="less">Less than</option>
        </FormControl>
    </FormGroup>{" "}
    <FormGroup controlId="formInlineName">
      <FormControl type="number" placeholder="value" />
    </FormGroup>

  </Form>
)

const AnswerType = ({
  // some props
  id,
  onChange,
}) => (
  <FormGroup controlId={"type-" + id}>
    <Col componentClass={ControlLabel} sm={2}>
      Type
    </Col>
    <Col componentClass={ControlLabel} sm={10} >
      <FormControl
        componentClass="select"
        onChange={(evt) => onChange(evt.target.value)}
        // value={this.}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="radio">Yes/No</option>
      </FormControl>
    </Col>
  </FormGroup>

);


const Question = ({
  // props
  question,
  onAnswerTypeChange,
}) => (
  <div>
      <Well bsSize="large">
        {/*TODO Add condition t/f to   */}
        {question.condition ? <Condition/> : null}
        <Form horizontal>
          <FormGroup
            controlId={"question-" + question.id}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Question
            </Col>
            <Col  componentClass={ControlLabel} sm={10}>
              <FormControl
                type="text"
                inputRef={ref => { this.input = ref; }}
                onChange=  {() => {
                    store.dispatch({
                      type:"CHANGE_TEXT",
                      id: question.id,
                      text:this.input.value,
                    });
                  }}
                // value={this.state.value}
                placeholder="Enter question"
              />
            </Col>
          </FormGroup>

          <AnswerType
            id={question.id}
            // pass question.answerType to the value in the FormControl
            onChange={ (value) => onAnswerTypeChange(question.id, value) }/>

          <ButtonToolbar>
              <Button bsStyle="primary" bsSize="sm" >
                Sub-Input
              </Button>
              {/*  TODO will need dispatch at some point */}
              <Button bsStyle="danger" bsSize="sm" >
                Delete
              </Button>
          </ButtonToolbar>
        </Form>
    </Well>
  </div>
);


const Questions = ({
  questions,
  onAnswerTypeChange,
}) => (
  <div>
    <ul style={{listStyle: 'none'}}>
      {questions.map(question =>
      <li key={question.id}>
        <Question
          question={question}
          onAnswerTypeChange={onAnswerTypeChange}/>
      </li>
      )}
    </ul>
  </div>
);

class FormBuilder extends React.Component {

  // use map to get each q from state and create each form
  // will have navs here
  render() {
    console.log(store.getState()); //TODO REMOVE ME EVENTUALLY
    const questions = this.props.questions

    return (
      <div>
        <div>
          <PageHeader>
            Form Builder 0.1
          </PageHeader>
        </div>

          <Questions
            questions={questions}
            onAnswerTypeChange={ (id, answerType) => {
              store.dispatch({
                type: "CHANGE_TYPE",
                id,
                answerType,
              })
            }}
          />

        <div>
          <Button
            bsStyle="primary"
            bsSize="large"
            active
            onClick={()=> {
              store.dispatch({
                type: "ADD_QUESTION",
                text: "newQuestion",
                answerType: "text",
                condition: null, //could be "radio" or "number"
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
    questions={store.getState().questions}
    />,
    document.getElementById('root'));
}

store.subscribe(render);
render();
