import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {
  private creditos:string = '/creditos';
  Creditos: AngularFirestoreCollection<any>;
  listadoCreditosAMostrar: any;
  constructor(public db:AngularFirestore) 
  {
    this.Creditos = db.collection(this.creditos, ref => ref.orderBy('cantidad'));
    this.listadoCreditosAMostrar = this.db.collection(this.creditos, ref => ref.orderBy('cantidad')).snapshotChanges();
   }

   getCreditos(): AngularFirestoreCollection<any> {
    return this.Creditos;
  }

  
  enviarCredito(cantidad:number, email:string, qrs:string){
    this.Creditos.add(
      {email:email,
        cantidad:cantidad,
        qrs:qrs});
  }
  UpdateCreditos(id:string, cantidad:number,qrs:string,email:string)
  {
    console.log(id +" "+ cantidad +" "+qrs+" "+email);
    this.db.collection(this.creditos).doc(id).update({cantidad:cantidad,qrs:qrs});
  }
}
