/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import CenterSpinner from '../center-spinner/CenterSpinner';
import OskariRPC from 'oskari-rpc';
import './PublishedMap.scss';
import idGenerator from '../../utils/idGenerator';
import MarkerHandler from './handlers/MarkerHandler';
import GroupsHandler from './handlers/GroupsHandler';

interface IPublishedMapProps {
    lang?: string
  }

interface IPublishedMapState {
    loading?: boolean,
    markers: object[],
    maplayerGroups: object[]
}

interface Group {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    groups: Array<Group>,
    id: number,
    layers: Array<number>,
    name: string,
    parentId: number
}

class PublishedMap extends Component<IPublishedMapProps, IPublishedMapState> {
    mapRef: any;
    synchronizer: any;

    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            loading: true,
            markers: [],
            maplayerGroups: []
        }
        this.mapRef = React.createRef();
    }

    componentDidMount() {
        const iframe = document.getElementById('sv-iframe');
        this.synchronizer = OskariRPC.synchronizerFactory(
          OskariRPC.connect(iframe, process.env.REACT_APP_PUBLISHED_MAP_DOMAIN),
          [
            // FIXME Example handlers, remove these on future
            new MarkerHandler(this.handleMapClick),
            new GroupsHandler(this.groupsGetted)
          ]
        );
        this.synchronizer.synchronize(this.state);
    }

    shouldComponentUpdate(nextProps: Readonly<IPublishedMapProps>, nextState: Readonly<IPublishedMapState>) {
        this.synchronizer.synchronize(nextState);
        if (nextState.loading !== this.state.loading) {
            return true;
        }
        return false; // no need to update DOM ever
    }

    componentWillUnmount() {
        this.synchronizer.destroy();
    }

    hideSpinner = () => {
        this.setState({
          loading: false
        });
    };

    // ***********************************************************************
    // RPC handler functions
    // ***********************************************************************
    // FIXME Example mapclick, remove on future
    handleMapClick = ({lon, lat}: {
        lon:number,
        lat:number
    }) => {
        this.setState((state, props) => {
          const location = {
            lon,
            lat,
            id: idGenerator(),
            selected: false
          }
          const updatedLocations = state.markers.slice();
          updatedLocations.push(location);
          return {
            markers: updatedLocations
          }
        });
    };

    // TODO Groups getted, save them to map state
    groupsGetted = (groups:Array<Group>) => {
        this.setState({
            maplayerGroups: groups
        });

        // Remove this on future
        // Get recursive group names to string array
        const getNames = (parent:string, groups:Array<Group>) => {
            let names: Array<string> = [];
            groups.forEach((group) => {
                if (!group.groups) {
                    names.push((parent==='') ? group.name: parent + ' / ' + group.name);
                } else if (group.groups) {
                    if (group.layers) {
                        names.push((parent==='') ? group.name: parent + ' / ' + group.name);
                    }
                    let names2 = getNames(group.name, group.groups);
                    names2.forEach((name) => {
                        names.push(name);
                    });
                }
            });
            return names;
        };
        console.log('Groups', getNames('', groups).join(','));
    };

    render() {
        return (
            <div id="published-map-container">
                {this.state.loading ? (
                    <CenterSpinner/>
                ) : null}
                <iframe ref={this.mapRef} id="sv-iframe" src={process.env.REACT_APP_PUBLISHED_MAP_URL + "&lang=" + this.props.lang}
                    allow="geolocation" onLoad={this.hideSpinner}>
                </iframe>
            </div>
        );
    }
}

const mapStateToProps = (state: { language: { current: string; }; }) => {
    return { lang: state.language.current }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PublishedMap);