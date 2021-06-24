import styled, { keyframes } from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import LayerList from './LayerList';
import { ListGroup } from 'react-bootstrap';

//VÄLIAIKAINEN PALIKKA VÄLITTÄMÄÄN TESTIDATAA HIERARKISELLE TASOVALIKOLLE

var groups = [{"name":"Hanke- ja suunnitelmakohteet","layers":[301],"groups":[{"name":"Käynnissä olevat hankkeet","layers":[301,300,133,134,34],"id":133,"parentId":34},{"name":"Toteutukseen tähtäävät suunnitelmakohteet","layers":[265,298,299],"id":135,"parentId":34}],"id":34,"parentId":-1},{"name":"Ratatiedot","layers":[100],"groups":[{"name":"Geotekniset kohteet","layers":[331,332],"id":136,"parentId":2},{"name":"Hallinnollinen tieto","layers":[101],"id":137,"parentId":2},{"name":"Yleiset","layers":[166],"id":139,"parentId":2},{"name":"Päällysrakenteet","layers":[601,397,398,400,401,403,402],"groups":[{"name":"Sijaintiraide","layers":[404,405,621],"id":166,"parentId":141}],"id":141,"parentId":2},{"name":"Rataverkon palvelut","layers":[414,415],"id":142,"parentId":2},{"name":"Suomen rataverkkoaineisto","layers":[100],"id":144,"parentId":2},{"name":"Sähkörata","layers":[622,623,624,625,626,627,628,629,630,631,632,633,634,635,636],"id":145,"parentId":2},{"name":"Tasoristeystiedot","layers":[419,420,67,421],"id":146,"parentId":2},{"name":"Turvalaitteet","layers":[637,638],"id":147,"parentId":2},{"name":"Hanke- ja suunnitelmakohteet","layers":[133,265],"id":148,"parentId":2}],"id":2,"parentId":-1},{"name":"Taustakartat","layers":[3],"id":1,"parentId":-1}];

var layers = [{"id":3,"opacity":100,"visible":true,"name":"NLS FI Taustakartta"},{"id":134,"opacity":100,"visible":false,"name":"Vesiväylähankkeet"},{"id":299,"opacity":100,"visible":false,"name":"Vesiväyläsuunnitelmat"},{"id":300,"opacity":100,"visible":false,"name":"Päällystystyöt"},{"id":133,"opacity":100,"visible":false,"name":"Ratahankkeet"},{"id":34,"opacity":100,"visible":false,"name":"Tiehankkeet"},{"id":265,"opacity":100,"visible":false,"name":"Ratasuunnitelmat"},{"id":298,"opacity":100,"visible":false,"name":"Tiesuunnitelmat"},{"id":331,"opacity":100,"visible":false,"name":"Pehmeiköt"},{"id":332,"opacity":100,"visible":false,"name":"Routaeristeet"},{"id":101,"opacity":100,"visible":false,"name":"Rautatieliikennepaikat"},{"id":404,"opacity":100,"visible":false,"name":"Kauko-ohjaus"},{"id":405,"opacity":100,"visible":false,"name":"Radio-ohjaus"},{"id":621,"opacity":100,"visible":false,"name":"Suojastusjärjestelmä"},{"id":397,"opacity":100,"visible":false,"name":"Kiskotus (oikea)"},{"id":398,"opacity":100,"visible":false,"name":"Kiskotus (vasen)"},{"id":601,"opacity":100,"visible":false,"name":"Puskin"},{"id":400,"opacity":100,"visible":false,"name":"Pölkytys"},{"id":401,"opacity":100,"visible":false,"name":"Radan merkki"},{"id":402,"opacity":100,"visible":false,"name":"Suurin nopeus"},{"id":403,"opacity":100,"visible":false,"name":"Tukikerros"},{"id":415,"opacity":100,"visible":false,"name":"Matkustajalaiturin osa"},{"id":414,"opacity":100,"visible":false,"name":"Matkustajalaiturit"},{"id":100,"opacity":100,"visible":false,"name":"Rataverkko"},{"id":636,"opacity":100,"visible":false,"name":"110 kV syöttöjohto"},{"id":622,"opacity":100,"visible":false,"name":"Ajolanka"},{"id":623,"opacity":100,"visible":false,"name":"Erotusjakso"},{"id":624,"opacity":100,"visible":false,"name":"Erotusmuuntaja"},{"id":625,"opacity":100,"visible":false,"name":"Imumuuntaja"},{"id":626,"opacity":100,"visible":false,"name":"Kannatin"},{"id":627,"opacity":100,"visible":false,"name":"Kääntöorsi"},{"id":628,"opacity":100,"visible":false,"name":"Maadoitus"},{"id":629,"opacity":100,"visible":false,"name":"Ratajohdon erotin ja ohjain"},{"id":630,"opacity":100,"visible":false,"name":"Ryhmityseristin"},{"id":631,"opacity":100,"visible":false,"name":"Syöttöasema"},{"id":632,"opacity":100,"visible":false,"name":"Sähköratapylväs"},{"id":633,"opacity":100,"visible":false,"name":"Säästömuuntaja"},{"id":634,"opacity":100,"visible":false,"name":"Vaununlämmitysasema"},{"id":635,"opacity":100,"visible":false,"name":"Välikytkinasema"},{"id":419,"opacity":100,"visible":false,"name":"Kansi (tasoristeys)"},{"id":420,"opacity":100,"visible":false,"name":"Merkki (tasoristeys)"},{"id":67,"opacity":100,"visible":false,"name":"Tasoristeys"},{"id":421,"opacity":100,"visible":false,"name":"Varoituslaitos (tasoristeys)"},{"id":637,"opacity":100,"visible":false,"name":"Baliisiryhmä"},{"id":638,"opacity":100,"visible":false,"name":"Raide-eristys"},{"id":166,"opacity":100,"visible":false,"name":"Ratatiedot layergroup"},{"id":301,"opacity":100,"visible":false,"name":"Kevyen liikenteen päällystystyöt"}]


const StyledLayerList = styled.div`
  width: 300px;
  position: absolute;
  top: 6%;
  left: 0px;
  z-index: 10;
  height: calc(100% - 6%);
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
  }
`;


export const LayerListTEMP = () => {

  const allGroups = useAppSelector((state) => state.rpc.allGroups);
  const allLayers = useAppSelector((state) => state.rpc.allLayers);

    return (
      <StyledLayerList>
        {/* <div style={{position: "absolute",margin: "15px",width: "300px",zIndex: "10"}}> */}
        <LayerList groups={allGroups} layers={allLayers} recurse={false} />
        {/* </div> */}
      </StyledLayerList>
      );
};


export default LayerListTEMP;