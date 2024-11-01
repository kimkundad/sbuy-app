import { Image, View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Stack, router, useRouter, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode, VideoFullscreenUpdate } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id = 52 } = params;

    const video = useRef(null);
    const scrollViewRef = useRef(null);  // ScrollView ref
    const [point, setPoint] = useState(0);
    const [status, setStatus] = useState({});
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [data, setData] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const intervalRef = useRef(null); // To store the interval reference

    // Function to handle point deduction
    const startDeductingPoints = () => {
        // Clear any existing intervals before starting a new one
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    
        // Start interval to deduct points every 5 seconds
        intervalRef.current = setInterval(async () => {
            setPoint((prevPoint) => (prevPoint > 0 ? prevPoint - 5 : 0));
    
            const token = await AsyncStorage.getItem('jwt_token');
    
            if (!token) {
                console.error('Token is missing');
                return;
            }
    
            try {
                const { data } = await axios.post('https://www.learnsbuy.com/api/del_point_v4', {
                    token
                });
                console.log('Points deducted successfully:', data?.data);
                if(data?.data === 0){
                    navigation.goBack();
                }
            } catch (err) {
                console.log('Error deducting points:', err);
            }
            
        }, 5000); // Deduct points every 5 seconds
    };

    // Function to stop point deduction
    const stopDeductingPoints = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Stop the interval when video is paused or stopped
            intervalRef.current = null;
        }
    };

    // Effect to handle video playback status changes
    useEffect(() => {
        if (status.isPlaying) {
            startDeductingPoints(); // Start deducting points when video is playing
        } else {
            stopDeductingPoints(); // Stop deducting points when video is paused or stopped
        }

        // Clean up the interval when the component unmounts
        return () => {
            stopDeductingPoints();
        };
    }, [status.isPlaying]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt_token');
                if (token) {
                    const response = await axios.post(`https://www.learnsbuy.com/api/getCourseByID/${id}`, { token });
                    setData(response.data.courses);

                    // Set the first video as the default selected video
                    setSelectedVideo({
                        title: response?.data?.courses?.count_video[0]?.course_video_name,
                        url: response?.data?.courses?.count_video[0]?.course_video_url,
                    });
                } else {
                    navigation.navigate('(aLogin)');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        const fetchPoint = async () => {
            try {
                // Get token from AsyncStorage
                const token = await AsyncStorage.getItem('jwt_token');
        
                if (token) {
                    // Make API call to get points
                    const response = await axios.post(`https://www.learnsbuy.com/api/get_point_v2`, { token });
        
                    const points = response.data.data;
        
                    // Set points state
                    if (points !== null && points !== undefined) {
                        setPoint(points);
                    }
        
                    // If points are 0, navigate back
                    if (points === 0) {
                        navigation.goBack();
                    }
        
                } else {
                    // No token, navigate to login screen
                    navigation.navigate('(aLogin)');
                }
            } catch (error) {
                // Log the error
                console.error('Error fetching points:', error);
            }
        };
        

        fetchData();
        fetchPoint();
    }, [id]);

    // Detect when selectedVideo changes and load the new video
    useEffect(() => {
        const loadVideo = async () => {
            if (selectedVideo?.url && video.current) {
                try {
                    // Unload any previous video before loading a new one
                    await video.current.unloadAsync();

                    // Log the selected video URL for debugging
                    console.log("Loading video URL:", selectedVideo?.url);

                    // Load the new video source
                    await video.current.loadAsync(
                        { uri: selectedVideo.url },
                        { shouldPlay: true }  // Automatically play the video once loaded
                    );
                } catch (error) {
                    console.error('Error loading video:', error);
                    Alert.alert('Error', `Failed to load video: ${error.message}`);
                }
            }
        };

        loadVideo();
    }, [selectedVideo?.url]);

    const handleVideoSelect = (video) => {
        const videoUrl = video?.course_video_url;

        // Log the selected video URL for debugging
        console.log("Selected video URL:", videoUrl);

        // Set the selected video details when a video is pressed
        setSelectedVideo({
            title: video.course_video_name,
            url: videoUrl,
        });

        // Scroll to the top of the ScrollView
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: 'Point '+ point,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: 'black',
                        fontFamily: 'Prompt_500Medium',
                        fontSize: 18,
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
                }}
            />

<ScrollView ref={scrollViewRef}>
                <View style={styles.mainPage}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={styles.courseTitle}>
                            {selectedVideo ? selectedVideo.title : 'Select a video to view details'}
                        </Text>
                    </View>
                </View>

                <View style={styles.container}>
                    <Video
                        ref={video}
                        style={isFullscreen ? styles.fullscreenVideo : styles.video}
                        source={{
                            uri: selectedVideo?.url || 'https://learnsbuy.com/assets/videos/1709478799.mp4', // Default video source (fallback)
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                        onFullscreenUpdate={async ({ fullscreenUpdate }) => {
                            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_PRESENT) {
                                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                            } else if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS) {
                                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                            }
                        }}
                    />
                </View>

                <View>
                    <View style={styles.lessonSection}>
                        <View style={styles.lessonHeader}>
                            <Text style={styles.lessonTitle}>Lessons</Text>
                        </View>
                        <View>
                            <Text style={styles.lessonMeta}>{data?.count_video?.length} Lessons</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            {data?.count_video && (
                                <View>
                                    {data?.count_video.map((video) => (
                                        <TouchableOpacity
                                            key={video.id}
                                            onPress={() => handleVideoSelect(video)}
                                        >
                                            <View style={styles.lessonItem}>
                                                <View>
                                                    <Image
                                                        source={{ uri: 'https://learnsbuy.com/assets/uploads/' + video?.thumbnail_img }}
                                                        style={styles.videoImg}
                                                    />
                                                </View>
                                                <View style={styles.lessonInfo}>
                                                    <Text style={styles.lessonName}>{video?.course_video_name}</Text>
                                                    <Text style={styles.lessonDuration}>
                                                        {video?.time_video ? video?.time_video : '20'} min
                                                    </Text>
                                                </View>
                                                <View style={styles.lessonActions}>
                                                    <View style={styles.playIcon}>
                                                        <Ionicons name="play-circle-outline" size={24} color="#dc3545" />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttons: {

    },
    postContentContainer: {
        flexDirection: 'column',
    },
    hrstyle: {
        color: '#014b2d'
    },
    videoImg: {
        width: 80,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    playIcon: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderRadius: 50,
        padding: 0,
        alignItems: 'center',
    },
    courseTitle: {
        fontSize: 15,
        fontFamily: 'Prompt_500Medium',
        color: '#000',
    },
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 6,
        borderRadius: 50,
    },
    container: {
    },
    mainPage: {
        marginTop: Platform.select({
            ios: 75,
            android: 65,
        }),
    },
    video: {
        height: 250
    },
    fullscreenVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    lessonSection: {
        paddingHorizontal: 15,
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
