import { StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "../services/imageService";
import { Image } from "react-native";
import { Video } from "expo-av";

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  const shadowStyles = Platform.select({
    web: {
      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
    },
    default: {
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 1,
    },
  });

  const createdAt = moment(item?.created_at).format("MMM D");

  const openPostDetails = () => {
    router.push("postDetails", { post: item });
  };

  const liked = false;
  const likes = [];

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={theme.colors.textLight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml contentWidth={wp(100)} source={{ html: item?.body }} />
          )}
        </View>

        {/* post image */}

        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            contentFit="cover"
            style={styles.postMedia}
          />
        )}

        {/* post video */}
        {item?.file && item?.file?.includes("postVideos") && (
          <Video
            source={getSupabaseFileUrl(item?.file)}
            useNativeControls
            resizeMode="cover"
            isLooping
            style={[styles.postMedia, { height: hp(30) }]}
          />
        )}

        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <TouchableOpacity>
              <Icon
                name="heart"
                size={24}
                fill={liked ? theme.colors.rose : "transparent"}
                color={liked ? theme.colors.rose : theme.colors.textLight}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{likes?.length}</Text>
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity>
              <Icon name="comment" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>{0}</Text>
          </View>

          <View style={styles.footerButton}>
            <TouchableOpacity>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    ...(Platform.OS === "web" ? {} : { shadowColor: "#000" }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  postMedia: {
    borderCurve: "continuous",
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
  },
  postBody: {
    marginLeft: 5,
  },
  username: {
    fontSize: hp(2.2),
    color: theme.colors.textDark,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
