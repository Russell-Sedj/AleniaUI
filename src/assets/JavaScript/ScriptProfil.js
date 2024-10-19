function toggle(id) {
    var content = document.getElementById(id);
    if (content.style.display === "none") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
}

function deleteAccount() {
    // Ici, vous pouvez ajouter le code pour supprimer le compte.
    // Par exemple, vous pouvez afficher une boîte de dialogue de confirmation.
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
        // Supprimer le compte...
    }
}

function deconnexion() {
    // Par exemple, vous pouvez afficher une boîte de dialogue de confirmation.
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        
    }
}