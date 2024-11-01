import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const MyCourse = () => {
  const [courses, setCourses] = useState(false);
  const navigation = useNavigation();
  const now = new Date(); // Get current date

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
          const response = await axios.post(`https://www.learnsbuy.com/api/getMyCourse`, { token });
          setCourses(response.data.data);
        } else {
          navigation.navigate('(aLogin)');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourse();
  }, []);

  const handlePress = async (course) => {
    const endDate = new Date(course?.end_day); // Convert end_day (YYYY-MM-DD) to Date object
    const isExpired = endDate < now; // Check if the course has expired

    if (isExpired) {
      // Show alert if the course is expired
      Alert.alert('หมดอายุ', 'คอร์สนี้หมดอายุแล้ว ติดต่อเจ้าหน้าที่', [{ text: 'OK' }]);
      return;
    }

    try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('jwt_token');
        
        if (!token) {
            // No token, navigate to login screen
            navigation.navigate('(aLogin)');
            return;  // Exit if not authenticated
        }

        // Make API call to get points
        const response = await axios.post(`https://www.learnsbuy.com/api/get_point_v2`, { token });
        const points = response.data.data;

        // If points are 0, show an alert and don't navigate
        if (points === 0) {
            Alert.alert('Point ไม่เพียงพอ', 'กรุณาติดต่อเจ้าหน้าที่', [{ text: 'OK' }]);
            return;  // Exit if points are insufficient
        }

        // If course is not expired and points are sufficient, navigate to the next screen
        router.push({
            pathname: '(course)/video',
            params: {
                id: course?.course_id,
            },
        });

    } catch (error) {
        console.error('Error handling press:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    }


  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: 'My Courses',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />

      <View>
        <View style={styles.textListHead}>
          <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', textAlign: 'center' }}>My Course</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses && (
          <>
            {courses.map((course, index) => {
              const endDate = new Date(course?.end_day);
              const isExpired = endDate < now;

              return (
                <TouchableOpacity
                  key={course?.course_id}
                  onPress={() => handlePress(course)} // Call handlePress on tap
                >
                  <View style={styles.courseCard}>
                    <Image
                      source={{ uri: 'https://learnsbuy.com/assets/uploads/' + course?.image_course }}
                      style={styles.courseImage}
                    />
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
                        {course?.title_course}
                      </Text>
                      <View style={styles.showFlex}>
                        <FontAwesome5 name="chalkboard-teacher" size={16} color="#666" />
                        <Text style={styles.teacherText}>{course?.te_study} | {course?.code_course}</Text>
                      </View>
                      <View style={styles.progressContainer}>
                        <View style={styles.showFlex}>
                          <Ionicons name="time-outline" size={20} color="#014b2d" />
                          <View>
                            <Text style={styles.progressText}>ใช้ได้ถึง</Text>
                          </View>
                        </View>
                        <Text style={styles.progressText}>
                          {isExpired ? 'หมดอายุ' : course?.end_day}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MyCourse;

const styles = StyleSheet.create({
    showFlex: {
        display: 'flex',
        flexDirection: 'row'
    },
    textListHead: {
        textAlign: 'center',
        marginTop: Platform.select({
            ios: 35,
            android: 35,
        }),
        marginVertical: 20
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 70,
        marginBottom: 20,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    activeTabButton: {
        backgroundColor: '#007bff',
    },
    tabText: {
        fontSize: 14,
        color: '#000',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    scrollContainer: {

        paddingBottom: 30,
    },
    courseCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    courseImage: {
        width: 100,
        height: 80,
        borderRadius: 10,
    },
    courseInfo: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    courseTitle: {
        fontSize: 14,
        fontFamily: "Prompt_500Medium",
        marginBottom: 5,
    },
    teacherText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 5,
        marginLeft: 5,
        fontFamily: "Prompt_400Regular",
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    completedText: {
        fontSize: 13,
        color: '#014b2d',
        fontFamily: "Prompt_500Medium",
        marginLeft: 5
    },
    progressText: {
        fontSize: 12,
        color: '#014b2d',
        fontFamily: "Prompt_500Medium",
        marginLeft: 5,
        textAlignVertical: 'bottom'
    },
    progressBar: {
        height: 6,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#e1e1e1',
    },
});
