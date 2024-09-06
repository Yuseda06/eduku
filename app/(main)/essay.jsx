import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  deleteEssay,
  fetchAllEssay,
  fetchEssay,
} from "../../services/essayService";
import { getAllUsers, getUserData } from "../../services/userService";
import { supabase } from "../../lib/supabase";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import EssayCard from "../../components/EssayCard";
import Button from "../../components/Button";
import Icon from "../../assets/icons";

const Essay = () => {
  const [essays, setEssays] = useState([]);
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllEssay();
    getUsers();
  }, [essays]);

  // console.log("users", users.data[0].id);

  const getUsers = async () => {
    let res = await getAllUsers();
    if (res.success) {
      setUsers(res);
    } else {
      // Handle error case, e.g., display a notification or error message
    }
  };

  const getAllEssay = async () => {
    let res = await fetchAllEssay();
    if (res.success) {
      setEssays(res.data);
      // console.log("first", res.data[1].userId);
      // let res = await getUserData(res.data.userId);
      // setUsers(res);
    } else {
      // Handle error case, e.g., display a notification or error message
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={{ marginLeft: 12 }}>
          <Header title="Essays" />
          <Pressable
            title="Add Post"
            onPress={() => router.push("notifications")}
            style={{
              alignSelf: "flex-end",
              marginTop: -32,
              marginRight: 12,
              marginBottom: 20,
            }}
          >
            <Icon name="edit" size={hp(3.2)} color={theme.colors.textLight} />
          </Pressable>

          {essays.length == 0 && (
            <Text style={[styles.noPosts, { marginTop: 50 }]}>
              No essays yet
            </Text>
          )}
        </View>

        <FlatList
          data={essays}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EssayCard
              item={item}
              currentUser={user}
              router={router}
              allUsers={users}
            />
          )}
          ListFooterComponent={
            <View
              style={{ marginVertical: essays.length == 0 ? 200 : 30 }}
            ></View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Essay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(4),
    marginBottom: 10,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  title: {
    fontSize: hp(2.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.bold,
  },
  noPosts: {
    fontSize: hp(3.2),
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
    gap: 10,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
  logout: {
    marginBottom: 50,
  },
});
