import styled from 'styled-components';
import AbstractText from './Components/AbstractText';
import Citation from './Components/Citation';
import Languages from './Components/Languages';
import LineageStatements from './Components/LineageStatements';
import MetadataDateStamp from './Components/MetadataDateStamp';
import MetadataGraphic from './Components/MetadataGraphic';
import OnlineResources from './Components/OnlineResources';
import TemporalExtents from './Components/TemporalExtents';
import TopicCategories from './Components/TopicCategories';

const StyledArticle = styled.article`
`;

export const JhsTab = ({ identification, datestamp, onlineResources, lineageStatements }) => {
    return (
        <StyledArticle>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <AbstractText identification={identification}></AbstractText>
            <MetadataDateStamp datestamp={datestamp}></MetadataDateStamp>
            <OnlineResources onlineResources={onlineResources}></OnlineResources>
            <Languages identification={identification}></Languages>
            <TopicCategories identification={identification}></TopicCategories>
            <TemporalExtents identification={identification}></TemporalExtents>
            <LineageStatements lineageStatements={lineageStatements}></LineageStatements>
        </StyledArticle>
    );
};
/*
'<article>' +

                    '    <% if (identification.spatialResolutions.length) { %>' +
                    '        <h2>' + this.locale.heading.spatialResolution + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.spatialResolutions, function (resolution) { %>' +
                    '            <li>1: <%- resolution %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.responsibleParties.length) { %>' +
                    '        <h2>' + this.locale.heading.responsibleParty + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.responsibleParties, function (responsibleParty) { %>' +
                    '            <li><%- responsibleParty.organisationName %></li>' +
                    '            <% if (responsibleParty.electronicMailAddresses.length) { %>' +
                    '                <ul>' +
                    '                <% _.forEach(responsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                    <li><%- electronicMailAddress %></li>' +
                    '                <% }); %>' +
                    '                </ul>' +
                    '            <% } %>' +
                    '        </li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.citation.date.date) { %>' +
                    '        <h2>' + this.locale.heading.citationDate + '</h2>' +
                    '        <p title="<%= (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {description: identification.citation.date.dateType}).description %>"><%- identification.citation.date.date %> (<%=' +
                    '        (locale.codeLists["gmd:CI_DateTypeCode"][identification.citation.date.dateType] || {label: identification.citation.date.dateType}).label' +
                    '        %>)</p>' +
                    '    <% } %>' +

                    '    <% if (distributionFormats.length) { %>' +
                    '        <h2>' + this.locale.heading.distributionFormat + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(distributionFormats, function (distributionFormat) { %>' +
                    '            <li><%- distributionFormat.name %> <%= distributionFormat.version ? "(" + distributionFormat.version + ")" : "" %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (identification.spatialRepresentationTypes.length) { %>' +
                    '        <h2>' + this.locale.heading.spatialRepresentationType + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(identification.spatialRepresentationTypes, function (spatialRepresentationType) { %>' +
                    '            <li title="<%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {description: spatialRepresentationType}).description %>"><%= (locale.codeLists["gmd:MD_SpatialRepresentationTypeCode"][spatialRepresentationType] || {label: spatialRepresentationType}).label %></li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +

                    '    <% if (fileIdentifier.length) { %>' +
                    '        <h2>' + this.locale.heading.fileIdentifier + '</h2>' +
                    '        <p><%- fileIdentifier %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataStandardName.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataStandardName + '</h2>' +
                    '        <p><%- metadataStandardName %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataStandardVersion.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataStandardVersion + '</h2>' +
                    '        <p><%- metadataStandardVersion %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataLanguage.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataLanguage + '</h2>' +
                    '        <p><%= locale.languages[metadataLanguage] || metadataLanguage %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataCharacterSet.length) { %>' +
                    '        <h2>' + this.locale.heading.metadataCharacterSet + '</h2>' +
                    '        <p title="<%= (locale.codeLists["gmd:MD_CharacterSetCode"][metadataCharacterSet] || {description: metadataCharacterSet}).description %>"><%= (locale.codeLists["gmd:MD_CharacterSetCode"][metadataCharacterSet] || {label: metadataCharacterSet}).label %></p>' +
                    '    <% } %>' +

                    '    <% if (metadataResponsibleParties.length) { %>' +
                    '    <h2>' + this.locale.heading.metadataOrganisation + '</h2>' +
                    '        <ul>' +
                    '        <% _.forEach(metadataResponsibleParties, function (metadataResponsibleParty) { %>' +
                    '            <li><%- metadataResponsibleParty.organisationName %>' +
                    '            <% if (metadataResponsibleParty.electronicMailAddresses.length) { %>' +
                    '                <ul>' +
                    '                <% _.forEach(metadataResponsibleParty.electronicMailAddresses, function (electronicMailAddress) { %>' +
                    '                    <li><%- electronicMailAddress %></li>' +
                    '                <% }); %>' +
                    '                </ul>' +
                    '            <% } %>' +
                    '        </li>' +
                    '        <% }); %>' +
                    '        </ul>' +
                    '    <% } %>' +
                    '</article>'
*/
export default JhsTab;