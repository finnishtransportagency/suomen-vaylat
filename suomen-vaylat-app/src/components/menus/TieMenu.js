import React, { Component } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class TieMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{marginLeft: '15px', marginRight: '15px'}}>
        <DropdownButton id="dropdown-basic-button" title="Tie">
            <Dropdown.Item href="#/action-1">Tie</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

export default TieMenu;