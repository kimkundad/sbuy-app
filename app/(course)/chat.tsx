import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Modal, Text, Image, StyleSheet, TextInput, Dimensions, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Button, Keyboard, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';

const socket = io('https://chat.learnsbuy.com');

const Chats = ({ route }) => {

    const { student_id, teacher_id, student_name, avatar, current_user_id  } = useLocalSearchParams(); 
    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [inputText, setInputText] = useState("")

    const isTeacher = parseInt(current_user_id) === parseInt(teacher_id);
    const userId = parseInt(current_user_id, 10) || 0; // ✅ ใช้ userId ที่เปลี่ยนตามผู้ใช้


    // ✅ สร้างห้องแชทหรือดึงห้องที่มีอยู่แล้ว
    useEffect(() => {
        console.log("📩 Sending request to create room:", { student_id, teacher_id });
    
        axios.post('https://chat.learnsbuy.com/create-room', { student_id, teacher_id })
            .then(response => {
                console.log("✅ Room Created:", response.data);
                setRoomId(response.data.room_id);
                socket.emit('joinRoom', response.data.room_id);
                fetchMessages(response.data.room_id);
            })
            .catch(err => console.error('❌ Error creating room:', err.response?.data || err));
    }, []);


    // ✅ ถ้าผู้ใช้เป็นครู ให้เรียก API `/mark-as-read`
    useEffect(() => {
        if (isTeacher && roomId) {
            axios.post('https://chat.learnsbuy.com/mark-as-read', { room_id: roomId, teacher_id })
                .then(response => console.log("✅ Updated read status:", response.data))
                .catch(error => console.error("❌ Error updating read status:", error));
        }
    }, [roomId, isTeacher]);  // ✅ ทำงานเฉพาะถ้าผู้ใช้เป็นครู และมี room_id

    // ✅ โหลดข้อความเก่าจากห้องแชท
    const fetchMessages = (room_id) => {
        axios.get(`https://chat.learnsbuy.com/messages/${room_id}`)
            .then(response => {
                const formattedMessages = response.data.map(msg => ({
                    _id: msg.id,
                    text: msg.message,
                    createdAt: new Date(msg.created_at),
                    user: {
                        _id: msg.sender_id, // ✅ แยก `_id` ตาม `sender_id`
                        name: msg.sender_id === teacher_id ? "ครู" : student_name, // ✅ กำหนดชื่อถูกต้อง
                        avatar: "https://learnsbuy.com/assets/images/avatar/"+ msg.avatar // ✅ Avatar นักเรียน
                    }
                }));
    
                setMessages(formattedMessages.reverse()); // ✅ เรียงใหม่ล่าสุดไปล่างสุด
            })
            .catch(err => console.error('❌ Error fetching messages:', err));
    };
    
    
    
    
    
    

    // ✅ ฟังก์ชันส่งข้อความ
    const onSend = useCallback(async () => {
        if (!inputText.trim() || !roomId) return;
        console.log("📩 Sending message...");
    
        const messageData = {
            room_id: roomId,
            sender_id: userId, 
            message: inputText,
            name: student_name,
            avatar: avatar
        };
    
        try {
            // ✅ ส่งข้อความไปที่เซิร์ฟเวอร์เท่านั้น (ไม่ต้อง `setMessages` ที่นี่)
            const response = await axios.post(`https://chat.learnsbuy.com/send-message`, messageData);
            console.log("✅ Message sent to server:", response.data);
    
            // ✅ ให้เซิร์ฟเวอร์ส่งข้อความกลับมาแทน
           // socket.emit('sendMessage', messageData);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    
        setInputText(""); // ✅ เคลียร์ช่องแชทหลังจากส่ง
    }, [roomId, inputText]);
    
    
    

    // ✅ รับข้อความแบบเรียลไทม์
    useEffect(() => {
        const handleReceiveMessage = (messageData) => {
            console.log("📩 New message from Socket:", messageData);
    
            // ตรวจสอบ sender_id และกำหนดค่าเริ่มต้น
            const senderId = messageData.sender_id ? parseInt(messageData.sender_id, 10) : null;
    
            if (!senderId) {
                console.warn("⚠️ Invalid sender_id:", messageData);
                return;
            }
    
            setMessages(prevMessages => {
                if (prevMessages.some(msg => msg._id === messageData.id)) {
                    return prevMessages;
                }

                console.log('messageData', messageData)
    
                const newMessage = {
                    _id: messageData.id || Math.random().toString(36).substring(7),
                    text: messageData.message || "",
                    createdAt: messageData.created_at ? new Date(messageData.created_at) : new Date(),
                    user: {
                        _id: senderId,
                        name: senderId === parseInt(teacher_id, 10) ? "ครู" : student_name || `User ${senderId}`,
                        avatar: "https://learnsbuy.com/assets/images/avatar/"+ messageData.avatar 
                    }
                };
    
                return GiftedChat.append(prevMessages, [newMessage]);
            });
        };
    
        socket.on('receiveMessage', handleReceiveMessage);
    
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [student_id, teacher_id, student_name]);
    
    
    
    

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                // ✅ ใช้ scrollToBottom อัตโนมัติเมื่อโหลดข้อความ
                scrollToBottom();
            }, 500);
        }
    }, [messages]);
    
    const scrollToBottom = () => {
        console.log("📜 Scrolling to bottom...");
    };
    


    const renderInputToolbar = () => (
        <View style={styles.inputContainer}>
            {/* <TouchableOpacity  style={styles.iconButton}>
                <Ionicons name="image-outline" size={24} color="#7F7F7F" />
            </TouchableOpacity> */}
            <TextInput
                style={styles.textInput}
                placeholder="พิมพ์ข้อความ..."
                value={inputText}
                onChangeText={setInputText}
            />
            <TouchableOpacity onPress={onSend} style={styles.iconButton}>
                <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? -190 : -290} // เพิ่ม Offset สำหรับ Header
            style={{ flex: 1 }} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
                    <StatusBar style="dark" />
                    <LinearGradient
                                        colors={['#4EBD8C', '#4EBD8C', '#6AD1A4']}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0, y: 0 }}
                                        style={styles.headerGradient}
                                    >
                        <View style={styles.listItemCon}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                <TouchableOpacity style={styles.btnBack} 
                                onPress={() => {
                                    isTeacher 
                                        ? router.push("(course)/chatList")  // ✅ ถ้าเป็นครูไปที่ chatList
                                        : router.push("(tabs)"); // ✅ ถ้าเป็นนักเรียนไปที่ tabs
                                }}
                                >
                                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 25 }}>
                                        <Ionicons name="chevron-back" size={20} color="black" />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.textListHead}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', color: '#fff', textAlign: 'center' }}>
                                        ส่งข้อความถึงเรา 
                                    </Text>
                                </View>
                                <View style={{ width: 32 }} />
                            </View>
                        </View>
                    </LinearGradient>

                    <GiftedChat 
                        messages={messages} 
                        onSend={onSend} 
                        renderInputToolbar={renderInputToolbar}
                        scrollToBottom={true} 
                        bottomOffset={Platform.OS === "ios" ? 80 : 0}
                        messagesContainerStyle={{
                            paddingBottom: Platform.OS === "ios" ? 30 : 10,
                        }}
                        user={{ _id: userId }}// ✅ บอกว่าใครเป็นผู้ใช้ปัจจุบัน (นักเรียน)
                    />

                </SafeAreaProvider>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Chats;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        marginBottom:10
    },
    textInput: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#F9F9F9",
        marginHorizontal: 10,
    },
    iconButton: {
        padding: 8,
    },
    headerGradient: {
        height: Platform.select({
            ios: 90,
            android: 75,
        }),
        width: '100%',
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
    listItemCon: {
        marginTop: Platform.select({
            ios: 35,
            android: 25,
        }),
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 10,
    },

});