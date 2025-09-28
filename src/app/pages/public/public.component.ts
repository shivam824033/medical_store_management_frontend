import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { NgxBarcodeScannerModule } from '@eisberg-labs/ngx-barcode-scanner';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})


export class PublicComponent  {
  onBarcodeScanned(result: string): void {
    console.log('Scanned Barcode:', result);
    // Add your lookup and sale processing logic here
  }

  onScanError(error: any): void {
    console.error('Scan error:', error);
  }

}
