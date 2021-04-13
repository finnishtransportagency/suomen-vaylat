import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';
import { createFilter } from 'redux-persist-transform-filter';

const saveSubsetFilter = createFilter(
    'feedbackSingle',
    ['support'],
);

const subjectTransform = createTransform(
    null,
    () => {
        return {
            fetching: false,
            fetched: false,
            feedback: {
                subjects: [],
                subSubjects: []
            },
            help: {
                subjects: [],
                subSubjects: []
            },
        };
    },
    {whitelist: ['subject']}
);

export const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['map', 'popup', 'mapStyleStore', 'feedback', 'faultNotices', 'sideBar'],
    transforms: [
        saveSubsetFilter,
        subjectTransform
    ],
};