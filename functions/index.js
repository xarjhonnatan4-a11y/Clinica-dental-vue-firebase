const admin = require("firebase-admin");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

admin.initializeApp();

exports.updateUserEmail = onCall(async (request) => {
  const { uid, newEmail } = request.data;

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Debes iniciar sesión para realizar esta acción."
    );
  }

  if (!uid || !newEmail) {
    throw new HttpsError(
      "invalid-argument",
      "UID y nuevo correo son requeridos."
    );
  }

  const uidSolicitante = request.auth.uid;

  const snap = await admin
    .firestore()
    .doc(`users/${uidSolicitante}`)
    .get();

  const solicitante = snap.data();

  if (!solicitante || solicitante.role !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "Solo un administrador puede editar correos."
    );
  }

  try {
    await admin.auth().updateUser(uid, {
      email: newEmail,
    });

    await admin.firestore().doc(`users/${uid}`).update({
      email: newEmail,
    });

    return {
      ok: true,
      message: "Correo actualizado correctamente.",
    };
  } catch (err) {
    console.error(err);

    throw new HttpsError(
      "internal",
      "Error actualizando correo."
    );
  }
});

exports.revokeUserSessions = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Debes iniciar sesión para realizar esta acción."
    );
  }

  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError(
      "invalid-argument",
      "UID requerido."
    );
  }

  const uidSolicitante = request.auth.uid;

  const snap = await admin
    .firestore()
    .doc(`users/${uidSolicitante}`)
    .get();

  const solicitante = snap.data();

  if (!solicitante || solicitante.role !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "Solo un administrador puede cerrar sesiones de usuarios."
    );
  }

  try {
    await admin.auth().revokeRefreshTokens(uid);

    return {
      success: true,
    };
  } catch (err) {
    console.error(err);

    throw new HttpsError(
      "internal",
      "No se pudieron cerrar las sesiones del usuario."
    );
  }
});