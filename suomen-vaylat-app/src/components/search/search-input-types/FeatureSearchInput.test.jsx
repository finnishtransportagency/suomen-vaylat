/**
 * @jest-environment jsdom
 */

import strings from '../../../translations';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeatureSearchInput from './FeatureSearchInput';
import { ReactReduxContext } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { validateFeatureSearch } from '../utils/SearchUtil';

// minimal theme used by the component's styled-components
const theme = {
  colors: {
    mainColor1: '#2b2b2b',
    secondaryColorDarkOrange: '#c55',
    darkGrey: '#333'
  },
  device: {
    tablet: '(max-width: 768px)'
  }
};

// Mock the custom hook used by the component
jest.mock('../../../state/hooks', () => ({
    useAppSelector: jest.fn()
}));

// Mock SearchUtil functions used by the component
jest.mock('../utils/SearchUtil', () => ({
    validateFeatureSearch: jest.fn(),
    mergeMatchedKeys: jest.fn((oldKeys, newKeys) => newKeys)
}));

// Mock react-select to a simple <select> for easy testing
jest.mock('react-select', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: ({ options = [], inputId, value, onChange, placeholder }) => (
            <select
                data-testid={inputId}
                value={value?.value || ''}
                onChange={(e) => {
                    const selected = options.find((o) => o.value === e.target.value);
                    onChange && onChange(selected);
                }}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        )
    };
});

describe('FeatureSearchInput', () => {
    const mockStore = {
        dispatch: jest.fn(),
        getState: jest.fn(),
        subscribe: jest.fn(),
        replaceReducer: jest.fn()
    };

    const renderWithProviders = (ui, { store = mockStore } = {}) =>
        render(
            <ThemeProvider theme={theme}>
                <ReactReduxContext.Provider value={{ store }}>{ui}</ReactReduxContext.Provider>
            </ThemeProvider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders selected layer name and requests field locales', async () => {
        const channel = {
            getFieldNameLocales: jest.fn((ids, successCb) => {
                // respond with a small object to exercise parseFieldNameLocales
                successCb({ attr1: 'Attribute 1', attr2: 'Attribute 2' });
            }),
        };

        useAppSelector.mockReturnValue({
            channel,
            selectedLayersByType: { mapLayers: [{ id: 123, name: 'Test Layer' }] },
            featureSearchResults: [],
            featureErrors: [],
            searchResults: null,
            searchValue: '',
            isSearchingActive: false,
            lastSearchValue: '',
            lastSearchAttribute: ''
        });

        renderWithProviders(
            <FeatureSearchInput setDropdownOpen={() => {}} emptySearchInputs={() => {}} />
        );

        // Layer name is shown
        expect(screen.getByText('Test Layer')).toBeInTheDocument();

        // getFieldNameLocales should have been called for the shown layer id
        expect(channel.getFieldNameLocales).toHaveBeenCalledWith(
            [123],
            expect.any(Function),
            expect.any(Function)
        );
    });

    test('enables attribute search, selects attribute and performs search with attribute', async () => {
        const channel = {
            getFieldNameLocales: jest.fn((ids, successCb) => {
                // return map of attributeKey: label
                successCb({ attr1: 'Attribute 1', attr2: 'Attribute 2' });
            }),
            searchFeatures: jest.fn((args, successCb) => {
                // simulate a successful search response
                successCb({
                    gfi: {
                        content: {
                            layerId: 123,
                            geojson: { features: [], matchedFeatures: [] }
                        }
                    }
                });
            })
        };

        useAppSelector.mockReturnValue({
            channel,
            selectedLayersByType: { mapLayers: [{ id: 123, name: 'Test Layer' }] },
            featureSearchResults: [],
            featureErrors: [],
            searchResults: null,
            searchValue: 'abc', // input bound to redux searchValue
            isSearchingActive: false,
            lastSearchValue: '',
            lastSearchAttribute: ''
        });

        // Make validation pass
        validateFeatureSearch.mockReturnValue(true);

        const setDropdownOpen = jest.fn();
        const emptySearchInputs = jest.fn();

        renderWithProviders(
            <FeatureSearchInput 
                setDropdownOpen={setDropdownOpen} 
                emptySearchInputs={emptySearchInputs} 
            />
        );
        
        // Enable attribute search (there is one checkbox)
        const checkbox = screen.getByRole('checkbox', { name: strings.search.feature.attributeSearch });
        fireEvent.click(checkbox);

        // The mocked react-select renders a <select> with data-testid "attribute-select"
        // Note findBy* function is for async DOM updates --> need to await
        const select = await screen.findByTestId('attribute-select');
        // Choose attr1
        fireEvent.change(select, { target: { value: 'attr1' } });

        // Click the search button
        const searchButton = screen.getByRole('button', { name: strings.search.search });
        fireEvent.click(searchButton);

        await waitFor(() => {
            // validateFeatureSearch should be invoked with the current searchValue and the store
            expect(validateFeatureSearch).toHaveBeenCalledWith('abc', mockStore, true);
        });

        let firstCallArgs = [];
        await waitFor(() => {
            // searchFeatures should have been called and the attribute passed as the 3rd param
            expect(channel.searchFeatures).toHaveBeenCalled();
            firstCallArgs = channel.searchFeatures.mock.calls[0][0]; // first positional arg
        });

        await waitFor(() => {
            expect(firstCallArgs[1]).toBe('abc'); // searchValue
        });

        await waitFor(() => {
            expect(firstCallArgs[2]).toBe('attr1'); // attributeUsedInSearch
        });

        await waitFor(() => {
            // dispatch should have run (component dispatches isSearching flags)
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(setDropdownOpen).toHaveBeenCalledWith(false)
        });
    });

    test('shows clear button and calls emptySearchInputs when clicked', () => {
        const channel = { getFieldNameLocales: jest.fn(), searchFeatures: jest.fn() };

        useAppSelector.mockReturnValue({
            channel,
            selectedLayersByType: { mapLayers: [{ id: 123, name: 'Test Layer' }] },
            featureSearchResults: [],
            featureErrors: [],
            searchResults: { some: 'result' }, // non-null triggers clear-button branch
            searchValue: 'foo',
            isSearchingActive: false,
            lastSearchValue: 'foo', // matches searchValue
            lastSearchAttribute: '' // matches default attribute state ''
        });

        const emptySearchInputs = jest.fn();

        renderWithProviders(
            <FeatureSearchInput setDropdownOpen={() => {}} emptySearchInputs={emptySearchInputs} />
        );

        const clearButton = screen.getByRole('button', { name: strings.search.clearResults });
        expect(clearButton).toBeInTheDocument();
        fireEvent.click(clearButton);
        expect(emptySearchInputs).toHaveBeenCalled();
    });
});
