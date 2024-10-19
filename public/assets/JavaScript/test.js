// script.js
document.getElementById('createBtn').addEventListener('click', function() {
    var jobPosts = document.getElementById('jobPosts');

    // Créer un nouvel élément div pour l'annonce
    var newPost = document.createElement('div');
    newPost.className = 'jobPost';

    // Ajouter des détails à l'annonce
    newPost.innerHTML = '<h2>Nouvelle annonce</h2>' +
                        '<input type="text" class="jobTitle" placeholder="Nom de la fiche">' +
                        '<input type="text" class="jobName" placeholder="Intitulé du poste">' +
                        '<textarea class="jobTasks" placeholder="Tâches"></textarea>' +
                        '<input type="file" class="jobImage" accept="image/*">' +
                        '<button class="deleteBtn">Supprimer</button>' +
                        '<button class="applyBtn">Publier</button>';

    // Ajouter l'annonce à la page
    jobPosts.appendChild(newPost);

    // Ajouter un écouteur d'événements au bouton Supprimer
    newPost.querySelector('.deleteBtn').addEventListener('click', function() {
        jobPosts.removeChild(newPost);
    });

    // Ajouter un écouteur d'événements au bouton Postuler
    newPost.querySelector('.applyBtn').addEventListener('click', function() {
        var jobTitle = newPost.querySelector('.jobTitle').value;
        var jobName = newPost.querySelector('.jobName').value;
        var jobTasks = newPost.querySelector('.jobTasks').value;
        var jobImage = newPost.querySelector('.jobImage').files.length;

        if (!jobTitle || !jobName || !jobTasks || !jobImage) {
            alert('Veuillez remplir toutes les cases avant de postuler.');
        } else {
            alert('Félicitations ! Votre candidature a été soumise avec succès.');
        }
    });
});

//EN PHP INCLUSION
/*********************************************************/
// PHP (add_to_database.php)
//<?php
//  ajouter le code pour connecter à votre base de données 
// $conn = new mysqli($servername, $username, $password, $dbname);
// $sql = "INSERT INTO MyTable (nom, age) VALUES ('John', 30)";
// $conn->query($sql);
//?>
/***************************************************************/


// EN HTML
//<button id="myButton">Ajouter à la base de données</button>

//<!-- jQuery -->
//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> exemple lien ...
//<script>
//$(document).ready(function(){
//  $("#myButton").click(function(){
//    $.ajax({
//      url: "add_to_database.php",
//      type: "POST",
//  /    data: { 
        //  ajouter les données 
 //     },
   //   success: function(result){
     //   alert("Données ajoutées ");
    //  },
      //error: function(xhr, status, error){
        //alert("Une erreur s'est produite: " + status + " " + error);
     // }
 //   });
 // });
//});
//</script>