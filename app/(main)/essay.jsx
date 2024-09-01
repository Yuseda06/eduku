import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchEssay } from "../../services/essayService";
import { getUserData } from "../../services/userService";
import { supabase } from "../../lib/supabase";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";

const Essay = () => {
  const [essays, setEssays] = useState([]);
  const { user, setAuth } = useAuth();

  const handleEssayEvent = async (payload) => {
    if (payload?.eventType == "INSERT" && payload?.new?.id) {
      let newEssay = { ...payload.new };
      let res = await getUserData(newEssay.userId);
      console.log("res", res);
      newEssay.user = res.success ? res.data : {};
      setEssays((prevEssays) => [newEssay, ...prevEssays]);
    }
  };

  console.log("essays :>> ", essays);

  useEffect(() => {
    let EssayChannel = supabase
      .channel("english")
      .on(
        "Postgres_changes",
        { event: "*", schema: "public", table: "english" },
        handleEssayEvent
      )
      .subscribe();

    getEssays();

    return () => {
      supabase.removeChannel(EssayChannel);
    };
  }, []);

  const getEssays = async () => {
    limit = limit + 10;
    let res = await fetchEssays(limit);
    if (res.success) {
      setEssays(res.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Essays" />
        <Text style={styles.title}>Essays</Text>
        <FlatList
          data={essays}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            <View style={{ marginVertical: essays.length == 0 ? 200 : 30 }}>
              {/* <Loading /> */}
            </View>
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
