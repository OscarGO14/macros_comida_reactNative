import React from 'react';
import { Text, View, Modal, SafeAreaView } from 'react-native';
import ActionButton from '../ui/ActionButton';
import { ConfirmationModalProps } from './types';

export default function ConfirmationModal({
  isVisible,
  onClose,
  handleConfirm,
  message,
}: ConfirmationModalProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-80">
        <View className="w-3/4 gap-4 bg-item_background rounded-lg p-5 shadow-lg">
          <Text className="text-center text-primary text-base font-bold">{message}</Text>
          <ActionButton color="accent" label="Confirmar" onPress={handleConfirm} />
          <ActionButton color="primary" label="Cancelar" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
