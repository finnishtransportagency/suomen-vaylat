import strings from "../../translations";
import UserLayer from "./UserLayer";

export const UserLayers = ({ layers }) => {

  if (!layers || layers.length === 0) {
    return (
      <p role="status" aria-live="polite" style={{ margin: 0, padding: '8px 12px', color: '#666' }}>
        {strings.layerlist.userContent.userlayers.noUserlayers}
      </p>
    );
  }
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
