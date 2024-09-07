import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProductDetails } from 'src/app/models/product-details';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

 product = new ProductDetails();
 // productList= new Array<ProductDetails>;
 productList: ProductDetails[] = [];
  constructor( private fb: FormBuilder,private sellerService: GlobalService) { }

  ngOnInit(): void {
  }

  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Furniture', 'Health'];

  addProduct(form: any) {
    if (form.valid) {
      const newProduct = form.value;
      Object.assign(this.product, newProduct);
      console.log('Product added successfully:', this.product);
      this.productList.push(this.product);

if(this.product.batchNumber!==null){
  this.sellerService.addProduct(this.product).subscribe((data: any)=>{
    
    console.log('Product added successfully:', data);

  })
}

      // Add logic to send the product to the backend or store it
      // alert('Product added successfully!');
      form.reset();
    }
  }
}
