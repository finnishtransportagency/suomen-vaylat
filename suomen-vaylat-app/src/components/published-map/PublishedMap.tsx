/* eslint-disable jsx-a11y/iframe-has-title */
import React, { Component } from 'react'
import { connect } from 'react-redux';
import CenterSpinner from '../center-spinner/CenterSpinner';
import './PublishedMap.scss';

interface IPublishedMapProps {
    lang?: string
  }

interface IPublishedMapState {
    loading?: boolean
}

class PublishedMap extends Component<IPublishedMapProps, IPublishedMapState> {

    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            loading: true
        }
    }

    hideSpinner = () => {
        this.setState({
          loading: false
        });
      };

    render() {
        return (
            <div id="published-map-container">
                {this.state.loading ? (
                    <CenterSpinner/>
                ) : null}
                <iframe id="sv-iframe" src={process.env.REACT_APP_PUBLISHED_MAP_URL + "&lang=" + this.props.lang}
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