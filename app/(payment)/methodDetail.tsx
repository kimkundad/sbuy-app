import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, Alert, ScrollView, Platform, RefreshControl, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useNavigation, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../hooks/UserContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import PaymentMethodSelector from '../../components/PaymentMethodSelector';

const MethodDetail = () => {

    const params = useLocalSearchParams();
    const [paymentData, setPaymentData] = useState(null);
    const [currentStep, setCurrentStep] = useState(2); // 2 คือ Payment Method
    const [transferDate, setTransferDate] = useState(new Date());
    const [transferTime, setTransferTime] = useState(new Date());
    const [receiptImage, setReceiptImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params?.data) {
            try {
                const parsedData = JSON.parse(params.data); // แปลงกลับเป็น object
                setPaymentData(parsedData);
                console.log("รับข้อมูล:", parsedData);
            } catch (error) {
                console.error("Error parsing data:", error);
            }
        }
    }, [params.data]);

    // เปิดตัวเลือกอัปโหลดรูปภาพ
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setReceiptImage(result.assets[0].uri);
        }
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // แปลงเวลาให้เป็น HH:mm
    const formatTime = (date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const StepIndicator = () => {
            return (
                <View style={styles.stepContainer}>
                    <View style={styles.step}>
                        <View style={[styles.stepCircle, currentStep >= 1 ? styles.activeStep : styles.inactiveStep]}>
                            <Text style={[styles.stepText, currentStep >= 1 ? styles.activeText : styles.inactiveText]}>1</Text>
                        </View>
                        <Text style={[styles.stepLabel, currentStep >= 1 ? styles.activeLabel : styles.inactiveLabel]}>Details</Text>
                    </View>
        
                    <View style={styles.stepLine} />
        
                    <View style={styles.step}>
                        <View style={[styles.stepCircle, currentStep >= 2 ? styles.activeStep : styles.inactiveStep]}>
                            <Text style={[styles.stepText, currentStep >= 2 ? styles.activeText : styles.inactiveText]}>2</Text>
                        </View>
                        <Text style={[styles.stepLabel, currentStep >= 2 ? styles.activeLabel : styles.inactiveLabel]}>Payment Method</Text>
                    </View>
        
                    <View style={styles.stepLine} />
        
                    <View style={styles.step}>
                        <View style={[styles.stepCircle, currentStep >= 3 ? styles.activeStep : styles.inactiveStep]}>
                            <Text style={[styles.stepText, currentStep >= 3 ? styles.activeText : styles.inactiveText]}>3</Text>
                        </View>
                        <Text style={[styles.stepLabel, currentStep >= 3 ? styles.activeLabel : styles.inactiveLabel]}>Confirmation</Text>
                    </View>
                </View>
            );
        };


        const getFileExtension = (uri) => {
            return uri.split('.').pop().toLowerCase(); // ดึงนามสกุลไฟล์ (jpg, jpeg, png)
        };
        
        const getMimeType = (extension) => {
            switch (extension) {
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                default:
                    return 'image/jpeg'; // ถ้าไม่แน่ใจให้เป็น jpeg
            }
        };


        const submitPayment = async () => {
            if (!selectedPayment || !paymentData?.final_price || !transferDate || !transferTime || !receiptImage) {
                Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
                return;
            }

            const token = await AsyncStorage.getItem('jwt_token');

            setIsSubmitting(true); // ✅ ป้องกันการกดซ้ำ

            const fileExtension = getFileExtension(receiptImage); // ดึงนามสกุลไฟล์
            const mimeType = getMimeType(fileExtension); // แปลงเป็น mimeType
        
            const formData = new FormData();
            formData.append("token", token); // ถ้ามีคูปอง
            formData.append("coupon_id", paymentData?.coupon_id || ""); // ถ้ามีคูปอง
            formData.append("bankname", selectedPayment?.id); // ✅ บังคับ
            formData.append("totalmoney", paymentData?.final_price); // ✅ บังคับ
            formData.append("day", formatDate(transferDate)); // ✅ ใช้ฟังก์ชัน formatDate
            formData.append("timer", transferTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })); // ✅ เวลาที่โอน
            formData.append("course_id", paymentData?.course_id); // ✅ บังคับ
            formData.append("image", {
                uri: Platform.OS === "ios" ? receiptImage.replace("file://", "") : receiptImage, // แก้ไขเส้นทางไฟล์บน iOS
                type: mimeType,
                name: `receipt.${fileExtension}`,
            });

            console.log('formData', formData)
        
            try {
                const response = await axios.post("https://www.learnsbuy.com/api/bil_course", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
        
                if (response.data.status === 200) {
                    Alert.alert("Success", "การชำระเงินสำเร็จ!");
                    router.push("/success");
                } else {
                    Alert.alert("Error", response.data.message || "เกิดข้อผิดพลาด");
                }
            } catch (error) {
                console.error("❌ Error submitting payment:", error);
                Alert.alert("Error", "ไม่สามารถส่งข้อมูลได้");
            } finally {
                setIsSubmitting(false); // ✅ ปลดล็อกปุ่ม
            }
        };
        


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
            <LinearGradient
                colors={['#4EBD8C', '#4EBD8C', '#6AD1A4']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.headerGradient}
            >
                <View style={styles.listItemCon}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
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
                                จองคอร์สเรียน
                            </Text>
                        </View>

                        {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                        <View style={{ width: 32 }} />
                    </View>

                </View>
            </LinearGradient>

            <ScrollView>
                <View style={styles.container}>

                    <View>
                        <StepIndicator />
                        <Text style={styles.infoText1}> Payment Method </Text>
                    </View>

                    <View style={styles.boxItemListPay}>


                    <PaymentMethodSelector onSelect={(bank) => setSelectedPayment(bank)} />

                        {/* Final Price - Readonly */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Final Price</Text>
                        <TextInput
                            style={styles.input}
                            value={paymentData?.final_price ? paymentData.final_price.toString() : 0}
                            editable={false} // Readonly
                        />
                    </View>

                    {/* Date Picker */}
                    {/* <View style={styles.inputContainer}>
                        <Text style={styles.label}>Transfer Date & Time</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <DateTimePicker
                            value={transferDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    // ✅ บังคับให้ใช้โซนเวลาไทย
                                    const thaiDate = new Date(selectedDate);
                                    thaiDate.setHours(thaiDate.getHours() + 7); // ปรับให้เป็นเวลาประเทศไทย
                                    setTransferDate(thaiDate);
                                }
                            }}
                        />
                            <DateTimePicker
                                value={transferTime}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) setTransferTime(selectedTime);
                                }}
                            />
                        </View>
                    </View> */}


<View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Date & Time</Text>

            {/* iOS: ใช้ DateTimePicker ตลอดเวลา / Android: ใช้ปุ่มกด */}
            {Platform.OS === 'ios' ? (
                <>
                    <View style={styles.inputContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <DateTimePicker
                            value={transferDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    // ✅ บังคับให้ใช้โซนเวลาไทย
                                    const thaiDate = new Date(selectedDate);
                                    thaiDate.setHours(thaiDate.getHours() + 7); // ปรับให้เป็นเวลาประเทศไทย
                                    setTransferDate(thaiDate);
                                }
                            }}
                        />
                            <DateTimePicker
                                value={transferTime}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {
                                    if (selectedTime) setTransferTime(selectedTime);
                                }}
                            />
                        </View>
                    </View>
                </>
            ) : (
                <>
                    {/* Android: ปุ่มเลือกวันที่ */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ padding: 10, borderWidth: 1, marginVertical: 10 }}>
                        <Text>{formatDate(transferDate)}</Text>
                    </TouchableOpacity>

                    {/* Android: ปุ่มเลือกเวลา */}
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ padding: 10, borderWidth: 1, marginVertical: 10 }}>
                        <Text>{formatTime(transferTime)}</Text>
                    </TouchableOpacity>

                    {/* Date Picker (Android) */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={transferDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    const thaiDate = new Date(selectedDate);
                                    thaiDate.setHours(thaiDate.getHours() + 7);
                                    setTransferDate(thaiDate);
                                }
                            }}
                        />
                    )}

                    {/* Time Picker (Android) */}
                    {showTimePicker && (
                        <DateTimePicker
                            value={transferTime}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                setShowTimePicker(false);
                                if (selectedTime) setTransferTime(selectedTime);
                            }}
                        />
                    )}
                </>
            )}
        </View>

                    {/* Upload Receipt Image */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Upload Receipt</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                            <Text style={styles.uploadText}>{receiptImage ? 'Change Image' : 'Upload Image'}</Text>
                        </TouchableOpacity>
                        {receiptImage && <Image source={{ uri: receiptImage }} style={styles.receiptImage} />}
                    </View>

                    {/* ปุ่มยืนยันการชำระเงิน */}
                    

                    </View>

                    <TouchableOpacity 
                        style={[styles.confirmButton, isSubmitting && styles.disabledButton]} 
                        onPress={submitPayment}
                        disabled={isSubmitting} // ✅ ป้องกันการกดซ้ำ
                    >
                        <Text style={styles.confirmText}>
                            {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งยืนยันข้อมูลการจอง"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaProvider>
    );


}
    
