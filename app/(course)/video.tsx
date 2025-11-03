import { Image, View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ScreenCapture from 'expo-screen-capture';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { id = 52 } = params;
    const scrollViewRef = useRef(null);

    const [point, setPoint] = useState(0);
    const [data, setData] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const intervalRef = useRef(null);
    const [status, setStatus] = useState({ isPlaying: false });

    // 🎥 ใช้ `useVideoPlayer` จาก `expo-video`
    // const player = useVideoPlayer(videoUrl, (player) => {
    //     if (videoUrl) {
    //         player.loop = false;
    //         player.play();
    //         setStatus({ isPlaying: true });
    //     }
    // }, [videoUrl]);


    const player = useVideoPlayer(
        videoUrl || null,
        (p) => {
            if (videoUrl) {
            p.play();
            }
        },
        [] // ❗️อย่าใส่ [videoUrl] เพราะจะสร้างใหม่ทุกครั้ง
        );

        useEffect(() => {
        if (player && videoUrl) {
            player.replace(videoUrl);
            player.play();
        }
        }, [videoUrl]);

    // 🛑 หยุดวิดีโอเมื่อออกจากหน้า
    useFocusEffect(
        useCallback(() => {
            return () => {
                if (player && typeof player.pause === 'function') {
                    try {
                        player.pause();
                        console.log('🔴 Video Paused');
                    } catch (error) {
                        console.warn('⚠️ Error pausing video:', error.message);
                    }
                }
            };
        }, [player])
    );

    useFocusEffect(
        useCallback(() => {
            const interval = setInterval(() => {
                if (player) {
                    setStatus({ isPlaying: player.playing });
                    console.log("🎥 Video Playing Status:", player.playing);
                }
            }, 1000);
    
            return () => {
                console.log("🧹 Cleaning up interval...");
                clearInterval(interval);
            };
        }, [player])
    );
    
    


    // ฟังก์ชันตัดคะแนนทุก 5 วินาทีเมื่อเล่นวิดีโอ
    const startDeductingPoints = () => {
        if (intervalRef.current) {
            console.log('⚠️ Interval already running, skipping...');
            return;
        }
    
        console.log('🔥 Starting point deduction every 5 seconds');
    
        intervalRef.current = setInterval(async () => {
            console.log('⏳ Deducting points...');
    
            // setPoint((prevPoint) => (prevPoint > 0 ? prevPoint - 5 : 0));
    
            try {
                const token = await AsyncStorage.getItem('jwt_token');
                console.log('🔑 Token:', token);
    
                if (!token) {
                    console.error('⚠️ Token is missing');
                    return;
                }
    
                const { data } = await axios.post('https://www.learnsbuy.com/api/del_point_v4', { token });
                console.log('✅ Points deducted:', data?.data);
                setPoint(data?.data)
                if (data?.data === 0) {
                    console.log('🚫 คะแนนหมด, กลับไปหน้าก่อนหน้า');
                    navigation.goBack();
                }
            } catch (err) {
                console.log('❌ Error deducting points:', err);
            }
        }, 5000);
    };
    

    // ฟังก์ชันหยุดตัดคะแนนเมื่อหยุดวิดีโอ
    const stopDeductingPoints = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('🛑 Interval cleared, stopping point deduction');
        }
    };

    // เรียกใช้งานเมื่อสถานะวิดีโอเปลี่ยนแปลง
    useEffect(() => {
        console.log("🎥 Player Status:", player?.status, "Playing:", player?.playing);
    
        if (player?.status === "readyToPlay" && player?.playing) {
            console.log("✅ Video is playing, calling startDeductingPoints()");
            startDeductingPoints();
        } else {
            console.log("⏸ Video is not playing, stopping deduction");
            stopDeductingPoints();
        }
    
        return () => {
            console.log("🧹 Cleaning up interval...");
            stopDeductingPoints();
        };
    }, [player?.status, player?.playing]);
    
    
    

    useEffect(() => {
        ScreenCapture.preventScreenCaptureAsync();
        return () => ScreenCapture.allowScreenCaptureAsync();
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt_token');
                if (token) {
                    const response = await axios.post(`https://www.learnsbuy.com/api/getCourseByID/${id}`, { token });
    
                 //   console.log('API Response:', response.data.courses);
                    setData(response.data.courses);
    
                    if (response?.data?.courses?.count_video?.length > 0) {
                        const firstVideo = response.data.courses.count_video[0];
                        setSelectedVideo({
                            title: firstVideo.course_video_name,
                            url: firstVideo.course_video_url,
                        });
                        setVideoUrl(firstVideo.course_video_url);
                    }
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
        fetchPoint();
        fetchData();
    }, [id]);
    

    const handleVideoSelect = (video) => {
        if (video?.course_video_url && video.course_video_url !== videoUrl) {
            setVideoUrl(video.course_video_url);
            setSelectedVideo({
                title: video.course_video_name,
                url: video.course_video_url,
            });
    
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };
    
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

            <LinearGradient
                            colors={['#4EBD8C', '#4EBD8C', '#6AD1A4']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.headerGradient}
                        >
                            <View style={styles.listItemCon}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                    <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)/mycourse')}>
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
                                        Point {point}
                                        </Text>
                                    </View>
            
                                    {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                                    <View style={{ width: 32 }} />
                                </View>
            
                            </View>
                        </LinearGradient>
                        <View style={styles.container}>
                    {selectedVideo?.url ? (
                        <VideoView
                        key={videoUrl} // บังคับให้ React remount component
                        player={player}
                        style={styles.video}
                        useNativeControls
                        allowsFullscreen
                        allowsPictureInPicture
                        />
                    ) : (
                        <Text style={styles.errorText}>No Video Available</Text>
                    )}
                </View>

            <ScrollView ref={scrollViewRef}>
                

                <View>
                    <View style={styles.lessonSection}>
                        <View style={styles.lessonHeader}>
                        <View>
                            <Text style={styles.lessonMeta}>{data?.count_video?.length} Lessons</Text>
                        </View>
                        </View>
                        <View>
                        <Text style={styles.lessonMeta}>
                       
                        </Text>

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
                                                <Image
                                                    source={{ uri: 'https://learnsbuy.com/assets/uploads/' + video?.thumbnail_img }}
                                                    style={styles.videoImg}
                                                />
                                                <View style={styles.lessonInfo}>
                                                    <Text style={styles.lessonName}>{video?.course_video_name}</Text>
                                                    <Text style={styles.lessonDuration}>
                                                        {video?.time_video ? video?.time_video : '20'} min
                                                    </Text>
                                                </View>
                                                <View style={styles.lessonActions}>
                                                    <Ionicons name="play-circle-outline" size={24} color="#dc3545" />
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
    headerGradient: {
        height: Platform.select({
            ios: 65,
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
            ios: 10,
            android: 5,
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
        marginTop: Platform.select({
            ios: -10,
            android: -15,
        }),
    },
    video: {
        height: 250,
        width: '100%',
        backgroundColor: 'black', // เพิ่มบรรทัดนี้
    },
    lessonSection: {
        paddingHorizontal: 15,
        marginBottom: 20,
        paddingBottom: 20,
    },
    lessonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderLeftWidth: 5,
        borderColor: '#4ebd8c',
        paddingVertical: 5,
        paddingLeft: 10,
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
        borderBottomWidth: 0.5,
        borderColor: '#4ebd8c',
        paddingVertical: 5
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
