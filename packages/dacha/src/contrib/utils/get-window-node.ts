export const getWindowNode = (windowNodeId: string): HTMLElement => {
  const windowNode = document.getElementById(windowNodeId);

  if (windowNode === null) {
    throw new Error(
      `Cannot find the node with id: ${windowNodeId}. Please specify windowNodeId for system and make sure the node exists`,
    );
  }

  return windowNode;
};
