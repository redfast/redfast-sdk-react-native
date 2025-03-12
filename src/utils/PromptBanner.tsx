import type { PathItem, PromptResult } from '@redfast/redfast-core';
import { extractInlineParams } from '@redfast/redfast-core';
import { FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { usePrompt } from './usePrompt';
import { getOS, getDeviceType } from './utils';

const Banner = ({
  pathItem,
  height,
  onEvent,
}: {
  pathItem: PathItem;
  height: number;
  onEvent: (result: PromptResult) => void;
}) => {
  const { id, actionGroupId, poster } = React.useMemo(
    () => extractInlineParams(pathItem, getOS(), getDeviceType()),
    [pathItem]
  );
  const {
    state: { promptMgr },
  } = usePrompt();

  React.useEffect(() => {
    if (promptMgr) {
      (async () => {
        const result = await promptMgr.onInlineViewed(id, actionGroupId);
        onEvent(result);
      })();
    }
  }, [promptMgr]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TouchableOpacity
      onPress={async () => {
        if (promptMgr) {
          const result = await promptMgr?.onInlineClicked(id, actionGroupId);
          onEvent(result);
        }
      }}
    >
      <Image
        source={{ uri: poster }}
        style={{ ...styles.imageRow, height: height }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export const PromptBanner = ({
  pathItems,
  height,
  onEvent,
}: {
  pathItems: PathItem[];
  height: number;
  onEvent: (result: PromptResult) => void;
}) => {
  return (
    <FlatList
      data={pathItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Banner pathItem={item} height={height} onEvent={onEvent} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  imageRow: {
    width: '100%',
    borderRadius: 10,
  },
});
