import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Col,
  Button,
  ButtonToolbar,
  Well,
} from 'react-bootstrap';


class Condition extends React.Component {
  constructor(props) {
    super(props);

    this.handleCondTypeChange = this.handleCondTypeChange.bind(this);
    this.handleCondValChange = this.handleCondValChange.bind(this);
  }

  handleCondTypeChange(evt) {
    const { id, path, dispatch } = this.props;
    dispatch({
      type: 'CHANGE_COND_TYPE',
      id,
      conditionType: evt.target.value,
      path,
    });
  }

  handleCondValChange(evt) {
    const { id, path, dispatch } = this.props;
    dispatch({
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
    const { dispatch } = this.props.store;
    dispatch({
      type: 'CHANGE_TEXT',
      id,
      text: evt.target.value,
      path,
    });
  }

  render() {
    const { question, onAnswerTypeChange } = this.props;
    const { dispatch } = this.props.store;

    return (
      <div>
        <Well bsSize="large">
          {question.conditionType ?
            <Condition
              id={question.id}
              path={question.path}
              conditionType={question.conditionType}
              conditionValue={question.conditionValue}
              dispatch={dispatch}
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
                  dispatch({
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
                  dispatch({
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
  store,
}) => (
  <ul style={{ listStyle: 'none' }}>
    {questions.map(question => (
      <li key={question.id}>
        <Question
          question={question}
          store={store}
          onAnswerTypeChange={onAnswerTypeChange}
        />
        {question.subInput ?
          <Questions
            questions={question.subInput}
            store={store}
            onAnswerTypeChange={onAnswerTypeChange}
          /> : null}
      </li>
    ))}
  </ul>
);


class Create extends React.Component {
  render() {
    const { store } = this.props;
    const { dispatch } = store;
    const { questions } = store.getState();

    return (
      <div>
        <div>
          <Questions
            store={store}
            questions={questions}
            onAnswerTypeChange={(id, answerType, path) => {
              dispatch({
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
              dispatch({
                type: 'ADD_QUESTION',
                text: '',
                answerType: 'number', // could be "radio" or "text"
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


export default Create;
