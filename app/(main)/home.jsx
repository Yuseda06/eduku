import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { getAllUsers } from "../../services/userService";
import UsersList from "../../components/UserList";

const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const [post, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    //call api here
  };

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout", error.message);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.icons}>
            <Pressable
              title="Add Post"
              onPress={() => router.push("notifications")}
            >
              <Icon
                name="heart"
                size={hp(3.2)}
                color={theme.colors.textLight}
              />
            </Pressable>
            <Pressable title="Add Post" onPress={() => router.push("newPost")}>
              <Icon name="plus" size={hp(3.2)} color={theme.colors.textLight} />
            </Pressable>
            <Pressable title="Add Post" onPress={() => router.push("profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.listStyle}>
          <Text style={styles.noPosts}>No posts yet</Text>
        </View>

        <View>
          <UsersList />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
