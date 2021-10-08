import  { Component } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class MainMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{marginRight: '15px'}}>
        <DropdownButton id="dropdown-basic-button" title="Aineistot">
            <Dropdown.Item href="#/action-1">Väylätiedot</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Hankkeet</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Ympäristö</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Kunnossapito</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Raportit</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}

export default MainMenu;