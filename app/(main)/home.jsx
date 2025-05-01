import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { getAllUsers, getUserData } from "../../services/userService";
import UsersList from "../../components/UserList";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { getScore } from "../../services/scoreService";
import { useFocusEffect } from "@react-navigation/native";
var limit = 10;

const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [scoresData, setScoresData] = useState([]);

  const handlePostEvent = async (payload) => {
    if (payload?.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getScores = async () => {
        let res = await getScore(user);
        if (res.success) {
          setScoresData(res.data);
        }
      };

      getScores();

      // Optional: Return a function to reset state when the component loses focus
      return () => {
        setScoresData([]);
      };
    }, [user])
  );

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    limit = limit + 10;
    let res = await fetchPosts(limit);
    if (res.success) {
      setPosts(res.data);
    }
  };

  const getUniqueUsers = (scoresData) => {
    const uniqueUsers = scoresData.reduce(
      (acc, curr) => {
        const { name, image } = curr.user;
        if (!acc.names.has(name)) {
          acc.names.add(name);
          acc.users.push({ name, image });
        }
        return acc;
      },
      { users: [], names: new Set() }
    );

    return uniqueUsers.users;
  };

  useEffect(() => {
    const uniqueUsers = getUniqueUsers(scoresData);
  }, [scoresData]);

  const usersListData = useMemo(() => {
    return getUniqueUsers(scoresData).map((item) => {
      const totalScore = scoresData
        .filter((score) => score.user.name === item.name)
        .reduce((acc, curr) => acc + curr.score, 0);
      return {
        name: item.name,
        image: item.image,
        totalScore: totalScore,
      };
    });
  }, [scoresData]);

  useEffect(() => {
    const totalScores = scoresData.reduce((acc, curr) => {
      const { name } = curr.user;
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name] += curr.score;
      return acc;
    }, {});
  }, [scoresData]);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.icons}>
            <Pressable
              title="Add Post"
              onPress={() => router.push("quizOpenAI")}
            >
              <Icon name="edit" size={hp(3.2)} color={theme.colors.textLight} />
            </Pressable>
            <Pressable title="Add Post" onPress={() => router.push("lessons")}>
              <Icon name="book" size={hp(3.2)} color={theme.colors.textLight} />
            </Pressable>
            <Pressable
              title="Add Post"
              onPress={() => router.push("vocabulary")}
            >
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

        {/* <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
            
              <Text style={{ textAlign: "center" }}>Post is end here</Text>
            </View>
          }
        /> */}

        <FlatList
          data={usersListData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.name.toString()}
          renderItem={({ item }) => <ScoreCard item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No scores yet</Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const ScoreCard = ({ item }) => {
  return (
    <View
      style={{
        marginBottom: 10,
        padding: 0,
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        overflow: "visible",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.scoreText}>Score: {item.totalScore}</Text>
        </View>
        <Avatar
          uri={item.image}
          size={hp(12)}
          rounded={hp(12)}
          style={{
            borderWidth: 4,
            borderColor: theme.colors.primary,
            marginTop: -hp(2),
            marginBottom: -hp(2),
            marginRight: hp(1),
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
          }}
        />
      </View>
    </View>
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
  linkStyle: {
    marginRight: wp(2),
  },
});
