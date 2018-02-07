import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';


// hirerarchy:
// FormBuilderApp holds state for
  // CreateForm - allows user to add question, with conditions.
  // PreviewForm - renders actual form as defined in builder (lots of behaviors)
  // ExportForm - generic shows all state as JSON

// CreateForm will need individual componets or functions. Probably functions?
  // question
  // type - form with three options - 1. text, 2. number, 3. yes/no (radio)
  // condition - will use question and type
  // buttons - addcondition, delete, addQuestion

const questionStyle = {
  width: '50%',
  border: '1px solid gray',
  display: 'block',
};

function selectInputType () {
  return (

      <select>
        <option value='text'>Text</option>
        <option value='number'>Number</option>
        <option value='yes/no'>Yes/No</option>
      </select>

  )
}

class Question extends React.Component{

  render() {
    return(
      <div style={questionStyle} >
        <form>
          <p>
            <lable>Question:
              <input
                size='75'
                type='text'></input>
            </lable>
          </p>
          <p>
            <lable>Type:
              {selectInputType()}
            </lable>
          </p>
          <button type="button">
            Add Sub-Input
          </button>
          <button type="button">Delete</button>
        </form>

      </div>
    );
  }
}


ReactDOM.render(<Question />, document.getElementById('root'));


// model = {question: {type: text/number/yn , conditions: []}}
