import { PromptCore } from "@redfast/redfast-core";
import type { DeviceInfo, PathItem, PromptResult } from "@redfast/redfast-core";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOS, getDeviceType } from "./utils";
import { Dimensions } from "react-native";
import { PathType } from "@redfast/redfast-core";

export interface Inline {
  name: string;
  id: string;
  image_composite: string;
  action_group_id?: string;
}

export class PromptManager extends PromptCore {
  constructor(appId: string, userId: string) {
    const device: DeviceInfo = {
      device_manufacturer: Device.manufacturer ?? "unknown",
      device_model: Device.modelName ?? "unknown",
      device_type: getOS(),
      device_category: getDeviceType(),
    };
    console.log(
      `screen resolution is ${Dimensions.get("window").width} * ${
        Dimensions.get("window").height
      }`
    );
    super(appId, userId, device, {
      createKey: AsyncStorage.setItem,
      getValue: async (key: string) => AsyncStorage.getItem(key),
      deleteKey: AsyncStorage.removeItem,
      hasKey: async (key: string): Promise<boolean> => {
        const value = await AsyncStorage.getItem(key);
        return value !== null;
      },
      getAllKeys: async (): Promise<readonly string[]> =>
        AsyncStorage.getAllKeys(),
    });
  }
}
