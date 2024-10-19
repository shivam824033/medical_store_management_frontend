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

  searchShow = false;
  categories2 = [
    {
     "id": "1",
     "name": "Tablet"
    },
    {
     "id": "2",
     "name": "Capsule"
    }
  ];

  onClick(data: any){
    console.log("on click", this.categories2)
  }
 product = new ProductDetails();
 productSearchResult = new ProductDetails();
 // productList= new Array<ProductDetails>;
 productList: ProductDetails[] = [];
 categories: Category[]=[];
  constructor(private sellerService: GlobalService) { 
this.searchShow =false;
//     var cat = new Category();
//     cat.name = "Tablet";
//     cat.value = 1;
// this.categories.push(cat)
    console.log(this.categories2)
  }

  ngOnInit(): void {

  }

 

  addProduct(form: any) {
    if (this.product!==null) {
      // const newProduct = form.value;
      // Object.assign(this.product, newProduct);
      console.log('Product added successfully:', this.product);
      this.productList.push(this.product);

if(this.product.batchNumber!==null){
  this.sellerService.addProduct(this.product).subscribe((data: any)=>{
    
    console.log('Product added successfully:', data);

  })
}

      // Add logic to send the product to the backend or store it
      // alert('Product added successfully!');
      //form.reset();
    }
  }
	searching = false;
	searchFailed = false;
  model: any;
  masterProduct!: MasterProductDetails;

  formatter = (x: { productName:string}) => x.productName;
  searchProduct: OperatorFunction<string, any> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searching = true)),
			switchMap((term) =>
				this.sellerService.getSellerProduct(term).pipe(
					tap((res) => {this.searchFailed = false}),
					catchError(() => {
						this.searchFailed = true;
						return of([]);
					})),
			),
      map((response) => {
       
        return response;
      })
		);

    onProductselect(data :any){
      console.log("selelr product details: ", data)
    //  this.masterProduct = data.item;
      this.productSearchResult = data.item;
      this.searchShow = true;
    }
    
}
