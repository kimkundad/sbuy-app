import React, { useState, useEffect } from 'react';
import { useNavigation, router } from 'expo-router';
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt_token');
        
        if (token) {
          // If token exists, navigate to the main app screen
          router.push('(tabs)');
        }
      } catch (error) {
        console.error('Error checking JWT token:', error);
      }
    };

    checkTokenAndRedirect();
  }, [router]);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please enter both phone and password');
      return;
    }

    //setLoading(true);
    
    try {
      console.log('try')
      // Replace with your API endpoint
      const response = await axios.post('https://www.learnsbuy.com/api/login', {
        email: form.email,
        password: form.password,
      });
      
      
     
      console.log('data-->', response.data)
      
      if (response.data.status === 200) {

         // Handle different `verify` statuses
      const token = response.data.data.token;
      const user = response.data.data.profile;

      if (token) {
        // User is logged in successfully, save the tokens and user info
        await AsyncStorage.setItem('jwt_token', token);
        await AsyncStorage.setItem('refresh_token', token); // Assuming refresh_token is the same as the token here
        await AsyncStorage.setItem('user_profile', JSON.stringify(user));
        
        Alert.alert('Success', 'Login successful!');
        router.push('(tabs)'); // Navigate to the main app screen after successful login

      } else {
        // Fallback case if something else happens
        Alert.alert('Error', 'Something went wrong, please try again.');
      }

    }else{
      Alert.alert('Error', 'wrong email or password.');
    }

    } catch (error) {
      console.log('Error during login:', error);
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 250, height: 77 }}
            />
          </View>

          <View>
            <Text style={styles.textHead}>Login</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholder="email@gmail.com"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
                keyboardType="email-address" // กำหนดประเภทของคีย์บอร์ดให้รองรับอีเมล
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
          onPress={() => router.push('/forgot')}
          style={{ marginTop: 'auto' }}>
            <Text style={styles.formLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={{ marginTop: 'auto' }}>
          <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
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
  textHead: {
    fontSize: 25,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 35
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 10
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121F43',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
    marginBottom: 20
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#121F43',
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
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});