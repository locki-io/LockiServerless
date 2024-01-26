export const replaceFilenameExtension = (filename: string, newExtension: string) => {
  const extensionSplitArray = filename.split('.');
  extensionSplitArray[extensionSplitArray.length - 1] = newExtension;
  return extensionSplitArray.join('.');
};
