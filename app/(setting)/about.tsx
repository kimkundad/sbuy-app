import { Image, View, Text, StyleSheet, Platform, TextInput, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const { width } = Dimensions.get('window');
const win = Dimensions.get('window');
const ratio = win.width / 541; //541 is actual image width

const About = () => {

    const navigation = useNavigation(); // สำหรับปุ่ม Back

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
            <StatusBar style="dark" />
            <ScrollView>
            <Stack.Screen options={{
                    headerTransparent: true,
                    headerTitle: 'เกี่ยวกับเรา Learnsbuy',
                    headerTitleAlign: 'center', // Center the header title
                    headerTitleStyle: {
                        color: 'black', // กำหนดสีของ headerTitle
                        fontFamily: 'Prompt_500Medium', // กำหนดฟอนต์
                        fontSize: 16
                    },
                    contentStyle: {
                      backgroundColor: 'white', // เพิ่มพื้นหลังสีขาวให้กับหน้าจอ
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
                    
                }} />
                <View>
                    <View style={{ marginTop: 0, }}>

                        <View style={styles.container}>


                        <View >

<View style={{
    flexDirection: 'row'
}}>
    <Image
        style={styles.imageStyle}
        source={require("../../assets/images/IMG_2647-1-2.png")}
    />
</View>

<View style={{
    flexDirection: "column",
    marginTop: 0,
    paddingHorizontal: 10,
}}>


    <View style={{
        alignItems: "center",
    }}>
        <Text style={{
            fontSize: 22,
            color: "#038206",
            fontFamily: "Prompt_500Medium",
        }}>ครูพี่โฮม</Text>
        <Text style={{
            fontSize: 14,
            color: "#666",
            fontFamily: "Prompt_500Medium",
        }}>ผู้ก่อตั้งสถาบันสอนถาษาญี่ปุ่น "เสาหลักแห่งศิลป์ญี่ปุ่น"</Text>
    </View>
    <View style={{
        alignItems: "center",
    }}>
        <Text style={{
            fontSize: 16,
            color: "#666",
            marginTop: 5,
            fontFamily: "Prompt_500Medium",
        }}>พรหมเทพ ชัยกิตติวณิชย์ (ครูพี่โฮม ZA-SHI)</Text>
        <Text style={{ fontFamily: "Prompt_400Regular", color: "#666",}}>สถาบันติว PAT ญี่ปุ่นและภาษาญี่ปุ่น ZA-SHI ภาษาญี่ปุ่น (ครูพี่โฮม) คนแรกและคนเดียวที่ได้ PAT ญี่ปุ่น 300 คะแนนเต็ม เกียรตินิยมอันดับ 1 (เหรียญทอง) อักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</Text>

    </View>

    <View
        style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
        }}
    >
        <View style={{
            backgroundColor: "#32d19129",
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 20
        }}>
            <Feather name="check-circle" size={20} color="#00c402" />
        </View>
        <View>
            <Text style={{
                color: "#000",
                fontSize: 12,
                paddingHorizontal: 20,
                fontFamily: "Prompt_500Medium",
                maxWidth: '100%'
            }}>
                อักษรศาสตร์บัณฑิต จุฬาลงกรณ์มหาวิทยาลัย เกียรตินิยมอันดับ 1 (เหรียญทอง) เอกภาษาญี่ปุ่น
            </Text>
        </View>
    </View>
    <View
        style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
        }}
    >
        <View style={{
            backgroundColor: "#32d19129",
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 20
        }}>
            <Feather name="check-circle" size={20} color="#00c402" />
        </View>
        <View>
            <Text style={{
                color: "#000",
                fontSize: 12,
                paddingHorizontal: 20,
                fontFamily: "Prompt_500Medium",
                maxWidth: '100%'
            }}>
                (ครูพี่โฮม) คนแรกและคนเดียวในประเทศไทยที่สอบ PAT ภาษาญี่ปุ่นได้ 300 คะแนนเต็ม
            </Text>
        </View>
    </View>
    <View
        style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
        }}
    >
        <View style={{
            backgroundColor: "#32d19129",
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 20
        }}>
            <Feather name="check-circle" size={20} color="#00c402" />
        </View>
        <View>
            <Text style={{
                color: "#000",
                fontSize: 12,
                paddingHorizontal: 20,
                fontFamily: "Prompt_500Medium",
                maxWidth: '100%'
            }}>
                ติวเตอร์ภาษาญี่ปุ่นอันดับ 1 ผู้ก่อตั้งสถาบันสอนถาษาญี่ปุ่น Za-shi, Learnsabuy มีสถิติติวลูกศิษย์ที่ติดอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ได้มากที่สุด
            </Text>
        </View>
    </View>
    <View
        style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
        }}
    >
        <View style={{
            backgroundColor: "#32d19129",
            paddingVertical: 4,
            paddingHorizontal: 6,
            borderRadius: 20
        }}>
            <Feather name="check-circle" size={20} color="#00c402" />
        </View>
        <View>
            <Text style={{
                color: "#000",
                fontSize: 12,
                paddingHorizontal: 20,
                fontFamily: "Prompt_500Medium",
                maxWidth: '100%'
            }}>
                ติวเตอร์ภาษาญี่ปุ่นที่ได้รับเชิญจากสื่อชั้นนำระดับประเทศ ไปตัว PAT ทั้งทาง GTH ON AIR (PLAY CHANNEL) และ TRUE VISIONS หรือ Trueplookpanya ( AdGang59 : 42 PAT 7 ภาษาญี่ปุ่น ครูพี่โฮม ZA-SHI )
            </Text>
        </View>
    </View>

    <View style={{
        alignItems: "center",
    }}>
        <Text style={{
            fontSize: 16,
            color: '#038206',
            marginTop: 5,
            fontFamily: "Prompt_500Medium",
        }}>ผลงานและรางวัล (ครูพี่โฮม)</Text>


        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                    ราลวัลชนะเลิศอันดับที่ 1 ในการแข่งขันเขียนเรียงความภาษาญี่ปุ่นในระดับอุดมศึกษาทั่วประเทศ
                </Text>
            </View>
        </View>


        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                ได้รับทุนการศึกษาไปเรียนภาษาญี่ปุ่น ณ กรุงโตเกียว ประเทศญี่ปุ่น
                </Text>
            </View>
        </View>


        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                ประกาศนียบัตรนิสิตอักษรศาสตร์ที่มีผลการเรียนดีเด่น เงินทุนศาสตราจารย์ รอง ศยามานนท์ - คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย
                </Text>
            </View>
        </View>

        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                    ตัวแทนเอกภาษาญี่ปุ่นและจุฬาลงกรณ์มหาวิทยาลัย กล่าวสุนทรพจน์ภาษาญี่ปุ่นขอบคุณประธานบริษัทและคณะผู้บริหารบริษัท โตโยต้า มอเตอร์ (ประเทศไทย) จำกัด เนื่องในโอกาสที่มาเยือนจุฬาลงกรณ์มหาวิทยาลัย
                </Text>
            </View>
        </View>

        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                    ตัวแทนเอกภาษาญี่ปุ่นและจุฬาลงกรณ์มหาวิทยาลัย กล่าวสุนทรพจน์ภาษาญี่ปุ่นขอบคุณประธานบริษัทและคณะผู้บริหารบริษัท ธนาคาร Mitsubishi Tokyo UFJ ประเทศญี่ปุ่น เนื่องในโอกาสที่มาเยือนจุฬาลงกรณ์มหาวิทยาลัย
                </Text>
            </View>
        </View>

        <View
            style={{
                flexDirection: "row",
                padding: 10,
                alignItems: "center",
            }}
        >
            <View style={{
                backgroundColor: "#32d19129",
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 20
            }}>
                <Feather name="check-circle" size={20} color="#00c402" />
            </View>
            <View>
                <Text style={{
                    color: "#000",
                    fontSize: 12,
                    paddingHorizontal: 20,
                    fontFamily: "Prompt_500Medium",
                    maxWidth: '100%'
                }}>
                   หัวหน้าโครงการภาษาญี่ปุ่นงานจุฬาลงกรณ์มหาวิทยาลัย วิชาการ คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย
                </Text>
            </View>
        </View>

    </View>