export default MethodDetail;
    
const styles = StyleSheet.create({
boxItemListPay: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 0.4,
        borderColor: '#999',
        marginTop: 5
    },
        stepContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            padding: 10,
            borderRadius: 10,
            marginBottom: 15,
        },
        step: {
            alignItems: 'center',
            flex: 1,
        },
        stepCircle: {
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        activeStep: {
            backgroundColor: '#007bff',
        },
        inactiveStep: {
            backgroundColor: '#ccc',
        },
        stepText: {
            fontSize: 14,
            fontFamily: 'Prompt_500Medium',
        },
        activeText: {
            color: '#fff',
        },
        inactiveText: {
            color: '#666',
        },
        stepLabel: {
            marginTop: 5,
            fontSize: 12,
        },
        activeLabel: {
            color: '#000',
            fontFamily: 'Prompt_500Medium',
        },
        inactiveLabel: {
            color: '#888',
        },
        stepLine: {
            width: 30,
            height: 2,
            backgroundColor: '#ccc',
        },
    
        infoText1: {
            color: 'black',
            fontFamily: 'Prompt_500Medium',
            fontSize: 18
        },
        headerGradient: {
            height: Platform.select({
                ios: 85,
                android: 55,
            }),
            width: '100%',
        },
        textListHead: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            fontFamily: 'Prompt_400Regular',
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
        container: {
            padding: 10,
            paddingHorizontal: 12,
            marginBottom: 30,
            marginTop: Platform.select({
    
            }),
        },
        inputContainer: {
            marginBottom: 15,
        },
        label: {
            fontSize: 16,
            color: '#333',
            marginBottom: 5,
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
            backgroundColor: '#f9f9f9',
        },
        uploadButton: {
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
        },
        uploadText: {
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Prompt_500Medium',
        },
        receiptImage: {
            width: '100%',
            height: 400,
            borderRadius: 8,
            marginTop: 10,
        },
        confirmButton: {
            backgroundColor: '#28a745',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
        },
        confirmText: {
            color: '#fff',
            fontSize: 18,
            fontFamily: 'Prompt_500Medium',
        },
        disabledButton: {
            backgroundColor: "#A5D6A7", // ✅ สีจางลงเมื่อปิดปุ่ม
        },

    });