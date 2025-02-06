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

const Payment = () => {

    const params = useLocalSearchParams();
    const [courseData, setCourseData] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 2 คือ Payment Method
    const [couponId, setCouponId] = useState(null); // เก็บ ID ของคูปอง
    

    useEffect(() => {
        if (params?.data) {
            try {
                const parsedData = JSON.parse(params.data); // แปลงกลับเป็น object
                setCourseData(parsedData);
                setOriginalPrice(parsedData?.courses?.price_course)
                setFinalPrice(parsedData?.courses?.price_course);
                //   console.log('data', parsedData); // ตรวจสอบว่าข้อมูลมาแล้ว
            } catch (error) {
                console.error("Error parsing data:", error);
            }
        }
    }, [params.data]);


    const applyDiscount = async () => {
        try {
            if (!coupon) {
                Alert.alert("Error", "กรุณากรอกรหัสคูปอง");
                return;
            }
            
            if (!courseData?.courses?.id) {
                Alert.alert("Error", "ไม่พบข้อมูลคอร์ส");
                return;
            }
    
            const token = await AsyncStorage.getItem('jwt_token');
            const response = await axios.post("https://www.learnsbuy.com/api/check_coupon", {
                token: token,  // ✅ ใช้ token ที่แท้จริง
                coupon: coupon,
                course_id: courseData.courses.id,
            });
    
            console.log('response', response.data);
    
            if (response.data.status === 200) {
                const discountValue = Number(response.data.data?.coupon_price || 0); // ✅ ป้องกัน undefined
                const originalPriceValue = Number(originalPrice || 0); // ✅ ป้องกัน undefined
    
                setDiscount(discountValue);
                setFinalPrice(originalPriceValue - discountValue);
                setCouponId(response.data.data?.id); // ✅ เก็บ coupon_id
                setIsCouponApplied(true); // ✅ ใช้คูปองแล้ว
            } else {
                setDiscount(0);
                setFinalPrice(Number(originalPrice || 0)); // ✅ ใช้ราคาเดิม
                setCouponId(null);
                Alert.alert("Error", response.data.message);
            }
        } catch (error) {
            console.error("❌ Error applying coupon:", error);
            Alert.alert("Error", "เกิดข้อผิดพลาดในการตรวจสอบคูปอง");
        }
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
                        <Text style={styles.infoText1}> Details </Text>
                    </View>

                    <View

                        style={styles.boxItemListPay}
                    >
                        <View key={courseData?.courses?.id} style={styles.lessonItem}>
                            <View>
                                <Image
                                    source={{ uri: 'https://learnsbuy.com/assets/uploads/' + courseData?.courses?.image_course }} // Replace with actual course image URL
                                    style={styles.videoImg}
                                />
                            </View>

                            <View style={styles.lessonInfo}>
                                <Text style={styles.lessonName} numberOfLines={1} ellipsizeMode="tail">{courseData?.courses?.title_course}</Text>
                                <Text style={styles.lessonDuration}>เนื้อหารวม {courseData?.courses?.pack_hr ? courseData?.courses?.pack_hr : '2h'} | {courseData?.count_video.length} Lessons</Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={styles.pricered} >{courseData?.courses?.price_course?.toLocaleString()}</Text>
                                    <Text style={styles.lessonDuration}> บาท</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ padding: 5, paddingVertical: 10 }}>

                        {/* ✅ ถ้ายังไม่ได้ใช้คูปอง แสดงช่องกรอก */}
                        {!isCouponApplied ? (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Student Discount Code"
                                    placeholderTextColor="#999"
                                    value={coupon}
                                    onChangeText={setCoupon}
                                />
                                <TouchableOpacity style={styles.applyButton} onPress={applyDiscount}>
                                    <Text style={styles.applyText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // ✅ ถ้าใช้คูปองแล้ว แสดงข้อความแทน
                            <View style={styles.appliedCouponContainer}>
                                <Text style={styles.appliedCouponText}>{coupon} code applied</Text>
                            </View>
                        )}

                        {/* แสดงราคาก่อนและหลังหักส่วนลด */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.label}>ราคาคอร์ส</Text>
                            <Text style={styles.price}>{originalPrice.toLocaleString()} บาท</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.label}>ส่วนลด</Text>
                            <Text style={styles.discountPrice}>-{discount.toLocaleString()} บาท</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.priceContainer}>
                            <Text style={[styles.label, { fontWeight: 'bold' }]}>ราคารวม</Text>
                            <Text style={[styles.price, styles.finalPrice]}>{finalPrice.toLocaleString()} บาท</Text>
                        </View>

                    </View>

                    <View style={{ marginTop: 15 }}>
                    <TouchableOpacity
                        style={styles.enrollButton}
                        onPress={() => {
                            const dataToSend = {
                                course_id: courseData?.courses?.id,
                                final_price: finalPrice,
                                coupon_id: discount > 0 ? couponId : null, // ส่ง coupon_id ถ้ามีการใช้คูปอง
                            };

                            router.push({
                                pathname: '(payment)/methodDetail',
                                params: { data: JSON.stringify(dataToSend) }, // ต้องแปลงเป็น string
                            });
                        }}
                    >
                        <Text style={styles.enrollButtonText}>ยืนยันจองคอร์สเรียน</Text>
                    </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaProvider>
    );

}

export default Payment;

const styles = StyleSheet.create({

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

    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    applyButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    discountPrice: {
        fontSize: 16,
        fontFamily: 'Prompt_500Medium',
        color: '#dc3545', // สีแดง
    },
    applyText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Prompt_500Medium',
    },
    appliedCouponContainer: {
        backgroundColor: '#fff3cd',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    appliedCouponText: {
        color: '#856404',
        fontSize: 16,
        fontFamily: 'Prompt_500Medium',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        color: '#444',
        fontFamily: 'Prompt_400Regular',
    },
    price: {
        fontSize: 16,
        fontFamily: 'Prompt_500Medium',
        color: '#000',
    },
    finalPrice: {
        color: '#007bff',
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginVertical: 10,
    },

    infoText1: {
        color: 'black',
        fontFamily: 'Prompt_500Medium',
        fontSize: 18
    },
    enrollButton: {
        backgroundColor: '#44a77b',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    enrollButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Prompt_500Medium',
    },
    boxItemListPay: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 0.4,
        borderColor: '#999',
        marginTop: 5
    },
    lessonDuration: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Prompt_500Medium',
    },
    lessonActions: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    pricered: {
        fontSize: 14,
        color: '#ed1c24',
        fontFamily: 'Prompt_500Medium',
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lessonInfo: {
        flex: 1,
        marginLeft: 10,
    },
    lessonName: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
        color: '#000',
    },
    videoImg: {
        width: 80,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
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
        marginTop: Platform.select({

        }),
    },

});