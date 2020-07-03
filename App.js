import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturePhoto, setCapturePhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null)
    return <View />;

  if (hasPermission === false)
    return <Text> Acesso negado! </Text>;

  async function takePicture() {
    if(camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturePhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturePhoto)
    .then(() => {
      Alert.alert('Atenção', 'Imagem registrada com sucesso!');
    })
    .catch(error => {
      console.log('Erro: ', error);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
      >
        <View style={styles.viewButtonCamera}>
          <TouchableOpacity 
          style={styles.buttonCamera}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
            );
          }}
          >
            <Text style={styles.textButtonCamera}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name='camera' size={23} color='#FFF' />
      </TouchableOpacity>

      { capturePhoto &&
      <Modal
      animationType='slide'
      transparent={false}
      visible={open}
      >
        <View style={styles.viewModal}>
          <View style={styles.groupButtons}>
            <TouchableOpacity style={styles.buttonCloseModal} onPress={() => setOpen(false)}>
              <FontAwesome name='window-close' size={50} color='#FF0000' />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonCloseModal} onPress={savePicture}>
              <FontAwesome name='upload' size={50} color='#121212' />
            </TouchableOpacity>
          </View>

          <Image 
          style={styles.photoModal}
          source={{ uri: capturePhoto }}
          />
        </View>
      </Modal>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  viewButtonCamera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  buttonCamera: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  textButtonCamera: {
    fontSize: 20,
    marginBottom: 13,
    color: '#FFF',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  viewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  buttonCloseModal: {
    margin: 10,
  },
  photoModal: {
    width: '100%',
    height: 450,
    borderRadius: 20,
  },
  groupButtons: {
    margin: 10,
    flexDirection: 'row',
  }
});
