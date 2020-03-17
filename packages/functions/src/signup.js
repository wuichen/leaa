const admin = require("firebase-admin");
const functions = require("firebase-functions");
// const uuidv4 = require('uuidv4');
const gotQL = require("gotql");
admin.initializeApp();

exports.handler = user => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": user.uid
    }
  };

  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(async () => {
      try {
        const mutation = {
          operation: {
            name: "insert_user",
            args: {
              objects: {
                id: user.uid,
                email: user.email
              }
            },
            fields: [
              {
                returning: {
                  fields: ["id", "email"]
                }
              }
            ]
          }
        };

        const options = {
          headers: {
            "x-hasura-admin-secret": "secret"
          },
          debug: false
        };

        const response = await gotQL.mutation(
          "mercy-app.herokuapp.com/v1/graphql",
          mutation,
          options
        );
        console.log(response);
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: new Date().getTime() });
      } catch (err) {
        console.log(err);
      }
    })
    .catch(error => {
      console.log(error);
    });
};
