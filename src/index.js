
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { questions, view } from '/Users/kara/Documents/react/form-builder/src/reducers';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  PageHeader,
  Button,
  ButtonToolbar,
  Well,
  Nav, NavItem,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';

import './index.css';

/* eslint react/prop-types: 0 */
/* eslint react/jsx-filename-extension: 0 */
/* eslint react/no-multi-comp: 0 */
// /* eslint import/no-unresolved: 0 */
// /* eslint import/extensions: 0 */

// // ********* Helper Functions *********
//
// const update = (stateList, action, path, fn) => {
//   console.log(stateList, action, path)
//   // The path attribute acts as direct queue leading to the child.
//   // for addding subInput path is to the parent, for everything else it is the
//   // question object itself
//   const [head, ...tail] = path;
//
//   // using map give back the state as a list...
//   // each state is either the top level state or a subInput (list),
//   return stateList.map((question) => {
//     // get all parents outside of my path (current head)
//     if (question.id !== head) {
//       return question;
//       // Still in the path. If we have a tail- continue, keeping this question and its subInput
//     } else if (tail.length > 0) {
//       return {
//         ...question,
//         subInput: update(question.subInput, action, tail, fn),
//       };
//     }// length tail = 0 >>> then head id the id we are seeking.
//     // Update the question using the provided function
//     return fn(action, question);
//   });
// };
//
// const updateSubInput = (action, question) => {
//   const subId = qId;
//   qId += 1;
//   return {
//     ...question,
//     subInput: [...question.subInput, {
//       id: subId,
//       text: action.text,
//       answerType: action.answerType,
//       conditionType: action.conditionType,
//       conditionValue: action.conditionValue,
//       path: [...action.parentPath, subId],
//       subInput: [],
//     },
//     ],
//   };
// };
//
// const updateText = (action, question) => ({
//   ...question,
//   text: action.text,
// });
//
// const updateType = (action, question) => ({
//   ...question,
//   answerType: action.answerType,
// });
//
// const updateCondType = (action, question) => ({
//   ...question,
//   conditionType: action.conditionType,
// });
//
// const updateCondVal = (action, question) => ({
//   ...question,
//   conditionValue: action.conditionValue,
// });
//
// const deleteQuestion = (stateList, id, pathTo) => {
//   const [head, ...tail] = pathTo;
//
//   return stateList.map((question) => {
//     if (question.id !== head) {
//       return question;
//     } else if (tail.length > 1) {
//       return {
//         ...question,
//         subInput: deleteQuestion(question.subInput, id, tail),
//       };
//     }
//     return { // tail length is one, this is the parent, can filter on id to delete
//       ...question,
//       subInput: question.subInput.filter(q => q.id !== tail[0]),
//       // could use id instead of tail.
//     };
//   });
// };
//
// // ************* REDUCERS *************
// // questions is the forms reducer for  Create .
// let qId = 0;
// const questions = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_QUESTION': {
//       const id = qId;
//       qId += 1;
//       return [
//         ...state, {
//           id,
//           text: action.text,
//           answerType: action.answerType,
//           conditionType: action.conditionType,
//           path: [id],
//           subInput: [],
//         },
//       ];
//     }
//
//     case 'ADD_SUB_Q':
//       return update(state, action, action.parentPath, updateSubInput);
//
//     case 'DELETE_QUESTION':
//
//       if (action.path.length === 1) {
//         return state.filter(q => q.id !== action.id);
//       }
//
//       return deleteQuestion(state, action.id, action.path);
//
//     case 'CHANGE_TYPE':
//       return update(state, action, action.path, updateType);
//
//     case 'CHANGE_TEXT':
//       return update(state, action, action.path, updateText);
//
//     case 'CHANGE_COND_TYPE':
//       return update(state, action, action.path, updateCondType);
//
//     case 'CHANGE_COND_VAL':
//       return update(state, action, action.path, updateCondVal);
//
//     default:
//       return state;
//   }
// };
//
// // view will set the view based on the Nav selected
// const view = (
//   state = 'CREATE',
//   action,
// ) => {
//   switch (action.type) {
//     case 'CHANGE_VIEW':
//       return action.filter;
//     default:
//       return state;
//   }
// };


const formBuilder = combineReducers({
  questions,
  view,
});

// the store holds state for the form-builder application,
// questions and view are reducers
const store = createStore(formBuilder);


// *************  REACT COMPONENTS *************

class Condition extends React.Component {
  constructor(props) {
    super(props);

    this.handleCondTypeChange = this.handleCondTypeChange.bind(this);
    this.handleCondValChange = this.handleCondValChange.bind(this);
  }

  handleCondTypeChange(evt) {
    const { id, path } = this.props;
    store.dispatch({
      type: 'CHANGE_COND_TYPE',
      id,
      conditionType: evt.target.value,
      path,
    });
  }

  handleCondValChange(evt) {
    const { id, path } = this.props;
    store.dispatch({
      type: 'CHANGE_COND_VAL',
      id,
      conditionValue: evt.target.value,
      path,
    });
  }

