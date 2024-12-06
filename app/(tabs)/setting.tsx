
import { Image, View, Text, Switch, StyleSheet, Platform, Alert, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigation, router } from 'expo-router';
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../hooks/api'; // Axios instance
import * as ImagePicker from 'expo-image-picker';

export default function Setting() {


    const [isEnabled, setIsEnabled] = useState(false);
    const { logout } = useContext(UserContext);
    const { userProfile, setUserProfile } = useContext(UserContext);
    const [myPoint, setMyPoint] = useState(0)
    const [files, setFiles] = useState(null); // Holds URI of selected image
    const [loading, setLoading] = useState(false); // Loading state for API call

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {

        setIsEnabled(userProfile?.noti_status === 1);
        console.log('API Response userProfile?.noti:', userProfile?.noti_status);
    
      }, [userProfile]); // Depend on id to refetch when it changes

    const toggleSwitch = async () => {
        const newStatus = !isEnabled;
        setIsEnabled(newStatus);
        const token = await AsyncStorage.getItem('jwt_token');
        try {
          const response = await api.post('/updateNoti', {
            token: token
          });
          console.log('API Response:', response?.data?.data?.profile); // Log ข้อมูลจาก API
          const updatedUser = response?.data?.data?.profile;
          await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
    
    
        } catch (error) {
          console.error('API Error:', error.toJSON());
          Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      };

    const get_userby_id = async () => {
        try {
          console.log('userProfile', userProfile?.id)
          const response = await axios.get(`https://www.learnsbuy.com/api/get_userby_id/${userProfile?.id}`);
      
          // Set the data to state or handle the response
          setMyPoint(response?.data?.data?.user_coin);
          console.log('user_coin', response?.data?.data?.user_coin)
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      };
    
    
       // เรียก get_userby_id เฉพาะเมื่อ userProfile พร้อมแล้ว
       useEffect(() => {
        if (userProfile?.id) {
            get_userby_id();
        }
    }, [userProfile?.id]); // ให้ useEffect ทำงานเมื่อ userProfile.id เปลี่ยนแปลง


      // Function to open image picker and set the profile image
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.status !== 'granted' || cameraPermissionResult.status !== 'granted') {
      Alert.alert('Permission required', 'Camera and gallery access are required to upload a profile picture.');
      return;
    }

    Alert.alert(
      'Upload Profile Picture', 
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });
            if (!result.cancelled) {
              console.log('New Image URI:', result?.assets?.[0]?.uri); // Check URI
              setFiles(result.uri || result?.assets?.[0]?.uri);
              await uploadImage(result?.assets?.[0]?.uri);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
              allowsEditing: true,
              quality: 1,
            });
            if (!result.cancelled) {
              console.log('New Image URI:', result.uri); // Check URI
              setFiles(result.uri || result?.assets?.[0]?.uri);
              await uploadImage(result?.assets?.[0]?.uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Function to upload image to the server
  const uploadImage = async (uri) => {
    setLoading(true); // Start loading

    try {

        const token = await AsyncStorage.getItem('jwt_token');

        const formData = new FormData();
        formData.append('image', {
            uri: uri,
            name: `avatar_${Date.now()}.jpg`, // Generate a unique filename
            type: 'image/jpeg',
        });
        formData.append('token', token);

        // Assuming `api` is configured with your base URL and headers
        const response = await api.post('/upAvatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('response user-->', response.data?.user)

        // Handle API response
        if (response.data.status === 200) {
          console.log('user-->', response.data?.user)
          const updatedUser = response.data.user;
          await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
          setUserProfile(updatedUser); // Update UserContext

            Alert.alert('Success', 'Profile picture updated successfully');
        } else {
            Alert.alert('Error', 'Failed to update profile picture');
        }

    } catch (error) {
        console.error('API Error:', error);
        Alert.alert('Error', error.message || 'An error occurred while uploading');
    } finally {
        setLoading(false); // Stop loading
    }
};

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
            <StatusBar style="dark" />
            <ScrollView>
                <View >

                    <View style={styles.container}>


                        <View style={{ alignItems: 'center' }}>

                        <View style={{ position: 'relative' }}>
                {/* Profile Image */}


                <View style={styles.borderAvatar}>
                <Image
                  key={files}
                  style={styles.userImageCenter}
                  source={{
                    uri: files || 'https://learnsbuy.com/assets/images/avatar/'+userProfile?.avatar || 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg',
                }}
                />
                </View>


                {/* Edit Button */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: '#fff', // Background for better visibility
                    borderRadius: 50,
                    padding: 4,
                  }}
                  onPress={openImagePicker}
                >
                  <MaterialIcons name="edit" size={18} color="black" />
                </TouchableOpacity>
              </View>

              
                            
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{
                                    color: Colors.black, fontSize: 18, fontFamily: 'Prompt_500Medium',
                                }}>{userProfile?.name}</Text>
                                <View style={styles.showflex}>
                                    <Text style={{
                                        color: Colors.black, fontSize: 14, fontFamily: 'Prompt_500Medium', fontWeight: 700, marginRight: 5
                                    }}>POINT</Text>
                                    <Text style={{
                                        color: Colors.black, fontSize: 14, fontFamily: 'Prompt_400Regular',
                                    }}>{myPoint.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.line_bot}></View>

                        {/* Menu Setting */}
                        <View style={{ marginTop: 8 }}>

                        <TouchableOpacity 
                        onPress={() => {
                            router.push({
                                pathname: '(setting)',
                                params: {}, // เพิ่ม params ให้เป็นออบเจ็กต์ว่างถ้าไม่มีพารามิเตอร์เพิ่มเติม
                            });
                        }}
                    >
                                <View style={styles.textListHead2}>
                                    <View style={styles.profile}>
                                        
                                        <View style={styles.obtn}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <Feather name="user" size={20} color="#00ad02" />
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.textSeting}>Edit Profile</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="black" />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                    router.push('(setting)/helpcen');
                                }}>
                                <View style={styles.textListHead2}>
                                    <View style={styles.profile}>
                                        <View style={styles.obtn}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <Feather name="phone" size={20} color="#00ad02" />
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={styles.textSeting}>Help Center</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="black" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View >
                                <View style={styles.textListHead2}>
                                    <View style={styles.profile}>
                                        
                                        <View style={styles.obtn}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <Ionicons name="notifications-outline" size={24} color="#00ad02" />
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.textSeting}>Notification</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                                            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View >
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                        router.push('(setting)/policy');
                                    }}>
                                    <View style={styles.textListHead2}>
                                        <View style={styles.profile}>

                                        <View style={styles.obtn}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <MaterialIcons name="lock-outline" size={20} color="#00ad02" />
                                            </View>
                                        </View>

                                          
                                            <View>
                                                <Text style={styles.textSeting}>privacy policy</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Feather name="chevron-right" size={24} color="black" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                    router.push('(setting)/about');
                                }}>
                                <View style={styles.textListHead2}>
                                    <View style={styles.profile}>
                                       

                                        <View style={styles.obtn}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <Feather name="info" size={20} color="#00ad02" />
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={styles.textSeting}>About Us</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="black" />
                                    </View>
                                </View>
                            </TouchableOpacity>




                            <TouchableOpacity
                                onPress={handleLogout}
                            >
                                <View style={styles.textListHead2}>
                                    <View style={styles.profile}>
                                       
                                        <View style={styles.obtnRed}>
                                            <View
                                                style={{
                                                    padding: 6,
                                                    borderRadius: 50
                                                }}
                                            >
                                                <AntDesign name="logout" size={20} color="#dc3545" />
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={styles.textSeting3}>Logout</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Feather name="chevron-right" size={24} color="#dc3545" />
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                        {/* Menu Setting */}


                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    borderAvatar: {
        backgroundColor: 'rgba(50, 209, 145, 0.4)',
        borderRadius: 50,
        padding: 4,
        alignItems: 'center',
      },
    container: {
        padding: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginTop: Platform.select({
            ios: 35,
            android: 25,
          }),
    },
    obtn: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        borderRadius: 50,
        padding: 4,
        alignItems: 'center',
    },
    obtnRed: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderRadius: 50,
        padding: 4,
        alignItems: 'center',
    },
    showflex: {
        display: 'flex',
        flexDirection: 'row',
    },
    textSeting: {
        fontSize: 16,
        fontFamily: 'Prompt_400Regular'
    },
    textSeting2: {
        fontSize: 15,
        fontFamily: 'Prompt_400Regular',
        color: '#3858b1'
    },
    textSeting3: {
        fontSize: 15,
        fontFamily: 'Prompt_400Regular',
        color: '#dc3545'

    },
    userImageCenter: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 99,
    },
    creditflex: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    credit: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    line_bot: {
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 0.3,
        paddingBottom: 20
    },
    profileMain: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    listItemCon: {
        marginTop: 15
    },
    textListHead: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textListHead2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingBottom: 15,
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 0.3,
    },
});
