// ********* Helper Functions *********

const update = (stateList, action, path, fn) => {
  console.log(stateList, action, path)
  // The path attribute acts as direct queue leading to the child.
  // for addding subInput path is to the parent, for everything else it is the
  // question object itself
  const [head, ...tail] = path;

  // using map give back the state as a list...
  // each state is either the top level state or a subInput (list),
  return stateList.map((question) => {
    // get all parents outside of my path (current head)
    if (question.id !== head) {
      return question;
      // Still in the path. If we have a tail- continue, keeping this question and its subInput
    } else if (tail.length > 0) {
      return {
        ...question,
        subInput: update(question.subInput, action, tail, fn),
      };
    }// length tail = 0 >>> then head id the id we are seeking.
    // Update the question using the provided function
    return fn(action, question);
  });
};

const updateSubInput = (action, question) => {
  const subId = qId;
  qId += 1;
  return {
    ...question,
    subInput: [...question.subInput, {
      id: subId,
      text: action.text,
      answerType: action.answerType,
      conditionType: action.conditionType,
      conditionValue: action.conditionValue,
      path: [...action.parentPath, subId],
      subInput: [],
    },
    ],
  };
};

const updateText = (action, question) => ({
  ...question,
  text: action.text,
});

const updateType = (action, question) => ({
  ...question,
  answerType: action.answerType,
});

const updateCondType = (action, question) => ({
  ...question,
  conditionType: action.conditionType,
});

const updateCondVal = (action, question) => ({
  ...question,
  conditionValue: action.conditionValue,
});

const deleteQuestion = (stateList, id, pathTo) => {
  const [head, ...tail] = pathTo;

  return stateList.map((question) => {
    if (question.id !== head) {
      return question;
    } else if (tail.length > 1) {
      return {
        ...question,
        subInput: deleteQuestion(question.subInput, id, tail),
      };
    }
    return { // tail length is one, this is the parent, can filter on id to delete
      ...question,
      subInput: question.subInput.filter(q => q.id !== tail[0]),
      // could use id instead of tail.
    };
  });
};

// ************* REDUCERS *************
// questions is the forms reducer for  Create .
let qId = 0;
const questions = (state = [], action) => {
  switch (action.type) {
    case 'ADD_QUESTION': {
      const id = qId;
      qId += 1;
      return [
        ...state, {
          id,
          text: action.text,
          answerType: action.answerType,
          conditionType: action.conditionType,
          path: [id],
          subInput: [],
        },
      ];
    }

    case 'ADD_SUB_Q':
      return update(state, action, action.parentPath, updateSubInput);

    case 'DELETE_QUESTION':

      if (action.path.length === 1) {
        return state.filter(q => q.id !== action.id);
      }

      return deleteQuestion(state, action.id, action.path);

    case 'CHANGE_TYPE':
      return update(state, action, action.path, updateType);

    case 'CHANGE_TEXT':
      return update(state, action, action.path, updateText);

    case 'CHANGE_COND_TYPE':
      return update(state, action, action.path, updateCondType);

    case 'CHANGE_COND_VAL':
      return update(state, action, action.path, updateCondVal);

    default:
      return state;
  }
};

// view will set the view based on the Nav selected
const view = (
  state = 'CREATE',
  action,
) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return action.filter;
    default:
      return state;
  }
};

export { questions, view };
// export default (view, questions);
// export default ;
