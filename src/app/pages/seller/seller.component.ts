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

  isLoading: boolean = false;
  successMessage = "";
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

  customerName: string = '';
  customerMobile: string = '';
  customerAddress: string = '';

  sum: ((previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any) | undefined;
  selectedFile: any;
  progress: number = 0;
  message: string | undefined;
  discount: number = 0;
  invoicePreview: any;
  invoiceViewFlag: boolean = false;
  ;

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

  sessionUserDetails: any;
  ngOnInit(): void {
    const userDetails = localStorage.getItem('UserDetails');
    if (undefined != userDetails && null != userDetails) {
      this.sessionUserDetails = JSON.parse(userDetails);
      if (this.sessionUserDetails.roles !== 'SELLER') {
        window.location.href = '/home';
      }
    }
  }


  onDiscountChange(discount: any) {
    if (this.billItems && this.billItems.length > 0) {
      this.billItems.forEach(item => {
        item.discount = discount;
        this.getTotalBillPerPRoduct(item);
      });
    }
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
          this.isLoading = true;
        this.sellerService.addProduct(this.product).subscribe((data: any) => {
  this.isLoading = false;

          if (data.errorMessage != null) {
            this.errorMessage = data.errorMessage;
          } else {
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
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.expiryShow = false;
          this.isLoading = true;

      }),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term, this.sessionUserDetails.storeId).pipe(
          tap((res) => {
             this.searchFailed = false;
               this.isLoading = false;

            }),
          catchError(() => {
            this.searchFailed = true;
              this.isLoading = false;

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
      tap(() => {
        this.searching = true;
        this.expiryShow = false;
        this.invoiceViewFlag = false;
          this.isLoading = true;
      }),
      switchMap((term) =>
        this.sellerService.getSellerProduct(term, this.sessionUserDetails.storeId).pipe(
          tap((res) => { this.searchFailed = false;
              this.isLoading = false;
           }),
          catchError(() => {
            this.searchFailed = true;
              this.isLoading = false;
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

  productSearchList: any;
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

  searchProductTemp: any;
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

    this.billErrorMessage = '';
    if (!this.selectedProduct || !this.sellQuantity) return;
    if (this.sellQuantity > this.selectedProduct.productStripCount) {
      this.billErrorMessage = 'Not enough stock!';
      return;
    }

    this.billItems.forEach(item => {
      if (item.batchNumber === this.selectedProduct.batchNumber) {
        this.billErrorMessage = 'Product Already exits in the bill!';
        this.searchProductTemp = null;
        item.warning = 'Product Already exits in the bill!';
        return;
      } else {
        item.warning = '';
      }
    });

    if (this.billErrorMessage) {
      return;
    }


    this.billItems.push({
      ...this.selectedProduct,
      quantity: this.sellQuantity,
      discount: this.discount,// Initialize discount,
      error: '',
      warning: '',
      tempValue: 0
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

  tempTotalAmount: number = 0;
  getBillTotal() {
    if (!this.billErrorMessage) {
      this.tempTotalAmount = this.billItems.reduce((sum, item) =>
        sum +
        ((item.quantity * item.productPerPrice) -
          ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100)), 0);
    }

    return this.tempTotalAmount
  }
  tempTotalAmountPerProduct: number = 0;
  getTotalBillPerPRoduct(item: any) {
    if (!item.error) {
      item.tempValue = ((item.quantity * item.productPerPrice) -
        ((item.quantity * item.productPerPrice * (item.discount || 0)) / 100));
    }
    return item.tempValue;
  }


  // ...existing code...
  finalizeBill() {
    this.billErrorMessage = '';
    if (this.billItems.length === 0) {
      this.billErrorMessage = 'No items in the bill to finalize!';
      return;
    }
    // Optionally, collect customer info from a form and add to billItems[0]
    this.billItems[0].customerName = this.customerName;
    this.billItems[0].customerMobile = this.customerMobile;

    this.isLoading = true;

    this.sellerService.finalizeBill(this.billItems).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.errorMessage) {
          this.billErrorMessage = res.errorMessage;
        } else {
          // Show invoice preview
          this.invoicePreview = res.response;
          this.billSuccessMessage = 'Bill finalized successfully!';
          this.billItems = [];
          this.invoiceViewFlag = true;
          setTimeout(() => this.billSuccessMessage = '', 3000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.billErrorMessage = 'Failed to finalize bill!';
      }
    });
  }
  // ...existing code...

  onQuantityChange(index: number) {
    // Optionally, add validation or update logic here if needed
    // For example, prevent negative or zero quantity, or check stock
    this.billErrorMessage = '';
    this.billItems[index].error = '';
    if (this.billItems[index].quantity > this.billItems[index].productStripCount) {
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

  expiredProducts: any[] = [];
  expiredProductDate: string = '';
  expiredProductError: string = '';
  expiryShow: boolean = false;
  fetchExpiredProducts() {
    this.expiredProductError = '';
    if (!this.expiredProductDate) {
      this.expiredProductError = 'Please select a date.';
      return;
    }
    this.searchShow = false;
      this.isLoading = true;

    this.sellerService.getExpiredProducts(this.expiredProductDate).subscribe(
      (res: any) => {

          this.isLoading = false;
        this.expiredProducts = res;
        this.expiryShow = true;
        if (this.expiredProducts.length === 0) {
          this.expiredProductError = 'No expired products found before the selected date.';
          this.expiryShow = false;
        }

      }), {
      error: () => {
        this.expiredProductError = 'Failed to fetch expired products.';
          this.isLoading = false;}
    };
  }
  // ...existing code...
  printInvoice() {
    const printContents = document.getElementById('invoiceContent')?.innerHTML;
    if (!printContents) return;
    const popupWin = window.open('', '_blank', 'width=800,height=900');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
      popupWin.document.close();
    }
  }
  // ...existing code...

  backToBilling() {
    this.invoiceViewFlag = false;
    this.invoicePreview = null;
    this.billErrorMessage = '';
    this.billSuccessMessage = '';
    this.searchShow = false;
    this.expiryShow = false;
    this.selectedProduct = null;
    this.selectedProductName = '';
    this.sellQuantity = 1;
    this.billItems = [];
    this.discount = 0;
    this.tempTotalAmount = 0;
    this.tempTotalAmountPerProduct = 0;
    this.customerName = '';
    this.customerMobile = '';
    this.customerAddress = '';
    this.searchProductTemp = null;
    this.successMessage = "";
    this.errorMessage = "";
    this.addAnotherbtn = false;

  }
}
