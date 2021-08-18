import Layer from './Layer';

export const Layers = ({ layers, isOpen, theme }) => {
    return (
        <>
            {layers.map((layer, index) => {
                return (
                    <Layer key={layer.id + '_' + theme} layer={layer} isOpen={isOpen} index={index} theme={theme}></Layer>
            )})}
        </>
    );
  };

export default Layers;