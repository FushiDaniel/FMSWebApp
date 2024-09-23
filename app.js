db.collection('items').get().then( (snapshot) => {
    console.log(snapshot.docs)

})

const firebaseConfig = {
    apiKey: "AIzaSyDWkFPa-kR1JXYqn_huzN6XH2UbVJwv7-Q",
    authDomain: "fms1-d8bc6.firebaseapp.com",
    projectId: "fms1-d8bc6",
    storageBucket: "fms1-d8bc6.appspot.com",
    messagingSenderId: "644375648681",
    appId: "1:644375648681:web:226348c29dbd5f02b74cb8",
    measurementId: "G-LZ86MPTXMR"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const itemForm = document.getElementById('itemForm');
const itemsBody = document.getElementById('itemsBody');

function displayItems() {
    itemsBody.innerHTML = '';
    db.collection("items").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td><img src="${data.image}" alt="${data.name}"></td>
                    <td>${data.name}</td>
                    <td>${data.description}</td>
                    <td>${data.available ? 'Available' : 'Not Available'}</td>
                    <td>
                        <button onclick="editItem('${doc.id}')">Edit</button>
                        <button onclick="deleteItem('${doc.id}')" class="delete-btn">Delete</button>
                    </td>
                </tr>
            `;
            itemsBody.innerHTML += row;
        });
    }).catch((error) => {
        console.error("Error fetching documents: ", error);
        itemsBody.innerHTML = "<tr><td colspan='5'>Error fetching documents. Check console for details.</td></tr>";
    });
}

itemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const itemId = document.getElementById('itemId').value;
    const item = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        available: document.getElementById('available').checked,
        image: document.getElementById('image').value
    };

    if (itemId) {
        db.collection("items").doc(itemId).update(item)
            .then(() => {
                console.log("Document successfully updated!");
                itemForm.reset();
                document.getElementById('itemId').value = '';
                displayItems();
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    } else {
        db.collection("items").add(item)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                itemForm.reset();
                displayItems();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }
});

function editItem(id) {
    db.collection("items").doc(id).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('itemId').value = id;
            document.getElementById('name').value = data.name;
            document.getElementById('description').value = data.description;
            document.getElementById('available').checked = data.available;
            document.getElementById('image').value = data.image;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        db.collection("items").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            displayItems();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}

displayItems();