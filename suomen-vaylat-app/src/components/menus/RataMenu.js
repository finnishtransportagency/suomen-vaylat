import { Component } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class RataMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{marginLeft: '15px', marginRight: '15px'}}>
        <DropdownButton id="dropdown-basic-button" title="Rata">
            <Dropdown.Item href="#/action-1">Rata</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

export default RataMenu;