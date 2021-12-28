'use strict';

// When filtering products,
// check whether products are already sorted.
// If sorted, filter 'sorted' products.
let isSorted = false;
let sorted;

fetchProducts('data/products.json').then(items => {
  const products = items.map(createProduct);
  const productsContainer = document.querySelector('.products');
  productsContainer.append(...products);

  const btns = document.querySelector('.btns');
  btns.addEventListener('click', e => onBtnClick(e, products));

  const select = document.querySelector('.select');
  select.addEventListener('change', () => {
    const value = select.value;
    onSelectChange(value, products, productsContainer);
  });
});

async function fetchProducts(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not OK');
  }
  const obj = await response.json();
  return obj.items;
}

function createProduct(item) {
  const product = document.createElement('article');
  product.setAttribute('class', 'product');
  product.setAttribute('data-type', item.type);
  product.setAttribute('data-price', item.price);
  product.innerHTML = `
    <img 
    src="${item.image}"
    alt="${item.type} image"
    class="product__img"
    />
    <span class="product__price">₩ ${item.price}</span>
    `;
  return product;
}

function onBtnClick(e, products) {
  const target = e.target;
  const category = target.dataset.category;
  if (category == undefined) {
    return;
  }
  filterProducts(products, category);
}

function filterProducts(products, category) {
  const toBeFiltered = isSorted ? sorted : products;
  toBeFiltered.forEach(product => {
    if (category === 'all' || category === product.dataset.type) {
      product.classList.remove('product--invisible');
    } else {
      product.classList.add('product--invisible');
    }
  });
}

function onSelectChange(value, products, productsContainer) {
  sortProducts(value, products);
  productsContainer.append(...sorted);
}

function sortProducts(criteria, products) {
  isSorted = true;
  const toBeSorted = [...products];
  switch (criteria) {
    case 'price-ascending':
      sorted = toBeSorted.sort((a, b) => a.dataset.price - b.dataset.price);
      break;
    case 'price-descending':
      sorted = toBeSorted.sort((a, b) => b.dataset.price - a.dataset.price);
      break;
    default:
      sorted = products;
  }
}
