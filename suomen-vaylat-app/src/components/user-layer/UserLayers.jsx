import UserLayer from "./UserLayer";

export const UserLayers = ({ layers, themeName, isSelected }) => {
  return (
    <>
      {layers.map((layer, index) => {
        return (
          <UserLayer
            key={layer.id + '_' + themeName}
            layer={layer}
            groupName={matchingGroup}
            index={index}
            isSelected={isSelected}
            themeName={themeName}
          />
        );
      })}
    </>
  );
};

export default UserLayers;
