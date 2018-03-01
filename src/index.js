import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { PageHeader } from 'react-bootstrap';

import rootReducer from './reducers';
import ExportJSON from './components/Export';
import Create from './components/Create';
import ViewNav from './components/ViewNav';
import Preview from './components/Preview';
import './index.css';


// the store holds state for the form-builder application,
// questions and view are reducers


// *************  REACT COMPONENTS *************


class FormBuilder extends React.Component {
  render() {
    const { store } = this.props;
    const { dispatch } = store;
    const { view, questions } = store.getState();
    // const { questions } =
    console.log(store.getState()); // FIXME REMOVE ME EVENTUALLY

    return (
      <div>
        <div>
          <PageHeader>
            Form Builder 0.1
          </PageHeader>
        </div>
        <div>
          <ViewNav dispatch={dispatch} />
        </div>
        <div>
          {/* FIXME */}
          { view === 'CREATE' ? <Create store={store} /> : null}
          { view === 'EXPORT' ? <ExportJSON questions={questions} /> : null}
          { view === 'PREVIEW' ? <Preview store={store} /> : null}
        </div>
      </div>
    );
  }
}

const store = createStore(rootReducer);
// ***************** END REACT COMPONENTS *****************

// define a render function that can be subscribed, and will be reacalled after
// any update to the store's state.
const render = () => {
  ReactDOM.render(
    <FormBuilder
      store={store}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
