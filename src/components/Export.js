import React from 'react';
import { Well } from 'react-bootstrap';

const ExportJSON = ({ questions }) => (
  <Well bsSize="large">
    <p>{JSON.stringify(questions)}</p>
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

export default ExportJSON;
