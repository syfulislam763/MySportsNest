import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ModalProps,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IndicatorProps extends Omit<ModalProps, 'visible'> {
  visible: boolean;
  onClose?: () => void;
  overlayStyle?: object;
  modalContainerStyle?: object;
  headerStyle?: object;
  children?: ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
}

const Loading: React.FC<IndicatorProps> = ({
  animationType = 'fade',
  visible,
  onClose,
  overlayStyle = {},
  modalContainerStyle = {},
  headerStyle = {},
  children,
  ...rest
}) => {
  return (
    <Modal
      transparent={true}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
      {...rest}
    >
      <SafeAreaView style={{ ...styles.overlay, ...overlayStyle }}>
        <View style={{ ...styles.modalContainer, ...modalContainerStyle }}>
          <ActivityIndicator color={"blue"} size={'large'}/>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});