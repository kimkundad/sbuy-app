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

const CourseDetail = () => {

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

                    const response = await axios.post(`https://www.learnsbuy.com/api/getCourseByID/${id}`, { token: token });
                    // Set the data to state or handle the response
                    setData(response.data.courses);

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
                                    รายละเอียดคอร์ส
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>

                <View style={styles.detailsContainer}>
                    {data?.courses?.url_youtube ? (
                        // If YouTube URL is available, embed the video
                        <WebView
                            style={styles.video}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ uri: data?.courses?.url_youtube }}  // Load YouTube video
                        />
                    ) : (
                        // Otherwise, show the course image
                        <Image
                            source={{ uri: 'https://learnsbuy.com/assets/uploads/' + data?.courses?.image_course }}
                            style={styles.courseImage}
                        />
                    )}
                    <Text style={styles.courseTitle}>{data?.courses?.title_course}</Text>
                    <View style={styles.courseInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={20} color="#014b2d" />
                            <Text style={styles.hrstyle}> {data?.courses?.pack_hr ? data?.courses?.pack_hr : '2h'}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather name="box" size={14} color="#014b2d" />
                            <Text style={{ color: '#014b2d' }}> {data?.courses?.code_course}</Text>
                        </View>
                        <View style={styles.infoItemStart}>
                            <MaterialIcons name="star" size={16} color="#ffd700" />
                            <Text>{data?.courses?.rating ? data?.courses?.rating : '5.0'}</Text>
                        </View>
                    </View>




                    {/* Lesson List */}
                    <View style={styles.lessonSection}>
                        <View style={styles.lessonHeader}>
                            <Text style={styles.lessonTitle}>Overview</Text>
                        </View>


                        <View style={styles.postContentContainer}>
                            {data?.courses?.detail_course.length > 300 ? (
                                showMore ? (
                                    <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                                        <Text style={styles.postDescription}>{data?.courses?.detail_course}</Text>
                                        <Text style={styles.seeMore}>Show less</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                                        <Text style={styles.postDescription}>
                                            {`${data?.courses?.detail_course.slice(0, 300)}... `}
                                        </Text>
                                        <Text style={styles.seeMore}>Show more</Text>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <Text style={styles.postDescription}>{data?.courses?.detail_course}</Text>
                            )}
                        </View>

                        <View style={{ marginTop: 10 }}></View>


                        <View style={styles.lessonHeader}>
                            <Text style={styles.lessonTitle}>Lessons</Text>

                        </View>
                        <View>
                            <Text style={styles.lessonMeta}>{data?.count_video.length} Lessons</Text>
                        </View>


                        <View style={{ marginTop: 10 }}>
                            {/* Lesson Items */}
                            {data?.count_video && (
                                <View>
                                    {data?.count_video.map((video, index) => (
                                        <View key={video.id} style={styles.lessonItem}>
                                            <View>
                                                <Image
                                                    source={{ uri: 'https://learnsbuy.com/assets/uploads/' + video?.thumbnail_img }} // Replace with actual course image URL
                                                    style={styles.videoImg}
                                                />
                                            </View>
                                            <View style={styles.lessonInfo}>
                                                <Text style={styles.lessonName}>{video?.course_video_name}</Text>
                                                <Text style={styles.lessonDuration}>{video?.time_video ? video?.time_video : '20'} min</Text>
                                            </View>
                                            <View style={styles.lessonActions}>
                                                <View style={styles.playIcon}>
                                                    <View
                                                        style={{
                                                            padding: 4,
                                                            borderRadius: 50,
                                                        }}
                                                    >
                                                        <Ionicons name="play-circle-outline" size={24} color="#dc3545" />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.enrollButton} onPress={() => router.push({
                        pathname: '(payment)/',
                        params: { data: JSON.stringify(data) }
                      })}>
                    <Text style={styles.enrollButtonText}>จองคอร์สเรียน</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default CourseDetail

const styles = StyleSheet.create({
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff00',
        padding: 10,
    },
    enrollButton: {
        backgroundColor: '#44a77b',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    enrollButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Prompt_500Medium',
    },
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