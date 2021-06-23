import React from 'react'

export const DataContext = React.createContext()

export const DataProvider = (props) => {
  const [state, setState] = React.useState({
    layers: [],
    selectedLayers: [],
    layerGroups: [],
  })

  const { layers, selectedLayers, layerGroups } = state

  const initialize = React.useCallback((data) => {
    return setState((prevState) => ({
      ...prevState,
      layers: data.layers,
      layerGroups: data.layerGroups,
    }))
  }, [])

  const addSelected = React.useCallback((item) => {
    return setState((prevState) => ({
      ...prevState,
      selectedLayers: [...prevState.selectedLayers, item],
    }))
  }, [])

  const removeSelected = React.useCallback((item) => {
    return setState((prevState) => ({
      ...prevState,
      selectedLayers: prevState.selectedLayers.filter(
        (selectedLayer) => selectedLayer.key !== item.key
      ),
    }))
  }, [])

  const contextValue = {
    layers,
    selectedLayers,
    layerGroups,
    initialize,
    addSelected,
    removeSelected,
  }

  return (
    <DataContext.Provider value={contextValue}>
      {props.children}
    </DataContext.Provider>
  )
}