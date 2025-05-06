import { ProductService } from './../../../Services/product.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../Toaster/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell-product.component.html',
  styleUrl: './sell-product.component.scss',
})
export class SellProductComponent {
  productForm: FormGroup;
  categoryArr: String[] = [
    'Fiction',
    'Non-Fiction',
    'Science',
    "Children's",
    'Educational',
    'Others',
  ];

  constructor(
    private toastService: ToasterService,
    private router: Router,
    private ProductService: ProductService
  ) {
    this.productForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      publicationYear: new FormControl('', [Validators.required]),
      condition: new FormControl('', [Validators.required]),
    });
  }

  get title() {
    return this.productForm.get('title');
  }
  get author() {
    return this.productForm.get('author');
  }
  get price() {
    return this.productForm.get('price');
  }
  get description() {
    return this.productForm.get('description');
  }
  get category() {
    return this.productForm.get('category');
  }
  get image() {
    return this.productForm.get('image');
  }
  get publicationYear() {
    return this.productForm.get('publicationYear');
  }
  get condition() {
    return this.productForm.get('condition');
  }
  selectedImageFile!: File;

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.productForm.patchValue({ image: file.name }); // just for validation
    }
  }
  // submitHandler(): void {
  //   if (this.productForm.valid) {
  //     console.log(this.productForm.value);
  //     this.ProductService.createBooks(this.productForm.value).subscribe({
  //       next: (response) => {
  //         console.log(response);
  //         this.productForm.reset();
  //         this.toastService.show('Product added successfully!', 'success');
  //         this.router.navigate(['/']);
  //       },
  //       error: (error) => {
  //         console.log('Error adding product:', error);
  //         this.toastService.show('Failed to add product!', 'error');
  //       },
  //     });
  //   } else {
  //     this.toastService.show('Please fill all fields!', 'error');
  //   }
  // }
  submitHandler(): void {
    if (this.productForm.valid && this.selectedImageFile) {
      const formData = new FormData();
      formData.append('title', this.productForm.get('title')?.value);
      formData.append('author', this.productForm.get('author')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('category', this.productForm.get('category')?.value);
      formData.append(
        'publicationYear',
        this.productForm.get('publicationYear')?.value
      );
      formData.append('condition', this.productForm.get('condition')?.value);
      formData.append('image', this.selectedImageFile); // the actual image file

      this.ProductService.createBooks(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.productForm.reset();
          this.toastService.show('Product added successfully!', 'success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.toastService.show('Failed to add product!', 'error');
        },
      });
    } else {
      this.toastService.show('Please fill all fields!', 'error');
    }
  }
}
