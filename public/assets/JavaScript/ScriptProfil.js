/**
 * Fonction pour basculer l'affichage d'un élément par son ID.
 * @param {string} id - L'ID de l'élément à basculer.
 */
function toggle(id) {
  var content = document.getElementById(id);
  if (content) {
    if (content.style.display === "none") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  } else {
    console.error(`Élément avec l'ID ${id} non trouvé.`);
  }
}

/**
 * Fonction pour supprimer le compte de l'utilisateur après confirmation.
 */
function deleteAccount() {
  // Afficher une boîte de dialogue de confirmation.
  if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
    // Ici, vous pouvez ajouter le code pour supprimer le compte.
    console.log("Compte supprimé.");
  }
}

/**
 * Fonction pour déconnecter l'utilisateur après confirmation.
 */
function deconnexion() {
  // Afficher une boîte de dialogue de confirmation.
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    // Ici, vous pouvez ajouter le code pour la déconnexion.
    console.log("Déconnexion réussie.");
  }
}