  render() {
    const {
      id, conditionType, conditionValue,
    } = this.props;

    return (
      <Form inline >
        <FormGroup controlId={`condType-${id}`} >
          <ControlLabel>Condition</ControlLabel>{' '}
          <FormControl
            componentClass="select"
            value={conditionType}
            onChange={this.handleCondTypeChange}
          >
            <option value="equal">Equals</option>
            <option value="greater">Greater than</option>
            <option value="less">Less than</option>
          </FormControl>
        </FormGroup>{' '}
        <FormGroup controlId={`condVal-${id}`} >
          <FormControl
            // could use conditionType to control this type. only 'equals'
            // allows text, all others numbers
            // could cause weirdness around equals val being number when previewing later...
            type="text"
            placeholder="conditional value"
            onChange={this.handleCondValChange}
            value={conditionValue}
          />
        </FormGroup>
      </Form>
    );
  }
}

const AnswerType = ({
  id,
  answerType,
  onChange,
}) => (
  <FormGroup controlId={`type-${id}`}>
    <Col componentClass={ControlLabel} sm={2}>
      Type
    </Col>
    <Col componentClass={ControlLabel} sm={10} >
      <FormControl
        componentClass="select"
        onChange={evt => onChange(evt.target.value)}
        value={answerType}
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="radio">Yes/No</option>
      </FormControl>
    </Col>
  </FormGroup>
);


class Question extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(evt) {
    const { id, path } = this.props.question;
    store.dispatch({
      type: 'CHANGE_TEXT',
      id,
      text: evt.target.value,
      path,
    });
  }

  render() {
    const { question, onAnswerTypeChange } = this.props;

    return (
      <div>
        <Well bsSize="large">
          {question.conditionType ?
            <Condition
              id={question.id}
              path={question.path}
              conditionType={question.conditionType}
              conditionValue={question.conditionValue}
            /> : null
          }
          <Form horizontal>
            <FormGroup
              controlId={`question-${question.id}`}
            >
              <Col componentClass={ControlLabel} sm={2}>
                Question
              </Col>
              <Col componentClass={ControlLabel} sm={10}>
                <FormControl
                  type="text"
                  onChange={this.handleTextChange}
                  value={question.text}
                  placeholder="Enter question"
                />
              </Col>
            </FormGroup>

            <AnswerType
              id={question.id}
              answerType={question.answerType}
              onChange={value => onAnswerTypeChange(question.id, value, question.path)}
            />

            <ButtonToolbar>
              <Button
                bsStyle="primary"
                bsSize="sm"
                onClick={() => {
                  store.dispatch({
                    type: 'ADD_SUB_Q',
                    parentPath: question.path,
                    conditionType: 'equal',
                    conditionValue: '',
                    text: '',
                    answerType: 'text',
                  });
                }}
              >
              Sub-Input
              </Button>
              <Button
                bsStyle="danger"
                bsSize="sm"
                onClick={() => {
                  store.dispatch({
                    type: 'DELETE_QUESTION',
                    path: question.path,
                    id: question.id,
                  });
                }}
              >
                  Delete
              </Button>
            </ButtonToolbar>
          </Form>
        </Well>
      </div>
    );
  }
}


const Questions = ({
  questions,
  onAnswerTypeChange,
}) => (
  <ul style={{ listStyle: 'none' }}>
    {questions.map(question => (
      <li key={question.id}>
        <Question
          question={question}
          onAnswerTypeChange={onAnswerTypeChange}
        />
        {question.subInput ?
          <Questions
            questions={question.subInput}
            onAnswerTypeChange={onAnswerTypeChange}
          /> : null}
      </li>
    )
  )}
  </ul>
);


class Create extends React.Component {

  render() {
    const { questions } = this.props;

    return (
      <div>
        <div>
          <Questions
            questions={questions}
            onAnswerTypeChange={ (id, answerType, path) => {
              store.dispatch({
                type: 'CHANGE_TYPE',
                id,
                answerType,
                path,
              });
            }}
          />
        </div>

        <div>
          <Button
            bsStyle="primary"
            bsSize="large"
            active
            onClick={() => {
              store.dispatch({
                type: 'ADD_QUESTION',
                text: '',
                answerType: 'number', //could be "radio" or "text"
                conditionType: null,
                });
                }}
          >
            Add Input
          </Button>
        </div>
      </div>
    );
  }
}


const RadioPreview = ({
  question,
  handleChange,
}) => (

  <Form>
    <FormGroup controlId={`question-${question.id}`}>
      <ControlLabel>{question.text}</ControlLabel>
      <br></br>
      <ToggleButtonGroup
        type="radio"
        name={`q-${question.id}`}
        onClick={evt => handleChange(evt.target.value, question.id)}
      >
        <ToggleButton name={`q-${question.id}`} value="yes">Yes</ToggleButton>
        <ToggleButton name={`q-${question.id}`} value="no">No</ToggleButton>
      </ToggleButtonGroup>
    </FormGroup>
  </Form>

);


