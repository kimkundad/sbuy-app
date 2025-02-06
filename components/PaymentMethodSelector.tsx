import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PaymentMethodSelector = ({ onSelect }) => {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await axios.get('https://www.learnsbuy.com/api/get_bank');
                if (response.data.status === 200) {
                    setBanks(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanks();
    }, []);

    const handleSelect = (bank) => {
        setSelectedBank(bank.id);
        onSelect(bank); // ส่งค่ากลับไปยัง Component แม่
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Other Ways To Pay</Text>
            {banks.map((bank) => (
                <TouchableOpacity
                    key={bank.id}
                    style={[
                        styles.option,
                        selectedBank === bank.id ? styles.selectedOption : null,
                    ]}
                    onPress={() => handleSelect(bank)}
                >
                    <Image
                        source={{ uri: `https://learnsbuy.com/assets/images/bank/${bank.image}` }}
                        style={styles.bankLogo}
                    />
                    <Text style={styles.bankName}>{bank.bank_name}</Text>
                    <View style={selectedBank === bank.id ? styles.radioSelected : styles.radio} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: '#007bff',
        backgroundColor: '#e6f0ff',
    },
    bankLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    bankName: {
        flex: 1,
        fontSize: 14,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    radioSelected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 6,
        borderColor: '#007bff',
    },
});
