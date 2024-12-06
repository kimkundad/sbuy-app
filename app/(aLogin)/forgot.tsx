import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Verify() {
    const navigation = useNavigation();
    const inputRefs = useRef([]); // Array of refs for OTP inputs
    const [loading, setLoading] = useState(false); // Loading state to disable actions while verifying
    const router = useRouter();

    const [form, setForm] = useState({
        email: ''
      });

      const handleSubmit = async () => {

        setLoading(true);
        
        try {

            const response = await axios.post('https://www.learnsbuy.com/api/resetPassword', {
                email: form.email, // Phone number from params
              });

              console.log('response.data', response.data)
      
              if (response.data.status === 200) {
                // ค่าแสดงว่าเกิน 3 นาทีแล้ว

                Alert.alert('Success', 'ระบบได้ทำการส่ง OTP ไปยังอีเมลของท่านแล้ว!');
                router.push({ pathname: '(aLogin)/verify', params: { email: response?.data?.data?.email } });
              } else if (response.data.status == 100) {
                // ค่าแสดงว่ายังไม่เกิน 3 นาที
                Alert.alert('Wait', 'เราไม่พบอีเมลนี้ในระบบ');
              }

        } catch (error) {
            console.error('Invalid email entered!:', error);
            Alert.alert('Error', 'Something went wrong, please try again.');
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
                        <Text style={styles.title}>Forgot Password</Text>
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
                        />
                      </View>

                        {/* <View>
                          <TouchableOpacity onPress={() => router.push('/resetpass')}>
                            <Text style={styles.btnTextRe}>Reset Password</Text>
                          </TouchableOpacity>
                        </View> */}

                        

                        <View style={styles.formAction}>
                            <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                                <View style={styles.btn}>
                                <Text style={styles.btnText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
  otpBox: {
    borderRadius: 5,
    borderColor: '#666',
    borderWidth: 0.5,
},
btnTextRe: {
  fontSize: 16,
    color: '#f47524',
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontWeight: '700',
    marginBottom: 20
},
otpContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
},
otpText: {
    fontSize: 20,
    color: '#000',
    padding: 0,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    lineHeight: 18,
    textAlign: 'center'
  },
  termTextblue:{
    color: '#0263e0',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1D2A32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  /** Header */
  topHeader: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
    textAlign: 'center',
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