</View>

</View>
                            
                        
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default About

const styles = StyleSheet.create({

    container: {
        padding: 10,
        paddingHorizontal: 12,
        marginTop: Platform.select({
          ios: 70,
          android: 75,
        }),
      },
      imageStyle: {
        width: win.width,
        height: 362 * ratio, //362 is actual height of image
        marginBottom: 20,
        flex: 1,
        borderRadius: 8,
    },
      backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
    },
    header: {
        fontSize: 16, 
        fontFamily: 'Prompt_500Medium'
    },
    mt10: {
        marginTop: 10
    },
    textDetail: {
        fontSize: 14, 
        fontFamily: 'Prompt_400Regular'
    },
    textListHead2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 0.5,
        paddingBottom: 20
    },
    textSeting : {
        fontSize: 16, 
        fontFamily: 'Prompt_400Regular'
      },
    image: {
        width: width, // Full width of the screen
        height: 200,  // Set the height as needed
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    contactBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 15,
        borderColor: '#666',
        borderRadius: 99,
        width: 200,
    },
    textListHead: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        fontFamily: 'Prompt_400Regular',
    },
    iconAdd: {
        color: '#f47524',
    },
    addBranch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 1
    },
    headerPage: {
        padding: 20,
        fontFamily: 'Prompt_500Medium',
        fontSize: 18,
        marginTop: -5
    },
    listItemCon: {
        paddingTop: 40,
        paddingHorizontal: 0,
        backgroundColor: '#fff',
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
    card: {
        marginTop: -5,
        position: 'static',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10
    },
    headBranch: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 15,
        marginTop: -3
    },
    phoneText: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 12,
        marginTop: -5
    },
    addressText: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 11,
        lineHeight: 15,
        marginTop: 5,
        height: 30,
        color: '#666'
    },
    innerItem: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 1,
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 0.5, // Specifies the width of the bottom border
        borderBottomColor: '#d7d7d7',
    },
});