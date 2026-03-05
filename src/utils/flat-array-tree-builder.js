export default function treebuilder(flatArray) {
  const idMap = {};
  const tree = [];

  flatArray.forEach((item) => {
    idMap[item.id] = {
      ...item,
      children: [],
    };
  });

  flatArray.forEach((item) => {
    const node = idMap[item.id];
    if (item.parent === null) {
      // Root node
      tree.push(node);
    } else {
      // Child node
      const parent = idMap[item.parent];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}
