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


const addSubQuestion = (stateList, action, subId, pathToParent) => {
  console.log(pathToParent);

  const [ head, ...tail ] = pathToParent;

  console.log("head is: " + head)
  console.log("tail is: " + tail)
  // using map give back the state as a list...
  // each state passed through is either the top level state or the subInput,
  // which is also a list.
  return stateList.map((question) => {
    // get all parents outside of my path (current head)
    console.log(question)
    if (question.id !== head){
      console.log("Question: " + question.id + ". Not part of path, skipping.")
      return question;
    }
    // this is a parent in the path. if we still have a tail, keep going but we need this question and its subInput
    else if (tail.length > 0 ) {
      console.log("Checking sub of question: " + question.id)
      return {
      ...question,
      subInput: addSubQuestion(question.subInput, action, subId, tail)
                              // ^^^copy my subInput//
      };
    }
    // base case length tail = 0 >>> then head IS my parent's id, add me to this
    // questions subInput.
    else {
      console.log("returning updated question ")
      return {
        ...question,
        subInput: [ ...question.subInput, {
          id: subId,
          text: action.text,
          answerType: action.answerType,
          condition: action.condition,
          path:[ ...action.parentPath, subId],
          subInput: [],
        }]
      };
    }
  })
  }

const deleteQuestion = (stateList, id, pathTo) => {

  const [ head, ...tail ] = pathTo;

  return stateList.map( (question) => {
    console.log(question)

    if (question.id !== head) {
      return question;
    }

    else if (tail.length > 1) {
      return {
        ...question,
        subInput: deleteQuestion(question.subInput, id, tail)
      };
    }
    // tail length is one, I am at parent and I can filter for the one to delete
    // from my subInput attribute
    else {
      return {
        ...question,
        subInput: question.subInput.filter( q =>  q.id !== tail[0]) //could use id instead of tail.
      };
    }
  })
}

// questions is the forms reducer on the Create 'page'.
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

    case "ADD_SUB_Q": // FIXME NEEDS TO BE RECURSIVE.
    // The path attribute of each question functions like a pre made and direct
    // queue leading to the child.
      console.log(action)
      const subId = qId++;
      // return state.map(question => {
      //   if (question.id !== action.parentPath[0]){
      //     return question;
      //   }
      //   return {
      //     ...question,
      //     subInput: [...question.subInput, {
      //       id: subId,
      //       text: action.text,
      //       answerType: action.answerType,
      //       condition: action.condition,
      //       path:[...action.parentPath, subId],
      //       subInput: []
      //     }]
      //   }
      // })

      return addSubQuestion(state, action, subId, action.parentPath);

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
    );

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

    case "DELETE_QUESTION":

      if (action.path.length === 1) {
        return state.filter(q => q.id !== action.id);
      }

      return deleteQuestion(state, action.id, action.path);

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
  // constructor(props) {
  //   super(props);
    // bind handlers to 'this' here
    // this.handleTextChange = this.handleTextChange.bind(this);
  // }

  // handleTextChange(evt, id) {
  //   store.dispatch({
  //     type: "CHANGE_TEXT",
  //     id: id,
  //     text: evt.target.value,
  //   });
  // }

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
                onChange={ (value) => onAnswerTypeChange(question.id, value) }/>

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
          onAnswerTypeChange={ (id, answerType) => {
            store.dispatch({
              type: "CHANGE_TYPE",
              id,
              answerType,
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
      <FormControl componentClass="textarea" autoresize
                  value={JSON.stringify(store.questions)}
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
