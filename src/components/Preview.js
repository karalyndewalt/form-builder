import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';

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
    const { answers, handleChange } = this.props;

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
        return (userIn === question.conditionValue);
      case 'greater':
        return (userIn > question.conditionValue);
      case 'less':
        return (userIn < question.conditionValue);
      default:
        return null;
    }
  }


  render() {
    const { questions, answers } = this.props;

    return (

      <ul style={{ listStyle: 'none' }}>
        { questions.length === 0 ? null : questions.map(question => (
          <li key={question.id}>
            {this.getPreviewType(question)}
            {question.subInput.length ?
              <PreviewQuestions
                questions={this.displayNext(question, answers)}
                answers={answers}
                handleChange={this.props.handleChange}
              /> : null
                }
          </li>
        ))
        }
      </ul>
    );
  }
}


class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.flattenQuestions();
    this.handleChange = this.handleChange.bind(this);
  }


  flattenQuestions() {
    const { questions } = this.props.store.getState();
    let stack = [...questions];
    const answers = {};

    while (stack.length > 0) {
      const currentQuestion = stack.pop();
      // add question to ansers object
      answers[currentQuestion.id] = { userIn: '' };
      const { subInput } = currentQuestion;
      // add all subInput to the stack
      if (subInput.length) {
        stack = stack.concat(subInput);
      }
    }
    return answers;
  }


  handleChange(value, qid) {
    // console.log(value, qid)
    this.setState({ [qid]: { ...this.state[qid], userIn: value } });
  }


  render() {
    // console.log('Preview');
    // console.log(JSON.stringify(this.state));
    const { questions } = this.props.store.getState();
    return (
      <PreviewQuestions
        questions={questions}
        answers={this.state}
        handleChange={this.handleChange}
      />
    );
  }
}


export default Preview;
