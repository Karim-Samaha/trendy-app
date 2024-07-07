import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    I18nManager,
    FlatList
} from 'react-native';
import { config } from '../screens/config';
import { getUser } from '../Utils/helpers';
import _axios from '../Utils/axios';
import { Feather } from "@expo/vector-icons";
const ReviewModal = ({ isModalVisible, toggleModal, id }) => {
    const [productRating, setProductRating] = useState(0);
    const [siteRating, setSiteRating] = useState(0);
    const [submited, setSubmited] = useState(false);
    console.log(id)
    const [formValue, setFormValue] = useState({
        productReview: "",
        storeReview: "",
        productRate: 1,
        storeRate: 1,
    });
    const handleProductRate = (num) => {
        setFormValue((prev) => ({ ...prev, productRate: num }))
    }
    const handleStoreRate = (num) => {
        setFormValue((prev) => ({ ...prev, storeRate: num }))
    }
    const textType = (field, val) => {
        setFormValue((prev) => ({ ...prev, [field]: val }))
    }
    const submitReview = async () => {
        const user = await getUser()
        _axios.post(
            `${config.backendUrl}/reviews/${id}?channel=web`,
            {
                storeReview: formValue.storeReview,
                storeRating: formValue.storeRate,
                productReview: formValue.productReview,
                productRating: formValue.storeRate,
            },
            { user }
        )
            .then((res) => setSubmited(true))
            .catch((err) => console.log(err));
    };
    const renderStars = (rating, setRating) => {
        return (
            <View style={styles.starsContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setRating(index + 1)}
                    >
                        <Text style={styles.star}>{index < rating ? '★' : '☆'}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return <Modal isVisible={isModalVisible}>
        {submited ? <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <View style={styles.success}>
                <Feather name="check-circle" size={40} color="green" style={{ marginTop: 12 }} />
                <Text style={styles.successText}>تم ارسال تقيمك</Text>
            </View>
        </View> : <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <View style={styles.formGroup}>
                <Text style={styles.label}>رأيك عن المنتج</Text>
                <TextInput
                    placeholder="تقييم المنتج"
                    style={styles.input}
                    onChangeText={e => textType('productReview', e)}
                    value={formValue.productReview}
                />
                <Text style={styles.subLabel}>قيم المنتج</Text>
                {renderStars(formValue.productRate, handleProductRate)}
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>رأيك عن الموقع</Text>
                <TextInput
                    placeholder="تقييم الموقع"
                    style={styles.input}
                    onChangeText={e => textType('storeReview', e)}
                    value={formValue.storeReview}
                />
                <Text style={styles.subLabel}>قيم الموقع</Text>
                {renderStars(formValue.storeRate, handleStoreRate)}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                <Text style={styles.submitButtonText}>إرسال التقييم</Text>
            </TouchableOpacity>
        </View>}
    </Modal>

}

export default ReviewModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        alignSelf: 'flex-start',
    },
    closeText: {
        fontSize: 24,
        color: '#000',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        textAlign: 'right',
    },
    starsContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    star: {
        fontSize: 24,
        marginHorizontal: 2,
        color: '#FFD700', // Gold color for the stars
    },
    submitButton: {
        backgroundColor: '#55a8b9',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    success: {
        alignItems: "center",
        marginTop: 50
    },
    successText: {
        fontWeight: "bold",
        color: "green",
        fontSize: 22,
        marginTop: 50
    }
});
