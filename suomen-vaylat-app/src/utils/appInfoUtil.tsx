import moment from 'moment';
import preval from 'preval.macro'

export const getAppVersion = () => {
    return process.env.REACT_APP_VERSION;
}

export const getAppBuildDate = () => {
    const buildTimestamp = preval`module.exports = new Date().getTime();`;
    const lastUpdateMoment = moment.unix(buildTimestamp / 1000);
    const formattedDate    = lastUpdateMoment.format('DD.MM.YYYY HH:mm:ss');
    return formattedDate;
}