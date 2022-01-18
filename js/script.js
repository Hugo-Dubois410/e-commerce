/*
C'est la liste des produits. Un dictionnaire en fait, réference : objet.
En vrai ce serait une base de données sur laquelle on fera des requetes au moment de filtrer et d'afficher les objets
*/

product_list = {
    '01' : {
        name: "Black tea",
        category: "tea",
        image: "./images/tea1.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '02' : {
        name: "Green tea",
        category: "tea",
        image: "./images/tea2.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '03' : {
        name: "Oolong tea",
        category: "tea",
        image: "./images/tea3.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '04' : {
        name: "Gaba tea",
        category: "tea",
        image: "./images/tea4.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '05' : {
        name: "Long Jing",
        category: "tea",
        image: "./images/tea5.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '06' : {
        name: "Matcha",
        category: "tea",
        image: "./images/tea6.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '07' : {
        name: "Black tea 2",
        category: "tea",
        image: "./images/tea7.jpeg",
        description: "This is some tea. It's very good, try it",
        price: 12.50
    },
    '08' : {
        name: "Jianshui Clay",
        category:"teaware",
        image: './images/teaware1.jpeg',
        description : "Very robust teaware.",
        price: 150
    },
    '09' : {
        name: "Gaiwan",
        category:"teaware",
        image: './images/teaware2.jpeg',
        description : "Very robust teaware.",
        price:20
    },
    '10' : {
        name: "Glass pot",
        category:"teaware",
        image: './images/teaware3.jpeg',
        description : "Very robust teaware.",
        price:45.99
    },
    '11' : {
        name: "Chaozhou Clay",
        category:"teaware",
        image: './images/teaware4.jpeg',
        description : "Very robust teaware.",
        price:150
    },
    '12' : {
        name: "Small cup",
        category:"teaware",
        image: './images/teaware5.jpeg',
        description : "Very robust teaware.",
        price:15
    }
}

/*
On s'assure que le DOM est bien chargé avant d'ajouter les events
*/
document.addEventListener('DOMContentLoaded', () => {
    
    let message_timeout;

    //On récupère le panier sauvegardé de l'utilisateur et on affiche les infos correspondantes sur la page web
    update_cart();

    /*
    Le clique sur les différentes catégories (tea ou teaware) : on va alors afficher les produits filtrés avec la fonction displayproducts
    */
    document.addEventListener('click',event => {

        if(event.target.matches('.product-nav'))
        {
            document.querySelector('#page-title').textContent ='Our '+event.target.textContent;
            document.querySelector('#home').style.display='none';
            displayProducts(document.querySelector('#product-list'),event.target.dataset.category);
        }

        //Le clique sur un bouton d'achat : on va mettre à jour le panier.
        else if (event.target.matches('.add-to-cart'))
        {
            clearTimeout(message_timeout);
            let message_elem = document.querySelector('#message-main');
            message_elem.style.display = '';
            message_elem.textContent = "The item '"+event.target.dataset.product_name+"' has successfully been added to your cart";
            message_timeout = setTimeout(()=> {message_elem.style.display='none';}, 3000);
            addQuantity(event.target,1);
            update_cart();
        }
        
         //Les clique dans le panier, ici sur le bouton "augmenter la quantité"
        else if(event.target.matches('.add-qty'))
        {
            const product = event.target.closest('.product-row');
            addQuantity(product,1);
            update_cart();
        }
        
        // Diminiuer la quantité
        else if(event.target.matches('.remove-qty'))
        {
            const product = event.target.closest('.product-row');
            addQuantity(product,-1);
            update_cart();        
        }

        //Supprimer l'article du panier
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


/*
Affichage des produits. On crée une carte pour chaque item de la catégorie
*/
function displayProducts(list,category)
{
    list.innerHTML = "";
 
    //Le filtre est effectué avec "filter"
    for(let [ref,product] of Object.entries(product_list).filter(x=>x[1].category==category))
    {
        list.innerHTML+= createCard(ref,product);
    }

    //Si la liste est vide, on affiche un message indiquant que le panier est vide 
    if(list.innerHTML=="")
    {
        list.innerHTML = `<div class="alert alert-danger" role="alert">
        There is no item for this category 
      </div>`;
    }
    
}

/*
Permet de créer une carte. Les infos du produit sont dans le dataset de l'element HTML "produit"
*/
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


//Ajoute une quantité donnée dans le panier. Si < 0 on supprime l'item
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

//Affichage avec bootstrap de chaque ligne correspondant à chaque item du panier. On affiche le total, les boutons de controle...
function update_cart(){
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let cart_total = Object.entries(cart).reduce((x,y)=>x+y[1].price*y[1].quantity,0).toFixed(2).replace('.',',')+'€';
    let cart_count = Object.values(cart).reduce((x,y)=>x+y.quantity,0);
    let cart_count_elem = document.querySelector('#cart-count')
    if(cart_count>0)
    {
        cart_count_elem.textContent= cart_count;
        cart_count_elem.style.display='';
    }
    else
    {
        cart_count_elem.style.display='none';
    }

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
        <div class="col-2 text-center">
            ${(product.price*product.quantity).toFixed(2).toString().replace('.',',')+'€'}
        </div>
        <div class="col-1 text-center">
            <a class="delete_button" href="javascript:;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill delete_button" viewBox="0 0 16 16">
                    <path class="delete_button" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </a>
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
        cart_body.innerHTML+=`<hr><div class="row p-3 justify-content-end"><div class="col-2">Total:</div><div class="col-2">${cart_total}</div><div class="col-1"></div></div>`;
        document.querySelector('#payment').style.display = ''

    }
}