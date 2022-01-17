document.addEventListener('DOMContentLoaded', () => {
    product_list = getProducts();
    update_cart();
    document.addEventListener('click',event => {

        if(event.target.matches('.product-nav'))
        {
            document.querySelector('#page-title').textContent ='Our '+event.target.textContent;
            document.querySelector('#home').style.display='none';
            displayProducts(document.querySelector('#product-list'),event.target.dataset.category);
        }

        else if (event.target.matches('.add-to-cart'))
        {
            addQuantity(event.target,1);
            update_cart();
        }
        else if(event.target.matches('.add-qty'))
        {
            const product = event.target.closest('.product-row');
            addQuantity(product,1);
            update_cart();
        }
        else if(event.target.matches('.remove-qty'))
        {
            const product = event.target.closest('.product-row');
            addQuantity(product,-1);
            update_cart();        
        }
        else if(event.target.matches('.delete_button'))
        {
            const ref = event.target.closest('.product-row').dataset.product_ref;
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            delete cart[ref];
            localStorage.setItem('cart',JSON.stringify(cart));
            update_cart();
        }
    });
});
function getProducts()
{


    res = []
    example_tea = {
        name: "blabla",
        category: "tea",
        image: "./images/tea1.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    };
    example_tea2 = {
        name: "blabla",
        category: "tea",
        image: "./images/tea2.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    };
    example_teaware = {
        name: "blabli",
        category:"teaware",
        image: './images/teaware1.jpeg',
        description : "Very robust teaware.",
        price: 150
    };
    example_teaware2 = {
        name: "blabli",
        category:"teaware",
        image: './images/teaware2.jpeg',
        description : "Very robust teaware.",
        price:20
    };
    example_teaware3 = {
        name: "blabli",
        category:"teaware",
        image: './images/teaware3.jpeg',
        description : "Very robust teaware.",
        price:45.99
    };
    example_teaware4 = {
        name: "blabli",
        category:"teaware",
        image: './images/teaware4.jpeg',
        description : "Very robust teaware.",
        price:150
    };
    example_teaware5 = {
        name: "blabli",
        category:"teaware",
        image: './images/teaware5.jpeg',
        description : "Very robust teaware.",
        price:15
    };

    res['a'] = example_tea;
    res['b'] = example_tea2;
    res['c'] = example_teaware;
    res['d'] = example_teaware2;
    res['e'] = example_teaware3;
    res['f'] = example_teaware4;
    res['g'] = example_teaware5;
    //get products here
    return res;
}

function displayProducts(list,category)
{
    list.innerHTML = "";

    for(let [ref,product] of Object.entries(product_list).filter(x=>x[1].category==category))
    {
        list.innerHTML+= createCard(ref,product);
    }

    if(list.innerHTML=="")
    {
        list.innerHTML = `<div class="alert alert-danger" role="alert">
        There is no item for this category 
      </div>`;
    }
    
}

function createCard(ref,product)
{
    return  `<div class="col-sm-6 col-md-4 col-lg-3">
    <div class="card"">
        <img class="card-img-top" src="${product.image}" alt="${product.name}">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text product-category">Catégorie: ${product.category}</p>
            <p class="card-text product-description">${product.description}</p>
            <p class="card-text product-price">Price: ${product.price}€</p>
            <a data-product_price=${product.price} data-product_ref="${ref}" data-product_name="${product.name}"  data-product_image="${product.image}" href="javascript:;" class="btn btn-dark add-to-cart">Add to cart</a>
        </div>
    </div>
</div>`;
}

function addQuantity(product,qty)
{
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    const ref = product.dataset.product_ref;
    if(cart[ref]==null)
    {
        cart[ref] = {
            name:product.dataset.product_name,
            price:product.dataset.product_price,
            quantity:qty,
            image:product.dataset.product_image
        };
    }
    else
        cart[product.dataset.product_ref].quantity+=qty;
    if(cart[product.dataset.product_ref].quantity < 1)
        delete cart[product.dataset.product_ref];

    localStorage.setItem('cart',JSON.stringify(cart));
}

function update_cart(){
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let cart_total = Object.entries(cart).reduce((x,y)=>x+y[1].price*y[1].quantity,0).toFixed(2).replace('.',',')+'€';
    let cart_count = Object.values(cart).reduce((x,y)=>x+y.quantity,0);
    document.querySelector('#cart-count').textContent= cart_count;
    document.querySelector("#cart-amount").textContent = cart_total;
    let cart_body = document.querySelector('#cart-edit')
    cart_body.innerHTML = '';
    for(let [ref,product] of Object.entries(cart))
    {
        cart_body.innerHTML+=`<div class="product-row row p-3 align-items-center" data-product_ref="${ref}" data-product_name="${product.name} data-product_price="${product.price}">
        <div class="col-2" >
            <img class="img-cart" src="${product.image}">
        </div>
        <div class="col-4 text-break">
            ${ref} : ${product.name}
        </div>
        <div class="col-1">
            <a class="remove-qty" href="javascript:;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill remove-qty" viewBox="0 0 16 16">
                    <path class="remove-qty" d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
            </a>
        </div>
        <div class="col-1 text-center">
            ${product.quantity}
        </div>
        <div class="col-1">
            <a class="add-qty" href="javascript:;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill add-qty" viewBox="0 0 16 16">
                    <path class ='add-qty' d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </a>
        </div>
        <div class="col-1 text-center">
            <a class="delete_button" href="javascript:;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill delete_button" viewBox="0 0 16 16">
                    <path class="delete_button" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
            </a>
        </div>
        <div class="col-2 text-center">
            ${(product.price*product.quantity).toFixed(2).toString().replace('.',',')+'€'}
        </div>
    </div>`;
    }
    if(cart_body.innerHTML=="")
    {
        cart_body.innerHTML = `<div class="alert alert-danger" role="alert">
        You have no item in your cart 
      </div>`;
      document.querySelector('#payment').style.display = 'none'

    }
    else
    {
        cart_body.innerHTML+=`<hr><div class="row p-3 justify-content-end"><div class="col-2">Total:</div><div class="col-2">${cart_total}</div></div>`;
        document.querySelector('#payment').style.display = ''

    }
}