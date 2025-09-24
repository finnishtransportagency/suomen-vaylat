import UserLayer from "./UserLayer";

export const UserLayers = ({ layers }) => {
  return (
    <>
      {layers.map((layer, index) => {
        return (
          <UserLayer
            key={layer.id}
            layer={layer}
            index={index}
          />
        );
      })}
    </>
  );
};

export default UserLayers;