const TNPreview = ({
  question,
  handleChange,
  answers,
}) => (
  <Form>
    <FormGroup controlId={`question-${question.id}`}>
      <ControlLabel>{question.text}</ControlLabel>{' '}
      <FormControl
        type={question.answerType}
        placeholder={`Enter ${question.answerType}`}
        value={answers[question.id].userIn}
        onChange={evt => handleChange(evt.target.value, question.id)}
      />
    </FormGroup>
  </Form>
);


class PreviewQuestions extends React.Component {
  // returns a list of subInput to be rendered when user answers match condition set in form

  getPreviewType = (question) => {
    const { questions, answers, handleChange } = this.props;

    return (question.answerType === 'radio') ?
      <RadioPreview
        question={question}
        handleChange={handleChange}
        answers={answers}
      /> :
      <TNPreview
        question={question}
        handleChange={handleChange}
        answers={answers}
      />;
  }

  displayNext = (question, answers) => {
    const { userIn } = answers[question.id];
    // const userIn = answers[question.id].userIn;
    const newQs = question.subInput.filter(q => (this.checkAnsVal(q, userIn)));
    return newQs;
  }

  checkAnsVal = (question, userIn) => {
    switch (question.conditionType) {
      case 'equal':
        return (userIn === question.conditionValue)
      case 'greater':
        return (userIn > question.conditionValue)
      case 'less':
        return (userIn < question.conditionValue)
  }}


  render() {
    const { questions, answers } = this.props;

    return (

      <ul style={{ listStyle: 'none' }}>
        { questions.length === 0 ? null : questions.map(question =>
          <li key={question.id}>
            {this.getPreviewType(question)}
            {question.subInput.length  ?
              <PreviewQuestions
                  questions={this.displayNext(question, answers)}
                  answers={this.props.answers}
                  handleChange={this.props.handleChange}
                /> : null
                }
          </li>
        )}
      </ul>
    );
  }
}


class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.flattenQuestions(props.store.questions);
    this.handleChange = this.handleChange.bind(this);
    // this.updateAnswers = this.updateAnswers.bind(this)
  }


   flattenQuestions(questions)  {

    let stack = [...questions];
    let answers = {};

    while (stack.length > 0) {
      const currentQuestion = stack.pop();
      // add question to ansers object
      answers[currentQuestion.id] = {userIn: ""};
      const subInput = currentQuestion.subInput;
      // add all subInput to the stack
      if (subInput.length) {
        stack = stack.concat(subInput)
      }
      if (stack.length === 0) {
        return answers;
      }
    }
  }


  handleChange(value, qid) {
    // console.log(value, qid)
    this.setState({ [qid]: { ...this.state[qid], userIn: value } });
  }


  render() {
    // console.log('Preview');
    // console.log(JSON.stringify(this.state));
    return (
      <PreviewQuestions
        questions={this.props.store.questions}
        answers={this.state}
        handleChange={this.handleChange}
        // updateAnswers={this.updateAnswers}
      />
    );
  }
}


const Export = ({
  store,
}) => (
  <Well bsSize="large">
    <p>{JSON.stringify(store.questions)}</p>
  </Well>
);
// alternative form version for EXPORT,
// <Form>
//   <FormGroup controlId="formControlsTextarea">
//     <ControlLabel>JSON</ControlLabel>
//     <FormControl bsSize="lg" componentClass="textarea" readOnly autoresize="true"
//                 value={JSON.stringify(store.questions, null, '\t')}
//     />
//   </FormGroup>
// </Form>


class ViewNav extends React.Component {

  handleSelect(eventKey, event) {
    event.preventDefault();
    store.dispatch({
      type:"CHANGE_VIEW",
      filter:eventKey,
    });
  }

  render() {
    return (
      <Nav bsStyle="tabs" onSelect={(k,evt) => this.handleSelect(k, evt)}>
        <NavItem eventKey="CREATE" >
          Create
        </NavItem>
        <NavItem eventKey="PREVIEW">
          Preview
        </NavItem>
        <NavItem eventKey="EXPORT" >
          Export
        </NavItem>
      </Nav>
    );
  }
}


class FormBuilder extends React.Component {

  render() {
    console.log(store.getState()); //FIXME REMOVE ME EVENTUALLY

    const questions = this.props.store.questions;
    const view = this.props.store.view;

    return (
      <div>
        <div>
          <PageHeader>
            Form Builder 0.1
          </PageHeader>
        </div>
        <div>
        <ViewNav />
        </div>
        <div>
          {/* FIXME */}
          { view === "CREATE" ?  <Create questions={questions} /> : null}
          { view === "EXPORT" ?  <Export store={this.props.store} /> : null}
          { view === "PREVIEW" ?  <Preview store={this.props.store} /> : null}
        </div>
      </div>
    );
  }
}


// ***************** END REACT COMPONENTS *****************

// define a render function that can be subscribed, and will be reacalled after
// any update to the store's state.
const render = () => {
  ReactDOM.render(
    <FormBuilder
      store={store.getState()}
    // questions={store.getState().questions}
    // view={}
    />,
    document.getElementById('root'));
};

store.subscribe(render);
render();
