import { Image, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, Stack, useNavigation } from 'expo-router';
import api from '../../hooks/api'; // Axios instance
import { UserContext } from '../../hooks/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
      const response = await api.post('/postName', { name: form.name, token });

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>


      <StatusBar
        style={Platform.OS === 'ios' ? 'dark' : 'light'}
        backgroundColor="#4ebd8c"
        translucent={false}
      />
      <LinearGradient
        colors={['#4EBD8C', '#4EBD8C', '#6AD1A4']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.listItemCon}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)/setting')}>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: 5,
                  borderRadius: 25
                }}
              >
                <Ionicons name="chevron-back" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <View style={styles.textListHead}>
              <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', color: '#fff', textAlign: 'center' }}>
                แก้ไขข้อมูลส่วนตัว
              </Text>
            </View>

            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
            <View style={{ width: 32 }} />
          </View>

        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>



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


    </View>
  );
};

export default EditProfile;


const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
  },
  container: {
    padding: 10,
    paddingHorizontal: 12,
  },
  headerGradient: {
    height: Platform.select({
      ios: 85,
      android: 55,
  }),
    width: '100%',
  },
  listItemCon: {
    marginTop: Platform.select({
      ios: 35,
      android: 10,
    }),
    paddingHorizontal: 0,
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
  btnBack: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    alignItems: 'center',
  },
  textListHead: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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

  card: {
    paddingTop: 15,
    position: 'static',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    padding: 10,
  },




});