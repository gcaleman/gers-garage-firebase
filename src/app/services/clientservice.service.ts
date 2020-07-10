import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Client } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private firestore: AngularFirestore, public client: Client) { }      // Inject through the constructor


/* // Retrive client data from firestore
getStudents() {
    return this.firestore.collection('clients').snapshotChanges();
}

// Store client data in firestore
createStudent(client: Client){
  return this.firestore.collection('clients').add(client);
}

// Delete a record
deleteStudent(clientUid: string){
  this.firestore.doc('clients/' + clientUid).delete();
}

// Update client data
updateStudent(client: Client){
  delete client.uid;
  this.firestore.doc('clients/' + client.uid).update(client);
} */

}