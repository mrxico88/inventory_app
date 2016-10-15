/**
 *  Copyright (c) 2015, Fullstack.io
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Component, EventEmitter} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

/**
 * Product object
 */

class Product {
    constructor(
        public sku: string,
        public name: string,
        public imageUrl: string,
        public department: string[],
        public price: number
    ) {}
}

/**
 * Product Image Component. show product image
 */
@Component ({
    selector: 'product-image',
    inputs: ['product'],
    host: {'class' : 'ui small image'},
    template: `
        <img class="product-image" [src]="product.imageUrl">
    `
})

class ProductImage {
    product: Product;
}

/**
 * Price component to show the price of a Product
 */

@Component ({
    selector: 'price-display',
    inputs: ['price'],
    template: `
        <div class="price-display">\${{price}}</div>
    `
})

class PriceDisplay {
    price: number;
}


/**
 * Product department component
 */

@Component ({
    selector: `product-department`,
    inputs: ['product'],
    template:`
        <div class="product-department">
            <span *ngFor="#name of product.department; #i=index">
                <a href="#">{{name}}</a>
                <span>{{i < (product.department.length-1) ? '>' : ''}}</span>
            </span>
        </div>
    `
})

class ProductDepartment {
    product: Product;
}

/**
 * Product Row. A component for a single product
 */

@Component ({
    selector:'product-row',
    inputs: ['product'],  //this will be the product that passed in from the parent component
    host: {'class' : 'item'}, //set attribute on the host element. attach class "item" to the host component
    directives: [ProductImage, ProductDepartment, PriceDisplay],
    template: `
        <product-image [product]="product"></product-image>
        <div class="content">
            <div class="header">{{product.name}}</div>
            <div class="meta">
                <div class="product-sku"> SKU # {{product.sku}}</div>
            </div>
            <div class="description">
                <product-department [product]="product"></product-department>
            </div>
        </div>
        <price-display [price]="product.price"></price-display>
        
    
    `
})

class ProductRow {
    product: Product;
}

/**
 * Product List Component 
 */
@Component ({
    selector: 'products-list',
    directives: [ProductRow],
    inputs: ['productList'],
    outputs: ['onProductSelected'],
    template:`
       <div class="ui item">
            <product-row *ngFor= "#myProduct of productList"
                            [product] = "myProduct" 
                            (click) = "clicked(myProduct)"
                            [class.selected]="isSelected(myProduct)">
            </product-row>
       </div> 
    `
})

class ProductList {
    /**
     * @input productList. product that passed to us
     */
    productList: Product[]; 

    /**
     * @output onProductSelected. outputs current product whenever product is selected
     */
    onProductSelected: EventEmitter<Product>;

    /**
     * @property current product - local state contains current selected product
     */
    currentProduct: Product;

    constructor() {
        this.onProductSelected = new EventEmitter();
    }

    /**
     * Define click event
     */
    clicked(product: Product): void {
        this.currentProduct = product;  //Set this current product to the product that passed in
        this.onProductSelected.emit(product);   //Emit the product that was clicked on our output
    }

    /**
     * Define is selected
     */
    isSelected(product: Product): boolean {
        if(!product || !this.currentProduct ) {
            return false;
        }

        return product.sku === this.currentProduct.sku;
    }

}




/**
 * Main Component
 */
@Component ({
    selector: 'inventory-app',
    directives: [ProductList],
    template: `
    <div class="inventory-app">
        <products-list
        [productList] = "products"   
        (onProductSelected)="productWasSelected($event)"> 
        </products-list>
    </div>
    `
})

class InventoryApp {
    products: Product[];

    constructor() {
        this.products = [
            new Product (
            'NICEHAT', 'A Nice Black Hat', '/resources/images/products/black-hat.jpg', ['Men', 'Accessories', 'Hats'], 29.99),

            new Product (
             'NEATOJACKET', 'Blue Jacket', '/resources/images/products/blue-jacket.jpg', ['Women', 'Apparel', 'Jackets & Vests'], 238.99),   

            new Product (
             'NICEHAT', 'A Nice Black Hat', '/resources/images/products/black-hat.jpg', ['Men', 'Accessories', 'Hats'], 29.9)
        ]
    }

    productWasSelected(product: Product): void {
        console.log("Product clicked: ", product);
    }
}

bootstrap(InventoryApp);