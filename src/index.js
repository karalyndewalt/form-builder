import React  from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers } from 'redux';
import { Form, FormGroup, FormControl, ControlLabel, Col,
        PageHeader,
        Button, ButtonToolbar,
        Well,
        Nav, NavItem, } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';


const update = (stateList, action, path, fn) => {
  // The path attribute acts as direct queue leading to the child.
  // for addding subInput path is to the parent, for everything else it is the
  // question object itself
  const [ head, ...tail ] = path;

  // using map give back the state as a list...
  // each state is either the top level state or a subInput (list),
  return stateList.map((question) => {
    // get all parents outside of my path (current head)
    // console.log(question)
    if (question.id !== head){
      return question;
    }
    // this is in the path. if we still have a tail, keep going but we need this question and its subInput
    else if (tail.length > 0 ) {
      return {
      ...question,
      subInput: update(question.subInput, action, tail, fn)
                              // ^^^copy my subInput//
      };
    }
    // length tail = 0 >>> then head IS my parent's id, add me to this
    // question's subInput.
    else {
      return fn(action, question);
    }
  })
  }

const updateSubInput = (action, question) => {
  const subId = qId++;
  return {
    ...question,
    subInput: [ ...question.subInput, {
      id: subId,
      text: action.text,
      answerType: action.answerType,
      condition: action.condition,
      path: [ ...action.parentPath, subId],
      subInput: [],
    }]
  };
}

const updateText = (action, question) => {
  return {
    ...question,
    text: action.text
  };
}

const updateType = (action, question) => {
  return {
    ...question,
    answerType: action.answerType
  };
}

const deleteQuestion = (stateList, id, pathTo) => {

  const [ head, ...tail ] = pathTo;

  return stateList.map( (question) => {

    if (question.id !== head) {
      return question;
    }

    else if (tail.length > 1) {
      return {
        ...question,
        subInput: deleteQuestion(question.subInput, id, tail)
      };
    }
    // tail length is one, this is the parent, can filter on id to delete
    else {
      return {
        ...question,
        subInput: question.subInput.filter( q =>  q.id !== tail[0]) //could use id instead of tail.
      };
    }
  })
}

// questions is the forms reducer for the Create 'page'.
let qId = 0;
const questions = (state = [], action) => {
  switch (action.type) {
    case "ADD_QUESTION":
      const id = qId++
      return [
        ...state, {
          id: id,
          text: action.text,
          answerType: action.answerType,
          condition: action.condition,
          path: [id],
          subInput: [],
        }
      ];

    case "ADD_SUB_Q":
      return update(state, action, action.parentPath, updateSubInput);

    case "DELETE_QUESTION":

      if (action.path.length === 1) {
        return state.filter(q => q.id !== action.id);
      }

      return deleteQuestion(state, action.id, action.path);

    case "CHANGE_TYPE":
      return update(state, action, action.path, updateType);

    case "CHANGE_TEXT":
      return update(state, action, action.path, updateText);

    case "CHANGE_COND_TYPE":
      return state; // FIXME

    case "CHANGE_COND_VAL":
      return state; // FIXME

    default:
      return state;
  }
};

// view will set the view based on the Nav selected
const view = (
  state = "CREATE",
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
    <FormGroup controlId={"condType-" + id} >
      <ControlLabel>Condition</ControlLabel>{' '}
        <FormControl
          componentClass="select"
          onChange={(evt) => {
            store.dispatch({
              type: "CHANGE_COND_TYPE",
              id: id,
              conditionType: evt.target.value,
            })
          }}
        >
          <option value="equal">Equals</option>
          <option value="greater">Greater than</option>
          <option value="less">Less than</option>
        </FormControl>
    </FormGroup>{" "}
    <FormGroup controlId={"condVal-" + id} >
      {/* set type using the action attribute from 'add subInput' */}
      <FormControl type="number" placeholder="value"
        onChange={(evt) => {
          store.dispatch({
            type: "CHANGE_COND_VAL",
            id: id,
            conditionValue: evt.target.value,
          })
        }}
      />
    </FormGroup>

  </Form>
)

