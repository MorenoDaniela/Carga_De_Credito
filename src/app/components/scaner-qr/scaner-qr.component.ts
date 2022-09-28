import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { CreditosService } from 'src/app/shared/services/creditos.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-scaner-qr',
  templateUrl: './scaner-qr.component.html',
  styleUrls: ['./scaner-qr.component.scss'],
})
export class ScanerQrComponent implements OnInit {

  scanActive: boolean = false;
  public misCreditos:any=new Array<any>();
  public miCredito:Credito = new Credito();
  constructor(public creditosService: CreditosService, public authService:AuthService,public alertController: AlertController)
  {

  }
  async ngOnInit()
  {
    await this.cargarMisCreditos();
  }


  cargarMisCreditos(){

    this.creditosService.listadoCreditosAMostrar.pipe(
      map((data: any) => {
        // this.misCreditos = new Array<Credito>();
        data.map((credito: any) =>{
          if(credito.payload.doc.data().email==this.authService.userData.email){
            var creditoCargado: Credito= new Credito();
            creditoCargado.email = credito.payload.doc.data().email;
            creditoCargado.cantidad = credito.payload.doc.data().cantidad;
            creditoCargado.qrs = credito.payload.doc.data().qrs;
            creditoCargado.id = credito.payload.doc.id;
            this.miCredito = creditoCargado;
            console.log(this.miCredito.cantidad);
            // console.log(this.miCredito.email);
            console.log(this.miCredito.qrs);
            // console.log(this.miCredito.id);
            // this.misCreditos.push(creditoCargado);
          }        
        })
      })
    ).subscribe((datos: any) => {
    });
  }

  UpdateCredito(qrEscaneado:string){
    var cantidadNuevo=0;
    //si es admin
    if (this.authService.userData.email.includes('admin')){
      if (!this.miCredito.qrs.includes(qrEscaneado))//no lo cargo
      {
        if (qrEscaneado=='8c95def646b6127282ed50454b73240300dccabc'){
          cantidadNuevo=this.miCredito.cantidad+10;
        }
        if (qrEscaneado=='ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 '){
          cantidadNuevo=this.miCredito.cantidad+50;
        }
        if (qrEscaneado=='2786f4877b9091dcad7f35751bfcf5d5ea712b2f'){
          cantidadNuevo=this.miCredito.cantidad+100;
        }
        var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
        this.creditosService.UpdateCreditos(this.miCredito.id,cantidadNuevo,creditosNuevos,this.authService.userData.email);
        
      }
      else//ya lo cargo
      { //si lo cargo 2 veces o mas NO
        if(this.YaLoCargo(qrEscaneado)){
          this.authService.presentToast("Ya cargo este código dos veces admin.",2000,'bottom','danger','text-center');
         
      }
        else//esto anda raro cuando no tiene el qr la primera vez creo que la solucion es preguntar antes si contais igual que en el else y si es true, si miro ese if que tengo
        {
          if (qrEscaneado=='8c95def646b6127282ed50454b73240300dccabc'){
            cantidadNuevo=this.miCredito.cantidad+10;
          }
          if (qrEscaneado=='ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 '){
            cantidadNuevo=this.miCredito.cantidad+50;
          }
          if (qrEscaneado=='2786f4877b9091dcad7f35751bfcf5d5ea712b2f'){
            cantidadNuevo=this.miCredito.cantidad+100;
          }
          var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
          this.creditosService.UpdateCreditos(this.miCredito.id,cantidadNuevo,creditosNuevos,this.authService.userData.email);
        
        }
      }
    }else//no es admin
    {
      if (this.miCredito.qrs.includes(qrEscaneado))//ya lo cargo
      {
        // alert("en if qr escaneado" + qrEscaneado);
        this.authService.presentToast("Ya cargo este código una vez usuario.",2000,'bottom','danger','text-center');
      }else//no lo cargo aun
      {
        // alert("en else qr escaneado" + qrEscaneado);
        
        if (qrEscaneado=='8c95def646b6127282ed50454b73240300dccabc'){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          cantidadNuevo=this.miCredito.cantidad+10;
        }
        if (qrEscaneado=='ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 '){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          //cantidadNuevo=this.miCredito.cantidad+50;//no anda el de 50 vaya a saber uno por que
          cantidadNuevo=this.miCredito.cantidad+50;
        }
        if (qrEscaneado=='2786f4877b9091dcad7f35751bfcf5d5ea712b2f'){
          //alert("cantidad " + cantidadNuevo +" " +this.miCredito.cantidad);
          cantidadNuevo=this.miCredito.cantidad+100;
        }
        var creditosNuevos = this.miCredito.qrs + '/'+qrEscaneado;
        // alert("creditosNuevos" + creditosNuevos);
        this.creditosService.UpdateCreditos(this.miCredito.id,cantidadNuevo,creditosNuevos,this.authService.userData.email);
      }
    }
  }

  Limpiar(){
    this.creditosService.UpdateCreditos(this.miCredito.id,0,"",this.authService.userData.email);
  }
  
  YaLoCargo(qrs:string){

  var firstIndex = this.miCredito.qrs.indexOf(qrs);
  // alert("INDICE PRIMERO "+firstIndex);
  // alert("LAST INDEX "+this.miCredito.qrs.lastIndexOf(qrs));
  var result = firstIndex !=  this.miCredito.qrs.lastIndexOf(qrs) && firstIndex != -1;
  // alert("RESULT "+result);
  return result;

  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        //alert(result.content); //The QR content will come out here
        //Handle the data as your heart desires here
        this.UpdateCredito(result.content)
      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  Salir(){
    this.authService.SignOut();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'alertCancel',
      header: '¿Estás seguro?',
      message: 'Si presionas Si se va a <strong>borrar</strong> tu saldo',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          id: 'confirm-button',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Okay');
            this.Limpiar();
          }
        }
      ]
    });

    await alert.present();
  }
}

export class Credito{
  qrs:string;
  cantidad:number;
  email:string;
  id:string;
}
