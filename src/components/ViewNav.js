import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
// import { changeView } from '../actions';


class ViewNav extends React.Component {
  handleSelect(eventKey, event) {
    const { dispatch } = this.props;
    event.preventDefault();
    dispatch({
      type: 'CHANGE_VIEW',
      filter: eventKey,
    });
  }

  render() {
    return (
      <Nav
        bsStyle="tabs"
        onSelect={(eventKey, event) =>
          this.handleSelect(eventKey, event)}
      >
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


export default ViewNav;
