import { Image, View, Text, StyleSheet, Dimensions, Platform, TextInput, Alert, ImageBackground, ActivityIndicator, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';
import { Link, useNavigation, router, Stack, useRouter } from 'expo-router';
import React, { useEffect, useContext, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const { width: screenWidth } = Dimensions.get('window');

const categories = [
  {
    id: 1,
    name: "ภาษาญี่ปุ่น",
  },
  {
    id: 2,
    name: "ภาษาเกาหลี",
  },
  {
    id: 3,
    name: "ภาษาจีน",
  },
  {
    id: 4,
    name: "ภาษาเยอรมัน",
  },
  {
    id: 5,
    name: "ภาษาอื่นๆ",
  },
];

export default function HomeScreen({ navigation }) {

  const [activeIndex, setActiveIndex] = useState(0);
  const { userProfile, logout } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [getSlide, setGetSlide] = useState(false);
  const [getPacKage, setPacKage] = useState(false);
  const [getCourse, setCourse] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [sortData, setSortData] = useState(0)
  const [myPoint, setMyPoint] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        navigation.navigate('Login');
      }
    };

    const fetchSlide = async () => {
      try {
        const response = await axios.get('https://www.learnsbuy.com/api/slide_show_app');

        // Set the data to state or handle the response
        setGetSlide(response.data.data);
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    const fetchPacKage = async () => {
      try {
        const response = await axios.get('https://www.learnsbuy.com/api/get_package_all_app');

        // Set the data to state or handle the response
        setPacKage(response.data.data.get_package);
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };



    fetchPacKage();
    checkAuth();
    fetchSlide();

  }, []);


  const get_userby_id = async () => {
    try {
    //  console.log('userProfile', userProfile?.id)
      const response = await axios.get(`https://www.learnsbuy.com/api/get_userby_id/${userProfile?.id}`);

      // Set the data to state or handle the response
      setMyPoint(response?.data?.data?.user_coin);
    //  console.log('user_coin', response?.data?.data?.user_coin)
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };


  // เรียก get_userby_id เฉพาะเมื่อ userProfile พร้อมแล้ว
  useEffect(() => {
    if (userProfile?.id) {
      get_userby_id();
    }
  }, [userProfile?.id]); // ให้ useEffect ทำงานเมื่อ userProfile.id เปลี่ยนแปลง

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://www.learnsbuy.com/api/all_cource_app/${sortData}`);
        setCourse(response.data.data.get_course);  // Update the course data based on the sort
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourse();  // Fetch courses whenever sortData changes
  }, [sortData]);  // Re-run effect when sortData changes

  useEffect(() => {
    console.log('userProfile', userProfile)
  }, [userProfile]);

  const padding = 20;
  const carouselWidth = screenWidth - padding * 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <View style={styles.container1}>
        <FlatList
          data={getCourse} // Assuming `getCourse` is the main data
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}

          // Header component with other content
          ListHeaderComponent={() => (
            <View >
              {/* Profile Section */}
              <View style={styles.profileMain}>
                <View style={styles.profile}>

                  <View style={styles.borderAvatar}>
                    <Image
                      style={styles.userImage}
                      source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
                  </View>

                  {userProfile ? (
                    <View>
                      <View style={styles.showflex}>
                        <Text style={{
                          color: Colors.white, fontSize: 12, fontFamily: 'Prompt_500Medium', fontWeight: 700, marginRight: 5
                        }}>POINT</Text>
                        <Text style={{
                          color: Colors.white, fontSize: 12, fontFamily: 'Prompt_400Regular', marginTop: -2
                        }}>{myPoint?.toLocaleString()}</Text>
                      </View>
                      <Text style={{ color: Colors.white, fontSize: 16, fontFamily: 'Prompt_400Regular', marginTop: -5 }}>{userProfile.name},</Text>
                    </View>
                  ) : (
                    <Text style={{ color: Colors.white, fontSize: 20 }}>Loading...</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}>
                  <View>
                    <Ionicons name="notifications-outline" size={27} color="white" />
                  </View>
                </TouchableOpacity>

              </View>
            

              {/* Slider Section */}
              <View style={styles.slideImg}>
                <View style={styles.boxGiffSlide}>

                  <View>
                    {Array.isArray(getSlide) && getSlide.length > 0 ? (
                      <>
                        <Carousel
                          loop
                          width={carouselWidth}
                          height={150}
                          autoPlay={true}
                          autoPlayInterval={4000}
                          data={getSlide}
                          scrollAnimationDuration={1000}
                          onSnapToItem={(index) => setActiveIndex(index)}  // Track the active slide
                          renderItem={({ index }) => (

                            <View>
                              <Image
                                source={{ uri: getSlide[index] }}  // นำ URL มาแสดงเป็นภาพ
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  resizeMode: 'cover',
                                  borderRadius: 5,
                                }}
                              />
                            </View>

                          )}
                        />
                        {/* Custom Pagination Dots */}
                        <View style={styles.pagination}>
                          {getSlide.map((_, index) => (
                            <View
                              key={index}
                              style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : styles.inactiveDot, // Different styles for active and inactive dots
                              ]}
                            />
                          ))}
                        </View>
                      </>
                    ) : (
                      <View>
                        <Text style={{ color: Colors.white, fontSize: 20 }}>Loading...</Text>
                      </View>
                    )}
                  </View>

                </View>
              </View>


              {/* Packages Section */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuHeader1}>แพ็กเกจสุดคุ้ม</Text>
                <Text style={styles.menuHeader2}>ทั้งหมด</Text>
              </View>

              <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {getPacKage && (
        <>
      {getPacKage.map((pack, index) => (
        <View key={index} style={styles.card}>
          <Image source={{ uri: 'https://learnsbuy.com/assets/uploads/' + pack.c_pack_image }} style={styles.image} />
          <Text style={styles.price} >{pack.c_pack_price?.toLocaleString()}</Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{pack.c_pack_name}</Text>
          <View style={{ paddingHorizontal: 5 }}>
          <View style={styles.courseInfo}>
          
          </View>
          </View>
        </View>
      ))}
      </>
    )}
    </ScrollView>

              {/* Categories Section */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuHeader1}>คอร์สเรียนทั้งหมด</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
              >
                {/* Category Items here */}
              </ScrollView>
            </View>
          )}

          renderItem={({ item }) => (

            <View style={styles.scrollContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '(course)/courseDetail',
                    params: { id: item.c_id },
                  });
                }}
              >
                <View style={styles.cardPro}>
                  <Image source={{ uri: 'https://learnsbuy.com/assets/uploads/' + item.image_course }} style={styles.imagePro1} />
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>{item.price_course?.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title_course}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#ffd700" />
                    <Text style={styles.rating}>{item.rating ? item.rating : '5.0'}</Text>
                    <Text style={styles.students}>
                      {item.view_course === 0 ? Math.floor(Math.random() * (100 - 500 + 1)) + 500 : item.view_course} students
                    </Text>
                  </View>
                  <View style={styles.teacherContainer}>
                    <Text style={styles.teacherName}>{item.te_study}</Text>
                    <Text style={styles.category}>{item.code_course}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          )}
        />
      </View>
    </SafeAreaView >
  );


}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
    marginTop: 0
  },
  imagePro1: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',

  },
  cardPro: {
    width: (screenWidth / 2) - 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 0,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  imageProduct: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  students: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  teacherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teacherName: {
    fontSize: 12,
    color: '#666',
  },
  priceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ed1c24',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  category: {
    fontSize: 12,
    color: '#007bff',
  },
  priceText: {
    color: '#fff',
    fontFamily: 'Prompt_500Medium',
  },
  courseTitle: {
    fontSize: 13,
    fontFamily: 'Prompt_400Regular',
    marginBottom: 5,
    color: '#000',
  },
  card: {
    width: screenWidth * 0.7,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    position: 'absolute',
    bottom: 40,
    right: 12,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Prompt_500Medium',
    backgroundColor: '#ed1c24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Prompt_500Medium',
    marginTop: 5,
    paddingHorizontal: 5
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
  },
  lessonText: {
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'center',
    marginLeft: 5
  },
  rating: {
    fontSize: 12,
    color: '#000',
    borderRightWidth: 1,
    borderColor: '#ddd',
    marginRight: 1,
    paddingRight: 3
  },
  durationText: {
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'center',
    marginLeft: 5
  },
  menuHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  menuHeader1: {
    fontSize: 18,
    fontFamily: 'Prompt_500Medium',
  },
  menuHeader2: {
    fontSize: 16,
    fontFamily: 'Prompt_400Regular',
    textAlignVertical: 'bottom',
    color: '#666'
  },
  containerBlue: {
    backgroundColor: '#4ebd8c',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 200,
    position: 'absolute',
    width: '100%'
  },
  borderAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 4,
    alignItems: 'center',
  },
  slideImg: {
    marginTop: 0
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#4ebd8c',  // Color for the active dot
  },
  inactiveDot: {
    backgroundColor: 'gray',  // Color for the inactive dots
  },
  container1: {
    padding: 20,
    marginTop: Platform.select({
 
    }),
  },
  profileMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  showflex: {
    display: 'flex',
    flexDirection: 'row',
  },
  boxGiff: {
    position: 'static',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,

  },
  boxGiffSlide: {
    position: 'static',
    borderRadius: 5,
    marginTop: 10,
  },
  textGiffblack: {
    color: Colors.gray,
    fontSize: 17,
    fontWeight: '700'
  },
  textGifforange: {
    color: '#f47524',
    fontSize: 18,
    fontWeight: '700'
  },
  headGiff: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  giftContent: {
    display: 'flex',
    flexDirection: 'row'
  },
});
