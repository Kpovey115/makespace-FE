import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/User";
import {
    View,
    Text,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { auth } from "../firebase";
import { onAuthStateChanged, updatePassword } from "firebase/auth";
import { getUserById, patchUser } from "../utils/apiRequests";

const ProfileCard = () => {
    const [userDetails, setUserDetails] = useState({});
    const [displayNameModalOpen, setDisplayNameModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [passwordChange, setPasswordChange] = useState("");
    const { user } = useContext(UserContext);
    const handlePress = () => {
        setDisplayNameModalOpen(true);
    };
    const handleDisplayNameSubmit = () => {
        onAuthStateChanged(auth, (user) => {
            const uid = user.uid;
            const update = { displayName };
            patchUser(update, uid).then((user) => {
                setUserDetails(user);
                setDisplayNameModalOpen(false);
                setDisplayName("");
            });
        });
    };

    const userFirebase = auth.currentUser;
    const handlePasswordSubmit = () => {
        updatePassword(userFirebase, passwordChange)
            .then(() => {
                // console.log("success! New password is.." + passwordChange);
                setPasswordModalOpen(false);
                setPasswordChange("");
            })
            .catch((error) => {});
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const uid = user.uid;
            getUserById(uid).then((user) => {
                setUserDetails(user);
            });
        });
        return unsubscribe;
    }, [user]);
    return (
        <View style={{ flexDirection: "row" }}>
            <View>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={{
                        uri: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://www.sbcc.sg/wp-content/themes/healthway/images/user-default.png",
                    }}
                />
            </View>
            <View>
                <Text>Display Name:{userDetails.displayName} </Text>
                <Button onPress={handlePress} title="edit display name" />
                <Modal visible={displayNameModalOpen} animationType="slide">
                    <AntDesign
                        style={{ marginTop: 20 }}
                        name="close"
                        size={24}
                        color="black"
                        onPress={() => setDisplayNameModalOpen(false)}
                    />
                    <Text>Type in your new display name</Text>
                    <TextInput
                        style={styles.inputBox}
                        value={displayName}
                        onChangeText={(text) => setDisplayName(text)}
                    ></TextInput>
                    <Button title="submit" onPress={handleDisplayNameSubmit} />
                </Modal>
                <Text>Username: {userDetails.username}</Text>
                {user === userDetails.username ? (
                    <Text>Email: {userDetails.emailAddress}</Text>
                ) : null}
                <TouchableOpacity>
                    <Text
                        onPress={() => setPasswordModalOpen(true)}
                        style={{ color: "blue" }}
                    >
                        Change password
                    </Text>
                </TouchableOpacity>
                <Modal visible={passwordModalOpen} animationType="slide">
                    <AntDesign
                        style={{ marginTop: 20 }}
                        name="close"
                        size={24}
                        color="black"
                        onPress={() => setPasswordModalOpen(false)}
                    />
                    <Text>Type in your new password</Text>
                    <TextInput
                        style={styles.inputBox}
                        value={passwordChange}
                        onChangeText={(text) => setPasswordChange(text)}
                    ></TextInput>
                    <Button title="submit" onPress={handlePasswordSubmit} />
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputBox: { borderWidth: 1 },
    editText: { fontSize: 12 },
});

export default ProfileCard;
