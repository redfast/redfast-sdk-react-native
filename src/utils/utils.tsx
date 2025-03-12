import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const getDeviceType = () => {
  switch (Device.deviceType ?? Device.DeviceType.UNKNOWN) {
    case Device.DeviceType.PHONE:
      return Platform.OS === 'ios' ? 'iphone' : 'phone';
    case Device.DeviceType.TABLET:
      return Platform.OS === 'ios' ? 'ipad' : 'tablet';
    case Device.DeviceType.TV:
      return 'tv';
    default:
      return 'unsupport';
  }
};

export const getOS = () => {
  switch (Platform.OS) {
    case 'ios':
      return 'ios';
    case 'android':
      return 'android_os';
    default:
      return 'unknown';
  }
};

export const getImageCompositeFieldName = () => {
  const os = getOS();
  const deviceType = getDeviceType();
  return `rf_settings_bg_image_${os}_${deviceType}_composite`;
};

export const modalAlignment = (modalPosition: string) => {
  let justifyContent = 'center';
  let alignItems = 'center';
  switch (modalPosition) {
    case 'top_center':
      justifyContent = 'flex-start';
      alignItems = 'center';
      break;
    case 'bottom_center':
      justifyContent = 'flex-end';
      alignItems = 'center';
      break;
    case 'top_left':
      justifyContent = 'flex-start';
      alignItems = 'flex-start';
      break;
    case 'top_right':
      justifyContent = 'flex-start';
      alignItems = 'flex-end';
      break;
    case 'bottom_left':
      justifyContent = 'flex-end';
      alignItems = 'flex-start';
      break;
    case 'bottom_right':
      justifyContent = 'flex-end';
      alignItems = 'flex-end';
      break;
    default:
      break;
  }
  return { justifyContent, alignItems };
};

export const CloseButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onPress}>
      <AntDesign name="close" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
