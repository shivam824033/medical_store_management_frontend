import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { Category, MasterProductDetails, ProductDetails } from 'src/app/models/product-details';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  successMessage ="";
  errorMessage = "";
  searchShow = false;
  addAnotherbtn = false;
  categories2 = [
    {
      "id": "1",
      "name": "Tablet"
    },
    {
      "id": "2",
      "name": "Capsule"
    },
    {
      "id": "3",
      "name": "Cream"
    }
  ];

sum: ((previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any) | undefined;
  selectedFile: any;
  progress: number =0;
  message: string | undefined;

  onClick(data: any) {
    console.log("on click", this.categories2)
  }
  product = new ProductDetails();
  productSearchResult = new ProductDetails();
  // productList= new Array<ProductDetails>;
  productList: ProductDetails[] = [];
  categories: Category[] = [];
  constructor(private sellerService: GlobalService) {
    this.searchShow = false;
    //     var cat = new Category();
    //     cat.name = "Tablet";
    //     cat.value = 1;
    // this.categories.push(cat)
    console.log(this.categories2)
  }

  ngOnInit(): void {

  }



  addProduct(form: any) {
    this.errorMessage = "";
    this.successMessage = "";
    if (this.product !== null) {
      // const newProduct = form.value;
      // Object.assign(this.product, newProduct);
      console.log('Product added successfully:', this.product);
      this.productList.push(this.product);

      if (this.product.batchNumber !== null) {
        this.sellerService.addProduct(this.product).subscribe((data: any) => {

          if (data.errorMessage != null) {
            this.errorMessage = data.errorMessage;
          } else{
            this.successMessage = 'Product added successfully'; //data.response;
            this.addAnotherbtn = true;
          }

        })
      }

      // Add logic to send the product to the backend or store it
      // alert('Product added successfully!');
      //form.reset();
    }
  }

  addAnotherProduct() {
    this.product = new ProductDetails();
    this.errorMessage = "";
    this.successMessage = "";
    this.addAnotherbtn = false;
  }

  searching = false;
  searchFailed = false;
  model: any;
  masterProduct!: MasterProductDetails;

//  formatter = (x: { BproductName: string, AexpiryDate: string }) => (x.BproductName, x.AexpiryDate);
    formatter = (x: { productName: string, batchNumber: string }) => `${x.productName} (${x.batchNumber})`;

  searchProduct: OperatorFunction<string, any> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term).pipe(
          tap((res) => { this.searchFailed = false }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })),
      ),
      map((response) => {
        // this.productSearchList = response;
        // var list: any[] = [];
        // response.forEach((res:any) => {
        //   list.push({"AexpiryDate" : res.productExpiryDate, "BproductName": res.productName});
        // });

        // console.log("search list",list)
        // return list;
        return response;
      })
    );

    searchProduct2: OperatorFunction<string, any> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term).pipe(
          tap((res) => { this.searchFailed = false }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })),
      ),
      map((response) => {
        // this.productSearchList = response;
        // var list: any[] = [];
        // response.forEach((res:any) => {
        //   list.push({"AexpiryDate" : res.productExpiryDate, "BproductName": res.productName});
        // });

        // console.log("search list",list)
        // return list;
        return response;
      })
    );

  productSearchList:any;
  onProductselect(data: any) {
    console.log("selelr product details: ", data)
    //  this.masterProduct = data.item;
    this.productSearchResult = data.item;
    this.searchShow = true;
    // var onSelectproduct = data.item;

    // this.productSearchList.forEach((productObj:any) => {
    //   if(productObj.productName === onSelectproduct.BproductName){
    //     this.productSearchResult = productObj;
    //     this.searchShow = true;
    //   }
    // });
  }

  searchProductTemp:any;
  selectedProduct: any = null;
  selectedProductName: string = '';
  sellQuantity: number = 1;
  billItems: any[] = [];
  billSuccessMessage: string = '';
  billErrorMessage: string = '';

  onProductSelectForBilling(event: any) {
    this.selectedProduct = event.item;
    this.selectedProductName = this.selectedProduct.productName;
  }

  addToBill() {
    if (!this.selectedProduct || !this.sellQuantity) return;
    if (this.sellQuantity > this.selectedProduct.productStripCount) {
      this.billErrorMessage = 'Not enough stock!';
      return;
    }
    this.billItems.push({
      ...this.selectedProduct,
      quantity: this.sellQuantity,
      discount: 0 ,// Initialize discount,
      error:'',
      tempValue:0
    });
    this.selectedProduct = null;
    this.selectedProductName = '';
    this.sellQuantity = 1;
    this.billErrorMessage = '';
    this.searchProductTemp = null;
  }

  removeBillItem(index: number) {
    this.billItems.splice(index, 1);
  }

  tempTotalAmount: number =0;
  getBillTotal() {
    if(!this.billErrorMessage){
    this.tempTotalAmount =this.billItems.reduce((sum, item) =>
      sum +
      ((item.quantity * item.productPerPrice) -
      ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100)), 0);
    }

    return this.tempTotalAmount
  }
   tempTotalAmountPerProduct: number =0;
    getTotalBillPerPRoduct(item :any) {
    if(!item.error){
     item.tempValue = ((item.quantity * item.productPerPrice) -
      ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100));
    }
    return item.tempValue;
  }


  finalizeBill() {
    // Implement your billing logic here (e.g., update stock, save bill, etc.)
    this.billSuccessMessage = 'Bill finalized successfully!';
    this.billItems = [];
    setTimeout(() => this.billSuccessMessage = '', 3000);
  }

  onQuantityChange(index: number) {
  // Optionally, add validation or update logic here if needed
  // For example, prevent negative or zero quantity, or check stock
  this.billErrorMessage='';
  this.billItems[index].error='';
    if(this.billItems[index].quantity > this.billItems[index].productStripCount) {
         this.billItems[index].error = 'Not enough stock!';
         this.billErrorMessage = 'Not enough stock!';
         return;
  }
  if (this.billItems[index].quantity < 1) {
    this.billItems[index].quantity = 1;
  }
}
 onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.progress = 0;
    this.message = '';
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file first!';
      return;
    }

    this.sellerService.upload(this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body;
        }
      },
      error: (err) => {
        this.message = 'Could not upload the file! ' + err.message;
      }
    });
  }

}
