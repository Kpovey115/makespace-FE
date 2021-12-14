import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/User";
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import ReviewModal from "../Components/ReviewModal";
import { getSingleListingById } from "../utils/apiRequests";
import ReviewCard from "../Components/ReviewCard";

const SingleListScreen = ({ route, navigation }) => {
  const [openContact, setOpenContact] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [listing, setListing] = useState({});
  const [reviewsLength, setReviewsLength] = useState(0);
  const { user } = useContext(UserContext);
  const id = route.params;
  const handleOwnerRequest = () => {
    navigation.navigate("UserProfile", { owner: listing.owner });
  };

  useEffect(() => {
    getSingleListingById(id).then((res) => {
      setListing(res);
    });
  }, [id, reviewsLength]);

  if (Object.keys(listing).length === 0)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  else {
    const locationObj = {
      id: listing._id,
      name: listing.title,
      size: listing.size,
      price: listing.price,
      spaceRating: listing.spaceRating,
      postcode: listing.location.postcode,
      images: listing.images,
    };
    return (
      <ScrollView>
        <View>
          <Image
            style={{ width: 400, height: 400 }}
            source={{ uri: listing.images[0] }}
          />
        </View>
        <View>
          <View>
            <Text>{listing.title}</Text>
          </View>
          <View>
            <View>
              <Text>
                Location :{listing.location.city} {listing.location.postcode}
              </Text>
            </View>
            <View>
              <Text>Space Rating: {listing.spaceRating}</Text>
            </View>
          </View>
          <View>
            <View>
              <TouchableOpacity onPress={handleOwnerRequest}>
                <Text>Owner :{listing.owner}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View>
              <Text>Price/Hour: {listing.price}</Text>
            </View>
            <View>
              <Text>Size: {listing.size}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="hours-24"
                size={24}
                color={
                  listing.amenities["_24HourAccess"] ? "#32CD32" : "#DCDCDC"
                }
              />
              <MaterialIcons
                name="wc"
                size={24}
                color={listing.amenities.WC ? "#32CD32" : "#DCDCDC"}
              />
              <FontAwesome
                name="wheelchair"
                size={24}
                color={listing.amenities.accessible ? "#32CD32" : "#DCDCDC"}
              />
              <FontAwesome5
                name="house-user"
                size={24}
                color={listing.amenities.indoor ? "#32CD32" : "#DCDCDC"}
              />
              <FontAwesome5
                name="tree"
                size={24}
                color={listing.amenities.outdoor ? "#32CD32" : "#DCDCDC"}
              />
              <FontAwesome5
                name="parking"
                size={24}
                color={listing.amenities.parking ? "#32CD32" : "#DCDCDC"}
              />
              <Entypo
                name="power-plug"
                size={24}
                color={listing.amenities.power ? "#32CD32" : "#DCDCDC"}
              />
              <MaterialCommunityIcons
                name="microwave"
                size={24}
                color={listing.amenities.kitchen ? "#32CD32" : "#DCDCDC"}
              />
            </View>
            <View>
              <Text>Description: {listing.description}</Text>
            </View>
          </View>
          <View>
            <Button
              title="View on map"
              onPress={() => {
                navigation.navigate("SingleSpaceOnMap", locationObj);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <Button
              title="Reviews"
              onPress={() => {
                setOpenReview(!openReview);
              }}
            />
            <Modal visible={openReviewModal} animationType="slide">
              <ReviewModal
                setOpenReviewModal={setOpenReviewModal}
                setReviewsLength={setReviewsLength}
                listing={listing}
                username={user}
              />
            </Modal>
            <Button
              title="Write a review"
              onPress={() => {
                setOpenReviewModal(true);
              }}
            />

            <Button
              title="Contact details"
              onPress={() => setOpenContact(!openContact)}
            />
          </View>
          {!!openContact ? (
            <View style={styles.hidden}>
              <Text style={styles.text}>
                {listing.contactDetails.emailAddress}
              </Text>
              <Text style={styles.text}>
                {listing.contactDetails.phoneNumber}
              </Text>
            </View>
          ) : null}

          <View>
            {!openReview ? null : (
              <View>
                {listing.reviews.length === 0 ? (
                  <View style={styles.hidden}>
                    <Text style={styles.text}>
                      No reviews yet? Leave the very first one!
                    </Text>
                  </View>
                ) : (
                  <View>
                    {listing.reviews.map((review) => {
                      return (
                        <View key={review._id}>
                          <ReviewCard review={review} />
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  hidden: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});

export default SingleListScreen;
