const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.Deletion = functions.https.onCall(async (data, context) => {
  try {
    const filePath = data.url;
    const password = data.unique;
    const db = admin.database();
    const fileRef = db.ref("fileData");
    const snapshot = await fileRef.once("value");
    const fileData = snapshot.val();

    const deleteRecord = async () => {
      const deletePromises = [];
      for (const [key, value] of Object.entries(fileData)) {
        if (password === value.unique) {
          deletePromises.push(fileRef.child(key).remove());
        }
      }
      await Promise.all(deletePromises);
    };

    setTimeout(async () => {
      try {
        await deleteRecord();
        await admin.storage().bucket().file(filePath).delete();
        console.log("File deleted from Firebase Storage:", filePath);
      } catch (error) {
        console.error("Error deleting file from Firebase Storage:", error);
      }
    }, 20000);

    return "Success";
  } catch (error) {
    console.error("Error scheduling file deletion:", error);
  }
});
