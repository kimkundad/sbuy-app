import React, { useState, useEffect } from 'react';
import { Link, useNavigation, router } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Centralized form handler to reduce repetitive code
  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRegister = async () => {
    const { email, password, confirmPassword, name } = form;

    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true); // Show loading state

    try {

        await AsyncStorage.removeItem('jwt_token');
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.removeItem('user_profile');

      // API call to register the user
      const response = await axios.post('https://www.learnsbuy.com/api/register', {
        email,
        name,
        password,
        c_password: confirmPassword,
        role:3
      });
       console.log('response', response.data.data)
      if (response.data.data.token) {
          // Extract tokens and user profile from the response
          const token = response.data.data.token;
          const refreshToken = response.data.data.token;
          const userProfile = response.data.data.profile;

          console.log('token', token, 'refreshToken', refreshToken, 'userProfile', userProfile);
  
          // Ensure tokens and user data are valid before storing
          if (token && refreshToken && userProfile) {
            // Store tokens and user data in AsyncStorage
            await AsyncStorage.setItem('jwt_token', token);
            await AsyncStorage.setItem('refresh_token', refreshToken);
            await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
  
            Alert.alert('Success', 'Verification successful!');
            router.push('(tabs)'); // Navigate to the main app screen
          } else {
            Alert.alert('Error', 'Invalid token or user data received.');
          }
        } else {
          Alert.alert('Error', 'Invalid verification code.');
        }

    } catch (error) {
      console.log('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong, please try again.x');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.topHeader}>
            <View style={styles.headerBack}>
              <Link href="(aLogin)">
                <Ionicons name="chevron-back-outline" size={28} color="black" />
              </Link>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Sign Up</Text>
          </View>

          <View style={styles.form}>
            {/* Input fields mapped from the state */}
            {[
              { placeholder: 'Full Name', value: form.name, field: 'name' },
              { placeholder: 'Email Address', value: form.email, field: 'email' },
              { placeholder: 'Password (min 8 characters)', value: form.password, field: 'password', secure: true },
              { placeholder: 'Confirm Password', value: form.confirmPassword, field: 'confirmPassword', secure: true }
            ].map(({ placeholder, value, field, secure = false, keyboardType = 'default' }, index) => (
              <View key={index} style={styles.input}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  secureTextEntry={secure}
                  keyboardType={keyboardType}
                  onChangeText={(text) => handleInputChange(field, text)}
                  placeholder={placeholder}
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={value}
                />
              </View>
            ))}

            <Text style={styles.infoText}>
              By clicking Sign Up below, you've read the full text and agreed to the{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleRegister} disabled={loading}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.otp}>You will receive an SMS</Text>
          </View>

          <TouchableOpacity onPress={() => router.push('(aLogin)')} style={{ marginTop: 'auto' }}>
            <Text style={styles.formFooter}>
              Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  infoText: {
    marginTop:10,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  otp: {
    marginTop: -5,
    fontSize: 14,
 textAlign: 'center',
 color: '#999'
  },
  linkText: {
    color: '#f47524',
    fontWeight: '700',
    lineHeight: 18
  },
  termTextblue:{
    color: '#0263e0',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: '#1D2A32',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  topHeader: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerImg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  /** Form */
  form: {
    marginBottom: 14,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f47524',
    textAlign: 'center',
    letterSpacing: 0.15,
    marginTop: 30,
    marginBottom: 50
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#4ebd8c',
    borderColor: '#4ebd8c',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});