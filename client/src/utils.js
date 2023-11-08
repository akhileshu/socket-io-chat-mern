export const getpartner = (userId, chat) => {
  return chat.users[0]._id === userId ? chat.users[1] : chat.users[0];
};
export const getpartnerName = (userId, chat) => {
  return chat.users[0]._id === userId ? chat.users[1].name : chat.users[0].name;
};
export const getMsgClass = (userId, message) => {
  return message.sender._id === userId ? "self" : "partner";
};
export const findUsersForNotification = (message) => {
  const users = [];
  const sender = message.sender._id;
  message.chat.users.forEach((user) => {
    if (user._id !== sender)users.push(user._id);
  });
  // console.log(users)
  return users
};
