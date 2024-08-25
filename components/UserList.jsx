import React, { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";
import { Text, View } from "react-native";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.msg);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      {users.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
};

export default UsersList;
