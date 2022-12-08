class Product {
	constructor(title, image, desc, price) {
		this.title = title;
		this.imageUrl = image;
		this.description = desc;
		this.price = price;
	}
}

class ElementAttribute {
	constructor(attrName, attrValue) {
		this.name = attrName;
		this.value = attrValue;
	}
}

class Component {
	constructor(renderHookId, shouldRender = true) {
		this.hookId = renderHookId;
		if (shouldRender) {
			this.render();
		}
	}

	render() {}

	createRootElement(tag, cssClasses, attributes) {
		const rootElement = document.createElement(tag);
		if (cssClasses) {
			rootElement.className = cssClasses;
		}
		if (attributes && attributes.length > 0) {
			for (const attr of attributes) {
				rootElement.setAttribute(attr.name, attr.value);
			}
		}
		document.getElementById(this.hookId).append(rootElement);
		return rootElement;
	}
}

class ShoppingCart extends Component {
	items = [];

	set cartItems(value) {
		this.items = value;
		this.totalOutput.innerHTML = `<h2>Total: ₹${this.totalAmount.toFixed(
			2
		)}</h2>`;
	}

	get totalAmount() {
		const sum = this.items.reduce(
			(prevValue, curItem) => prevValue + curItem.price,
			0
		);
		return sum;
	}

	constructor(renderHookId) {
		super(renderHookId);
	}

	addProduct(product) {
		const updatedItems = [...this.items];
		updatedItems.push(product);
		this.cartItems = updatedItems;
	}

	orderProducts() {
		console.log("ordering...");
		console.log(this.items);
	}

	render() {
		const cartEl = this.createRootElement("section", "cart");
		cartEl.innerHTML = `
			<h2>Total: ₹${0}</h2>
			<button>Order Now!</button>
		`;
		const orderButton = cartEl.querySelector("button");
		orderButton.addEventListener("click", () => this.orderProducts());
		this.totalOutput = cartEl.querySelector("h2");
	}
}

class ProductItem extends Component {
	constructor(product, renderHookId) {
		super(renderHookId, false);
		this.product = product;
		this.render();
	}

	addToCart() {
		App.addProductToCart(this.product);
	}

	render() {
		const prodEl = this.createRootElement("li", "product-item");
		prodEl.innerHTML = `
                <div>
                    <img src="${this.product.imageUrl}" alt="${this.product.title}">
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>₹${this.product.price}</h3>
                        <p>${this.product.description}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            `;
		const addCartButton = prodEl.querySelector("button");
		addCartButton.addEventListener("click", this.addToCart.bind(this));
	}
}

class ProductList extends Component {
	products = [];

	constructor(renderHookId) {
		super(renderHookId);
		this.fetchProducts();
	}

	fetchProducts() {
		this.products = [
			new Product(
				"iPhone 14 Pro",
				"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209_GEO_EMEA?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660753617539",
				"Buy iPhone 14 Pro (Deep Purple)",
				139900
			),
			new Product(
				"MacBook Pro",
				"https://www.apple.com/v/macbook-pro-14-and-16/c/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg",
				"MacBook Pro M1 Pro or M1 Max Chip 16-inch",
				292780
			),
		];
		this.renderProducts();
	}

	renderProducts() {
		for (const prod of this.products) {
			new ProductItem(prod, "prod-list");
		}
	}

	render() {
		this.createRootElement("ul", "product-list", [
			new ElementAttribute("id", "prod-list"),
		]);
		if (this.products && this.products.length > 0) {
			this.renderProducts();
		}
	}
}

class Shop extends Component {
	constructor() {
		super();
	}

	render() {
		this.cart = new ShoppingCart("app");
		new ProductList("app");
	}
}

class App {
	static cart;

	static init() {
		const shop = new Shop();
		this.cart = shop.cart;
	}

	static addProductToCart(product) {
		this.cart.addProduct(product);
	}
}

App.init();