const AnswerType = ({
  id,
  answerType,
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
        value={answerType}
      >
        <option value="">select</option>
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
    // bind handlers to 'this' here
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(evt, id) {
    store.dispatch({
      type: "CHANGE_TEXT",
      id: id,
      text: evt.target.value,
    });
  }

  render () {

  const { question,  onAnswerTypeChange } = this.props;
  // const onAnswerTypeChange = this.props.onAnswerTypeChange;

    return (
      <div>
          <Well bsSize="large">
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
                    // onChange={(id) => {this.handleTextChange(id)}}
                    onChange={(evt) => {
                      store.dispatch({
                          type: "CHANGE_TEXT",
                          id: question.id,
                          text: evt.target.value,
                          path: question.path,
                        });
                      }}
                    value={question.text}
                    placeholder="Enter question"
                  />
                </Col>
              </FormGroup>

              <AnswerType
                id={question.id}
                answerType={question.answerType}
                // pass question.answerType to the value in the FormControl
                onChange={ (value) => onAnswerTypeChange(question.id, value, question.path) }/>

              <ButtonToolbar>
                  <Button bsStyle="primary" bsSize="sm"
                    onClick={() => {
                      store.dispatch({
                        type: "ADD_SUB_Q",
                        parentPath: question.path,
                        condition:"equals",
                        text: "",
                        answerType: "text",
                      });
                    }}
                  >
                    Sub-Input
                  </Button>
                  {/*  TODO will need dispatch at some point */}
                  <Button bsStyle="danger" bsSize="sm"
                    onClick={ () => {
                      store.dispatch({
                        type: "DELETE_QUESTION",
                        path: question.path,
                        id: question.id,
                      })
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
    <ul style={{listStyle: 'none'}}>
      {questions.map(question =>
      <li key={question.id}>
        <Question
          question={question}
          onAnswerTypeChange={onAnswerTypeChange}/>
        {question.subInput ? <Questions
                                questions={question.subInput}
                                onAnswerTypeChange={onAnswerTypeChange} /> : null}
      </li>
      )}
    </ul>
);

class Create extends React.Component {

  render() {
    const questions = this.props.questions

    return (
    <div>
      <div>
        <Questions
          questions={questions}
          onAnswerTypeChange={ (id, answerType, path) => {
            store.dispatch({
              type: "CHANGE_TYPE",
              id,
              answerType,
              path
            })
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
              type: "ADD_QUESTION",
              text: "",
              answerType: "number", //could be "radio" or "number"
              condition:null,
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

const Export = ({
  store,
}) => (
  // <pre>{JSON.stringify(store.questions)}</pre>
  <Form>
    <FormGroup controlId="formControlsTextarea">
      <ControlLabel>JSON</ControlLabel>
      <FormControl componentClass="textarea" readOnly autoresize="true"
                  value={JSON.stringify(store.questions, null, '\t')}
      />
    </FormGroup>
  </Form>

)

class ViewNav extends React.Component {

  handleSelect(eventKey, event) {
    event.preventDefault();
    store.dispatch({
      type:"CHANGE_VIEW",
      filter:eventKey
    })
  }
  render () {
    return (
      <Nav bsStyle="tabs" onSelect={(k,evt) => this.handleSelect(k, evt)}>
        <NavItem eventKey="CREATE" href="/home">
          Create
        </NavItem>
        <NavItem eventKey="PREVIEW" title="Item">
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
    console.log(store.getState()); //TODO REMOVE ME EVENTUALLY
    // console.log(view);

    const questions = this.props.store.questions;
    const view = this.props.store.view;
    // const store = this.props.store; // I'm not working because of hoisting -- using the console as

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
          { view === "CREATE" ?  <Create questions={questions} /> : null}
          { view === "EXPORT" ?  <Export store={this.props.store} /> : null}
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
      store={store.getState()}
    // questions={store.getState().questions}
    // view={}
    />,
    document.getElementById('root'));
}

store.subscribe(render);
render();
