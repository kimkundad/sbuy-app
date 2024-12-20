import { Image, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,Platform, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, Stack, useNavigation } from 'expo-router';
import api from '../../hooks/api'; // Axios instance
import { UserContext } from '../../hooks/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {

  const navigation = useNavigation(); // สำหรับปุ่ม Back

  const { userProfile, setUserProfile } = useContext(UserContext);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  // Populate the form with userProfile data when the component mounts
  useEffect(() => {
    if (userProfile) {
      setForm({
        name: userProfile?.name || '',
        phone: userProfile?.phone || '',
        email: userProfile?.email || '',
      });
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!form.name) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true); // Start loading


    try {

        const token = await AsyncStorage.getItem('jwt_token');
        console.log('updatedUser', form.name)
      const response = await api.post('/postName', {name: form.name, token});
     
      if (response.data.status === 200) {
        const updatedUser = response?.data?.data?.profile;
        
        await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
        setUserProfile(updatedUser); // Update UserContext
        Alert.alert('Success', 'Profile updated successfully');
        router.push('(tabs)/setting'); // Navigate to settings page
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile');
      console.error('Update Profile Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Stack.Screen options={{
                    headerTransparent: true,
                    headerTitle: 'Edit Profile',
                    headerTitleAlign: 'center', // Center the header title
                    headerTitleStyle: {
                        color: 'black', // กำหนดสีของ headerTitle
                        fontFamily: 'Prompt_500Medium', // กำหนดฟอนต์
                        fontSize: 16
                    },
                    contentStyle: {
                      backgroundColor: 'white', // เพิ่มพื้นหลังสีขาวให้กับหน้าจอ
                    },
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 6,
                                borderRadius: 50
                            }}
                        >
                            <Ionicons name="chevron-back" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                    ),
                    
                }} />
      <ScrollView>
        
        
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>ชื่อ-นามสกุล</Text>
              <TextInput
                clearButtonMode="while-editing"
                placeholder="ชื่อผู้ใช้งาน..."
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name}
                onChangeText={(name) => setForm({ ...form, name })}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>เบอร์ติดต่อ</Text>
              <TextInput
                keyboardType="number-pad"
                placeholder="09578512xxx"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.phone}
                onChangeText={(phone) => setForm({ ...form, phone })}
                editable={false}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>อีเมล</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholder="email@email.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
                editable={false}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleUpdateProfile} disabled={loading}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{loading ? 'Updating...' : 'Update'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>


      </ScrollView>
    </SafeAreaProvider>
  );
};

export default EditProfile;


const styles = StyleSheet.create({

  container: {
    padding: 10,
    paddingHorizontal: 12,
    marginTop: Platform.select({
      ios: 70,
      android: 75,
    }),
  },
  backIcon: {
    backgroundColor: 'rgba(50, 209, 145, 0.2)',
    padding: 3,
    borderRadius: 50,
},
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    fontFamily: 'Prompt_400Regular',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#121F43',
    borderColor: '#121F43',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Prompt_500Medium',
  },
  label: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14
  },
  formAction: {
  
    marginTop: 10,
    marginBottom: 50
  },
  iconAdd: {
    color: '#f47524',
  },
  addBranch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 1
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  headerPage: {
    padding: 20,
    fontFamily: 'Prompt_500Medium',
    fontSize: 18,
    marginTop: -5
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#121F43',
    marginBottom: 8,
  },
  inputControl: {
    height: 45,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'solid',
  },
  listItemCon: {
    paddingTop: 40,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    // Android shadow (elevation)
    elevation: 10,
  },
  card: {
    paddingTop: 15,
    position: 'static',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    padding: 10,
  },
  headBranch: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 15,
    marginTop: -3
  },
  phoneText: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 12,
    marginTop: -5
  },
  addressText: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
    height: 30,
    color: '#666'
  },
  innerItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 1,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
  },
});