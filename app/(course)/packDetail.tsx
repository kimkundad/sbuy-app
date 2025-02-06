import React, { useState, useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native'; // Import useRoute
import { Image, View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Stack, router, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const PackDetail = () => {

    const navigation = useNavigation(); // สำหรับปุ่ม Back
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id = 52, other } = params;
    console.log('params', params?.id)
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            try {

                const token = await AsyncStorage.getItem('jwt_token');
                if (token) {

                    const response = await axios.get(`https://www.learnsbuy.com/api/get_package_id_app/${id}`);
                    // Set the data to state or handle the response
                    setData(response.data.data);

                } else {
                    navigation.navigate('(aLogin)');
                }


            } catch (error) {
                console.error('Error fetching slides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); // Depend on id to refetch when it changes

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Course Image and Details */}
                <StatusBar style="dark" />
                <LinearGradient
                    colors={['#4EBD8C', '#4EBD8C', '#6AD1A4']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)/')}>
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
                                    รายละเอียดคอร์ส {id}
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>

                <View style={styles.detailsContainer}>
                    <Image
                        source={{ uri: 'https://learnsbuy.com/assets/uploads/' + data?.pack?.c_pack_image }}
                        style={styles.courseImage}
                    />
                    <Text style={styles.courseTitle}>{data?.pack?.c_pack_name}</Text>

                    {/* Lesson List */}
                    <View style={styles.lessonSection}>
                        <View style={styles.lessonHeader}>
                            <Text style={styles.lessonTitle}>Overview</Text>
                        </View>


                        <View style={styles.postContentContainer}>
                            <Text style={styles.postDescription}>{data?.pack?.c_pack_detail}</Text>
                        </View>

                        <View style={{ marginTop: 10 }}></View>


                        <View style={styles.lessonHeader}>
                            <Text style={styles.lessonTitle}>Course</Text>

                        </View>
                        <View>
                            <Text style={styles.lessonMeta}>{data?.course.length} Course</Text>
                        </View>


                        <View style={{ marginTop: 10 }}>
                            {/* Lesson Items */}
                            {data?.course && (
                                <View>
                                    {data?.course.map((video, index) => (
                                        <View key={video.id} style={styles.lessonItem}>
                                            <View>
                                                <Image
                                                    source={{ uri: 'https://learnsbuy.com/assets/uploads/' + video?.image_course }} // Replace with actual course image URL
                                                    style={styles.videoImg}
                                                />
                                            </View>
                                            <View style={styles.lessonInfo}>
                                                <Text style={styles.lessonName}>{video?.title_course}</Text>
                                                {/* <Text style={styles.lessonDuration}>{video?.time_video ? video?.time_video : '20'} min</Text> */}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>



                    </View>
                </View>
            </ScrollView>


        </View>
    )

}

export default PackDetail

const styles = StyleSheet.create({
    headerGradient: {
        height: 85,
        width: '100%',
    },
    scrollContainer: {
        paddingBottom: 30,

    },
    listItemCon: {
        marginTop: Platform.select({
            ios: 35,
            android: 35,
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
    postDescription: {
        paddingTop: 0,
        paddingHorizontal: 5,
        color: "#999999",
        fontSize: 14,
        fontFamily: "Prompt_500Medium",
    },

    seeMore: {
        paddingHorizontal: 10,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        color: "#00c402",
        fontSize: 16,
        fontFamily: "Prompt_400Regular",
    },
    postContentContainer: {
        flexDirection: 'column',
    },
    hrstyle: {
        color: '#014b2d'
    },
    video: {
        width: '100%',
        height: 220,
        borderRadius: 20,
    },
    playIcon: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderRadius: 50,
        padding: 0,
        alignItems: 'center',
    },
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 6,
        borderRadius: 50,
    },
    videoImg: {
        width: 80,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    courseImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
        borderRadius: 20,
    },
    detailsContainer: {
        padding: 20,
    },
    courseTitle: {
        marginVertical: 15,
        fontSize: 18,
        fontFamily: 'Prompt_500Medium',
        color: '#000',
    },
    courseInfo: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    infoItem: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    infoItemStart: {
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tabItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    activeTab: {
        backgroundColor: '#d1d1ff',
    },
    tabText: {
        color: '#000',
    },
    activeTabText: {
        color: '#4f4fff',
        fontWeight: 'bold',
    },
    lessonSection: {
        marginBottom: 20,
        paddingBottom: 20
    },
    lessonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,

        borderLeftWidth: 5,
        borderColor: '#4ebd8c',
        fontFamily: 'Prompt_500Medium',
        // borderBottomWidth: 0.5,
        // borderBottomColor: '#4ebd8c',
        paddingVertical: 5,
        paddingLeft: 10
    },
    lessonTitle: {
        fontSize: 20,
        fontFamily: 'Prompt_500Medium',
        color: '#000',
    },
    lessonMeta: {
        fontSize: 14,
        color: '#666',
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
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
    lessonDuration: {
        fontSize: 14,
        color: '#666',
    },
    lessonActions: {
        flexDirection: 'row',
        alignItems: 'center',

    },
});