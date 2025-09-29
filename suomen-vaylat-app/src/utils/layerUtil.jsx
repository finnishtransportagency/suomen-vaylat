
export const findGroupForLayer = (groups, layerId) => {
  for (let group of groups) {
    if (group.layers && group.layers.includes(layerId)) {
      return group;
    }
    if (group.groups) {
      const nestedGroup = findGroupForLayer(group.groups, layerId);
      if (nestedGroup) return nestedGroup;
    }
  }
  return null;
};