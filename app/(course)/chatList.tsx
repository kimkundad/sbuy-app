import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Image, View, Text, Switch, StyleSheet, Platform, Alert, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import moment from 'moment';

const ChatList = () => {

    const [studentChats, setStudentChats] = useState([]);

    useEffect(() => {
        axios.get('https://chat.learnsbuy.com/students-chats')
            .then(response => {
                setStudentChats(response.data);
            })
            .catch(error => console.error("❌ Error fetching student chats:", error));
    }, []);

    const formatDate = (timestamp) => {
        const date = moment(timestamp);
        
        if (date.isSame(moment(), 'day')) {
            return `วันนี้ ${date.format('HH:mm')}`; // ถ้าเป็นวันนี้ เช่น "วันนี้ 14:30"
        } else if (date.isSame(moment().subtract(1, 'day'), 'day')) {
            return `เมื่อวาน ${date.format('HH:mm')}`; // ถ้าเป็นเมื่อวาน เช่น "เมื่อวาน 10:15"
        } else {
            return date.format('D MMM YYYY'); // วันที่ธรรมดา เช่น "3 ก.พ. 2025"
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
                        <TouchableOpacity style={styles.btnBack} onPress={() => 
                            router.push('(tabs)/')
                            }>
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
                                ข้อความนักเรียน
                            </Text>
                        </View>

                        {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                        <View style={{ width: 32 }} />
                    </View>

                </View>
            </LinearGradient>
      

                <View style={styles.container}>

                <FlatList
    data={studentChats}
    keyExtractor={(item) => item.student_id.toString()}
    renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            // handle onPress
                           router.push({
                                pathname: "(course)/chat",
                                params: { student_id: item.student_id, teacher_id: 1, student_name: item.name, avatar: "timeline_25610920_165705.jpg", current_user_id: 1 },
                            });
                        }}>
                        <View style={styles.textListHead2}>
                            <View style={styles.profile}>
                                <View style={item.is_read === 0 ? styles.obtnRed : styles.obtn}>
                                    <View
                                        style={{
                                            padding: 1,
                                            borderRadius: 50
                                        }}
                                    >
                                        <Image
                                            style={styles.userImage}
                                            source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
                                    </View>
                                </View>

                                <View>
                                    <Text style={styles.textSeting}>{item.name}</Text>
                                    <Text style={styles.textSetingMsg}>{item.message}</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.textDate}>{formatDate(item.created_at)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )}
/>
                
                </View>

  
        </SafeAreaProvider>

    );

};

export default ChatList;

const styles = StyleSheet.create({
    iconR: {
        marginTop: 5
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 99,
    },
    textSeting: {
        fontSize: 15,
        fontFamily: 'Prompt_400Regular'
    },
    textSetingMsg: {
        fontSize: 12,
        fontFamily: 'Prompt_400Regular',
        color: '#666'
    },
    textDate: {
        fontSize: 13,
        fontFamily: 'Prompt_400Regular',
        color: '#666',
        marginTop: 12
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
        marginVertical: 15,
        paddingHorizontal: 12,
        marginTop: Platform.select({

        }),
    },
    textListHead2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingBottom: 8,
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 0.3,
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    obtn: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        borderRadius: 50,
        padding: 4,
        alignItems: 'center',
    },
    obtnRed: {
        backgroundColor: 'rgba(241, 15, 15, 0.2)',
        borderRadius: 50,
        padding: 4,
        alignItems: 'center',
    },

});